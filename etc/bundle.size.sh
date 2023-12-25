#!/bin/bash

OUTPUT_DIR=".output/server"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

list_files_and_folders_with_size() {
    local total_size=0
    local entry_size

    echo "➜ Analyzing build..."
    echo ""

    for entry in "$OUTPUT_DIR"/*; do
        if [[ -f "$entry" ]]; then
            entry_size=$(du -sh "$entry" | cut -f1)
            echo "- ${GREEN}$(basename "$entry")${NC} - Size: $entry_size"
        elif [[ -d "$entry" ]]; then
            entry_size=$(du -sh "$entry" | cut -f1)
            echo "- ${RED}$(basename "$entry")${NC} - Size: $entry_size"
        fi
        total_size=$(($total_size + $(du -s "$entry" | cut -f1)))
    done

    total_size_hr=$(du -sh -c "$OUTPUT_DIR" | grep 'total$' | cut -f1)
    echo ""
    echo "➜ ${YELLOW}Total size of entries in $OUTPUT_DIR: $total_size_hr${NC}"
}

if [[ -d "$OUTPUT_DIR" ]]; then
    list_files_and_folders_with_size
else
    echo "Error: Directory $OUTPUT_DIR does not exist."
    exit 1
fi
