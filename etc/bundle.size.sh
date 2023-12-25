#!/bin/bash

OUTPUT_DIR=".output/server"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
GREY='\033[0;90m'
NC='\033[0m'

list_files_with_size() {
    local total_size=0
    local entry_size

    echo "➜ Analyzing build..."
    echo ""

    format_size() {
        local size_kb=$(du -sk "$1" | cut -f1)
        echo "${size_kb}K"
    }

    find "$OUTPUT_DIR" -type f | while read -r file; do
        entry_size=$(format_size "$file")
        echo "  ├─ ${GREY}$file${GREY} ($entry_size)${NC}"
    done

    total_size_hr=$(du -sh -c "$OUTPUT_DIR" | grep 'total$' | cut -f1)
    echo ""
    echo "Σ ${GREEN}SSR bundle size: $total_size_hr${NC}"
}

if [[ -d "$OUTPUT_DIR" ]]; then
    list_files_with_size
else
    echo "Error: Directory $OUTPUT_DIR does not exist."
    exit 1
fi
