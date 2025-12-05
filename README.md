# Nexom

A modern microservices-based platform built with Node.js, TypeScript, and MongoDB.

## 🏗️ Architecture

Nexom follows a microservices architecture with the following services:

```
┌─────────────────────────────────────────────────────┐
│                    API Gateway                       │
│                   (Future)                           │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                                  │
┌───────▼────────┐              ┌─────────▼──────────┐
│  Auth Service  │              │ Service Catalog    │
│   Port: 3001   │              │   Port: 3002       │
│                │              │                    │
│ - JWT Auth     │              │ - Service CRUD     │
│ - Email OTP    │              │ - Search           │
│ - User Mgmt    │              │ - Categories       │
└────────────────┘              └────────────────────┘
        │                                  │
        └────────────────┬─────────────────┘
                         │
                ┌────────▼─────────┐
                │   MongoDB        │
                │   Database       │
                └──────────────────┘
```

## 🚀 Services

### Auth Service
Handles authentication and user management:
- User registration and login
- Email-based OTP verification
- JWT token generation and validation
- Password management

### Service Catalog
Manages service listings:
- CRUD operations for services
- Service search and filtering
- Category management
- JWT-protected endpoints

### Common Modules
Shared functionality across services:
- Database connection management
- Utility functions
- Type definitions

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: v6 or higher
- **npm**: v9 or higher
- **Git**: v2.30 or higher

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone git@github.com:vizzscript/Nexom.git
cd Nexom
```

### 2. Install Dependencies

```bash
# Auth Service
cd server/auth-service
npm install

# Service Catalog
cd ../service-catalog
npm install
```

### 3. Environment Configuration

Create `.env` files for each service:

**server/auth-service/.env**:
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/nexom
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development

# Email Configuration (Ethereal for development)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-user
EMAIL_PASS=your-ethereal-password
EMAIL_FROM=noreply@nexom.com
```

**server/service-catalog/.env**:
```env
SERVICE_PORT=3002
```

> **Note**: The service-catalog shares `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV` from auth-service's `.env` file.

### 4. Start MongoDB

```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name nexom-mongo mongo:latest
```

## 🏃 Running the Application

### Development Mode

```bash
# Terminal 1 - Auth Service
cd server/auth-service
npm run dev

# Terminal 2 - Service Catalog
cd server/service-catalog
npm run dev
```

### Production Build

```bash
# Build all services
cd server/auth-service
npm run build
npm start

cd server/service-catalog
npm run build
npm start
```

## 📡 API Endpoints

### Auth Service (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/resend-otp` | Resend OTP |

### Service Catalog (Port 3002)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/services` | Get all services | ✅ |
| GET | `/api/services/:id` | Get service by ID | ✅ |
| POST | `/api/services` | Create new service | ✅ |
| PUT | `/api/services/:id` | Update service | ✅ |
| DELETE | `/api/services/:id` | Delete service | ✅ |

## 🧪 Testing

### Example API Calls

**Register a User**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Create Service** (requires JWT token):
```bash
curl -X POST http://localhost:3002/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Web Development",
    "description": "Professional web development services",
    "category": "Technology",
    "price": 999.99
  }'
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Development workflow
- Branching strategy
- Commit message conventions
- Pull request process
- Code review guidelines

## 📝 Project Structure

```
Nexom/
├── server/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── config/          # Configuration
│   │   │   ├── controllers/     # Route controllers
│   │   │   ├── database/        # Database models
│   │   │   ├── middleware/      # Express middleware
│   │   │   ├── routes/          # API routes
│   │   │   ├── services/        # Business logic
│   │   │   ├── utils/           # Utilities
│   │   │   └── server.ts        # Entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── service-catalog/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── server.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── common/
│       └── db/
│           └── connection.ts    # Shared DB connection
│
├── .gitignore
├── .gitattributes
├── .gitmessage
├── CONTRIBUTING.md
└── README.md
```

## 🔧 Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Validation**: Express Validator

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Development Challenges](server/DEVELOPMENT_CHALLENGES.md)

## 🐛 Known Issues

See [DEVELOPMENT_CHALLENGES.md](server/DEVELOPMENT_CHALLENGES.md) for known issues and their solutions.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **vizzscript** - Initial work

## 🙏 Acknowledgments

- Built with modern microservices architecture principles
- Follows industry-standard Git workflow
- Implements secure authentication practices

---

**Happy Coding! 🚀**
