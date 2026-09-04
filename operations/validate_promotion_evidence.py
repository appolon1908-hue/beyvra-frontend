#!/usr/bin/env python3
"""Validate a frontend staging certification promotion manifest."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

SHA = re.compile(r"^[0-9a-f]{40}$")
IMAGE = re.compile(r"^ghcr\.io/[a-z0-9._/-]+@sha256:[0-9a-f]{64}$")
RUN_ID = re.compile(r"^[0-9]+$")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()

    value = json.loads(args.manifest.read_text())
    required = {
        "schema_version": 1,
        "target": "staging-readonly",
        "certification_result": "PASS",
        "rollback_rehearsal": "PASS",
        "paired_backend_certification": "PASS",
        "signed_provenance_verified": True,
        "deployment_read_only": True,
        "live_trading_authorized": False,
        "real_money_authorized": False,
        "payments_authorized": False,
        "withdrawals_authorized": False,
        "transactional_email_authorized": False,
        "external_execution_authorized": False,
        "legacy_realtime_fallback_enabled": False,
    }
    for key, expected in required.items():
        if value.get(key) != expected:
            raise SystemExit(f"invalid {key}: {value.get(key)!r}")

    for key in ("source_sha", "backend_source_sha"):
        if not SHA.fullmatch(str(value.get(key, ""))):
            raise SystemExit(f"{key} is not an exact Git SHA")
    for key in ("frontend_image", "backend_image"):
        if not IMAGE.fullmatch(str(value.get(key, ""))):
            raise SystemExit(f"{key} is not an immutable GHCR digest")
    if not RUN_ID.fullmatch(str(value.get("backend_certification_run_id", ""))):
        raise SystemExit("backend_certification_run_id is not numeric")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
