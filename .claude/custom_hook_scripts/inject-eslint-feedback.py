#!/usr/bin/env python3
import json
import sys
import os
from datetime import datetime

# Get the project directory
project_dir = os.environ.get('CLAUDE_PROJECT_DIR', '.')
monitor_file = os.path.join(project_dir, '.claude', 'custom_hook_scripts', 'logs', 'eslint_monitor.log')

# Read hook input from stdin
hook_input = json.load(sys.stdin)

issues_file = os.path.join(project_dir, '.claude', 'custom_hook_scripts', 'tmp_files', 'pending_eslint_issues.txt')


if os.path.exists(issues_file):
    with open(issues_file, 'r') as f:
        issues_content = f.read().strip()
    
    if issues_content:
        with open(monitor_file, 'a') as f:
            f.write(f"{datetime.now()}: UserPromptSubmit submitted eslint errors to the conversation")
        
        # Print ESLint feedback to stdout - this will be injected as context
        print(issues_content)
        print()  # Empty line for separation
        
        # Clean up the issues file
        os.remove(issues_file)