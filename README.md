# Nexom

A modern microservices-based Home cleaning platform built with Node.js, TypeScript, and MongoDB.

## 🏗️ Architecture
 
Nexom follows a microservices architecture with a React frontend:
 
```
┌─────────────────────────────────────────────────────┐
│                 Client Application                  │
│               (React + Vite + TS)                   │
│                   Port: 5173                        │
└──────────────────────────┬──────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────┐
│                    API Gateway                      │
│                   (Future)                          │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                                 │
┌───────▼────────┐              ┌─────────▼──────────┐
│  Auth Service  │              │ Service Catalog    │
│   Port: 8081   │              │   Port: 8082       │
│                │              │                    │
│ - Firebase Auth│              │ - Home Cleaning    │
│ - OTP Login    │              │ - Services List    │
│ - User Mgmt    │              │ - Adv. Search      │
└────────────────┘              └────────────────────┘
        │                                  │
        ├────────────────┬─────────────────┤
        │                │                 │
 ┌──────▼─────────┐ ┌────▼──────────┐ ┌────▼─────────────┐
 │ Payment Service│ │Booking Service│ │ Contact Service  │
 │   Port: 8084   │ │   Port: 8085   │ │   Port: 8083     │
 │                │ │                │ │                 │
 │ - Stripe Pay   │ │ - Bookings     │ │ - Email Inquiries│
 │ - Webhooks     │ │ - Status Mgmt  │ │ - Auto-replies   │
 └────────────────┘ └────────────────┘ └─────────────────┘
                         │
                ┌────────▼─────────┐
                │   MongoDB        │
                │   Database       │
                └──────────────────┘
```

## 🚀 Services

### Client Application
Modern frontend interface built with React and Vite:
- Premium UI with circular animations
- Responsive design with TailwindCSS
- **User Dashboard with Booking Management**
- **Multi-step Booking Wizard**
- Integrated authentication flows
- Service browsing and filtering

### Auth Service
Handles authentication and user management:
- **Firebase Google Sign-In** integration
- Traditional Email/Password signup/login
- Email OTP based verification (backup)
- JWT token generation and validation

### Service Catalog
Specialized Home Cleaning Service platform:
- Service type categorization
- Advanced filtering (rooms, area, price)
- Home cleaning specific attributes

### Payment Service
Handles payments and transactions:
- Stripe Payment Intent creation
- Webhook handling for payment status updates

### Booking Service
Handles service bookings and scheduling:
- Create and manage service bookings
- Status tracking (Pending, Paid, Cancelled)
- User booking history
- Integration with Payment service for automatic updates

### Contact Service
Manages user inquiries:
- Contact form submission
- Automated email replies via SendGrid
- Admin notifications

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

You can install dependencies for all services from the root `server` directory:

```bash
cd server
npm install
```

Or individually:

```bash
# Auth Service
cd server/auth-service
npm install

# Service Catalog
cd ../service-catalog
npm install
```

### 3. Environment Configuration

Create `.env` files for each service.

**server/auth-service/.env**:
```env
PORT=8081
MONGO_URI=mongodb://localhost:27017/nexom
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-app.onrender.com

# Email Configuration (SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=support@nexom.com

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

**server/service-catalog/.env**:
```env
SERVICE_PORT=8082
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-app.onrender.com
```

**server/contact-service/.env**:
```env
PORT=8083
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-app.onrender.com
# Email config (can share with auth-service or be separate)
```

**server/payment-service/.env**:
```env
PORT=8084
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-app.onrender.com
```

> **Note**: The service-catalog shares `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV` from auth-service's `.env` file in development.

### 4. Start MongoDB or Use MongoDB Atlas

You can either start MongoDB locally or use MongoDB Atlas for production.

#### Local MongoDB

```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name nexom-mongo mongo:latest
```

#### MongoDB Atlas

```bash
# Using MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nexom?retryWrites=true&w=majority
```

## 🏃 Running the Application

### Running All Services Concurrently

You can now run all backend microservices with a single command from the `server` directory:

```bash
cd server
npm install
npm run dev
```

This will start the Auth Service, Service Catalog, Payment Service, and Contact Service in parallel using `concurrently`.

### Individual Service Mode

If you prefer to run services individually:

```bash
# Terminal 1 - Auth Service
cd server/auth-service
npm run dev

# Terminal 2 - Service Catalog
cd server/service-catalog
npm run dev

