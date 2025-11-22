# Getting Started with JSHS StockMaster

## Welcome! 👋

Welcome to JSHS StockMaster, your modern inventory management solution. This guide will help you get started quickly.

## What is JSHS StockMaster?

JSHS StockMaster is a comprehensive inventory management system that helps you:
- Track products across multiple warehouses
- Manage stock receipts and deliveries
- Monitor inventory levels in real-time
- Generate comprehensive reports
- Maintain complete audit trails

## Quick Navigation

### 🏠 Landing Page
When you first visit the application, you'll see the landing page at:
```
https://your-domain.com/
```

The landing page showcases:
- Key features and benefits
- System statistics
- Call-to-action buttons to get started

### 🔐 Sign In / Sign Up
Click the **"Get Started"** or **"Sign In"** button to access the login page:
```
https://your-domain.com/login
```

**First Time Users**:
1. Click "Don't have an account? Sign up"
2. Enter a username (letters, numbers, underscore only)
3. Enter a password
4. Click "Sign Up"
5. The first user becomes the admin automatically!

**Returning Users**:
1. Enter your username
2. Enter your password
3. Click "Sign In"

### 📊 Dashboard
After logging in, you'll be redirected to the dashboard:
```
https://your-domain.com/dashboard
```

The dashboard shows:
- Total products count
- Low stock alerts
- Pending receipts
- Pending deliveries
- Recent stock movements

## Main Features

### 1. Products Management
**Location**: Navigation menu → Products

**What you can do**:
- Add new products with SKU, name, category
- Set initial stock levels
- Edit product information
- View all products in a table
- Filter and search products

**How to add a product**:
1. Click "Add Product" button
2. Fill in product details
3. Click "Save"

### 2. Stock Receipts
**Location**: Navigation menu → Receipts

**What you can do**:
- Record incoming stock from suppliers
- Create receipt documents
- Validate receipts to increase stock
- Track receipt status (Draft/Done)

**How to create a receipt**:
1. Click "Create Receipt"
2. Select supplier
3. Add products and quantities
4. Save as draft or validate immediately

### 3. Deliveries
**Location**: Navigation menu → Deliveries

**What you can do**:
- Create delivery orders for customers
- Pick and pack items
- Validate deliveries to decrease stock
- Track delivery status

**How to create a delivery**:
1. Click "Create Delivery"
2. Select customer
3. Add products and quantities
4. Save as draft or validate immediately

### 4. Internal Transfers
**Location**: Navigation menu → Transfers

**What you can do**:
- Move stock between warehouses
- Transfer items between locations
- Track all transfers
- Maintain location accuracy

**How to create a transfer**:
1. Click "Create Transfer"
2. Select source and destination
3. Add products and quantities
4. Validate to complete transfer

### 5. Stock Adjustments
**Location**: Navigation menu → Adjustments

**What you can do**:
- Correct stock discrepancies
- Record physical count differences
- Document reasons for adjustments
- Update system to match reality

**How to create an adjustment**:
1. Click "Create Adjustment"
2. Select product
3. Enter actual quantity
4. Add reason for adjustment
5. Validate to update stock

### 6. Stock Ledger
**Location**: Navigation menu → Stock Ledger

**What you can do**:
- View complete history of stock movements
- Filter by product, operation type, date
- Track who made changes and when
- Generate audit reports

## User Interface Features

### 🌓 Dark/Light Mode
Switch between dark and light themes:

**When logged in**:
- Look for the sun/moon icon in the header
- Click to open theme menu
- Choose: Light, Dark, or System

**On login page**:
- Look for the sun/moon icon in top-right corner
- Click to change theme

Your preference is saved automatically!

### 📱 Responsive Design
JSHS StockMaster works on:
- Desktop computers
- Laptops
- Tablets
- Mobile phones

The interface adapts to your screen size automatically.

### 🔍 Search and Filter
Most pages include:
- Search boxes to find items quickly
- Filter dropdowns to narrow results
- Sort options to organize data

## User Roles

### Admin
**Permissions**: Full access to everything
- Manage all products
- Create/edit/delete all operations
- View all reports
- Manage users (if user management is added)

**Note**: The first user to register becomes the admin automatically.

### Inventory Manager
**Permissions**: Operational access
- Manage products
- Create and validate operations
- View reports
- Monitor stock levels

### Warehouse Staff
**Permissions**: Basic operations
- View products
- Create operations (receipts, deliveries)
- Execute transfers
- Record adjustments

## Tips for Success

### 1. Start with Products
Before doing anything else:
1. Add your products to the system
2. Set initial stock levels
3. Organize by categories

### 2. Use Categories
Organize products into categories:
- Electronics
- Furniture
- Raw Materials
- Finished Goods
- etc.

