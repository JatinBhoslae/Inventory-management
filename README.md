# StockMaster Inventory Management System

## Overview

StockMaster is a comprehensive, real-time inventory management system designed to replace manual registers and Excel-based tracking methods. The application digitizes and streamlines all stock-related operations across multiple warehouses, providing automated stock tracking, movement logging, and real-time visibility into inventory levels.

## Features

### Core Functionality
- **Dashboard Control Center**: Real-time KPIs including total products, low stock alerts, pending receipts, and pending deliveries
- **Product Management**: Complete CRUD operations for product catalog with SKU tracking, categories, and stock levels
- **Stock Operations**:
  - **Receipts**: Manage incoming stock from suppliers
  - **Deliveries**: Handle outgoing stock to customers
  - **Internal Transfers**: Move stock between warehouses
  - **Stock Adjustments**: Correct discrepancies and physical count differences
- **Stock Ledger**: Comprehensive audit trail of all stock movements
- **Low Stock Alerts**: Automatic notifications when items reach minimum threshold
- **Multi-Warehouse Support**: Manage inventory across multiple physical locations

### User Roles
- **Admin**: Full system access (first registered user becomes admin)
- **Inventory Manager**: Oversee operations and make strategic decisions
- **Warehouse Staff**: Execute physical operations

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend Options**: 
  - **Option 1**: Supabase (PostgreSQL + Authentication) - Currently configured
  - **Option 2**: MongoDB Atlas + Express.js - Available (see MONGODB_MIGRATION_GUIDE.md)
- **State Management**: React Context + Hooks
- **Routing**: React Router v6

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components (Header, etc.)
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts (Auth)
│   ├── db/
│   │   ├── supabase.ts    # Supabase client
│   │   └── api.ts         # Database API functions
│   ├── lib/
│   │   └── api-client.ts  # MongoDB API client (for MongoDB option)
│   ├── pages/             # Application pages
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   ├── routes.tsx         # Route configuration
│   └── App.tsx            # Main application component
├── server/                # MongoDB Express.js backend (optional)
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── config/        # Database configuration
│   │   └── server.js      # Express server
│   └── package.json
├── supabase/
│   └── migrations/        # Database migrations (for Supabase)
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- **For Supabase Option**: Supabase account (currently configured)
- **For MongoDB Option**: MongoDB Atlas account (see MONGODB_MIGRATION_GUIDE.md)

### Environment Setup

1. **Clone or extract the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   The `.env` file is already configured with Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://vbqqbvithnalykkehkro.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   VITE_APP_ID=app-7q5l3ibtv7cx
   VITE_LOGIN_TYPE=gmail
   ```

### Local Development

1. **Start the development server**
   ```bash
   npm run dev -- --host 127.0.0.1
   ```
   
   Or alternatively:
   ```bash
   npx vite --host 127.0.0.1
   ```

2. **Access the application**
   
   Open your browser and navigate to `http://127.0.0.1:5173`

3. **First-time setup**
   - Register a new account (first user becomes admin automatically)
   - Start adding products, warehouses, suppliers, and customers
   - Begin tracking your inventory operations

### Database Setup

The database schema is already deployed to Supabase. The migration includes:

- User profiles with role-based access control
- Warehouses, categories, products
- Suppliers and customers
- Stock operation tables (receipts, deliveries, transfers, adjustments)
- Stock ledger for audit trail
- Low stock alerts view

## User Guide

### Getting Started

1. **Login/Register**
   - Navigate to the login page
   - Register with a username and password
   - The first registered user automatically becomes an admin

2. **Dashboard**
   - View key performance indicators
   - Monitor low stock alerts
   - Access quick actions for common operations

3. **Product Management**
   - Add products with SKU, category, unit of measure
   - Set initial stock and minimum stock levels
   - Track current stock levels in real-time

4. **Stock Operations**
   - **Receipts**: Record incoming stock from suppliers
   - **Deliveries**: Create delivery orders for customers
   - **Transfers**: Move stock between warehouses
   - **Adjustments**: Correct stock discrepancies

5. **Stock Ledger**
   - View complete history of all stock movements
   - Track changes with before/after quantities
   - Audit trail for compliance

## Development

### Code Quality

Run linting:
```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

### Frontend Deployment

The application can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

### Database

The application supports two backend options:

#### Option 1: Supabase (Currently Configured)
- Database: PostgreSQL
- Authentication: Supabase Auth
- Real-time subscriptions: Available but not currently implemented

#### Option 2: MongoDB Atlas + Express.js
- Database: MongoDB Atlas
- Authentication: JWT-based
- Complete REST API with Express.js
- See **MONGODB_MIGRATION_GUIDE.md** for detailed setup instructions

To migrate to MongoDB:
1. Follow the instructions in `MONGODB_MIGRATION_GUIDE.md`
2. Set up MongoDB Atlas cluster
3. Install server dependencies: `cd server && npm install`
4. Configure environment variables
5. Start the backend server: `npm start`
6. Update frontend to use MongoDB API client

## Security

- Username/password authentication with automatic email suffix
- Row Level Security (RLS) on sensitive tables
- Role-based access control
- First user becomes admin automatically
- Secure session management

## Design System

- **Primary Color**: Professional Blue (#2563EB / hsl(217 91% 60%))
- **Success Color**: Green (#10B981 / hsl(142 71% 45%))
- **Destructive Color**: Red (#EF4444 / hsl(0 84% 60%))
- **Typography**: System font stack
- **Components**: shadcn/ui with Tailwind CSS
- **Responsive**: Desktop-first with mobile adaptation

## Future Enhancements

Potential features for future development:
- Barcode scanning integration
- Advanced reporting and analytics
- Export functionality (PDF, Excel, CSV)
- Email notifications for low stock
- Multi-currency support
- Batch operations
- Advanced filtering and search
- Real-time collaboration features
- Mobile app (React Native)

## Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Consult Supabase documentation for backend issues
4. Review shadcn/ui documentation for UI components

## License

This project is proprietary software. All rights reserved.

## Credits

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**StockMaster** - Streamline Your Inventory Management
