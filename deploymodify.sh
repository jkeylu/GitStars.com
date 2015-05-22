#!/usr/bin/env bash

sed "s/\(GITHUB_ID\): \".*\"/\1: \"$1\"/; s/\(GITHUB_SECRET\): \".*\"/\1: \"$2\"/" ecosystem.json5
