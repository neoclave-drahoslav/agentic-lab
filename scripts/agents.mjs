import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const agentsRoot = path.join(repoRoot, ".agents");
const configPath = path.join(agentsRoot, "config.json");
const checkOnly = process.argv.includes("--check");

const banner = [
  "<!--",
  "DO NOT EDIT.",
  "Generated from .agents/ canonical sources.",
  "Run: npm run agents:generate",
  "-->",
  ""
].join("\n");

function readText(relativePath) {
  return fs.readFileSync(path.join(agentsRoot, relativePath), "utf8").trim();
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

function stripLeadingH1(markdown) {
  return markdown.replace(/^# .+?(\r?\n){1,2}/, "").trim();
}

function section(title, body) {
  return `### ${title}\n\n${stripLeadingH1(body)}`;
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
  return config.roles
    .map((roleRef) => renderRole(readJson(roleRef.path)))
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

function renderDomains(config) {
  return config.domains.map(renderDomain).join("\n\n");
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
  return ensureTrailingNewline(
    Object.entries(values).reduce(
      (output, [key, value]) => output.replaceAll(`{{${key}}}`, value),
      templateText
    )
  );
}

function writeOrCheck(relativeTarget, content, drift) {
  const target = path.join(repoRoot, relativeTarget);

  if (checkOnly) {
    if (!fs.existsSync(target)) {
      drift.push(`${relativeTarget} is missing`);
      return;
    }

    const current = fs.readFileSync(target, "utf8");
    if (current !== content) {
      drift.push(`${relativeTarget} is out of date`);
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  console.log(`generated ${relativeTarget}`);
}

function buildRootAdapter(config, adapter) {
  const template = readText(adapter.template);
  return applyTemplate(template, {
    banner,
    title: adapter.title,
    notes: adapter.notes,
    globalSections: renderGlobalSources(config),
    domainSections: renderDomains(config),
    roleSections: renderRoles(config)
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

function main() {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const drift = [];

  for (const adapter of config.adapters) {
    writeOrCheck(adapter.target, buildRootAdapter(config, adapter), drift);
  }

  for (const domain of config.domains) {
    writeOrCheck(domain.localAdapterTarget, buildDomainAdapter(config, domain), drift);
  }

  for (const instruction of config.copilotPathInstructions ?? []) {
    writeOrCheck(instruction.target, buildCopilotPathInstruction(config, instruction), drift);
  }

  if (checkOnly && drift.length > 0) {
    console.error("Agent instruction adapters are out of sync:");
    for (const item of drift) {
      console.error(`- ${item}`);
    }
    console.error("Run: npm run agents:generate");
    process.exit(1);
  }

  if (checkOnly) {
    console.log("Agent instruction adapters are in sync.");
  }
}

main();