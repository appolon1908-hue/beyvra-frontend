#!/usr/bin/env python3
"""Verify an immutable Beyvra frontend and its paired backend candidate."""

from __future__ import annotations

import argparse
import json
import ssl
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def request(
    base_url: str,
    path: str,
    *,
    timeout: int,
    method: str = "GET",
    body: object | None = None,
) -> tuple[int, dict[str, str], bytes]:
    data = None
    headers = {
        "Accept": "application/json",
        "User-Agent": "beyvra-frontend-release-verifier/1",
    }
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = Request(
        base_url.rstrip("/") + path,
        data=data,
        headers=headers,
        method=method,
    )
    try:
        response = urlopen(
            req,
            timeout=timeout,
            context=ssl.create_default_context(),
        )
        raw, status, response_headers = (
            response.read(1_048_576),
            response.status,
            response.headers,
        )
    except HTTPError as exc:
        raw, status, response_headers = (
            exc.read(1_048_576),
            exc.code,
            exc.headers,
        )
    return (
        status,
        {key.lower(): value for key, value in response_headers.items()},
        raw,
    )


def json_request(*args, **kwargs) -> tuple[int, dict[str, str], object]:
    status, headers, raw = request(*args, **kwargs)
    try:
        payload = json.loads(raw.decode()) if raw else {}
    except (UnicodeDecodeError, json.JSONDecodeError):
        payload = None
    return status, headers, payload


def add_check(
    checks: list[dict[str, object]],
    *,
    name: str,
    passed: bool,
    http_status: int | None = None,
) -> None:
    result: dict[str, object] = {
        "name": name,
        "result": "PASS" if passed else "FAIL",
    }
    if http_status is not None:
        result["http_status"] = http_status
    checks.append(result)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--expected-public-base-url", required=True)
    parser.add_argument("--frontend-source-sha", required=True)
    parser.add_argument("--frontend-image-digest", required=True)
    parser.add_argument("--backend-source-sha", required=True)
    parser.add_argument("--backend-image-digest", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--timeout", type=int, default=20)
    args = parser.parse_args()

    checks: list[dict[str, object]] = []

    health_status, _, health_raw = request(
        args.base_url,
        "/healthz",
        timeout=args.timeout,
    )
    add_check(
        checks,
        name="frontend_health",
        passed=health_status == 200 and health_raw.strip() == b"ok",
        http_status=health_status,
    )

    release_status, _, release = json_request(
        args.base_url,
        "/__release.json",
        timeout=args.timeout,
    )
    release_ok = (
        release_status == 200
        and isinstance(release, dict)
        and release.get("service") == "beyvra-frontend"
        and release.get("source_sha") == args.frontend_source_sha
        and release.get("image_digest") == args.frontend_image_digest
        and release.get("deployment_read_only") is True
        and release.get("realtime_v2_enabled") is True
        and release.get("legacy_realtime_fallback_enabled") is False
    )
    add_check(
        checks,
        name="frontend_immutable_identity",
        passed=release_ok,
        http_status=release_status,
    )

    config_status, config_headers, config = json_request(
        args.base_url,
        "/__runtime-config.json",
        timeout=args.timeout,
    )
    expected_site = args.expected_public_base_url.rstrip("/")
    config_ok = (
        config_status == 200
        and isinstance(config, dict)
        and config.get("VITE_API_BASE_URL") == "/api"
        and config.get("VITE_SOCKET_BASE_URL") == "AUTO"
        and config.get("VITE_PUBLIC_SITE_URL") == expected_site
        and config.get("VITE_REALTIME_V2_ENABLED") == "true"
        and config.get("VITE_REALTIME_V2_V1_FALLBACK_ENABLED") == "false"
        and config.get("VITE_DEPLOYMENT_READ_ONLY") == "true"
        and "no-store" in config_headers.get("cache-control", "")
    )
    add_check(
        checks,
        name="frontend_runtime_configuration",
        passed=config_ok,
        http_status=config_status,
    )

    root_status, root_headers, _ = request(
        args.base_url,
        "/",
        timeout=args.timeout,
    )
    csp = root_headers.get("content-security-policy", "")
    headers_ok = (
        root_status == 200
        and "default-src 'self'" in csp
        and "connect-src 'self'" in csp
        and "frame-ancestors 'none'" in csp
        and "api.beyvra.com" not in csp
        and "staging." not in csp
        and root_headers.get("x-content-type-options", "").lower()
        == "nosniff"
        and bool(root_headers.get("strict-transport-security"))
    )
    add_check(
        checks,
        name="frontend_security_headers",
        passed=headers_ok,
        http_status=root_status,
    )

    backend_status, _, backend = json_request(
        args.base_url,
        "/api/v1/system/version",
        timeout=args.timeout,
    )
    safety = backend.get("safety", {}) if isinstance(backend, dict) else {}
    backend_ok = (
        backend_status == 200
        and isinstance(backend, dict)
        and backend.get("source_sha") == args.backend_source_sha
        and backend.get("image_digest") == args.backend_image_digest
        and backend.get("immutable_identity_verified") is True
        and backend.get("deployment_read_only") is True
        and isinstance(safety, dict)
        and safety.get("deployment_read_only") is True
        and safety.get("simulation_enabled") is False
        and safety.get("live_trading_enabled") is False
        and safety.get("real_trading_enabled") is False
        and safety.get("real_money_enabled") is False
        and safety.get("external_execution_enabled") is False
    )
    add_check(
        checks,
        name="paired_backend_immutable_identity",
        passed=backend_ok,
        http_status=backend_status,
    )

    capabilities_status, _, capabilities = json_request(
        args.base_url,
        "/api/v1/system/capabilities",
        timeout=args.timeout,
    )
    capabilities_ok = (
        capabilities_status == 200
        and isinstance(capabilities, dict)
        and capabilities.get("deployment_read_only") is True
        and capabilities.get("simulation") is False
        and capabilities.get("real_trading") is False
        and capabilities.get("real_money") is False
    )
    add_check(
        checks,
        name="paired_backend_fail_closed_capabilities",
        passed=capabilities_ok,
        http_status=capabilities_status,
    )

    mutation_status, _, mutation = json_request(
        args.base_url,
        "/api/v1/trading/orders",
        timeout=args.timeout,
        method="POST",
        body={},
    )
    mutation_ok = (
        mutation_status == 503
        and isinstance(mutation, dict)
        and isinstance(mutation.get("error"), dict)
        and mutation["error"].get("code") == "DEPLOYMENT_READ_ONLY"
    )
    add_check(
        checks,
        name="paired_backend_mutation_rejection",
        passed=mutation_ok,
        http_status=mutation_status,
    )

    overall = all(check["result"] == "PASS" for check in checks)
    evidence = {
        "schema_version": 1,
        "target": args.base_url,
        "expected_public_base_url": expected_site,
        "expected_frontend_source_sha": args.frontend_source_sha,
        "expected_frontend_image_digest": args.frontend_image_digest,
        "expected_backend_source_sha": args.backend_source_sha,
        "expected_backend_image_digest": args.backend_image_digest,
        "checks": checks,
        "overall": "PASS" if overall else "FAIL",
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(evidence, indent=2) + "\n")
    print(json.dumps(evidence, separators=(",", ":")))
    return 0 if overall else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (URLError, TimeoutError, OSError) as exc:
        print(
            json.dumps(
                {
                    "overall": "FAIL",
                    "failure_category": type(exc).__name__,
                }
            )
        )
        raise SystemExit(1)
