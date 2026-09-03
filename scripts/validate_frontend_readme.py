#!/usr/bin/env python3
"""Fail closed when Beyvra frontend authority documentation or release wiring regresses."""

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
DOCKERFILE = ROOT / "client-portal" / "Dockerfile.prod"
DEPLOYMENT = ROOT / "DEPLOYMENT.md"
PROMOTION = ROOT / "docs" / "PRODUCTION-READONLY-PROMOTION.md"
READINESS = ROOT / "docs" / "PRODUCTION-READINESS-2026-09-03.md"
DEPLOY_SCRIPT = ROOT / "operations" / "deploy_immutable_frontend.sh"
VERIFY_SCRIPT = ROOT / "operations" / "verify_frontend_release.py"
CI_WORKFLOW = ROOT / ".github" / "workflows" / "ci.yml"
DEPLOY_WORKFLOW = ROOT / ".github" / "workflows" / "deploy.yml"
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


def reject(text: str, patterns: tuple[str, ...], context: str) -> None:
    for pattern in patterns:
        if re.search(pattern, text, re.MULTILINE):
            fail(f"{context} contains prohibited pattern: {pattern}")


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


def validate_documentation(scripts: set[str]) -> None:
    root_text = read(ROOT_README)
    portal_text = read(PORTAL_README)
    deployment_text = read(DEPLOYMENT)
    promotion_text = read(PROMOTION)
    readiness_text = read(READINESS)

    for marker in TEMPLATE_MARKERS:
        if any(
            marker.lower() in text.lower()
            for text in (root_text, portal_text, deployment_text)
        ):
            fail(f"generic README template marker remains: {marker}")

    require(
        root_text,
        (
            "## Repository authority",
            "## Current release truth",
            "## Request and identity boundary",
            "## Container architecture",
            "## Immutable release flow",
            "## Production gates",
            "## Active-mode boundary",
            "appolon1908-hue/beyvra-frontend",
            "appolon1908-hue/beyvra-backend",
            "https://auth.codestra.co/realms/codestra",
            "GET /api/v1/auth/oidc/login/?next=/platform",
            "Authorization Code Flow with PKCE S256",
            "Identity tokens must not be stored in `localStorage`.",
            "FRONTEND_IMAGE=repository@sha256:...",
            "has no `build:` directive",
            "staging-readonly",
            "production-readonly",
            "capped at one percent",
            "LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED_BY_THIS_REPOSITORY",
        ),
        "root README",
    )
    require(
        portal_text,
        (
            "# Beyvra Client Portal",
            "[`../README.md`](../README.md)",
            "appolon1908-hue/beyvra-backend",
            "VITE_API_BASE_URL=/api",
            "VITE_SOCKET_BASE_URL=AUTO",
            "GET /api/v1/auth/oidc/login/?next=/platform",
            "https://auth.codestra.co/realms/codestra",
            "node scripts/check-api-contract.mjs --source-only",
            "API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract",
            "E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e",
            "POST /api/v1/demo/sessions",
            "Deploying this portal never enables live trading.",
        ),
        "client-portal README",
    )
    require(
        deployment_text,
        (
            "IMMUTABLE_IMAGE_PUBLICATION=WORKFLOW_CONTROLLED",
            "PRODUCTION_READONLY_PROMOTION=EXACT_DIGEST_ONLY",
            "PRODUCTION_CANARY_LIMIT_PERCENT=1",
            "FRONTEND_IMAGE=repository@sha256:...",
            "contains no `build:` directive",
            "staging-readonly",
            "production-readonly",
            "publish_image=false",
            "CANARY_TRAFFIC_PERCENT",
            "EXTERNAL_CANARY_ROUTING_VERIFIED",
            "DEPLOYMENT_READ_ONLY",
        ),
        "deployment guide",
    )
    require(
        promotion_text + readiness_text,
        (
            "staging-readonly",
            "production-readonly",
            "repository@sha256",
            "Active trading / real money: NOT AUTHORIZED",
        ),
        "production-readiness documentation",
    )

    for script in scripts & EXPECTED_SCRIPTS:
        command = f"npm run {script}"
        if command not in root_text or command not in portal_text:
            fail(f"README command is missing: {command}")


