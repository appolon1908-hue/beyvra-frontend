#!/bin/sh
set -eu
umask 077

runtime_dir=/tmp/beyvra-runtime
nginx_conf_dir=/tmp/nginx/conf.d

: "${VITE_API_BASE_URL:=/api}"
: "${VITE_SOCKET_BASE_URL:=AUTO}"
: "${VITE_PUBLIC_SITE_URL:?VITE_PUBLIC_SITE_URL is required}"
: "${VITE_BRAND_NAME:=Beyvra}"
: "${VITE_GEOIP_ENDPOINT:=}"
: "${VITE_REALTIME_V2_ENABLED:=true}"
: "${VITE_REALTIME_V2_V1_FALLBACK_ENABLED:=false}"
: "${VITE_DEPLOYMENT_READ_ONLY:=true}"
: "${BEYVRA_SOURCE_SHA:?BEYVRA_SOURCE_SHA is required}"
: "${BEYVRA_IMAGE_DIGEST:?BEYVRA_IMAGE_DIGEST is required}"
: "${BEYVRA_RELEASE_ID:?BEYVRA_RELEASE_ID is required}"
: "${BEYVRA_BUILD_TIMESTAMP:=unknown}"
: "${PUBLIC_SERVER_NAME:?PUBLIC_SERVER_NAME is required}"
: "${BACKEND_UPSTREAM:?BACKEND_UPSTREAM is required}"

