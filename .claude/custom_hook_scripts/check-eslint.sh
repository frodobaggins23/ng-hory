#!/bin/bash

# Extract file path from Claude's tool input
FILE_PATH=$(jq -r '.tool_input.file_path')
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/custom_hook_scripts/logs/eslint_monitor.log"
ERROR_FILE="$CLAUDE_PROJECT_DIR/.claude/custom_hook_scripts/tmp_files/pending_eslint_issues.txt"

# Ensure log and tmp_files directories exist
mkdir -p "$CLAUDE_PROJECT_DIR/.claude/custom_hook_scripts/logs"
mkdir -p "$CLAUDE_PROJECT_DIR/.claude/custom_hook_scripts/tmp_files"

# Only run ESLint on TypeScript and HTML files
if [[ "$FILE_PATH" == *.ts ]] || [[ "$FILE_PATH" == *.html ]]; then
    # Monitoring log: ESLint check started
    echo "$(date): Running ESLint check for file: $FILE_PATH" >> $LOG_FILE
    
    # Run ESLint and capture output (including errors)
    ESLINT_OUTPUT=$(npx eslint "$FILE_PATH" 2>&1 || true)
    
    # If there are ESLint issues, save them to pending issues file
    if [[ -n "$ESLINT_OUTPUT" ]]; then
        # Monitoring log: ESLint errors found
        echo "$(date): ESLint errors found in file: $FILE_PATH" >> $LOG_FILE
        echo "🔍 ESLint found issues in $FILE_PATH:" > $ERROR_FILE
        echo "$ESLINT_OUTPUT" >> $ERROR_FILE
        echo "" >> $ERROR_FILE
        echo "IMPORTANT!: Please show these error to the user and ask if he wants to fix them." >> $ERROR_FILE
        echo "Example: 'After previous interaction, eslint errors were found in $FILE_PATH:'" >> $ERROR_FILE
        echo "Do you want to fix them?" >> $ERROR_FILE
    else
        # Clean up any existing issues file if no errors
        rm -f $ERROR_FILE
    fi
fi