def validate_environment(text: str) -> None:
    require(
        text,
        (
            "PORT=8080",
            "VITE_API_BASE_URL=/api",
            "VITE_SOCKET_BASE_URL=AUTO",
            "VITE_PUBLIC_SITE_URL=https://staging.beyvra.com",
            "VITE_BRAND_NAME=Beyvra",
            "VITE_REALTIME_V2_ENABLED=true",
            "VITE_REALTIME_V2_V1_FALLBACK_ENABLED=false",
            "VITE_DEPLOYMENT_READ_ONLY=true",
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
            "image: ${FRONTEND_IMAGE:?FRONTEND_IMAGE must be an immutable repository@sha256 digest}",
            "pull_policy: never",
            'user: "101:101"',
            "read_only: true",
            "no-new-privileges:true",
            "cap_drop:",
            "- ALL",
            "127.0.0.1:${PORT:?PORT is required}:8080",
            "VITE_API_BASE_URL: /api",
            "VITE_SOCKET_BASE_URL: AUTO",
            'VITE_REALTIME_V2_ENABLED: "true"',
            'VITE_REALTIME_V2_V1_FALLBACK_ENABLED: "false"',
            'VITE_DEPLOYMENT_READ_ONLY: "true"',
            "BEYVRA_SOURCE_SHA: ${SOURCE_SHA:?SOURCE_SHA is required}",
            "BEYVRA_IMAGE_DIGEST: ${FRONTEND_IMAGE}",
            "BACKEND_UPSTREAM: ${BACKEND_UPSTREAM:?BACKEND_UPSTREAM is required}",
            "external: true",
            "name: ${BACKEND_NETWORK:?BACKEND_NETWORK is required}",
        ),
        "Compose source",
    )
    reject(
        text,
        (
            r"^\s*build:\s*",
            r"^\s*image:\s*[^\n]*:latest\s*$",
            r"dockerfile:\s*Dockerfile\.prod",
            r"context:\s*\./client-portal",
            r"SERVER_PORT",
            r"profiles:\s*\[\s*[\"']edge[\"']\s*\]",
        ),
        "Compose source",
    )


def validate_dockerfile(text: str) -> None:
    require(
        text,
        (
            "ARG NODE_IMAGE=",
            "ARG NGINX_IMAGE=",
            "FROM ${NODE_IMAGE} AS build-stage",
            "FROM ${NGINX_IMAGE} AS production-stage",
            "npm ci",
            "apk upgrade --no-cache",
            "org.opencontainers.image.revision",
            "EXPOSE 8080",
            "USER 101",
            'ENTRYPOINT ["/usr/local/bin/beyvra-entrypoint"]',
        ),
        "production Dockerfile",
    )


def validate_contract_and_browser() -> None:
    contract = read(CONTRACT_CHECKER)
    playwright = read(PLAYWRIGHT_CONFIG)
    setup = read(PLAYWRIGHT_SETUP)
    require(
        contract,
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
    require(playwright, ("globalSetup", "E2E_BASE_URL"), "Playwright configuration")
    require(
        setup,
        (
            'context.post("/api/v1/demo/sessions"',
            "E2E_SKIP_GUEST_BOOTSTRAP",
            "Guest session bootstrap failed",
        ),
        "Playwright global setup",
    )


def validate_release_authority() -> None:
    ci = read(CI_WORKFLOW)
    workflow = read(DEPLOY_WORKFLOW)
    deploy = read(DEPLOY_SCRIPT)
    verifier = read(VERIFY_SCRIPT)

    require(
        ci,
        (
            "exact-head-base-ci:",
            "gitleaks/gitleaks-action@v2",
            "aquasecurity/trivy-action@0.35.0",
            "npm run audit:gate",
            "test ! -e client-portal/deploy.sh",
            "docker compose -f docker-compose.yaml config --images",
        ),
        "CI workflow",
    )
    require(
        workflow,
        (
            "staging-readonly",
            "production-readonly",
            "publish_image:",
            "frontend_image:",
            "provenance: mode=max",
            "sbom: true",
            "Production promotion must reuse a staging-certified digest.",
            "environment:",
            "DEPLOY_KNOWN_HOSTS",
            "CANARY_TRAFFIC_PERCENT",
            "EXTERNAL_CANARY_ROUTING_VERIFIED",
        ),
        "deployment workflow",
    )
    require(
        deploy,
        (
            "@sha256:[0-9a-f]{64}$",
            "SOURCE_SHA",
            "BACKEND_SOURCE_SHA",
            "BACKEND_IMAGE",
            "CANARY_TRAFFIC_PERCENT",
            "CANARY_TRAFFIC_PERCENT > 1",
            "EXTERNAL_CANARY_ROUTING_VERIFIED",
            "--no-build",
            "previous.env",
            "rollback()",
            "verify_frontend_release.py",
        ),
        "deployment script",
    )
    require(
        verifier,
        (
            "/__release.json",
            "/__runtime-config.json",
            "/api/v1/system/version",
            "/api/v1/system/capabilities",
            "/api/v1/trading/orders",
            "DEPLOYMENT_READ_ONLY",
            "content-security-policy",
            "strict-transport-security",
        ),
        "release verifier",
    )


def validate() -> None:
    scripts = validate_package(load_json(PACKAGE))
    validate_documentation(scripts)
    validate_environment(read(ENV_EXAMPLE))
    validate_compose(read(COMPOSE))
    validate_dockerfile(read(DOCKERFILE))
    validate_contract_and_browser()
    validate_release_authority()


def main() -> None:
    validate()
    print("Beyvra frontend README and release authority: PASS")


if __name__ == "__main__":
    main()
