#!/bin/bash

OUTPUT_DIR=".output/server"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

list_files_with_size() {
    local total_size=0
    local entry_size

    echo "➜ Analyzing build..."
    echo ""

    format_size() {
        du -sh "$1" | cut -f1
    }

    for entry in "$OUTPUT_DIR"/*; do
        if [[ -f "$entry" ]]; then
            entry_size=$(format_size "$entry")
            echo "  ├─ ${GREEN}$entry${NC} ($entry_size)"
        elif [[ -d "$entry" ]]; then
            echo "  ├─ ${RED}$entry${NC}"
            for subentry in "$entry"/*; do
                if [[ -f "$subentry" ]]; then
                    entry_size=$(format_size "$subentry")
                    echo "  │  ├─ $(basename "$subentry") ($entry_size)"
                fi
            done
        fi
    done

    total_size_hr=$(du -sh -c "$OUTPUT_DIR" | grep 'total$' | cut -f1)
    echo ""
    echo "Σ ${YELLOW}SSR bundle size: $total_size_hr${NC}"
}

if [[ -d "$OUTPUT_DIR" ]]; then
    list_files_with_size
else
    echo "Error: Directory $OUTPUT_DIR does not exist."
    exit 1
fi
