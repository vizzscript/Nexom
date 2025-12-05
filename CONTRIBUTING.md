# Contributing to Nexom

Thank you for your interest in contributing to Nexom! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a positive environment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git
- npm or yarn

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:vizzscript/Nexom.git
   cd Nexom
   ```

2. **Install dependencies**
   ```bash
   # Auth Service
   cd server/auth-service
   npm install
   
   # Service Catalog
   cd ../service-catalog
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in each service directory:
   
   **auth-service/.env**:
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/nexom
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```
   
   **service-catalog/.env**:
   ```env
   SERVICE_PORT=3002
   ```

4. **Configure Git commit template**
   ```bash
   git config commit.template .gitmessage
   ```

## Development Workflow

### Project Structure

```
Nexom/
├── server/
│   ├── auth-service/          # Authentication microservice
│   ├── service-catalog/       # Service catalog microservice
│   └── common/                # Shared modules (DB, utilities)
└── client/                    # Frontend (future)
```

### Running Services Locally

```bash
# Auth Service
cd server/auth-service
npm run dev

# Service Catalog
cd server/service-catalog
npm run dev
```

## Branching Strategy

We follow **Git Flow** branching model:

### Main Branches

- **`main`**: Production-ready code. Protected branch.
- **`develop`**: Integration branch for features. Protected branch.

### Supporting Branches

- **`feature/*`**: New features
  - Branch from: `develop`
  - Merge into: `develop`
  - Naming: `feature/user-authentication`, `feature/service-search`

- **`bugfix/*`**: Bug fixes for develop
  - Branch from: `develop`
  - Merge into: `develop`
  - Naming: `bugfix/login-error`, `bugfix/db-connection`

- **`hotfix/*`**: Urgent production fixes
  - Branch from: `main`
  - Merge into: `main` and `develop`
  - Naming: `hotfix/security-patch`, `hotfix/critical-bug`

- **`release/*`**: Release preparation
  - Branch from: `develop`
  - Merge into: `main` and `develop`
  - Naming: `release/v1.0.0`, `release/v1.1.0`

### Branch Workflow Example

```bash
# Create a new feature
git checkout develop
git pull origin develop
git checkout -b feature/add-user-profile

# Make changes and commit
git add .
git commit

# Push to remote
git push -u origin feature/add-user-profile

# Create Pull Request on GitHub
```

## Commit Message Guidelines

We use **Conventional Commits** specification for clear and consistent commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Revert a previous commit

### Scope

The scope should be the name of the affected service or module:
- `auth-service`
- `service-catalog`
- `common`
- `config`
- `docs`

### Examples

```bash
# Good commit messages
feat(auth-service): add JWT token refresh endpoint
fix(service-catalog): resolve database connection timeout
docs(readme): update installation instructions
refactor(common): extract database connection to shared module
chore(deps): update dependencies to latest versions

# Bad commit messages
update code
fix bug
changes
WIP
```

### Commit Message Template

A commit message template is available in `.gitmessage`. Configure it:

```bash
git config commit.template .gitmessage
```

## Pull Request Process

### Before Creating a PR

1. **Ensure your branch is up to date**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```

3. **Verify build succeeds**
   ```bash
   npm run build
   ```

### Creating a PR

1. Push your branch to GitHub
2. Navigate to the repository on GitHub
3. Click "New Pull Request"
4. Fill out the PR template completely
5. Link any related issues
6. Request reviewers

### PR Requirements

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions
- [ ] No merge conflicts
- [ ] PR description is clear and complete

## Code Review Guidelines

### For Authors

- Keep PRs focused and reasonably sized
- Respond to feedback promptly
- Be open to suggestions
- Update PR based on review comments

### For Reviewers

- Review within 24-48 hours
- Be constructive and respectful
- Focus on code quality, not personal preferences
- Approve only when all concerns are addressed
- Check for:
  - Code correctness
  - Test coverage
  - Documentation
  - Performance implications
  - Security concerns

## Development Best Practices

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write unit tests for business logic
- Write integration tests for API endpoints
- Aim for >80% code coverage
- Test edge cases and error scenarios

### Security

- Never commit sensitive data (.env files, secrets, keys)
- Validate all user inputs
- Use parameterized queries for database operations
- Keep dependencies updated
- Follow OWASP security guidelines

## Questions?

If you have questions or need help, please:
- Open an issue on GitHub
- Reach out to the maintainers
- Check existing documentation

Thank you for contributing to Nexom! 🚀
