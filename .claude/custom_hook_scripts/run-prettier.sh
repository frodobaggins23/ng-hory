#!/bin/bash

filename=$(jq -r '.tool_input.file_path')

LOG_FOLDER="$CLAUDE_PROJECT_DIR/.claude/custom_hook_scripts/logs"
LOG_FILE="$LOG_FOLDER/prettier_monitor.log"

mkdir -p "$LOG_FOLDER"

# Check if file extension is .ts or .html
if [[ "$filename" == *.ts || "$filename" == *.html ]]; then
    echo "$(date): Running prettier on $filename" >> "$LOG_FILE"
    npx prettier --write "$filename"
fi