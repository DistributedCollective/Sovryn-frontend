#!/usr/bin/env bash

git checkout HEAD CHANGELOG.md

set -e
trap 'echo -e "\033[0;31mPlease commit your git changes first.\033[0m"' ERR
git diff-index --quiet HEAD --
trap - ERR
echo -e "\033[0;32mUpdating CHANGELOG.md\033[0m"

./node_modules/.bin/auto-changelog --ignore-commit-pattern "Updated CHANGELOG.md"
git add CHANGELOG.md
git commit -m "Updated CHANGELOG.md" --no-verify

