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

REQUIRED_ROOT_HEADINGS = {
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

REQUIRED_ROOT_TEXT = {
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
    "LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED_BY_THIS_REPOSITORY",
    "PROVIDER_CREDENTIALS_ALLOWED_IN_BROWSER=NO",
    "GET /api/v1/auth/oidc/login/?next=/platform",
    "Authorization Code Flow with PKCE S256",
    "Frontend API calls default to the same-origin `/api` boundary.",
    "Merging this repository never authorizes a production deployment",
}

GENERIC_TEMPLATE_MARKERS = {
    "This README would normally document whatever steps are necessary",
    "Learn Markdown",
    "Who do I talk to?",
    "Quick summary",
}


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


def validate_root_readme(text: str, scripts: set[str]) -> None:
    for marker in GENERIC_TEMPLATE_MARKERS:
        if marker.lower() in text.lower():
            fail(f"generic README template marker remains: {marker}")

    for heading in REQUIRED_ROOT_HEADINGS:
        if heading not in text:
            fail(f"root README is missing required section: {heading}")

    for required in REQUIRED_ROOT_TEXT:
        if required not in text:
            fail(f"root README is missing required authority text: {required}")

    for script in EXPECTED_SCRIPTS:
        command = f"npm run {script}"
        if script not in scripts:
            fail(f"README-required package script is absent: {script}")
        if command not in text:
            fail(f"root README does not document package script: {command}")

    if "live trading" not in text.lower() or "does not authorize" not in text.lower():
        fail("root README does not explicitly deny live-trading authorization")
    if "localStorage" not in text:
        fail("root README does not prohibit browser identity-token storage")
    if "repository@sha256:..." not in text:
        fail("root README does not require immutable production image identity")


def validate_portal_readme(text: str, scripts: set[str]) -> None:
    for marker in GENERIC_TEMPLATE_MARKERS:
        if marker.lower() in text.lower():
            fail(f"generic client-portal README marker remains: {marker}")

    for required in (
        "# Beyvra Client Portal",
        "[`../README.md`](../README.md)",
        "appolon1908-hue/beyvra-backend",
        "VITE_API_BASE_URL=/api",
        "GET /api/v1/auth/oidc/login/?next=/platform",
        "https://auth.codestra.co/realms/codestra",
        "https://api.beyvra.com",
        "Deploying this portal never enables live trading.",
    ):
        if required not in text:
            fail(f"client-portal README is missing required text: {required}")

    for script in EXPECTED_SCRIPTS:
        if script not in scripts:
            fail(f"client-portal README references absent package script: {script}")
        if f"npm run {script}" not in text:
            fail(f"client-portal README does not document package script: {script}")


def validate_package(document: dict[str, Any]) -> set[str]:
    scripts = document.get("scripts")
    if not isinstance(scripts, dict):
        fail("client-portal package.json has no scripts object")
    script_names = {str(name) for name in scripts}
    missing = EXPECTED_SCRIPTS - script_names
    if missing:
        fail(f"client-portal package.json is missing scripts: {sorted(missing)}")

    dependencies = document.get("dependencies")
    dev_dependencies = document.get("devDependencies")
    if not isinstance(dependencies, dict) or not isinstance(dev_dependencies, dict):
        fail("client-portal dependency declarations are incomplete")

    for dependency in (
        "react",
        "@reduxjs/toolkit",
        "@tanstack/react-query",
        "antd",
        "echarts",
        "lightweight-charts",
        "i18next",
        "socket.io-client",
    ):
        if dependency not in dependencies:
            fail(f"README runtime dependency is absent: {dependency}")

    for dependency in ("typescript", "vite", "vitest", "@playwright/test", "@axe-core/playwright"):
        if dependency not in dev_dependencies:
            fail(f"README toolchain dependency is absent: {dependency}")

    react_version = str(dependencies["react"]).lstrip("^~")
    if not react_version.startswith("19."):
        fail(f"README says React 19 but package.json uses {dependencies['react']}")

    return script_names


def validate_environment(text: str) -> None:
    required = {
        "SERVER_PORT=8080",
        "VITE_API_BASE_URL=/api",
        "VITE_PUBLIC_SITE_URL=https://staging.beyvra.com",
        "VITE_BRAND_NAME=Beyvra",
    }
    for item in required:
        if item not in text:
            fail(f"environment example is missing README-documented value: {item}")

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        name, value = stripped.split("=", 1)
        if name.startswith("VITE_") and re.search(
            r"(?i)(password|secret|private[_-]?key|access[_-]?token|refresh[_-]?token|bearer)",
            value,
        ):
            fail(f"public Vite variable appears to contain secret material: {name}")


def validate_compose(text: str) -> None:
    for required in (
        "context: ./client-portal",
        "dockerfile: Dockerfile.prod",
        '"127.0.0.1:${SERVER_PORT:-8080}:80"',
        "trading-network:",
        "external: true",
        'profiles: ["edge"]',
    ):
        if required not in text:
            fail(f"Compose source does not match README: {required}")

    if re.search(r"(?m)^\s*image:\s*[^\n]*:latest\s*$", text):
        fail("Compose uses a floating latest image tag")


def validate() -> None:
    root_readme = read(ROOT_README)
    portal_readme = read(PORTAL_README)
    package = load_json(PACKAGE)
    environment = read(ENV_EXAMPLE)
    compose = read(COMPOSE)
    read(DEPLOYMENT)

    scripts = validate_package(package)
    validate_root_readme(root_readme, scripts)
    validate_portal_readme(portal_readme, scripts)
    validate_environment(environment)
    validate_compose(compose)


def main() -> None:
    validate()
    print("Beyvra frontend README authority: PASS")


if __name__ == "__main__":
    main()
