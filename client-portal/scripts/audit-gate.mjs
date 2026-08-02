import { execFileSync } from "node:child_process";

const acceptedAdvisories = new Set(["https://github.com/advisories/GHSA-qwww-vcr4-c8h2"]);

let report;
try {
  report = JSON.parse(execFileSync("npm", ["audit", "--omit=dev", "--json"], { encoding: "utf8" }));
} catch (error) {
  if (!error.stdout) throw error;
  report = JSON.parse(error.stdout.toString());
}

const findings = Object.values(report.vulnerabilities ?? {}).flatMap((entry) =>
  (entry.via ?? []).filter((item) => typeof item === "object"),
);
const unexpected = findings.filter((item) => !acceptedAdvisories.has(item.url));

if (unexpected.length > 0) {
  console.error("Production dependency audit found unapproved vulnerabilities:");
  for (const finding of unexpected) console.error(`- ${finding.title} (${finding.url})`);
  process.exit(1);
}

if (findings.length > 0) {
  console.log("Audit passed with the documented React Router RSC-only exception; this SPA does not enable RSC server actions.");
} else {
  console.log("Audit passed with no production vulnerabilities.");
}
