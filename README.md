# OPPA — Premium Streetwear E-Commerce (MERN Stack)

## Quick Start

### 1. Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (or a MongoDB Atlas URI)
- (Optional) Stripe & Cloudinary accounts for payments/images

### 2. Configure Environment
Edit `backend/.env` and set your real values:
```
MONGO_URI=mongodb://localhost:27017/oppa   # or Atlas URI
JWT_SECRET=your_strong_random_secret
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
```

### 3. Seed the Database
```bash
cd backend
npm run seed
```
This creates:
- **Admin:** admin@oppa.com / admin123
- **Customer:** customer@oppa.com / customer123
- 10 sample products & 2 coupons (OPPA10, WELCOME20)

### 4. Start the App
Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 5. Open in Browser
Visit **http://localhost:5173**

### Project Structure
```
backend/          Express API + MongoDB
  config/         Database & Cloudinary config
  controllers/    Route handlers
  middleware/     Auth, error handling, rate limiting
  models/         Mongoose schemas
  routes/         API routes
  seed.js         Database seeder

frontend/         React + Vite
  src/
    components/   Reusable UI components
    pages/        Customer & Admin pages
    store/        Redux Toolkit slices
    utils/        API client & helpers
```

### API Endpoints
| Resource   | Base Path        | Auth       |
|------------|------------------|------------|
| Auth       | /api/auth        | Public     |
| Products   | /api/products    | Public/Admin |
| Orders     | /api/orders      | Protected  |
| Users      | /api/users       | Admin      |
| Payments   | /api/payments    | Protected  |
| Coupons    | /api/coupons     | Protected/Admin |

### Admin Panel
Navigate to **/admin** after logging in with the admin account.
