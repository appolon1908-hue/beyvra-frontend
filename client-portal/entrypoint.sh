#!/bin/bash
set -e
from_string='const CONFIG=""'
to_string='window.configs = {
  "VITE_API_BASE_URL":"'"${VITE_API_BASE_URL}"'"
}'
file=/usr/share/nginx/html/index.html
# Replace string in given file
perl -s -0777 -pi -e 's/\Q$from\E/$to/' -- -from="$from_string" -to="$to_string" $file
exec "$@"