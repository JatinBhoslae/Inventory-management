# StockMaster Backend Server

Express.js + MongoDB backend for StockMaster Inventory Management System.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your MongoDB Atlas credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation.

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Product.js        # Product model
│   │   ├── Category.js       # Category model
│   │   ├── Warehouse.js      # Warehouse model
│   │   └── StockLedger.js    # Stock ledger model
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── productRoutes.js  # Product routes
│   │   ├── categoryRoutes.js # Category routes
│   │   ├── warehouseRoutes.js# Warehouse routes
│   │   └── stockRoutes.js    # Stock operation routes
│   ├── controllers/
│   │   ├── authController.js # Auth logic
│   │   └── productController.js # Product logic
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   └── server.js             # Express app entry point
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── API_REFERENCE.md          # API documentation
└── README.md                 # This file
```

## Features

- JWT-based authentication
- Role-based access control (admin, inventory_manager, warehouse_staff)
- RESTful API design
- MongoDB with Mongoose ODM
- Password hashing with bcrypt
- CORS enabled
- Error handling middleware

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development, production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret key for JWT | random_secure_string |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing

## Development Dependencies

- **nodemon**: Auto-reload during development

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- CORS is enabled for all origins (configure for production)
- Environment variables for sensitive data

## Testing

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

## Deployment

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables

### Heroku

```bash
cd server
heroku create stockmaster-api
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set JWT_SECRET="your_secret"
git push heroku main
```

## Troubleshooting

### MongoDB Connection Issues

1. Check connection string format
2. Verify IP whitelist in MongoDB Atlas
3. Ensure database user has correct permissions

### Port Already in Use

Change PORT in `.env` file or kill the process:
```bash
lsof -ti:5000 | xargs kill -9
```

### CORS Errors

Update CORS configuration in `server.js` to allow specific origins:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## License

MIT
