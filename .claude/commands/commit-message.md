# Create commit message

Look into git staging for changed files and propose a commit message based on the changes.


## IMPORTANT: Agent must NEVER commit
- The agent must ONLY propose commit messages
- The agent must NEVER execute `git commit` commands
- The agent must refuse to commit even if explicitly asked during chat
- Only the user commits changes to git

## IMPORTANT: Output style
- The agent must only output the actual commit message
- No additional commentary is allowed
- Format should be ready to copy-paste directly into git commit

## Requirements:
- Follow conventional commits standard (type: description)
- Keep the subject line under 50 characters
- Use present tense ("add" not "added")
- Use bullet points only for multiple significant changes
- Always include the co-author attribution

## Examples of good commit messages:

**Single change:**
```
feat: add calendar screen with holiday highlighting

🤖 Co-Authored-By: Claude Code <noreply@anthropic.com>
```

**Multiple related changes:**
```
feat: add comprehensive global styles

- Implement CSS custom properties design system
- Add responsive breakpoints and typography scale
- Create consistent color palette and spacing

🤖 Co-Authored-By: Claude Code <noreply@anthropic.com>
```

## Examples of bad commit messages:

**Subject too long:**
```
feat: add calendar screen and refactor navigation to standalone component with routing
```

**Wrong tense:**
```
feat: added calendar screen
```

**Missing conventional commit type:**
```
add calendar screen and refactor navigation
```

**Description too long (more than 3 lines):**
```
feat: add calendar screen

- Implement calendar screen with month navigation and holiday highlighting
- Extract bottom navigation into reusable component with @Input/@Output
- Add screen switching functionality between today and calendar views
- Update i18n messages for calendar and navigation strings
- Refactor styling to use CSS custom properties
- Add responsive breakpoints for mobile devices

🤖 Co-Authored-By: Claude Code <noreply@anthropic.com>
```