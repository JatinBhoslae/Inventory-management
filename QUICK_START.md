# StockMaster Quick Start Guide

## 🎯 What's New

### ✅ Bug Fixed
- **Product Creation Error**: Fixed the "Failed to save product" error when adding new products without a category

### 🚀 New Features
- **MongoDB Atlas Support**: Complete Express.js + MongoDB backend as an alternative to Supabase
  - Full REST API with JWT authentication
  - Role-based access control
  - Comprehensive documentation
- **Dark/Light Mode Toggle**: Switch between dark and light themes with system preference support
  - Available in header for logged-in users
  - Available on login page for all users
  - Persists preference in localStorage

## 📋 Choose Your Backend

### Option 1: Continue with Supabase (Current Setup)

**No changes needed!** Your application works exactly as before.

```bash
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Option 2: Migrate to MongoDB Atlas (New)

**Follow these steps:**

1. **Read the Migration Guide**
   ```bash
   # Open MONGODB_MIGRATION_GUIDE.md
   ```

2. **Set Up MongoDB Atlas**
   - Create free account at https://www.mongodb.com/cloud/atlas
   - Create a cluster (free M0 tier)
   - Get connection string

3. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure Environment**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB credentials
   ```

5. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server runs on: `http://localhost:5000`

6. **Update Frontend Config**
   ```bash
   # In root directory, create/update .env
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

7. **Start Frontend**
   ```bash
   npm run dev
   ```
   Access at: `http://localhost:5173`

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `README.md` | Main project documentation |
| `MONGODB_MIGRATION_GUIDE.md` | Complete MongoDB setup guide |
| `CHANGES_SUMMARY.md` | Detailed changes and technical info |
| `server/README.md` | Backend server setup |
| `server/API_REFERENCE.md` | Complete API documentation |

## 🔧 Quick Commands

### Supabase Backend (Current)
```bash
# Install and run
npm install
npm run dev

# Lint
npm run lint

# Build
npm run build
```

### MongoDB Backend (New)
```bash
# Backend
cd server
npm install
npm start          # Production
npm run dev        # Development with auto-reload

# Frontend
npm install
npm run dev
```

## 🧪 Testing

### Test Supabase Backend
```bash
npm run dev
# Open http://localhost:5173
# Register and test product creation
```

### Test MongoDB Backend
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Test health endpoint
curl http://localhost:5000/api/health

# Terminal 3: Start frontend
npm run dev

# Open http://localhost:5173
```

## 🎓 First Time Setup

### With Supabase (Current)
1. Start the app: `npm run dev`
2. Register a new account (first user becomes admin)
3. Start adding products, warehouses, and categories

### With MongoDB
1. Follow "Option 2" steps above
2. Register via API or frontend (first user becomes admin)
3. Start using the application

## 🔐 Default Admin Setup

**First registered user automatically becomes admin!**

Example registration:
```bash
# Via API (MongoDB)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@stockmaster.com",
    "password": "Admin@123",
    "nickname": "System Administrator"
  }'

# Or via frontend (both backends)
# Just register through the UI
```

## 🆘 Troubleshooting

### Product Creation Still Failing?
- Clear browser cache and reload
- Check browser console for errors
- Verify database connection

### MongoDB Connection Issues?
- Check MongoDB Atlas IP whitelist
- Verify connection string in `.env`
- Ensure database user has correct permissions

### Port Already in Use?
```bash
# Change port in server/.env
PORT=5001

# Or kill process
lsof -ti:5000 | xargs kill -9
```

## 📞 Need Help?

1. Check the relevant documentation file
2. Review error messages in console
3. Verify environment variables
4. Check MongoDB Atlas dashboard (if using MongoDB)
5. Review API_REFERENCE.md for endpoint details

## 🎉 You're Ready!

Choose your backend option and start managing your inventory with StockMaster!

---

**Quick Links:**
- 📖 [Main README](./README.md)
- 🔄 [MongoDB Migration Guide](./MONGODB_MIGRATION_GUIDE.md)
- 📝 [Changes Summary](./CHANGES_SUMMARY.md)
- 🔌 [API Reference](./server/API_REFERENCE.md)
