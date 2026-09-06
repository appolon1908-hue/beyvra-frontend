#!/usr/bin/env bash
set -Eeuo pipefail

required=(
  FRONTEND_IMAGE
  SOURCE_SHA
  BACKEND_SOURCE_SHA
  BACKEND_IMAGE
  CHANGE_ID
  DEPLOYMENT_TARGET
  PUBLIC_SERVER_NAME
  PUBLIC_BASE_URL
  VERIFICATION_BASE_URL
  BACKEND_NETWORK
  BACKEND_UPSTREAM
  PORT
  CANARY_TRAFFIC_PERCENT
)
for name in "${required[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    printf 'Missing required variable: %s\n' "$name" >&2
    exit 1
  fi
done

digest_pattern='@sha256:[0-9a-f]{64}$'
for name in FRONTEND_IMAGE BACKEND_IMAGE; do
  if [[ ! "${!name}" =~ $digest_pattern ]]; then
    printf '%s must be an immutable repository@sha256 digest.\n' "$name" >&2
    exit 1
  fi
done
for name in SOURCE_SHA BACKEND_SOURCE_SHA; do
  if [[ ! "${!name}" =~ ^[0-9a-f]{40}$ ]]; then
    printf '%s must be a full lower-case Git SHA.\n' "$name" >&2
    exit 1
  fi
