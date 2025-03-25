#!/bin/bash

# Generate the JSON output from git-cliff
output=$(git cliff --unreleased --bump --context)

# Extract the version and changelog body using jq
version=$(echo "$output" | jq -r '.[0].version')
changelog=$(echo "$output" | jq -r '.[0].body')

# Create an annotated Git tag with the changelog as the tag message
git tag -a "$version" -m "$changelog"