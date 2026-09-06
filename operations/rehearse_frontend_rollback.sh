#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

required=(
  FRONTEND_IMAGE
  SOURCE_SHA
  BACKEND_SOURCE_SHA
  BACKEND_IMAGE
  CHANGE_ID
  DEPLOYMENT_TARGET
  PUBLIC_BASE_URL
  VERIFICATION_BASE_URL
  BACKEND_NETWORK
  BACKEND_UPSTREAM
  PORT
  CANARY_TRAFFIC_PERCENT
)
for name in "${required[@]}"; do
  [[ -n "${!name:-}" ]] || {
    printf 'Missing rollback value: %s\n' "$name" >&2
    exit 1
  }
done

digest_pattern='^ghcr\.io/[a-z0-9._/-]+@sha256:[0-9a-f]{64}$'
[[ "$FRONTEND_IMAGE" =~ $digest_pattern ]]
[[ "$BACKEND_IMAGE" =~ $digest_pattern ]]
[[ "$SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$BACKEND_SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$CHANGE_ID" =~ ^[A-Za-z0-9._-]+$ ]]
[[ "$PORT" =~ ^[0-9]+$ ]]
[[ "$CANARY_TRAFFIC_PERCENT" =~ ^[0-9]+$ ]]

case "$DEPLOYMENT_TARGET" in
  staging-readonly) ;;
  production-readonly)
    (( CANARY_TRAFFIC_PERCENT <= 1 ))
    [[ "${EXTERNAL_CANARY_ROUTING_VERIFIED:-false}" == "true" ]]
    ;;
  *) exit 1 ;;
esac

release_dir="releases/${CHANGE_ID}"
previous_file="${release_dir}/previous.env"
candidate_file="${release_dir}/candidate.env"
workflow_file="${release_dir}/workflow.env"
for path in "$previous_file" "$candidate_file" "$workflow_file"; do
  [[ -s "$path" ]] || {
    printf 'Rollback evidence file is missing: %s\n' "$path" >&2
    exit 1
  }
done

read_env_value() {
  local file=$1 name=$2
  bash -c '
    set -eu
    . "$1"
    eval "value=\${'"$2"':-}"
    printf "%s" "$value"
  ' _ "$file"
}

previous_image="$(read_env_value "$previous_file" FRONTEND_IMAGE)"
previous_source="$(read_env_value "$previous_file" SOURCE_SHA)"
[[ "$previous_image" =~ $digest_pattern ]]
[[ "$previous_source" =~ ^[0-9a-f]{40}$ ]]

candidate_image="$FRONTEND_IMAGE"
candidate_source="$SOURCE_SHA"
compose=(
  docker compose
  --project-directory .
  -f docker-compose.yaml
)

local_base_url() {
  local address
  address="$("${compose[@]}" port client-portal 8080 | head -n 1)"
  [[ -n "$address" ]]
  case "$address" in
    0.0.0.0:*) address="127.0.0.1:${address##*:}" ;;
    "[::]:"*) address="127.0.0.1:${address##*:}" ;;
  esac
  printf 'http://%s\n' "$address"
}

verify_release() {
  local target=$1 output=$2 expected_source=$3 expected_image=$4
  python3 operations/verify_frontend_release.py \
    --base-url "$target" \
    --expected-public-base-url "$PUBLIC_BASE_URL" \
    --frontend-source-sha "$expected_source" \
    --frontend-image-digest "$expected_image" \
    --backend-source-sha "$BACKEND_SOURCE_SHA" \
    --backend-image-digest "$BACKEND_IMAGE" \
    --output "$output"
}

activate() {
  local image=$1 source=$2
  FRONTEND_IMAGE="$image"
  SOURCE_SHA="$source"
  export FRONTEND_IMAGE SOURCE_SHA
  "${compose[@]}" up -d --no-build --wait client-portal
  container="$("${compose[@]}" ps -q client-portal)"
  [[ -n "$container" ]]
  observed="$(docker inspect --format '{{.Config.Image}}' "$container")"
  test "$observed" = "$image"
  test "$(docker inspect --format '{{.Config.User}}' "$container")" = "101:101"
}

