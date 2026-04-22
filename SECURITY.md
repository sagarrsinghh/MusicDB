# Security Policy

## Overview
This project handles user data, authentication tokens, and third-party API credentials. Security is a top priority.

## Sensitive Information - DO NOT COMMIT

### Never commit the following to version control:
- **Environment files**: `.env`, `.env.local`, `.env.*.local`
- **Database credentials**: Passwords, connection strings
- **API Keys & Secrets**:
  - Spotify API credentials
  - JWT signing keys
  - Third-party service tokens
- **Private keys**: SSL certificates, SSH keys
- **Debug files**: Debug logs, test credentials

### Environment Variables Reference

#### Backend (.env)
```
DB_HOST=          # Database host
DB_PORT=          # Database port
DB_USERNAME=      # Database user
DB_PASSWORD=      # Database password (SENSITIVE)
DB_NAME=          # Database name
SPOTIFY_CLIENT_ID=     # From Spotify Dashboard (SENSITIVE)
SPOTIFY_CLIENT_SECRET= # From Spotify Dashboard (SENSITIVE)
JWT_SECRET=            # Strong random string (SENSITIVE)
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=   # Backend API URL
```

## Setup Instructions

1. **Generate strong secrets**:
   ```bash
   # Generate a secure JWT secret (64 characters)
   openssl rand -base64 32
   ```

2. **Configure environment files**:
   - Copy `.env.example` to `.env` (backend)
   - Copy `.env.example` to `.env.local` (frontend)
   - Fill in actual values from your services

3. **Secure your credentials**:
   - Store in a password manager
   - Share via secure channels only
   - Rotate regularly

## Best Practices for Contributors

### Before Committing
1. **Check for secrets**:
   ```bash
   git diff --cached | grep -i "password\|secret\|token\|key"
   ```

2. **Verify .gitignore is respected**:
   ```bash
   git check-ignore .env*
   git check-ignore debug_*.js
   ```

3. **Review staged files**:
   ```bash
   git diff --cached --name-only
   ```

### If You Accidentally Commit Secrets

**CRITICAL**: If you accidentally commit any secrets:

1. **Immediately rotate all credentials** (database password, API keys, JWT secret)
2. **Remove from git history**:
   ```bash
   # Remove file from all history
   git filter-branch --tree-filter 'rm -f .env' HEAD
   # Force push (only if you're the only one on the branch)
   git push --force-with-lease
   ```
3. **Notify the team** of the credential rotation

## Production Security Checklist

- [ ] All environment variables are set in production environment
- [ ] Database uses strong, unique passwords
- [ ] JWT secret is cryptographically secure
- [ ] Spotify API credentials are limited to necessary scopes
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Database backups are encrypted
- [ ] Secrets are rotated periodically
- [ ] Access logs are monitored
- [ ] Application runs with minimal required permissions

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. **Contact the project maintainers** privately
3. **Provide detailed information** about the vulnerability
4. **Allow time for a fix** before public disclosure

## Additional Resources

- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [NestJS Security](https://docs.nestjs.com/techniques/security)
- [Next.js Security](https://nextjs.org/learn/foundations/how-nextjs-works/where-your-code-runs)
