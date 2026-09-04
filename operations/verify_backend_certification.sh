#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

required=(
  BACKEND_REPOSITORY
  BACKEND_CERTIFICATION_RUN_ID
  BACKEND_SOURCE_SHA
  BACKEND_IMAGE
  DEPLOYMENT_TARGET
  GH_TOKEN
)
for name in "${required[@]}"; do
  [[ -n "${!name:-}" ]] || {
    printf 'Missing backend certification value: %s\n' "$name" >&2
    exit 1
  }
done

[[ "$BACKEND_REPOSITORY" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]
[[ "$BACKEND_CERTIFICATION_RUN_ID" =~ ^[0-9]+$ ]]
[[ "$BACKEND_SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$BACKEND_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[0-9a-f]{64}$ ]]
case "$DEPLOYMENT_TARGET" in
  staging-readonly|production-readonly) ;;
  *) exit 1 ;;
esac

evidence_dir="${BACKEND_CERTIFICATION_EVIDENCE_DIR:-evidence/backend-certification}"
rm -rf "$evidence_dir" /tmp/beyvra-backend-certification
mkdir -p "$evidence_dir" /tmp/beyvra-backend-certification

run="$(
  gh api \
    "repos/${BACKEND_REPOSITORY}/actions/runs/${BACKEND_CERTIFICATION_RUN_ID}"
)"
jq -e \
  --arg expected_sha "$BACKEND_SOURCE_SHA" '
    .name == "Certify deployed immutable Beyvra backend" and
    .event == "workflow_run" and
    .head_branch == "main" and
    .head_sha == $expected_sha and
    .status == "completed" and
    .conclusion == "success"
  ' <<<"$run" >/dev/null

gh run download "$BACKEND_CERTIFICATION_RUN_ID" \
  --repo "$BACKEND_REPOSITORY" \
  --pattern "beyvra-backend-certification-${DEPLOYMENT_TARGET}-*" \
  --dir /tmp/beyvra-backend-certification

mapfile -t predicates < <(
  find /tmp/beyvra-backend-certification -type f \
    -name certification-attestation-predicate.json -print
)
[[ "${#predicates[@]}" -eq 1 ]]
predicate="${predicates[0]}"

jq -e \
  --arg source_sha "$BACKEND_SOURCE_SHA" \
  --arg backend_image "$BACKEND_IMAGE" \
  --arg target "$DEPLOYMENT_TARGET" \
  --arg run_id "$BACKEND_CERTIFICATION_RUN_ID" '
    .source_sha == $source_sha and
    .backend_image == $backend_image and
    .target == $target and
    .certification_run_id == $run_id and
    .certification_result == "PASS" and
    .rollback_rehearsal == "PASS" and
    .zero_live_effects == "PASS" and
    .deployment_read_only == true and
    .live_trading_authorized == false and
    .real_money_authorized == false and
    .payments_authorized == false and
    .withdrawals_authorized == false and
    .transactional_email_authorized == false and
    .external_execution_authorized == false
  ' "$predicate" >/dev/null

attestation_type="https://github.com/appolon1908-hue/beyvra-backend/attestations/certification/v1"
signer="${BACKEND_REPOSITORY}/.github/workflows/certify-deployment.yml"
gh attestation verify "oci://${BACKEND_IMAGE}" \
  --repo "$BACKEND_REPOSITORY" \
  --signer-workflow "$signer" \
  --source-ref refs/heads/main \
  --predicate-type "$attestation_type" \
  --format json \
  > "$evidence_dir/backend-certification-attestation-verification.json"

jq -e \
  --arg source_sha "$BACKEND_SOURCE_SHA" \
  --arg backend_image "$BACKEND_IMAGE" \
  --arg target "$DEPLOYMENT_TARGET" \
  --arg run_id "$BACKEND_CERTIFICATION_RUN_ID" '
    any(.[];
      .verificationResult.statement.predicate.source_sha == $source_sha and
      .verificationResult.statement.predicate.backend_image == $backend_image and
      .verificationResult.statement.predicate.target == $target and
      .verificationResult.statement.predicate.certification_run_id == $run_id and
      .verificationResult.statement.predicate.certification_result == "PASS" and
      .verificationResult.statement.predicate.rollback_rehearsal == "PASS" and
      .verificationResult.statement.predicate.zero_live_effects == "PASS" and
      .verificationResult.statement.predicate.deployment_read_only == true
    )
  ' "$evidence_dir/backend-certification-attestation-verification.json" >/dev/null

cp "$predicate" "$evidence_dir/backend-certification-predicate.json"
jq -n \
  --arg repository "$BACKEND_REPOSITORY" \
  --arg certification_run_id "$BACKEND_CERTIFICATION_RUN_ID" \
  --arg source_sha "$BACKEND_SOURCE_SHA" \
  --arg backend_image "$BACKEND_IMAGE" \
  --arg target "$DEPLOYMENT_TARGET" \
  '{
    repository: $repository,
    certification_run_id: $certification_run_id,
    source_sha: $source_sha,
    backend_image: $backend_image,
    target: $target,
    result: "PASS"
  }' > "$evidence_dir/backend-certification-readback.json"
