#!/bin/bash

# Extract file path from Claude's tool input
FILE_PATH=$(jq -r '.tool_input.file_path')

# Only run ESLint on TypeScript and HTML files
if [[ "$FILE_PATH" == *.ts ]] || [[ "$FILE_PATH" == *.html ]]; then
    # Run ESLint and capture output (including errors)
    ESLINT_OUTPUT=$(npx eslint "$FILE_PATH" 2>&1 || true)
    
    # If there are ESLint issues, write them to a feedback file
    if [[ -n "$ESLINT_OUTPUT" ]]; then
        echo "🔍 ESLint found issues in $FILE_PATH:" > "$CLAUDE_PROJECT_DIR/.claude/eslint_feedback.txt"
        echo "$ESLINT_OUTPUT" >> "$CLAUDE_PROJECT_DIR/.claude/eslint_feedback.txt"
        echo "" >> "$CLAUDE_PROJECT_DIR/.claude/eslint_feedback.txt"
        echo "Please fix these ESLint issues." >> "$CLAUDE_PROJECT_DIR/.claude/eslint_feedback.txt"
        
        # Output JSON to indicate feedback is available
        echo '{"hookSpecificOutput": {"feedbackFile": ".claude/eslint_feedback.txt"}}'
    fi
fi