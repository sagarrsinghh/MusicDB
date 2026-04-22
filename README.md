# MusicDB - A Full-Stack Music Database Application

A modern full-stack application built with **NestJS** (backend) and **Next.js** (frontend) for managing music, artists, and community reviews.

## 📁 Project Structure

```
musicdb/
├── musicdb-backend/       # NestJS API server
├── musicdb-frontend/      # Next.js React frontend
├── SECURITY.md           # Security policies and best practices
├── CONTRIBUTING.md       # Contributing guidelines
└── README.md            # This file
```

## ✨ Features

### Backend API
- **User Authentication**: JWT-based authentication with Passport
- **Spotify Integration**: Connect to Spotify API for music data
- **Music Database**: Artist, song, and music management
- **User Ratings & Reviews**: Community-driven content
- **Favorites System**: Bookmark favorite songs and artists
- **Protected Routes**: JWT-based authorization

### Frontend UI
- **Beautiful UI**: Modern React components with Tailwind CSS
- **3D Visuals**: Interactive 3D elements using Three.js
- **Authentication**: Secure login and registration
- **Artist & Song Discovery**: Browse and search music
- **User Reviews**: Read and write community reviews
- **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MySQL 5.7 or higher
- Spotify Developer Account (for API keys)

### Backend Setup

```bash
cd musicdb-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and Spotify credentials

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

**Available Scripts**:
```bash
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm test              # Run unit tests
npm run test:cov      # Generate coverage reports
npm run test:e2e      # Run end-to-end tests
```

### Frontend Setup

```bash
cd musicdb-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your backend API URL

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Available Scripts**:
```bash
npm run dev    # Development server (http://localhost:3000)
npm run build  # Production build
npm start      # Start production server
npm run lint   # Run ESLint
```

## 🔐 Security Setup

### IMPORTANT: Never commit secrets!

1. **Create environment files**:
   ```bash
   # Backend
   cd musicdb-backend
   cp .env.example .env
   
   # Frontend
   cd musicdb-frontend
   cp .env.example .env.local
   ```

2. **Configure with actual values** (NOT in version control):
   - Database credentials
   - Spotify API keys
   - JWT secret
   - API URLs

3. **Reference**: See [SECURITY.md](SECURITY.md) for detailed security guidelines

## 📚 API Documentation

### Key Endpoints

**Authentication**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

**Music**:
- `GET /songs` - List all songs
- `GET /songs/:id` - Get song details
- `GET /artists` - List all artists
- `GET /artists/:id` - Get artist details

**User Features**:
- `GET /users/profile` - User profile
- `POST /favorites` - Add to favorites
- `GET /ratings` - Get ratings
- `POST /reviews` - Create review

For complete API documentation, refer to the backend README: [musicdb-backend/README.md](musicdb-backend/README.md)

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS 11
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **External APIs**: Spotify API
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **State Management**: Zustand
- **Language**: TypeScript
- **Linting**: ESLint

## 📝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code standards
- Security guidelines
- Pull request process

**Key Security Points**:
- Never commit `.env` files
- Check for secrets before committing
- Run linting and tests locally
- Use environment variables for sensitive data

## 🔒 Security Policy

This project handles user data and authentication. Security is critical.

**NEVER commit**:
- Environment files (`.env`, `.env.local`)
- Database credentials
- API keys and secrets
- JWT signing keys
- Debug files with credentials

See [SECURITY.md](SECURITY.md) for:
- Detailed security guidelines
- Setup instructions
- Best practices for contributors
- Production checklist

## 📦 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password

DB_NAME=musicdb
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🧪 Testing

```bash
# Backend tests
cd musicdb-backend
npm test              # Unit tests
npm run test:cov      # With coverage
npm run test:e2e      # E2E tests

# Frontend tests (if configured)
cd musicdb-frontend
npm test
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [Spotify API Reference](https://developer.spotify.com/documentation)

## 📄 License

This project is licensed under the UNLICENSED license.

## 👥 Authors & Maintainers

[SAGAR SINGH | JECRC UNIVERSITY ]

## 🤝 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Security**: See [SECURITY.md](SECURITY.md) for reporting security issues

## ✅ GitHub Readiness Checklist

- ✅ `.gitignore` configured properly
- ✅ `.env.example` files provided
- ✅ `SECURITY.md` with security guidelines
- ✅ `CONTRIBUTING.md` for contributors
- ✅ No secrets committed to repository
- ✅ Environment variables documented
- ✅ License specified
- ✅ Clear development setup instructions
- ✅ API documentation available
- ✅ Production security checklist

---

