#!/bin/bash

# Define the starting directory
DIRECTORY="."

# Function for standard output
standard_output() {
  echo "$1 v$2"
}

# Function for pretty (table format) output
pretty_output() {
  printf "%-30s | %-10s\n" "$1" "$2"
}

# Determine the appropriate output function based on the --pretty parameter
if [[ $1 == "--pretty" ]]; then
  output_function=pretty_output
  # Print the table headers
  printf "%-30s | %-10s\n" "Package Name" "Version"
  echo "-------------------------------------|------------"
else
  output_function=standard_output
fi

# Locate package.json files excluding node_modules and common directories
find "$DIRECTORY" -name 'package.json' ! -path '*/node_modules/*' ! -path '*/common/*' | while read file
do
  # Extract name and version using jq
  NAME=$(jq -r .name "$file")
  VERSION=$(jq -r .version "$file")

  # Call the output function
  $output_function "$NAME" "$VERSION"
done
