#!/usr/bin/env bash

log() {
  echo "  ○ $@"
}

log sed ecosystem.json5
sed -i "s/\(GITHUB_ID\): \".*\"/\1: \"$1\"/; s/\(GITHUB_SECRET\): \".*\"/\1: \"$2\"/" ecosystem.json5

log npm install --production
npm install --production

log pm2 startOrRestart
pm2 startOrRestart ecosystem.json5 --env production
