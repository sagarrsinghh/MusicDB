# Contributing to MusicDB

Thank you for your interest in contributing to the MusicDB project! This document provides guidelines for contributing code and maintaining our security standards.

## Getting Started

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/musicdb.git
   cd musicdb
   ```

2. **Backend setup**:
   ```bash
   cd musicdb-backend
   npm install
   cp .env.example .env
   # Edit .env with your local database and API credentials
   npm run start:dev
   ```

3. **Frontend setup**:
   ```bash
   cd musicdb-frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your API URL
   npm run dev
   ```

## Development Guidelines

### Code Standards

- **TypeScript**: Ensure all code is properly typed
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Run `npm run format` to auto-format code
- **Testing**: Write tests for new features

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add user profile page
fix: Resolve JWT token expiration issue
docs: Update API documentation
```

Format: `<type>: <short description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Security Guidelines

### 🚨 NEVER Commit Secrets

**Before every commit, verify**:

1. Check staged files for sensitive data:
   ```bash
   git diff --cached | grep -E "password|secret|token|key|api[_-]?key" -i
   ```

2. Ensure .env files are not staged:
   ```bash
   git check-ignore .env*
   git check-ignore debug*.js
   ```

3. Review your changes:
   ```bash
   git diff --cached
   ```

### Files That Should NEVER Be Committed

- `.env`, `.env.local`, `.env.*.local`
- Debug scripts with hardcoded credentials
- API keys, tokens, secrets
- Database dumps with real data
- Private keys or certificates

### Review Checklist

Before submitting a pull request, ensure:

- [ ] No `.env` files staged
- [ ] No API credentials in code
- [ ] No debug files with secrets
- [ ] No hardcoded passwords or tokens
- [ ] Environment variables used instead of hardcoded values
- [ ] Code follows linting rules
- [ ] Tests pass locally
- [ ] Commit messages are clear

## Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with clear messages

3. **Test locally**:
   ```bash
   npm run lint
   npm test
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request** with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots for UI changes
   - Test results

## Reporting Issues

Found a bug? Have a feature request?

1. **Check existing issues** first
2. **Use descriptive titles** and descriptions
3. **Include steps to reproduce** for bugs
4. **Include environment details** (OS, Node version, npm version)
5. **For security issues**: See [SECURITY.md](SECURITY.md)

## Code Review

Pull requests will be reviewed for:

- **Security**: No exposed secrets or vulnerabilities
- **Code quality**: Follows standards, proper types
- **Tests**: Adequate test coverage
- **Documentation**: Clear comments where needed
- **Performance**: No unnecessary overhead

## Questions?

- Open a Discussion on GitHub
- Contact maintainers
- Check existing documentation

Thank you for helping make MusicDB better! 🎵
