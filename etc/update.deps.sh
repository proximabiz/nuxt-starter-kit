#!/usr/bin/env bash

# check for updates, and upgrade if requested
echo "${packages}" | awk '{print $2 "package.json"}' | xargs -n 1 -x ncu "${@}" --packageFile

# we upgraded our package.json files,Install dependencies using pnpm
echo "Installing dependencies with pnpm..."
pnpm install