# Terminal 3 - Payment Service
cd server/payment-service
npm run dev

# Terminal 4 - Contact Service
cd server/contact-service
npm run dev
```

## 🚀 Deployment (Render)

The backend services are configured for deployment on [Render](https://render.com).

### Configuration for each service:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
    - `NODE_ENV`: `production`
    - `MONGO_URI`: Your MongoDB Atlas URI
    - `JWT_SECRET`: Your production secret
    - `ALLOWED_ORIGINS`: Your frontend production URL (e.g., `https://nexom-client.onrender.com`)

Ensure you set the **Root Directory** correctly for each service (e.g., `server/auth-service`).

## 📡 API Endpoints

### Auth Service (Port 8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/send-otp` | Send OTP to user's email |
| POST | `/api/v1/auth/verify-otp` | Verify email OTP |
| POST | `/api/v1/auth/resend-otp` | Resend OTP |

### Service Catalog (Port 8082)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/services` | Get all services | ✅ |
| GET | `/api/v1/services/:id` | Get service by ID | ✅ |
| POST | `/api/v1/services` | Create new service | ✅ |
| DELETE | `/api/v1/services/:id` | Delete service | ✅ |

### Payment Service (Port 8084)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/payments/create-intent` | Create Stripe Payment Intent | ✅ |
| GET | `/api/v1/payments/status/:id` | Get payment status | ✅ |
| POST | `/api/v1/payments/webhook` | Stripe Webhook handler | ❌ |

### Booking Service (Port 8085)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/v1/bookings` | Create a new booking | ✅ |
| GET    | `/api/v1/bookings/user/:userId` | Get user bookings | ✅ |
| GET    | `/api/v1/bookings/:id` | Get booking details | ✅ |
| PATCH  | `/api/v1/bookings/:id` | Update booking status | ✅ |

### Contact Service (Port 8083)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/contact/submit` | Submit contact form | ❌ |

## 🧪 Testing

### Example API Calls

**Send OTP**:
```bash
curl -X POST http://localhost:8081/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Verify OTP**:
```bash
curl -X POST http://localhost:8081/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": 123456
  }'
```

**Create Service** (requires JWT token):
```bash
curl -X POST http://localhost:8082/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Web Development",
    "description": "Full-stack web development service",
    "price": 1500,
    "duration": 120,
    "category": "Development",
    "imageUrl": "https://example.com/image.jpg"
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
 ├── client/                  # Frontend Application
 │   ├── src/
 │   │   ├── components/      # Reusable UI components
 │   │   ├── pages/           # Page components
 │   │   ├── assets/          # Static assets
 │   │   ├── App.tsx          # Main App component
 │   │   └── main.tsx         # Entry point
 │   ├── public/
 │   ├── index.html
 │   └── vite.config.ts
 │
 ├── server/                  # Backend Microservices
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
 │   ├── contact-service/     # Contact Microservice
 │   │   ├── src/
 │   │   └── ...
 │   │
 │   ├── payment-service/     # Payment Microservice
 │   │   ├── src/
 │   │   └── ...
 │   │
 │   └── common/
 │       └── db/
 │           └── connection.ts    # Shared DB connection
 │
 ├── .gitignore
 ├── .gitattributes
 ├── .gitmessage
 ├── CONTRIBUTING.md
 ├── DEVELOPMENT_CHALLENGES.md
 └── README.md
 ```
 
 ## 🔧 Technology Stack
 
 ### Frontend
 - **Framework**: React 18 with Vite
 - **Language**: TypeScript
 - **Styling**: TailwindCSS
 - **State**: React Hooks
 - **Icons**: Lucide React
 
 ### Backend
 - **Runtime**: Node.js
 - **Language**: TypeScript
 - **Framework**: Express.js
 - **Database**: MongoDB with Mongoose
 - **Authentication**: JWT (JSON Web Tokens)
 - **Email**: Nodemailer / SendGrid
 - **Validation**: Express Validator
 - **Payments**: Stripe

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Development Challenges & Solutions](DEVELOPMENT_CHALLENGES.md)

## 🐛 Known Issues

See [DEVELOPMENT_CHALLENGES.md](DEVELOPMENT_CHALLENGES.md) for known issues and their solutions, including:
- MongoDB buffering timeouts
- CORS configuration
- TypeScript module resolution

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
