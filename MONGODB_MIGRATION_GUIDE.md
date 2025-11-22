# StockMaster MongoDB Atlas Migration Guide

## Overview

This guide will help you migrate the StockMaster application from Supabase (PostgreSQL) to MongoDB Atlas.

## Prerequisites

1. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
2. Node.js installed (v16 or higher)
3. npm or pnpm package manager

## Step 1: Set Up MongoDB Atlas

### Create a MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas and sign up or log in
2. Click "Build a Database"
3. Choose the FREE tier (M0 Sandbox)
4. Select your preferred cloud provider and region
5. Click "Create Cluster"

### Configure Database Access

1. In the Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (save these!)
5. Set user privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Configure Network Access

1. Go to "Network Access" in the Atlas dashboard
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add your specific IP addresses
5. Click "Confirm"

### Get Connection String

1. Go to "Database" in the Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database user password
6. Add database name: `mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority`

## Step 2: Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

This will install:
- express: Web framework
- mongoose: MongoDB ODM
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing

## Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your MongoDB Atlas connection string:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/stockmaster?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Important Security Notes:**
- Change `JWT_SECRET` to a random, secure string
- Never commit the `.env` file to version control
- Use strong passwords for MongoDB users

## Step 4: Start the Backend Server

From the `server` directory:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on http://localhost:5000

You should see:
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

## Step 5: Update Frontend Configuration

Update the frontend to use the new MongoDB backend API.

Create or update `.env` in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 6: Test the API

Test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "StockMaster API is running"
}
```

## Step 7: Create Initial Admin User

Register the first user (will automatically be assigned admin role):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@stockmaster.com",
    "password": "Admin@123",
    "nickname": "System Administrator"
  }'
```

Save the returned token for authenticated requests.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (manager/admin only)
- `PUT /api/products/:id` - Update product (manager/admin only)
- `DELETE /api/products/:id` - Delete product (manager/admin only)
- `GET /api/products/low-stock` - Get low stock products

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create warehouse (manager/admin only)
- `PUT /api/warehouses/:id` - Update warehouse (manager/admin only)
- `DELETE /api/warehouses/:id` - Delete warehouse (manager/admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (manager/admin only)
- `PUT /api/categories/:id` - Update category (manager/admin only)
- `DELETE /api/categories/:id` - Delete category (manager/admin only)

### Stock Operations
- `GET /api/stock/ledger` - Get stock ledger entries
- `POST /api/stock/receipt` - Record stock receipt
- `POST /api/stock/delivery` - Record stock delivery
- `POST /api/stock/adjustment` - Record stock adjustment
- `GET /api/stock/dashboard` - Get dashboard statistics

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Example authenticated request:

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Database Schema

### Users Collection
- username (unique)
- email (unique)
- password (hashed)
- phone
- nickname
- role (admin, inventory_manager, warehouse_staff)
- is_active
- timestamps

### Products Collection
- name
- sku (unique)
- category (reference to Category)
- unit_of_measure
- initial_stock
- current_stock
- min_stock_level
- is_active
- timestamps

### Categories Collection
- name (unique)
- description
- timestamps

### Warehouses Collection
- name (unique)
- location
- is_active
- timestamps

### StockLedger Collection
- product (reference to Product)
- warehouse (reference to Warehouse)
- operation_type (receipt, delivery, transfer_in, transfer_out, adjustment)
- operation_number
- quantity_change
- stock_before
- stock_after
- user (reference to User)
- timestamps

## Troubleshooting

### Connection Issues

**Error: "MongooseServerSelectionError"**
- Check your MongoDB Atlas connection string
- Verify your IP address is whitelisted in Network Access
- Ensure your database user credentials are correct

**Error: "Authentication failed"**
- Verify the username and password in your connection string
- Check that the database user has proper permissions

### Port Already in Use

If port 5000 is already in use:
1. Change the PORT in `.env` file
2. Update frontend API URL accordingly

### CORS Issues

If you encounter CORS errors:
- Ensure the backend CORS middleware is properly configured
- Check that the frontend is making requests to the correct API URL

## Production Deployment

### Backend Deployment (Recommended: Railway, Render, or Heroku)

1. **Railway.app** (Recommended):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   cd server
   railway login
   railway init
   railway up
   ```

2. **Render.com**:
   - Connect your GitHub repository
   - Create a new Web Service
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Add environment variables from `.env`

3. **Heroku**:
   ```bash
   cd server
   heroku create stockmaster-api
   heroku config:set MONGODB_URI="your_connection_string"
   heroku config:set JWT_SECRET="your_secret"
   git push heroku main
   ```

### Frontend Deployment

Update `.env` with production API URL:

```env
VITE_API_URL=https://your-backend-url.com/api
```

Deploy frontend to Vercel, Netlify, or any static hosting service.

### Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use strong MongoDB user passwords
- [ ] Restrict MongoDB Network Access to specific IPs in production
- [ ] Enable MongoDB Atlas backup
- [ ] Use HTTPS for all API requests
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Enable MongoDB Atlas monitoring and alerts

## Data Migration from Supabase

If you have existing data in Supabase:

1. Export data from Supabase using their dashboard or API
2. Transform data to match MongoDB schema
3. Use MongoDB Compass or mongoimport to import data
4. Verify data integrity after import

## Support

For issues or questions:
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/docs/
- Express.js Documentation: https://expressjs.com/

## Next Steps

1. Implement frontend API client to connect to MongoDB backend
2. Add data validation and error handling
3. Implement file upload for product images
4. Add email notifications for low stock alerts
5. Implement advanced reporting and analytics
6. Add export functionality (CSV, PDF)
7. Implement real-time updates using WebSockets

## License

MIT License - See LICENSE file for details
