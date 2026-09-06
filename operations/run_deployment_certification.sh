#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

required=(
  DEPLOY_RUN_ID
  DEPLOY_HOST
  DEPLOY_USER
  DEPLOY_SSH_KEY
  DEPLOY_KNOWN_HOSTS
  DEPLOY_PATH
  PUBLIC_SERVER_NAME
  VERIFICATION_BASE_URL
  BACKEND_NETWORK
  BACKEND_UPSTREAM
  BACKEND_SOURCE_SHA
  BACKEND_IMAGE
  PORT
  CANARY_TRAFFIC_PERCENT
  EXTERNAL_CANARY_ROUTING_VERIFIED
  SOURCE_SHA
  FRONTEND_IMAGE
  DEPLOYMENT_TARGET
  CHANGE_ID
  GITHUB_REPOSITORY
  GH_TOKEN
)
for name in "${required[@]}"; do
  [[ -n "${!name:-}" ]] || {
    printf 'Missing protected certification value: %s\n' "$name" >&2
    exit 1
  }
done

[[ "$DEPLOY_RUN_ID" =~ ^[0-9]+$ ]]
[[ "$DEPLOY_PATH" =~ ^/[A-Za-z0-9._/-]+$ ]]
[[ "$PUBLIC_SERVER_NAME" =~ ^[A-Za-z0-9.-]+$ ]]
[[ "$VERIFICATION_BASE_URL" =~ ^https://[A-Za-z0-9.-]+(:[0-9]+)?$ ]]
[[ "$BACKEND_NETWORK" =~ ^[A-Za-z0-9_.:-]+$ ]]
[[ "$BACKEND_UPSTREAM" =~ ^[A-Za-z0-9_.:-]+$ ]]
[[ "$BACKEND_SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ "$BACKEND_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[0-9a-f]{64}$ ]]
[[ "$FRONTEND_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[0-9a-f]{64}$ ]]
[[ "$PORT" =~ ^[0-9]+$ ]]
[[ "$CANARY_TRAFFIC_PERCENT" =~ ^[0-9]+$ ]]
case "$EXTERNAL_CANARY_ROUTING_VERIFIED" in true|false) ;; *) exit 1 ;; esac
case "$DEPLOYMENT_TARGET" in
  staging-readonly) ;;
  production-readonly)
    (( CANARY_TRAFFIC_PERCENT <= 1 ))
    [[ "$EXTERNAL_CANARY_ROUTING_VERIFIED" == "true" ]]
    ;;
  *) exit 1 ;;
esac

cleanup() {
  rm -rf \
    ~/.ssh \
    certification.env \
    frontend-certification-bundle.tgz \
    /tmp/beyvra-frontend-deployment
}
trap cleanup EXIT

mkdir -p /tmp/beyvra-frontend-deployment evidence
gh run download "$DEPLOY_RUN_ID" --repo "$GITHUB_REPOSITORY" \
  --name "beyvra-frontend-deployment-${DEPLOYMENT_TARGET}-${CHANGE_ID}" \
  --dir /tmp/beyvra-frontend-deployment

for required_evidence in \
  candidate.env \
  candidate-local-evidence.json \
  candidate-ingress-evidence.json \
  previous.env; do
  find /tmp/beyvra-frontend-deployment -type f \
    -name "$required_evidence" -print -quit | grep -q .
done

tar -czf frontend-certification-bundle.tgz \
  operations/rehearse_frontend_rollback.sh \
  operations/verify_frontend_release.py
if tar -tzf frontend-certification-bundle.tgz \
  | grep -E '(^/|(^|/)\.\.(/|$))' >/dev/null; then
  echo "Unsafe certification archive path detected." >&2
  exit 1
fi

{
  printf 'SOURCE_SHA=%q\n' "$SOURCE_SHA"
  printf 'FRONTEND_IMAGE=%q\n' "$FRONTEND_IMAGE"
  printf 'BACKEND_SOURCE_SHA=%q\n' "$BACKEND_SOURCE_SHA"
  printf 'BACKEND_IMAGE=%q\n' "$BACKEND_IMAGE"
  printf 'CHANGE_ID=%q\n' "$CHANGE_ID"
  printf 'DEPLOYMENT_TARGET=%q\n' "$DEPLOYMENT_TARGET"
  printf 'PUBLIC_BASE_URL=%q\n' "https://${PUBLIC_SERVER_NAME}"
  printf 'VERIFICATION_BASE_URL=%q\n' "$VERIFICATION_BASE_URL"
  printf 'BACKEND_NETWORK=%q\n' "$BACKEND_NETWORK"
  printf 'BACKEND_UPSTREAM=%q\n' "$BACKEND_UPSTREAM"
  printf 'PORT=%q\n' "$PORT"
  printf 'CANARY_TRAFFIC_PERCENT=%q\n' "$CANARY_TRAFFIC_PERCENT"
  printf 'EXTERNAL_CANARY_ROUTING_VERIFIED=%q\n' \
    "$EXTERNAL_CANARY_ROUTING_VERIFIED"
} > certification.env
chmod 600 certification.env

install -d -m 700 ~/.ssh
printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts

remote="${DEPLOY_USER}@${DEPLOY_HOST}"
incoming="/tmp/beyvra-frontend-cert-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
scp frontend-certification-bundle.tgz "${remote}:${incoming}.tgz"
scp certification.env "${remote}:${incoming}.env"

ssh "$remote" "bash -se" <<REMOTE
set -euo pipefail
cd '$DEPLOY_PATH'
tar -xzf '${incoming}.tgz' -C '$DEPLOY_PATH'
install -m 600 '${incoming}.env' \
  '$DEPLOY_PATH/releases/$CHANGE_ID/certification.env'
rm -f '${incoming}.tgz' '${incoming}.env'
set -a
. 'releases/$CHANGE_ID/workflow.env'
. 'releases/$CHANGE_ID/certification.env'
set +a
trap 'rm -f "releases/$CHANGE_ID/certification.env"' EXIT
./operations/rehearse_frontend_rollback.sh
REMOTE

scp -r \
  "${remote}:${DEPLOY_PATH}/releases/${CHANGE_ID}/." \
  evidence/
rm -f \
  evidence/workflow.env \
  evidence/certification.env \
  evidence/*/workflow.env \
  evidence/*/certification.env