### 3. Set Low Stock Alerts
For each product, set a minimum stock level:
- System will alert you when stock is low
- Helps prevent stockouts
- Enables proactive reordering

### 4. Validate Operations Promptly
- Draft operations don't affect stock
- Validate receipts to increase stock
- Validate deliveries to decrease stock
- Keep drafts to a minimum

### 5. Regular Stock Checks
- Perform physical counts regularly
- Use adjustments to correct discrepancies
- Document reasons for adjustments
- Maintain accuracy

### 6. Review Stock Ledger
- Check ledger regularly for unusual patterns
- Verify all movements are legitimate
- Use for audit and compliance
- Track user actions

## Common Workflows

### Receiving Stock from Supplier
1. Go to Receipts
2. Click "Create Receipt"
3. Select supplier
4. Add products and quantities received
5. Validate receipt
6. Stock automatically increases

### Shipping to Customer
1. Go to Deliveries
2. Click "Create Delivery"
3. Select customer
4. Add products and quantities to ship
5. Validate delivery
6. Stock automatically decreases

### Moving Stock Between Warehouses
1. Go to Transfers
2. Click "Create Transfer"
3. Select source warehouse
4. Select destination warehouse
5. Add products and quantities
6. Validate transfer
7. Location updated, total stock unchanged

### Correcting Stock Errors
1. Go to Adjustments
2. Click "Create Adjustment"
3. Select product
4. Enter correct quantity
5. Add reason (e.g., "Physical count correction")
6. Validate adjustment
7. Stock updated to correct amount

## Keyboard Shortcuts

### Navigation
- `Tab` - Move to next field
- `Shift + Tab` - Move to previous field
- `Enter` - Submit form / Confirm action
- `Esc` - Close dialog / Cancel action

### Forms
- `Ctrl/Cmd + S` - Save (if implemented)
- `Ctrl/Cmd + Enter` - Submit form (if implemented)

## Troubleshooting

### Can't Log In
**Problem**: Login fails

**Solutions**:
1. Check username is correct (no spaces)
2. Check password is correct
3. Try registering if you're a new user
4. Clear browser cache and try again

### Stock Not Updating
**Problem**: Stock levels don't change

**Solutions**:
1. Make sure you validated the operation (not just saved as draft)
2. Check the operation status is "Done"
3. Refresh the page
4. Check Stock Ledger for the movement

### Page Not Loading
**Problem**: Page shows error or doesn't load

**Solutions**:
1. Refresh the page (F5)
2. Clear browser cache
3. Try a different browser
4. Check internet connection

### Theme Not Changing
**Problem**: Dark/light mode doesn't switch

**Solutions**:
1. Click the theme toggle again
2. Try selecting a different theme option
3. Refresh the page
4. Clear browser cache

## Getting Help

### Documentation
- `README.md` - Technical overview
- `QUICK_START.md` - Quick reference
- `LANDING_PAGE_GUIDE.md` - Landing page details
- `DARK_MODE_FEATURE.md` - Theme switching guide

### Support
For technical issues:
1. Check this documentation
2. Review error messages
3. Check browser console (F12)
4. Contact your system administrator

## Best Practices

### Data Entry
- ✅ Use consistent naming conventions
- ✅ Fill in all required fields
- ✅ Double-check quantities before validating
- ✅ Add notes/descriptions for clarity

### Stock Management
- ✅ Validate operations promptly
- ✅ Perform regular physical counts
- ✅ Investigate discrepancies immediately
- ✅ Keep low stock alerts updated

### Security
- ✅ Use strong passwords
- ✅ Log out when finished
- ✅ Don't share login credentials
- ✅ Report suspicious activity

### Performance
- ✅ Close unused tabs
- ✅ Clear browser cache periodically
- ✅ Use latest browser version
- ✅ Maintain stable internet connection

## Next Steps

Now that you're familiar with the basics:

1. **Explore the Dashboard**
   - Familiarize yourself with the KPIs
   - Check out the navigation menu

2. **Add Your First Product**
   - Go to Products
   - Click "Add Product"
   - Fill in the details

3. **Create Your First Operation**
   - Try creating a receipt
   - Practice the workflow
   - Validate and see stock update

4. **Customize Your Experience**
   - Set your preferred theme
   - Organize products by category
   - Set up low stock alerts

5. **Review the Stock Ledger**
   - See your operations logged
   - Understand the audit trail
   - Verify everything is tracked

## Welcome to JSHS StockMaster!

You're now ready to start managing your inventory efficiently. If you have any questions, refer back to this guide or explore the other documentation files.

Happy inventory managing! 📦

---

**Last Updated**: 2025-01-22  
**Version**: 1.0.0  
**Brand**: JSHS  
**Product**: StockMaster
