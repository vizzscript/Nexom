# Development Challenges & Solutions

This document chronicles the technical challenges encountered during the development of the Nexom microservices architecture and their resolutions.

---

## Table of Contents
1. [MongoDB Buffering Timeout](#1-mongodb-buffering-timeout)
2. [TypeScript Module Resolution](#2-typescript-module-resolution)
3. [API Error Response Status Codes](#3-api-error-response-status-codes)
4. [Mobile to Email OTP Migration](#4-mobile-to-email-otp-migration)
5. [JWT Authentication Implementation](#5-jwt-authentication-implementation)
6. [RabbitMQ Connection Blocking Server Startup](#6-rabbitmq-connection-blocking-server-startup)
7. [Frontend Integration & CORS](#7-frontend-integration--cors)
8. [Service Catalog Transformation (Home Cleaning)](#8-service-catalog-transformation-home-cleaning)

---

## 1. MongoDB Buffering Timeout

### Error
```json
{
    "status": 500,
    "message": "Operation `users.findOne()` buffering timed out after 10000ms"
}
```

### Symptoms
- Server logs showed "Database connected!" with connection state: 1
- All database queries timed out after 10 seconds
- Issue persisted even after server restarts

### Root Cause
**Duplicate Mongoose Installations** causing instance mismatch:

```
/server/node_modules/mongoose          (Root instance)
/server/auth-service/node_modules/mongoose  (Service instance)
```

**Module Resolution Conflict**:
- `common/db/connection.ts` resolved `mongoose` from root `node_modules` (walked up directory tree)
- `auth-service/src/database/models/UserModel.ts` resolved `mongoose` from service `node_modules`
- Database connection was established on **Root Mongoose instance**
- User model was created on **Service Mongoose instance** (disconnected)
- Queries buffered indefinitely waiting for a connection that never came

### Investigation Steps
1. Verified MongoDB connection with standalone test script - **Connection worked perfectly (1.6s)**
2. Checked server startup sequence - **Database connection was properly awaited**
3. Examined package.json dependencies - **Both services had mongoose@^9.0.0**
4. Discovered root `node_modules` directory with duplicate mongoose installation
5. Traced module resolution paths using Node.js resolution algorithm

### Solution
Implemented **Dependency Injection** pattern for Mongoose instance:

**Modified Files**:

1. **`common/db/connection.ts`**:
```typescript
// Before
export const connectDB = async () => {
    await mongoose.connect(config.MONGO_URI!);
}

// After
export const connectDB = async (mongooseInstance: any) => {
    await mongooseInstance.connect(config.MONGO_URI!);
}
```

2. **`auth-service/src/server.ts`**:
```typescript
import mongoose from "mongoose";
// ...
await connectDB(mongoose); // Pass local instance
```

3. **`service-catalog/src/server.ts`**:
```typescript
import mongoose from "mongoose";
// ...
await connectDB(mongoose); // Pass local instance
```

### Lessons Learned
- In monorepo-like structures, be cautious of module resolution in shared code
- Always verify which `node_modules` directory dependencies resolve from
- Dependency injection makes shared libraries more flexible and prevents instance conflicts
- Test database connections in isolation to rule out network/authentication issues

### Prevention
- Consider using workspace managers (Lerna, Nx, Turborepo) for proper monorepo management
- Use `npm ls mongoose` to detect duplicate installations
- Implement explicit dependency injection for singleton-based libraries

---

## 2. TypeScript Module Resolution

### Error
```
error TS6059: File '/server/common/db/connection.ts' is not under 'rootDir' '/server/auth-service/src'. 
'rootDir' is expected to contain all source files.
```

### Root Cause
The `auth-service` needed to compile files from the parent `common` directory, but TypeScript's `rootDir` was set to `./src`.

### Solution
Updated `auth-service/tsconfig.json`:
```json
{
  "compilerOptions": {
    "rootDir": "..",  // Allow compilation from parent directory
    "baseUrl": ".",
    "paths": {
      "@common/*": ["../common/*"]
    }
  },
  "include": [
    "src/**/*",
    "../common/**/*"  // Include common directory
  ]
}
```

### Lessons Learned
- `rootDir` must encompass all source files being compiled
- Use path aliases (`@common/*`) for cleaner imports
- Ensure `include` array covers all directories referenced in code

---

## 3. API Error Response Status Codes

### Issue
All API responses returned HTTP 200, even for errors:
```bash
HTTP/1.1 200 OK
{
    "status": 500,
    "message": "Error message"
}
```

### Root Cause
Controllers were sending error status in the response body but not setting the HTTP status code:
```typescript
return res.json({
    status: 500,
    message: error.message
});
```

### Solution
Updated all controller error handlers to set proper HTTP status codes:
```typescript
// Before
return res.json({
    status: statusCode,
    message: error.message
});

// After
return res.status(statusCode).json({
    status: statusCode,
    message: error.message
});
```

### Lessons Learned
- HTTP status codes and response body status should match
- Proper status codes are essential for API clients, monitoring, and debugging
- Always use `res.status(code).json()` pattern for error responses

---

## 4. Mobile to Email OTP Migration

### Challenge
Convert existing mobile OTP authentication system to email-based OTP.

### Changes Required
1. **Data Model**: Changed `mobile` field to `email` in User schema
2. **Validation**: Replaced mobile number validation with email validation
3. **Service Layer**: Replaced SMS service with email service (SMTP)
4. **Controller Logic**: Updated all references from mobile to email
5. **API Contracts**: Changed request/response schemas

### Implementation Highlights

**User Model** (`UserModel.ts`):
```typescript
email: {
    type: String,
    required: [true, "Email must be provided."],
    unique: true,
    validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Please provide a valid email address."
    }
}
```

**Email Service** (`EmailService.ts`):
```typescript
static async sendOtpEmail(email: string, otp: string) {
    await transporter.sendMail({
        from: config.smtp.user,
        to: email,
        subject: "Your OTP Code",
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    });
}
```

### Lessons Learned
- Plan data model changes carefully to avoid breaking existing data
- Update validation logic to match new field types
- Test email delivery in development before production deployment
- Consider rate limiting for email sending to prevent abuse

---

## 5. JWT Authentication Implementation

### Objective
Implement JWT-based authentication for service-catalog microservice, ensuring all routes are only accessible to authenticated users with valid tokens from the auth-service.

### Challenge 1: Shared Configuration Between Services

**Issue**: Service-catalog needed to share `JWT_SECRET` and `MONGO_URI` with auth-service while maintaining its own `SERVICE_PORT`.

**Solution**: Implemented dual environment file loading:
```typescript
// Load auth-service .env for shared config
const authServiceEnvPath = path.join(__dirname, "../../../auth-service/.env");
config({ path: authServiceEnvPath });

// Load local .env for service-specific config
const localEnvPath = path.join(__dirname, "../../.env");
config({ path: localEnvPath });
```

**Lessons Learned**:
- Microservices can share configuration while maintaining independence
- Load order matters - later configs override earlier ones
- Use path.join for cross-platform compatibility

---

### Challenge 2: TypeScript Request Type Extension

**Error**:
```
error TS2339: Property 'user' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'
```

**Root Cause**: Express Request interface doesn't include custom properties by default.

**Solution**: Extended Express Request type globally in middleware file:
```typescript
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}
```

**Why in middleware file instead of separate .d.ts?**
- TypeScript type declarations need to be in scope when used
- Placing in middleware ensures it's loaded before use
- Added `typeRoots` to tsconfig.json for additional type definitions

**Lessons Learned**:
- Global type extensions must be in files that are compiled
- Use `declare global` for extending third-party types
- TypeScript requires explicit type definitions for custom properties

---

### Challenge 3: Database Connection Timing Issue

**Error**:
```
Connecting to database...undefined
MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

**Root Cause**: 
- `common/db/connection.ts` imported auth-service config at module load time
- Environment variables weren't loaded yet when config was imported
- Config initialization happened before dotenv.config() execution

**Solution**: Modified `connectDB` to accept URI as parameter:
```typescript
// Before
import config from "../../auth-service/src/config/config";
export const connectDB = async (mongooseInstance: any) => {
    await mongooseInstance.connect(config.MONGO_URI!);
}

// After
export const connectDB = async (mongooseInstance: any, mongoUri: string) => {
    await mongooseInstance.connect(mongoUri);
}
```

**Updated both services**:
```typescript
// service-catalog/src/server.ts
await connectDB(mongoose, config.MONGO_URI as string);

// auth-service/src/server.ts
await connectDB(mongoose, config.MONGO_URI as string);
```

**Lessons Learned**:
- Module-level imports execute before runtime code
- Environment variables must be loaded before config is accessed
- Dependency injection solves initialization order problems
- Shared utilities should accept parameters rather than import configs

---

### Challenge 4: Environment File Corruption

**Issue**: Appending `JWT_SECRET` to service-catalog `.env` corrupted the `MONGO_URI`:
```env
MONGO_URI="mongodb+srv://..."JWT_SECRET="a1a04d6819cd5394312c247d2dc85d55"
```

**Result**: Database name became the entire corrupted string, exceeding MongoDB's 38-byte limit.

**Solution**: 
1. Cleaned up service-catalog `.env` to only contain `SERVICE_PORT`
2. Relied on auth-service `.env` for shared configuration
3. Used proper config loading strategy

**Lessons Learned**:
- Be careful with shell redirection operators (`>>` vs `>`)
- Validate `.env` files after programmatic modifications
- Keep service-specific and shared configs separate

---

### Implementation Summary

**Files Created**:
- `src/config/config.ts` - Dual environment file loading
- `src/middleware/auth.middleware.ts` - JWT verification middleware
- `src/middleware/error.middleware.ts` - Error handling middleware
- `src/middleware/index.ts` - Middleware exports
- `src/utils/ApiError.ts` - Custom error class
- `src/types/express.d.ts` - TypeScript type extensions

**Files Modified**:
- `src/routes/service.routes.ts` - Applied authentication middleware
- `src/server.ts` - Added error handling middleware
- `common/db/connection.ts` - Accepts mongoUri parameter
- `auth-service/src/server.ts` - Passes mongoUri to connectDB

**Authentication Flow**:
1. Client obtains JWT token from auth-service via OTP verification
2. Client includes token in `Authorization: Bearer <token>` header
3. Service-catalog middleware extracts and verifies token
4. Decoded user info attached to `req.user`
5. Request proceeds to controller if valid, returns 401 if invalid

**Test Results**:
- ✅ No token → 401 Unauthorized
- ✅ Invalid token → 401 Unauthorized  
- ✅ Expired token → 401 Unauthorized
- ✅ Valid token → Full CRUD access

---

## 6. RabbitMQ Connection Blocking Server Startup

### Issue
Server hung during startup after database connection, never reaching "Server is running" message.

### Root Cause
RabbitMQ service constructor called `this.init()` immediately:
```typescript
class RabbitMQService {
    constructor() {
        this.init(); // Blocks if RabbitMQ is unavailable
    }
}

export const rabbitMQService = new RabbitMQService(); // Runs at module load time
```

### Solution
1. Removed auto-initialization from constructor
2. Added graceful error handling in server startup:
```typescript
try {
    await rabbitMQService.init();
    console.log("RabbitMQ client initialized");
} catch (rabbitMQError) {
    console.warn("Warning: RabbitMQ connection failed. Server will continue without message queue.");
}
```

### Lessons Learned
- Avoid side effects in constructors, especially async operations
- Make external service connections optional or gracefully degradable
- Server should start even if non-critical services are unavailable
- Use explicit initialization methods instead of constructor-based initialization

---

## Best Practices Established

### 1. Server Startup Sequence
```typescript
const startServer = async () => {
    try {
        // 1. Connect to database first
        await connectDB(mongoose);
        
        // 2. Start HTTP server
        server = app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
        
        // 3. Initialize optional services (with error handling)
        try {
            await rabbitMQService.init();
        } catch (err) {
            console.warn("Optional service failed:", err);
        }
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};
```

### 2. Error Response Pattern
```typescript
try {
    // Business logic
    return res.status(200).json({
        status: 200,
        message: "Success",
        data: result
    });
} catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        status: statusCode,
        message: error.message
    });
}
```

### 3. Dependency Injection for Shared Libraries
```typescript
// Shared library accepts dependencies
export const sharedFunction = (dependency: any) => {
    // Use injected dependency
};

// Services inject their local dependencies
import localDependency from "local-package";
sharedFunction(localDependency);
```

---

## Tools & Commands Used for Debugging

### Check for Duplicate Dependencies
```bash
npm ls mongoose
```

### Find Running Processes
```bash
ps aux | grep "ts-node"
lsof -i :8081
```

### Kill Stale Processes
```bash
pkill -f "ts-node src/server.ts"
```

### Test MongoDB Connection
```bash
node test-db-connection.js
```

### Test API Endpoints
```bash
curl -X POST http://localhost:3001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## Future Improvements

1. **Implement Proper Monorepo Structure**
   - Use Lerna, Nx, or Turborepo
   - Centralize shared dependencies
   - Implement workspace-based dependency management

2. **Add Comprehensive Testing**
   - Unit tests for models and services
   - Integration tests for API endpoints
   - Mock external services (MongoDB, RabbitMQ, SMTP)

3. **Improve Error Handling**
   - Centralized error handling middleware
   - Custom error classes for different error types
   - Structured logging with correlation IDs

4. **Add Health Checks**
   - `/health` endpoint for service monitoring
   - Database connection health check
   - External service availability checks

5. **Environment-Specific Configuration**
   - Separate configs for dev, staging, production
   - Validate environment variables on startup
   - Use configuration management tools

---

*Last Updated: December 10, 2025*

---

## 7. Frontend Integration & CORS

### Challenge
Connecting the React (Vite) frontend with multiple backend microservices running on different ports, while handling Cross-Origin Resource Sharing (CORS) and maintaining secure authentication state.

### Issue
Browser blocked requests from `http://localhost:5173` (Frontend) to `http://localhost:3001` (Auth) and `http://localhost:3002` (Service Catalog) due to CORS policy.
```
Access to fetch at 'http://localhost:3001/api/v1/auth/verify-otp' from origin 'http://localhost:5173' has been blocked by CORS policy.
```

### Solution
1. **Backend Configuration**:
   Enabled CORS in both `auth-service` and `service-catalog` with specific origin and credentials support.

   ```typescript
   // server.ts (in both services)
   import cors from "cors";
   
   app.use(cors({
       origin: process.env.NEXOM_FRONTEND_URL || "http://localhost:5173",
       credentials: true // Important for cookies/sessions if used
   }));
   ```

2. **Frontend Environment Variables**:
   Configured dynamic base URLs for API calls using Vite's environment variables.
   ```typescript
   // client/.env
   VITE_AUTH_SERVICE_URL=http://localhost:3001/api/v1/auth
   VITE_SERVICE_CATALOG_URL=http://localhost:3002/api/v1
   ```

### UI Implementation
**Challenge**: Creating a premium, engaging "Home" page that stands out.
**Solution**: Implemented a "Circular Floating Card" animation using CSS transforms and keyframes to showcase service categories (Cleaning, Plumbing, etc.) in a rotating orbit around a central hero text.

### Lessons Learned
- Always configure CORS with specific origins in production; `*` is unsafe.
- Use environment variables for all API endpoints to switch easily between dev/prod.
- Visual aesthetics (animations) significantly improve perceived application quality.

---

## 8. Service Catalog Transformation (Home Cleaning)

### Challenge
Transforming a generic "Service Catalog" into a specialized "Home Cleaning Services" platform requiring specific data structures (property types, room counts) and advanced filtering.

### Changes Required
1. **Data Modeling**:
   - Created `Category` model for Property Types (Apartment, Villa) and Service Types (Deep Cleaning, Move-in).
   - Extended `Service` model with cleaning-specific fields: `propertyType`, `numberOfRooms`, `numberOfBathrooms`, `areaSize`.

2. **Advanced Filtering**:
   - Implemented complex query building in `ServiceService` to filter by multiple criteria simultaneously.

### Implementation Highlights

**Service Model Extension**:
```typescript
const ServiceSchema = new Schema({
    // ... basic fields
    propertyType: { type: Schema.Types.ObjectId, ref: 'Category' },
    serviceType: { type: Schema.Types.ObjectId, ref: 'Category' },
    specifications: {
        numberOfRooms: Number,
        numberOfBathrooms: Number,
        areaSize: Number, // in sq ft
        furnished: Boolean
    }
});
```

**Filtering Logic**:
```typescript
// service.service.ts
const filter: any = {};
if (query.propertyType) filter.propertyType = query.propertyType;
if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
}
```

### Lessons Learned
- Domain-specific requirements often necessitate schema denormalization or specific field extensions.
- Building flexible filtering logic early saves time as requirements grow.
- Separating "Categories" into their own model allows for dynamic frontend dropdowns without code changes.
