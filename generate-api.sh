#!/usr/bin/env bash

npx swagger-typescript-api generate \
  -p http://localhost:8080/v3/api-docs \
  -o src/api \
  -n api.ts \
  --module-name-first-tag

status=$?
echo
read -n 1 -s -r -p "Press any key to close this window..."
echo
exit $status