done
if [[ ! "$CHANGE_ID" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "CHANGE_ID contains unsupported characters." >&2
  exit 1
fi
if [[ ! "$PUBLIC_SERVER_NAME" =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "PUBLIC_SERVER_NAME is invalid." >&2
  exit 1
fi
if [[ "$PUBLIC_BASE_URL" != "https://${PUBLIC_SERVER_NAME}" ]]; then
  echo "PUBLIC_BASE_URL must be the HTTPS URL for PUBLIC_SERVER_NAME." >&2
  exit 1
fi
for name in PUBLIC_BASE_URL VERIFICATION_BASE_URL; do
  if [[ ! "${!name}" =~ ^https://[A-Za-z0-9.-]+(:[0-9]+)?$ ]]; then
    printf '%s must be an HTTPS origin without a path.\n' "$name" >&2
    exit 1
  fi
done
for name in BACKEND_NETWORK BACKEND_UPSTREAM; do
  if [[ ! "${!name}" =~ ^[A-Za-z0-9_.:-]+$ ]]; then
    printf '%s contains unsupported characters.\n' "$name" >&2
    exit 1
  fi
done
if [[ ! "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1024 || PORT > 65535 )); then
  echo "PORT must be between 1024 and 65535." >&2
  exit 1
fi
if [[ ! "$CANARY_TRAFFIC_PERCENT" =~ ^[0-9]+$ ]] \
  || (( CANARY_TRAFFIC_PERCENT < 0 || CANARY_TRAFFIC_PERCENT > 100 )); then
  echo "CANARY_TRAFFIC_PERCENT must be an integer from 0 through 100." >&2
  exit 1
fi

case "$DEPLOYMENT_TARGET" in
  staging-readonly)
    ;;
  production-readonly)
    if (( CANARY_TRAFFIC_PERCENT > 1 )); then
      echo "Production read-only canary traffic must not exceed one percent." >&2
      exit 1
    fi
    if [[ "${EXTERNAL_CANARY_ROUTING_VERIFIED:-false}" != "true" ]]; then
      echo "Production requires independent ingress canary verification." >&2
      exit 1
    fi
    ;;
  *)
    echo "DEPLOYMENT_TARGET must be staging-readonly or production-readonly." >&2
    exit 1
    ;;
esac

for command in docker python3; do
  command -v "$command" >/dev/null 2>&1
 done
docker compose version >/dev/null
docker info >/dev/null
docker network inspect "$BACKEND_NETWORK" >/dev/null

for path in \
  docker-compose.yaml \
  operations/deploy_immutable_frontend.sh \
  operations/verify_frontend_release.py; do
  if [[ ! -f "$path" ]]; then
    printf 'Required deployment file is missing: %s\n' "$path" >&2
    exit 1
  fi
done

compose=(
  docker compose
  --project-directory .
  -f docker-compose.yaml
)
release_dir="releases/${CHANGE_ID}"
mkdir -p "$release_dir"
chmod 700 "$release_dir"

export \
  FRONTEND_IMAGE SOURCE_SHA CHANGE_ID PUBLIC_SERVER_NAME \
  BACKEND_NETWORK BACKEND_UPSTREAM PORT

configured_images="$("${compose[@]}" config --images | sed '/^$/d' | sort -u)"
if [[ -z "$configured_images" ]] \
  || grep -Ev '@sha256:[0-9a-f]{64}$' <<<"$configured_images" >/dev/null; then
  echo "Every production image must resolve to an immutable digest:" >&2
  printf '%s\n' "$configured_images" >&2
  exit 1
fi
printf '%s\n' "$configured_images" > "${release_dir}/configured-images.txt"

container="$("${compose[@]}" ps -q client-portal 2>/dev/null || true)"
previous_image=""
previous_source=""
if [[ -n "$container" ]]; then
  previous_image="$(docker inspect --format '{{.Config.Image}}' "$container")"
  if [[ ! "$previous_image" =~ $digest_pattern ]]; then
    resolved="$(
      docker image inspect \
        --format '{{range .RepoDigests}}{{println .}}{{end}}' \
        "$previous_image" 2>/dev/null | head -n 1 || true
    )"
    if [[ "$resolved" =~ $digest_pattern ]]; then
      previous_image="$resolved"
    fi
  fi
  if [[ -n "$previous_image" ]]; then
    previous_source="$(
      docker image inspect \
        --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' \
        "$previous_image" 2>/dev/null || true
    )"
  fi
fi
previous_complete=false
if [[ "$previous_image" =~ $digest_pattern \
      && "$previous_source" =~ ^[0-9a-f]{40}$ ]]; then
  previous_complete=true
fi
{
  printf 'FRONTEND_IMAGE=%q\n' "$previous_image"
  printf 'SOURCE_SHA=%q\n' "$previous_source"
} > "${release_dir}/previous.env"

if [[ "$DEPLOYMENT_TARGET" == "production-readonly" \
      && "$previous_complete" != "true" ]]; then
  echo "Production requires a complete immutable previous frontend candidate." >&2
  exit 1
fi

docker pull "$FRONTEND_IMAGE"
docker image inspect "$FRONTEND_IMAGE" >/dev/null
image_source="$(
  docker image inspect \
    --format '{{ index .Config.Labels "org.opencontainers.image.revision" }}' \
    "$FRONTEND_IMAGE"
)"
if [[ "$image_source" != "$SOURCE_SHA" ]]; then
  echo "Frontend image source label does not match SOURCE_SHA." >&2
  exit 1
fi

candidate_started=false
rollback_started=false

local_base_url() {
  local address
  address="$("${compose[@]}" port client-portal 8080 | head -n 1)"
  if [[ -z "$address" ]]; then
    echo "Unable to resolve the local frontend port." >&2
    return 1
  fi
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

rollback() {
  local exit_code=$?
  if [[ "$rollback_started" == "true" ]]; then
    exit "$exit_code"
  fi
  rollback_started=true
  trap - ERR

  if [[ "$candidate_started" != "true" ]]; then
    exit "$exit_code"
  fi

  if [[ "$previous_complete" != "true" ]]; then
    echo "Frontend verification failed without a previous candidate; stopping it." >&2
    "${compose[@]}" stop client-portal || true
    exit "$exit_code"
  fi

  echo "Frontend verification failed; restoring the previous immutable image." >&2
  FRONTEND_IMAGE="$previous_image"
  SOURCE_SHA="$previous_source"
  export FRONTEND_IMAGE SOURCE_SHA
  "${compose[@]}" up -d --no-build --wait client-portal
  rollback_local="$(local_base_url)"
  verify_release \
    "$rollback_local" \
    "${release_dir}/rollback-local-evidence.json" \
    "$previous_source" \
    "$previous_image"
  exit "$exit_code"
}
trap rollback ERR

candidate_started=true
"${compose[@]}" up -d --no-build --wait client-portal
container="$("${compose[@]}" ps -q client-portal)"
observed_image="$(docker inspect --format '{{.Config.Image}}' "$container")"
if [[ "$observed_image" != "$FRONTEND_IMAGE" ]]; then
  echo "Running frontend image does not match the certified digest." >&2
  exit 1
fi
if [[ "$(docker inspect --format '{{.Config.User}}' "$container")" != "101:101" ]]; then
  echo "Frontend container is not running as the required unprivileged user." >&2
  exit 1
fi

candidate_local="$(local_base_url)"
verify_release \
  "$candidate_local" \
  "${release_dir}/candidate-local-evidence.json" \
  "$SOURCE_SHA" \
  "$FRONTEND_IMAGE"
verify_release \
  "$VERIFICATION_BASE_URL" \
  "${release_dir}/candidate-ingress-evidence.json" \
  "$SOURCE_SHA" \
  "$FRONTEND_IMAGE"

{
  printf 'SOURCE_SHA=%q\n' "$SOURCE_SHA"
  printf 'FRONTEND_IMAGE=%q\n' "$FRONTEND_IMAGE"
  printf 'BACKEND_SOURCE_SHA=%q\n' "$BACKEND_SOURCE_SHA"
  printf 'BACKEND_IMAGE=%q\n' "$BACKEND_IMAGE"
  printf 'DEPLOYMENT_TARGET=%q\n' "$DEPLOYMENT_TARGET"
  printf 'PUBLIC_BASE_URL=%q\n' "$PUBLIC_BASE_URL"
  printf 'VERIFICATION_BASE_URL=%q\n' "$VERIFICATION_BASE_URL"
  printf 'CANARY_TRAFFIC_PERCENT=%q\n' "$CANARY_TRAFFIC_PERCENT"
  printf 'EXTERNAL_CANARY_ROUTING_VERIFIED=%q\n' \
    "${EXTERNAL_CANARY_ROUTING_VERIFIED:-false}"
  printf 'CHANGE_ID=%q\n' "$CHANGE_ID"
  printf 'DEPLOYED_AT=%q\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
} > "${release_dir}/candidate.env"

trap - ERR
printf 'DEPLOYMENT_RESULT=PASS\n'
