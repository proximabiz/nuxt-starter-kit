#!/usr/bin/env bash

# Ref- https://www.npmjs.com/package/npm-check-updates/v/11.3.0

# check for updates, and upgrade if requested
echo "${packages}" | awk '{print $2 "package.json"}' | xargs -n 1 -x ncu --doctor -u "${@}"

# we upgraded our package.json files,Install dependencies using pnpm
echo "Installing dependencies with pnpm..."
pnpm install