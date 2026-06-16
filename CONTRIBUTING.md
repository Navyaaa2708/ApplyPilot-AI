# Contributing to ApplyPilot AI

Thank you for your interest in contributing! ApplyPilot AI is an open-source project and welcomes community contributions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/ApplyPilot.git
   cd ApplyPilot
   ```

3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local database details
npm run dev
```

### Extension

1. Navigate to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the `extension/` folder

## Code Standards

### TypeScript Backend
- Use `npm run build` to compile
- Use `npm run lint` to check code style
- Add type annotations for all functions
- Write unit tests for services

### JavaScript Extension
- No `eval()` or inline scripts
- Use const/let instead of var
- Add JSDoc comments for public functions
- Test on multiple job board sites

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Extension Testing
1. Test on LinkedIn, Indeed, Naukri
2. Verify ATS scores match expected ranges
3. Test resume upload for PDF, DOCX, TXT
4. Test local AI mode with Ollama
5. Test offline functionality

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issues: "Fixes #123"
- One feature per commit
- Test before committing

Example:
```
feat: add salary range extraction for job descriptions

Adds regex patterns to extract salary information from job postings
on Indeed, LinkedIn, and Naukri. Validates ranges and stores in
normalized job object.

Fixes #45
```

## Pull Request Process

1. **Update your branch:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Create a pull request** with:
   - Clear description of changes
   - Reference to related issue
   - Screenshots for UI changes
   - Test results

3. **Address feedback** from reviewers

4. **Merge** when approved

## Reporting Issues

When reporting a bug:
- Include your OS and Chrome version
- Describe the expected behavior
- Describe the actual behavior
- Include steps to reproduce
- Attach screenshots or logs

## Feature Requests

Suggest new features by:
1. Checking if similar request exists
2. Describing the use case
3. Explaining the benefit
4. Suggesting implementation approach

## Code of Conduct

ApplyPilot AI is committed to providing a welcoming and inclusive environment. We do not tolerate:
- Harassment
- Discrimination
- Abuse
- Any form of disrespect

Report violations to: conduct@applypilot.ai

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

## Questions?

Open a discussion on GitHub or email: dev@applypilot.ai