case "$VITE_API_BASE_URL" in
  /*) ;;
  *) echo "VITE_API_BASE_URL must be same-origin." >&2; exit 1 ;;
esac
[ "$VITE_SOCKET_BASE_URL" = "AUTO" ] || {
  echo "VITE_SOCKET_BASE_URL must be AUTO for the immutable candidate." >&2
  exit 1
}
case "$VITE_PUBLIC_SITE_URL" in
  "https://${PUBLIC_SERVER_NAME}"|"https://${PUBLIC_SERVER_NAME}/") ;;
  *) echo "VITE_PUBLIC_SITE_URL must match PUBLIC_SERVER_NAME over HTTPS." >&2; exit 1 ;;
esac
case "$VITE_GEOIP_ENDPOINT" in
  ""|/*) ;;
  *) echo "VITE_GEOIP_ENDPOINT must be empty or same-origin." >&2; exit 1 ;;
esac
[ "$VITE_REALTIME_V2_ENABLED" = "true" ] || {
  echo "The immutable candidate requires realtime v2." >&2
  exit 1
}
[ "$VITE_REALTIME_V2_V1_FALLBACK_ENABLED" = "false" ] || {
  echo "Legacy realtime fallback is not allowed." >&2
  exit 1
}
[ "$VITE_DEPLOYMENT_READ_ONLY" = "true" ] || {
  echo "This candidate is authorized only in read-only mode." >&2
  exit 1
}
case "$BEYVRA_SOURCE_SHA" in
  *[!0-9a-f]*|"") echo "BEYVRA_SOURCE_SHA must be lower-case hexadecimal." >&2; exit 1 ;;
esac
[ "${#BEYVRA_SOURCE_SHA}" -eq 40 ] || {
  echo "BEYVRA_SOURCE_SHA must be a full Git SHA." >&2
  exit 1
}
case "$BEYVRA_IMAGE_DIGEST" in
  *@sha256:*) ;;
  *) echo "BEYVRA_IMAGE_DIGEST must be an immutable repository@sha256 digest." >&2; exit 1 ;;
esac
digest_value=${BEYVRA_IMAGE_DIGEST##*@sha256:}
case "$digest_value" in
  *[!0-9a-f]*|"") echo "BEYVRA_IMAGE_DIGEST must use a lower-case SHA-256 digest." >&2; exit 1 ;;
esac
[ "${#digest_value}" -eq 64 ] || {
  echo "BEYVRA_IMAGE_DIGEST must contain 64 digest characters." >&2
  exit 1
}
case "$PUBLIC_SERVER_NAME" in
  *[!A-Za-z0-9.-]*|"") echo "PUBLIC_SERVER_NAME is invalid." >&2; exit 1 ;;
esac
case "$BACKEND_UPSTREAM" in
  *[!A-Za-z0-9_.:-]*|"") echo "BACKEND_UPSTREAM is invalid." >&2; exit 1 ;;
esac
case "$VITE_BRAND_NAME" in
  *[!A-Za-z0-9._\ -]*|"") echo "VITE_BRAND_NAME is invalid." >&2; exit 1 ;;
esac
case "$BEYVRA_RELEASE_ID" in
  *[!A-Za-z0-9._-]*|"") echo "BEYVRA_RELEASE_ID is invalid." >&2; exit 1 ;;
esac

json_escape() {
  printf '%s' "$1" | awk '
    BEGIN { ORS = "" }
    {
      if (NR > 1) printf "\\n"
      gsub(/\\/, "\\\\")
      gsub(/"/, "\\\"")
      gsub(/\r/, "\\r")
      gsub(/\t/, "\\t")
      printf "%s", $0
    }
  '
}

mkdir -p "$runtime_dir" "$nginx_conf_dir"
chmod 700 "$runtime_dir" "$nginx_conf_dir"

api="$(json_escape "$VITE_API_BASE_URL")"
socket="$(json_escape "$VITE_SOCKET_BASE_URL")"
site="$(json_escape "${VITE_PUBLIC_SITE_URL%/}")"
brand="$(json_escape "$VITE_BRAND_NAME")"
geoip="$(json_escape "$VITE_GEOIP_ENDPOINT")"
source_sha="$(json_escape "$BEYVRA_SOURCE_SHA")"
image_digest="$(json_escape "$BEYVRA_IMAGE_DIGEST")"
release_id="$(json_escape "$BEYVRA_RELEASE_ID")"
built_at="$(json_escape "$BEYVRA_BUILD_TIMESTAMP")"

cat > "${runtime_dir}/config.json" <<EOF
{
  "VITE_API_BASE_URL": "${api}",
  "VITE_SOCKET_BASE_URL": "${socket}",
  "VITE_PUBLIC_SITE_URL": "${site}",
  "VITE_BRAND_NAME": "${brand}",
  "VITE_GEOIP_ENDPOINT": "${geoip}",
  "VITE_REALTIME_V2_ENABLED": "${VITE_REALTIME_V2_ENABLED}",
  "VITE_REALTIME_V2_V1_FALLBACK_ENABLED": "${VITE_REALTIME_V2_V1_FALLBACK_ENABLED}",
  "VITE_DEPLOYMENT_READ_ONLY": "${VITE_DEPLOYMENT_READ_ONLY}"
}
EOF

{
  printf 'window.configs = '
  cat "${runtime_dir}/config.json"
  printf ';\n'
} > "${runtime_dir}/config.js"

cat > "${runtime_dir}/release.json" <<EOF
{
  "service": "beyvra-frontend",
  "source_repository": "https://github.com/appolon1908-hue/beyvra-frontend",
  "source_sha": "${source_sha}",
  "image_digest": "${image_digest}",
  "release_id": "${release_id}",
  "built_at": "${built_at}",
  "deployment_read_only": ${VITE_DEPLOYMENT_READ_ONLY},
  "realtime_v2_enabled": ${VITE_REALTIME_V2_ENABLED},
  "legacy_realtime_fallback_enabled": ${VITE_REALTIME_V2_V1_FALLBACK_ENABLED}
}
EOF

export PUBLIC_SERVER_NAME BACKEND_UPSTREAM
envsubst '${PUBLIC_SERVER_NAME} ${BACKEND_UPSTREAM}' \
  < /etc/nginx/templates/default.conf.template \
  > "${nginx_conf_dir}/default.conf"

chmod 600 \
  "${runtime_dir}/config.json" \
  "${runtime_dir}/config.js" \
  "${runtime_dir}/release.json" \
  "${nginx_conf_dir}/default.conf"

exec "$@"
