import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const agentsRoot = path.join(repoRoot, ".agents");
const configPath = path.join(agentsRoot, "config.json");
const manifestTarget = ".agents/generated-manifest.json";
const generatedMarker = "Generated from .agents/ canonical sources.";
const checkOnly = process.argv.includes("--check");
const validateOnly = process.argv.includes("--validate");

const banner = [
  "<!--",
  "DO NOT EDIT.",
  generatedMarker,
  "Run: npm run agents:generate",
  "-->",
  ""
].join("\n");

const ignoredWalkDirs = new Set([".git", "node_modules"]);
const ignoredGeneratedMarkerFiles = new Set(["scripts/agents.mjs"]);

function fail(errors) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

function readText(relativePath) {
  return fs.readFileSync(resolveAgentsPath(relativePath), "utf8").trim();
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function ensureTrailingNewline(value) {
  return `${value.trim()}\n`;
}

function list(items) {
  if (!items || items.length === 0) {
    return "- None declared";
  }
  return items.map((item) => `- ${item}`).join("\n");
}

function codeList(items) {
  if (!items || items.length === 0) {
    return "- None declared";
  }
  return items.map((item) => `- \`${item}\``).join("\n");
}

function yamlQuoted(value) {
  return JSON.stringify(String(value ?? ""));
}

function toolsCsv(items) {
  return (items ?? []).map((item) => String(item)).join(", ");
}

function cursorGlobs(items) {
  return (items ?? []).join(",");
}

function stripLeadingH1(markdown) {
  return markdown.replace(/^# .+?(\r?\n){1,2}/, "").trim();
}

function section(title, body) {
  return `### ${title}\n\n${stripLeadingH1(body)}`;
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasUnsafePathSegment(value) {
  return (
    !isNonEmptyString(value) ||
    path.isAbsolute(value) ||
    /^[A-Za-z]:/.test(value) ||
    value.split(/[\\/]+/).includes("..")
  );
}

function resolveRepoTarget(relativeTarget) {
  if (hasUnsafePathSegment(relativeTarget)) {
    throw new Error(`Unsafe generated target path: ${relativeTarget}`);
  }
  const resolved = path.resolve(repoRoot, relativeTarget);
  if (!resolved.startsWith(repoRoot + path.sep) && resolved !== repoRoot) {
    throw new Error(`Generated target escapes repository root: ${relativeTarget}`);
  }
  return resolved;
}

function resolveAgentsPath(relativePath) {
  if (hasUnsafePathSegment(relativePath)) {
    throw new Error(`Unsafe .agents source path: ${relativePath}`);
  }
  const resolved = path.resolve(agentsRoot, relativePath);
  if (!resolved.startsWith(agentsRoot + path.sep) && resolved !== agentsRoot) {
    throw new Error(`Source path escapes .agents root: ${relativePath}`);
  }
  return resolved;
}

function assertArray(errors, value, label, minItems = 0) {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array.`);
    return false;
  }
  if (value.length < minItems) {
    errors.push(`${label} must contain at least ${minItems} item(s).`);
    return false;
  }
  return true;
}

function assertUniqueIds(errors, items, label) {
  const seen = new Set();
  for (const item of items ?? []) {
    if (!isObject(item) || !isNonEmptyString(item.id)) {
      continue;
    }
    if (seen.has(item.id)) {
      errors.push(`${label} contains duplicate id '${item.id}'.`);
    }
    seen.add(item.id);
  }
}

function assertExistingAgentsFile(errors, relativePath, label) {
  if (hasUnsafePathSegment(relativePath)) {
    errors.push(`${label} has unsafe path '${relativePath}'.`);
    return;
  }
  const fullPath = resolveAgentsPath(relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`${label} does not exist: .agents/${relativePath}`);
  }
}

function assertRepoTarget(errors, relativePath, label) {
  if (hasUnsafePathSegment(relativePath)) {
    errors.push(`${label} has unsafe target path '${relativePath}'.`);
  }
}

function validateSourceRef(errors, source, label) {
  if (!isObject(source)) {
    errors.push(`${label} must be an object.`);
    return;
  }
  if (!isNonEmptyString(source.id)) errors.push(`${label}.id is required.`);
  if (!isNonEmptyString(source.title)) errors.push(`${label}.title is required.`);
  if (!isNonEmptyString(source.path)) {
    errors.push(`${label}.path is required.`);
  } else {
    assertExistingAgentsFile(errors, source.path, `${label}.path`);
  }
}

function validateRoleFile(errors, roleRef, label) {
  validateSourceRef(errors, { ...roleRef, title: roleRef?.id ?? label }, label);
  if (!roleRef?.path || hasUnsafePathSegment(roleRef.path) || !fs.existsSync(resolveAgentsPath(roleRef.path))) {
    return;
  }

  let role;
  try {
    role = readJson(roleRef.path);
  } catch (error) {
    errors.push(`${label} is not valid JSON: ${error.message}`);
    return;
  }

  for (const field of ["id", "title", "purpose"]) {
    if (!isNonEmptyString(role[field])) errors.push(`${label}.${field} is required in ${roleRef.path}.`);
  }
  for (const field of ["allowedActions", "mustDo", "mustNotDo"]) {
    assertArray(errors, role[field], `${label}.${field}`, 1);
  }
  if (role.claude !== undefined) {
    if (!isObject(role.claude)) {
      errors.push(`${label}.claude must be an object when present.`);
    } else {
      if (!isNonEmptyString(role.claude.name)) errors.push(`${label}.claude.name is required.`);
      if (!isNonEmptyString(role.claude.description)) errors.push(`${label}.claude.description is required.`);
      assertArray(errors, role.claude.tools, `${label}.claude.tools`, 1);
    }
  }
}

function validateConfig(config) {
  const errors = [];

  if (!isObject(config)) {
    return [".agents/config.json must contain a JSON object."];
  }

  if (assertArray(errors, config.globalSources, "globalSources", 1)) {
    assertUniqueIds(errors, config.globalSources, "globalSources");
    config.globalSources.forEach((source, index) => validateSourceRef(errors, source, `globalSources[${index}]`));
  }

  if (assertArray(errors, config.roles, "roles", 1)) {
    assertUniqueIds(errors, config.roles, "roles");
    config.roles.forEach((role, index) => validateRoleFile(errors, role, `roles[${index}]`));
  }

  const domainIds = new Set();
  if (assertArray(errors, config.domains, "domains", 1)) {
    assertUniqueIds(errors, config.domains, "domains");
    for (const [index, domain] of config.domains.entries()) {
      const label = `domains[${index}]`;
      if (!isObject(domain)) {
        errors.push(`${label} must be an object.`);
        continue;
      }
      for (const field of ["id", "name", "sourceDir", "ownerTeam", "riskLevel", "localAdapterTarget"]) {
        if (!isNonEmptyString(domain[field])) errors.push(`${label}.${field} is required.`);
      }
      if (isNonEmptyString(domain.id)) domainIds.add(domain.id);
      if (!['low', 'medium', 'high', 'critical'].includes(domain.riskLevel)) {
        errors.push(`${label}.riskLevel must be low, medium, high, or critical.`);
      }
      assertArray(errors, domain.ownerPaths, `${label}.ownerPaths`, 1);
      assertArray(errors, domain.runtimePaths, `${label}.runtimePaths`, 1);
      assertArray(errors, domain.reviewers, `${label}.reviewers`, 1);
      assertArray(errors, domain.testCommands, `${label}.testCommands`, 1);
      assertRepoTarget(errors, domain.localAdapterTarget, `${label}.localAdapterTarget`);

      if (assertArray(errors, domain.files, `${label}.files`, 4)) {
        const requiredFileIds = new Set(["domain", "ownership", "testing", "agent-overrides"]);
        assertUniqueIds(errors, domain.files, `${label}.files`);
        for (const source of domain.files) {
          if (source?.id) requiredFileIds.delete(source.id);
        }
        for (const missing of requiredFileIds) {
          errors.push(`${label}.files is missing required '${missing}' source.`);
        }
        domain.files.forEach((source, fileIndex) => validateSourceRef(errors, source, `${label}.files[${fileIndex}]`));
      }
    }
  }

  if (assertArray(errors, config.adapters, "adapters", 1)) {
    assertUniqueIds(errors, config.adapters, "adapters");
    for (const [index, adapter] of config.adapters.entries()) {
      const label = `adapters[${index}]`;
      if (!isObject(adapter)) {
        errors.push(`${label} must be an object.`);
        continue;
      }
      for (const field of ["id", "target", "template", "title", "notes"]) {
        if (!isNonEmptyString(adapter[field])) errors.push(`${label}.${field} is required.`);
      }
      if (adapter.target) assertRepoTarget(errors, adapter.target, `${label}.target`);
      if (adapter.template) assertExistingAgentsFile(errors, adapter.template, `${label}.template`);
    }
  }

  for (const [field, label] of [
    ["domainAdapterTemplate", "domainAdapterTemplate"],
    ["copilotPathInstructionTemplate", "copilotPathInstructionTemplate"],
    ["cursorDomainRuleTemplate", "cursorDomainRuleTemplate"],
    ["claudeAgentTemplate", "claudeAgentTemplate"]
  ]) {
    if (!isNonEmptyString(config[field])) {
      errors.push(`${label} is required.`);
    } else {
      assertExistingAgentsFile(errors, config[field], label);
    }
  }

  if (!isNonEmptyString(config.claudeAgentsTargetDir)) {
    errors.push("claudeAgentsTargetDir is required.");
  } else {
    assertRepoTarget(errors, config.claudeAgentsTargetDir, "claudeAgentsTargetDir");
  }

  for (const [collectionName, items, targetSuffix] of [
    ["copilotPathInstructions", config.copilotPathInstructions, ".instructions.md"],
    ["cursorDomainRules", config.cursorDomainRules, ".mdc"]
  ]) {
    if (!assertArray(errors, items, collectionName, 0)) continue;
    assertUniqueIds(errors, items, collectionName);
    for (const [index, item] of items.entries()) {
      const label = `${collectionName}[${index}]`;
      if (!isObject(item)) {
        errors.push(`${label} must be an object.`);
        continue;
      }
      for (const field of ["id", "domainId", "target"]) {
        if (!isNonEmptyString(item[field])) errors.push(`${label}.${field} is required.`);
      }
      if (collectionName === "copilotPathInstructions" && !isNonEmptyString(item.applyTo)) {
        errors.push(`${label}.applyTo is required.`);
      }
      if (item.domainId && !domainIds.has(item.domainId)) {
        errors.push(`${label}.domainId references unknown domain '${item.domainId}'.`);
      }
      if (item.target) {
        assertRepoTarget(errors, item.target, `${label}.target`);
        if (!item.target.endsWith(targetSuffix)) {
          errors.push(`${label}.target should end with '${targetSuffix}'.`);
        }
      }
    }
  }

  return errors;
}

function renderGlobalSources(config) {
  return config.globalSources
    .map((source) => section(source.title, readText(source.path)))
    .join("\n\n");
}

function renderGlobalSummary(config) {
  return config.globalSources
    .map((source) => `- ${source.title}: .agents/${source.path}`)
    .join("\n");
}

function loadRoles(config) {
  return config.roles.map((roleRef) => ({ roleRef, role: readJson(roleRef.path) }));
}

function renderRole(role) {
  return [
    `### ${role.title}`,
    "",
    `Role id: \`${role.id}\``,
    "",
    role.purpose,
    "",
    "Allowed actions:",
    list(role.allowedActions),
    "",
    "Must do:",
    list(role.mustDo),
    "",
    "Must not do:",
    list(role.mustNotDo)
  ].join("\n");
}

function renderRoles(config) {
  return loadRoles(config)
    .map(({ role }) => renderRole(role))
    .join("\n\n");
}

function renderClaudeAgentSummary(config) {
  return loadRoles(config)
    .map(({ role }) => {
      const agent = role.claude ?? {};
      const name = agent.name ?? role.id;
      return `- \`${name}\` -> ${role.title}: ${agent.description ?? role.purpose}`;
    })
    .join("\n");
}

function findGeneratedTarget(items, domainId) {
  return items?.find((item) => item.domainId === domainId)?.target;
}

function renderDomainIndex(config) {
  return config.domains
    .map((domain) => [
      `### ${domain.name}`,
      "",
      `Domain id: \`${domain.id}\``,
      `Owner team: ${domain.ownerTeam}`,
      `Risk level: ${domain.riskLevel}`,
      "",
      "Runtime paths:",
      codeList(domain.runtimePaths),
      "",
      "Generated domain adapters:",
      codeList([
        domain.localAdapterTarget,
        findGeneratedTarget(config.copilotPathInstructions, domain.id),
        findGeneratedTarget(config.cursorDomainRules, domain.id)
      ].filter(Boolean))
    ].join("\n"))
    .join("\n\n");
}

function renderDomainSourceFiles(domain) {
  return domain.files
    .map((source) => section(source.title, readText(source.path)))
    .join("\n\n");
}

function renderDomain(domain) {
  const metadata = [
    `Domain id: \`${domain.id}\``,
    `Owner team: ${domain.ownerTeam}`,
    `Risk level: ${domain.riskLevel}`,
    "",
    "Runtime paths:",
    codeList(domain.runtimePaths),
    "",
    "Instruction source paths:",
    codeList(domain.ownerPaths),
    "",
    "Required reviewers:",
    list(domain.reviewers),
    "",
    "Verification commands:",
    codeList(domain.testCommands)
  ].join("\n");

  return [
    `### ${domain.name}`,
    "",
    metadata,
    "",
    renderDomainSourceFiles(domain)
  ].join("\n");
}

function renderTestCommands(domain) {
  return codeList(domain.testCommands);
}

function findDomain(config, domainId) {
  const domain = config.domains.find((candidate) => candidate.id === domainId);
  if (!domain) {
    throw new Error(`Unknown domain id: ${domainId}`);
  }
  return domain;
}

function applyTemplate(templateText, values) {
  const output = Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    templateText
  );
  const unresolved = output.match(/{{[a-zA-Z0-9_-]+}}/g);
  if (unresolved) {
    throw new Error(`Unresolved template placeholders: ${[...new Set(unresolved)].join(", ")}`);
  }
  return ensureTrailingNewline(output);
}

function buildRootAdapter(config, adapter) {
  const template = readText(adapter.template);
  return applyTemplate(template, {
    banner,
    title: adapter.title,
    notes: adapter.notes,
    descriptionYaml: yamlQuoted(adapter.notes),
    globalSections: renderGlobalSources(config),
    domainIndex: renderDomainIndex(config),
    roleSections: renderRoles(config),
    claudeAgentSummary: renderClaudeAgentSummary(config)
  });
}

function buildDomainAdapter(config, domain) {
  const template = readText(config.domainAdapterTemplate);
  return applyTemplate(template, {
    banner,
    domainName: domain.name,
    domainTarget: path.dirname(domain.localAdapterTarget).replaceAll("\\", "/"),
    ownerTeam: domain.ownerTeam,
    runtimePaths: codeList(domain.runtimePaths),
    ownerPaths: codeList(domain.ownerPaths),
    reviewers: list(domain.reviewers),
    globalSummary: renderGlobalSummary(config),
    domainSection: renderDomain(domain),
    roleSections: renderRoles(config),
    testCommands: renderTestCommands(domain)
  });
}

function buildCopilotPathInstruction(config, instruction) {
  const domain = findDomain(config, instruction.domainId);
  const template = readText(config.copilotPathInstructionTemplate);
  return applyTemplate(template, {
    banner,
    applyTo: instruction.applyTo,
    applyToYaml: yamlQuoted(instruction.applyTo),
    domainName: domain.name,
    ownerTeam: domain.ownerTeam,
    runtimePaths: codeList(domain.runtimePaths),
    ownerPaths: codeList(domain.ownerPaths),
    reviewers: list(domain.reviewers),
    globalSummary: renderGlobalSummary(config),
    domainSection: renderDomain(domain),
    roleSections: renderRoles(config),
    testCommands: renderTestCommands(domain)
  });
}

function buildCursorDomainRule(config, rule) {
  const domain = findDomain(config, rule.domainId);
  const template = readText(config.cursorDomainRuleTemplate);
  const description = `Generated ${domain.name} domain instructions from .agents canonical sources`;
  return applyTemplate(template, {
    banner,
    descriptionYaml: yamlQuoted(description),
    domainName: domain.name,
    globsYaml: yamlQuoted(cursorGlobs(domain.runtimePaths)),
    ownerTeam: domain.ownerTeam,
    runtimePaths: codeList(domain.runtimePaths),
    ownerPaths: codeList(domain.ownerPaths),
    reviewers: list(domain.reviewers),
    domainSection: renderDomain(domain),
    testCommands: renderTestCommands(domain)
  });
}

function buildClaudeAgent(config, role) {
  const agent = role.claude ?? {};
  const template = readText(config.claudeAgentTemplate);
  return applyTemplate(template, {
    banner,
    roleId: role.id,
    agentNameYaml: yamlQuoted(agent.name ?? role.id),
    title: role.title,
    descriptionYaml: yamlQuoted(agent.description ?? role.purpose),
    toolsCsv: toolsCsv(agent.tools),
    modelYaml: yamlQuoted(agent.model ?? "inherit"),
    colorYaml: yamlQuoted(agent.color ?? "blue"),
    purpose: role.purpose,
    allowedActions: list(role.allowedActions),
    mustDo: list(role.mustDo),
    mustNotDo: list(role.mustNotDo)
  });
}

function buildOutputs(config) {
  const outputs = [];
  const addOutput = (target, content) => outputs.push({ target, content });

  for (const adapter of config.adapters) {
    addOutput(adapter.target, buildRootAdapter(config, adapter));
  }

  for (const domain of config.domains) {
    addOutput(domain.localAdapterTarget, buildDomainAdapter(config, domain));
  }

  for (const instruction of config.copilotPathInstructions ?? []) {
    addOutput(instruction.target, buildCopilotPathInstruction(config, instruction));
  }

  for (const rule of config.cursorDomainRules ?? []) {
    addOutput(rule.target, buildCursorDomainRule(config, rule));
  }

  for (const { role } of loadRoles(config)) {
    const agentName = role.claude?.name ?? role.id;
    const target = path.posix.join(config.claudeAgentsTargetDir, `${agentName}.md`);
    addOutput(target, buildClaudeAgent(config, role));
  }

  outputs.sort((a, b) => a.target.localeCompare(b.target));
  const manifest = {
    marker: generatedMarker,
    schemaVersion: 1,
    generatedBy: "scripts/agents.mjs",
    files: outputs.map((output) => output.target)
  };
  addOutput(manifestTarget, `${JSON.stringify(manifest, null, 2)}\n`);
  outputs.sort((a, b) => a.target.localeCompare(b.target));
  return outputs;
}

function writeOutput(target, content) {
  const fullPath = resolveRepoTarget(target);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`generated ${target}`);
}

