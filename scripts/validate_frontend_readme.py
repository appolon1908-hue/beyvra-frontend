#!/usr/bin/env python3
"""Fail closed when Beyvra frontend authority documentation regresses."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
ROOT_README = ROOT / "README.md"
PORTAL_README = ROOT / "client-portal" / "README.md"
PACKAGE = ROOT / "client-portal" / "package.json"
ENV_EXAMPLE = ROOT / "client-portal" / ".env.example"
COMPOSE = ROOT / "docker-compose.yaml"
DEPLOYMENT = ROOT / "DEPLOYMENT.md"
CONTRACT_CHECKER = ROOT / "client-portal" / "scripts" / "check-api-contract.mjs"
PLAYWRIGHT_CONFIG = ROOT / "client-portal" / "playwright.config.ts"
PLAYWRIGHT_SETUP = ROOT / "client-portal" / "e2e" / "global-setup.ts"

EXPECTED_SCRIPTS = {
    "dev",
    "build",
    "lint",
    "typecheck",
    "i18n:check",
    "audit:gate",
    "errors:check",
    "brand:check",
    "test:errors",
    "test:realtime",
    "test:chart",
    "test:contract",
    "test:e2e",
}

ROOT_HEADINGS = {
    "## Repository authority",
    "## Current release truth",
    "## Application surfaces",
    "## Current browser application",
    "## Request and identity boundary",
    "## Frontend and backend responsibility split",
    "## Runtime and toolchain",
    "## Local development",
    "## Configuration",
    "## Validation",
    "## Container build",
    "## Staging deployment",
    "## Production gates",
    "## Security rules",
    "## Repository layout",
    "## Change policy",
}

ROOT_TEXT = {
    "appolon1908-hue/beyvra-frontend",
    "appolon1908-hue/beyvra-backend",
    "https://beyvra.com",
    "https://platform.beyvra.com",
    "https://admin.beyvra.com",
    "https://api.beyvra.com",
    "https://auth.codestra.co/realms/codestra",
    "https://staging.beyvra.com",
    "REPOSITORY_AUTHORITY=DEFINED",
    "PRODUCTION_RELEASE=NOT_CERTIFIED_BY_THIS_README",
    "PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED",
    "LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED_BY_THIS_REPOSITORY",
    "PROVIDER_CREDENTIALS_ALLOWED_IN_BROWSER=NO",
    "GET /api/v1/auth/oidc/login/?next=/platform",
    "Authorization Code Flow with PKCE S256",
    "Frontend API calls default to the same-origin `/api` boundary.",
    "node scripts/check-api-contract.mjs --source-only",
    "API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract",
    "E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e",
    "POST /api/v1/demo/sessions",
    "Merging this repository never authorizes a production deployment",
}

TEMPLATE_MARKERS = {
    "This README would normally document whatever steps are necessary",
    "Learn Markdown",
    "Who do I talk to?",
    "Quick summary",
}

SECRET_INDICATOR = re.compile(
    r"(?i)(password|passwd|secret|private[_-]?key|api[_-]?key|client[_-]?secret|"
    r"access[_-]?token|refresh[_-]?token|bearer|credential|database[_-]?url|dsn)"
)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def read(path: Path) -> str:
    if not path.is_file():
        fail(f"required file is missing: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(read(path))
    except Exception as exc:
        fail(f"invalid JSON in {path.relative_to(ROOT)}: {exc}")
    if not isinstance(value, dict):
        fail(f"JSON root must be an object: {path.relative_to(ROOT)}")
    return value


def require(text: str, values: set[str] | tuple[str, ...], context: str) -> None:
    for value in values:
        if value not in text:
            fail(f"{context} is missing required text: {value}")


def validate_package(document: dict[str, Any]) -> set[str]:
    scripts = document.get("scripts")
    dependencies = document.get("dependencies")
    dev_dependencies = document.get("devDependencies")
    if not isinstance(scripts, dict):
        fail("client-portal package.json has no scripts object")
    if not isinstance(dependencies, dict) or not isinstance(dev_dependencies, dict):
        fail("client-portal dependency declarations are incomplete")

    script_names = {str(name) for name in scripts}
    missing = EXPECTED_SCRIPTS - script_names
    if missing:
        fail(f"client-portal package.json is missing scripts: {sorted(missing)}")

    for name in (
        "react",
        "@reduxjs/toolkit",
        "@tanstack/react-query",
        "antd",
        "echarts",
        "lightweight-charts",
        "i18next",
        "socket.io-client",
    ):
        if name not in dependencies:
            fail(f"README runtime dependency is absent: {name}")
    for name in (
        "typescript",
        "vite",
        "vitest",
        "@playwright/test",
        "@axe-core/playwright",
    ):
        if name not in dev_dependencies:
            fail(f"README toolchain dependency is absent: {name}")

    if not str(dependencies["react"]).lstrip("^~").startswith("19."):
        fail("README says React 19 but package.json does not")
    return script_names


def validate_readmes(root_text: str, portal_text: str, scripts: set[str]) -> None:
    for marker in TEMPLATE_MARKERS:
        if marker.lower() in root_text.lower() or marker.lower() in portal_text.lower():
            fail(f"generic README template marker remains: {marker}")

    require(root_text, ROOT_HEADINGS, "root README")
    require(root_text, ROOT_TEXT, "root README")
    require(
        portal_text,
        (
            "# Beyvra Client Portal",
            "[`../README.md`](../README.md)",
            "appolon1908-hue/beyvra-backend",
            "VITE_API_BASE_URL=/api",
            "GET /api/v1/auth/oidc/login/?next=/platform",
            "https://auth.codestra.co/realms/codestra",
            "https://api.beyvra.com",
            "node scripts/check-api-contract.mjs --source-only",
            "API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract",
            "E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e",
            "POST /api/v1/demo/sessions",
            "PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED",
            "Deploying this portal never enables live trading.",
        ),
        "client-portal README",
    )

    for script in scripts & EXPECTED_SCRIPTS:
        command = f"npm run {script}"
        if command not in root_text or command not in portal_text:
            fail(f"README command is missing: {command}")

    if "localStorage" not in root_text:
        fail("root README does not prohibit browser identity-token storage")
    if "repository@sha256:..." not in root_text:
        fail("root README does not require immutable production image identity")
    if "does not, by this documentation alone, prove" not in root_text:
        fail("root README overstates production artifact evidence")
    if "Production uses an immutable registry digest" in portal_text:
        fail("client-portal README claims unproven production deployment")


def validate_environment(text: str) -> None:
    require(
        text,
        (
            "SERVER_PORT=8080",
            "VITE_API_BASE_URL=/api",
            "VITE_PUBLIC_SITE_URL=https://staging.beyvra.com",
            "VITE_BRAND_NAME=Beyvra",
        ),
        "environment example",
    )
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        raw_name, raw_value = stripped.split("=", 1)
        name = raw_name.strip()
        value = raw_value.strip()
        if not name.startswith("VITE_"):
            continue
        normalized_name = name.lower().replace("-", "_")
        if SECRET_INDICATOR.search(normalized_name) or SECRET_INDICATOR.search(value):
            fail(
                "public Vite configuration contains a secret-bearing variable "
                f"name or value: {name}"
            )


def validate_compose(text: str) -> None:
    require(
        text,
        (
            "context: ./client-portal",
            "dockerfile: Dockerfile.prod",
            '"127.0.0.1:${SERVER_PORT:-8080}:80"',
            "trading-network:",
            "external: true",
            'profiles: ["edge"]',
        ),
        "Compose source",
    )
    if re.search(r"(?m)^\s*image:\s*[^\n]*:latest\s*$", text):
        fail("Compose uses a floating latest image tag")


def validate_contract_checker(text: str) -> None:
    require(
        text,
        (
            "../src/api/endpoints.ts",
            "minimumRegistryPaths",
            "endpointDefinitions",
            "directEndpointCalls",
            "registryEndpoints.size < minimumRegistryPaths",
            '"/v1/workspace/bootstrap"',
            "backendEndpoints.size === 0",
            'process.argv.includes("--source-only")',
        ),
        "API contract checker",
    )


def validate_playwright(config: str, setup: str, root_text: str, portal_text: str) -> None:
    require(config, ("globalSetup", "E2E_BASE_URL"), "Playwright configuration")
    require(
        setup,
        (
            'context.post("/api/v1/demo/sessions"',
            "E2E_SKIP_GUEST_BOOTSTRAP",
            "Guest session bootstrap failed",
        ),
        "Playwright global setup",
    )
    for documentation in (root_text, portal_text):
        require(
            documentation,
            ("does not start", "E2E_BASE_URL", "POST /api/v1/demo/sessions"),
            "Playwright documentation",
        )


def validate_deployment(text: str) -> None:
    require(
        text,
        (
            "SOURCE_BUILD_REHEARSAL=AVAILABLE",
            "IMMUTABLE_IMAGE_PUBLICATION=NOT_PROVEN_BY_THIS_REPOSITORY",
            "PROTECTED_PRODUCTION_DEPLOYMENT=NOT_PROVEN_BY_THIS_REPOSITORY",
            "PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED",
            "LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED",
            "node scripts/check-api-contract.mjs --source-only",
            "API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract",
            "E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e",
            "POST /api/v1/demo/sessions",
            "repository@sha256:...",
        ),
        "deployment guide",
    )


def validate() -> None:
    root_readme = read(ROOT_README)
    portal_readme = read(PORTAL_README)
    scripts = validate_package(load_json(PACKAGE))
    validate_readmes(root_readme, portal_readme, scripts)
    validate_environment(read(ENV_EXAMPLE))
    validate_compose(read(COMPOSE))
    validate_contract_checker(read(CONTRACT_CHECKER))
    validate_playwright(
        read(PLAYWRIGHT_CONFIG),
        read(PLAYWRIGHT_SETUP),
        root_readme,
        portal_readme,
    )
    validate_deployment(read(DEPLOYMENT))


def main() -> None:
    validate()
    print("Beyvra frontend README authority: PASS")


if __name__ == "__main__":
    main()