restore_candidate_on_error() {
  local status=$?
  trap - ERR
  set +e
  FRONTEND_IMAGE="$candidate_image"
  SOURCE_SHA="$candidate_source"
  export FRONTEND_IMAGE SOURCE_SHA
  "${compose[@]}" up -d --no-build --wait client-portal >/dev/null 2>&1
  exit "$status"
}
trap restore_candidate_on_error ERR

mkdir -p "$release_dir"
candidate_local="$(local_base_url)"
verify_release \
  "$candidate_local" \
  "${release_dir}/rollback-candidate-before.json" \
  "$candidate_source" \
  "$candidate_image"
verify_release \
  "$VERIFICATION_BASE_URL" \
  "${release_dir}/rollback-candidate-ingress-before.json" \
  "$candidate_source" \
  "$candidate_image"

candidate_index_before="$(
  curl --fail --silent --show-error --max-time 20 \
    "${candidate_local}/" | sha256sum | awk '{print $1}'
)"
[[ "$candidate_index_before" =~ ^[0-9a-f]{64}$ ]]

docker pull "$previous_image"
test "$(
  docker image inspect \
    --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' \
    "$previous_image"
)" = "$previous_source"

rollback_started_ns="$(date +%s%N)"
activate "$previous_image" "$previous_source"
previous_local="$(local_base_url)"
verify_release \
  "$previous_local" \
  "${release_dir}/rollback-previous-local.json" \
  "$previous_source" \
  "$previous_image"
verify_release \
  "$VERIFICATION_BASE_URL" \
  "${release_dir}/rollback-previous-ingress.json" \
  "$previous_source" \
  "$previous_image"
rollback_finished_ns="$(date +%s%N)"

restore_started_ns="$(date +%s%N)"
activate "$candidate_image" "$candidate_source"
restored_local="$(local_base_url)"
verify_release \
  "$restored_local" \
  "${release_dir}/rollback-candidate-restored-local.json" \
  "$candidate_source" \
  "$candidate_image"
verify_release \
  "$VERIFICATION_BASE_URL" \
  "${release_dir}/rollback-candidate-restored-ingress.json" \
  "$candidate_source" \
  "$candidate_image"
restore_finished_ns="$(date +%s%N)"

candidate_index_after="$(
  curl --fail --silent --show-error --max-time 20 \
    "${restored_local}/" | sha256sum | awk '{print $1}'
)"
test "$candidate_index_before" = "$candidate_index_after"

rollback_ms="$(( (rollback_finished_ns - rollback_started_ns) / 1000000 ))"
restore_ms="$(( (restore_finished_ns - restore_started_ns) / 1000000 ))"

jq -n \
  --arg previous_source_sha "$previous_source" \
  --arg previous_image "$previous_image" \
  --arg candidate_source_sha "$candidate_source" \
  --arg candidate_image "$candidate_image" \
  --arg static_index_sha256 "$candidate_index_after" \
  --argjson rollback_rto_ms "$rollback_ms" \
  --argjson candidate_restore_rto_ms "$restore_ms" \
  '{
    schema_version: 1,
    rollback_result: "PASS",
    candidate_restore_result: "PASS",
    previous_source_sha: $previous_source_sha,
    previous_image: $previous_image,
    candidate_source_sha: $candidate_source_sha,
    candidate_image: $candidate_image,
    rollback_rto_ms: $rollback_rto_ms,
    candidate_restore_rto_ms: $candidate_restore_rto_ms,
    rpo: 0,
    static_index_sha256: $static_index_sha256,
    static_integrity_unchanged: true,
    deployment_read_only: true,
    live_effects_authorized: false
  }' > "${release_dir}/rollback-rehearsal.json"

trap - ERR
printf 'FRONTEND_ROLLBACK_REHEARSAL=PASS\n'