function checkOutput(target, content, drift) {
  const fullPath = resolveRepoTarget(target);
  if (!fs.existsSync(fullPath)) {
    drift.push(`${target} is missing`);
    return;
  }
  const current = fs.readFileSync(fullPath, "utf8");
  if (current !== content) {
    drift.push(`${target} is out of date`);
  }
}

function walkFiles(directory) {
  const results = [];
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredWalkDirs.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function toRepoRelative(fullPath) {
  return path.relative(repoRoot, fullPath).replaceAll(path.sep, "/");
}

function findStaleGeneratedFiles(expectedTargets) {
  const expected = new Set(expectedTargets.map((target) => target.replaceAll("\\", "/")));
  const stale = [];
  for (const file of walkFiles(repoRoot)) {
    const relative = toRepoRelative(file);
    if (expected.has(relative) || ignoredGeneratedMarkerFiles.has(relative)) continue;
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (content.includes(generatedMarker)) {
      stale.push(`${relative} is stale generated output`);
    }
  }
  return stale.sort();
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error("Failed to read .agents/config.json:");
    console.error(error.message);
    process.exit(1);
  }
}

function main() {
  const config = loadConfig();
  const validationErrors = validateConfig(config);
  if (validationErrors.length > 0) {
    console.error("Agent instruction config is invalid:");
    fail(validationErrors);
  }

  if (validateOnly) {
    console.log("Agent instruction config is valid.");
    return;
  }

  const outputs = buildOutputs(config);

  if (checkOnly) {
    const drift = [];
    for (const output of outputs) {
      checkOutput(output.target, output.content, drift);
    }
    drift.push(...findStaleGeneratedFiles(outputs.map((output) => output.target)));

    if (drift.length > 0) {
      console.error("Agent instruction adapters are out of sync:");
      fail(drift);
    }

    console.log("Agent instruction adapters are in sync.");
    return;
  }

  for (const output of outputs) {
    writeOutput(output.target, output.content);
  }
}

main();