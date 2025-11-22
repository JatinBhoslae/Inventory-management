# StockMaster API Reference

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890",
  "nickname": "John"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "warehouse_staff",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** First registered user automatically becomes admin.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "warehouse_staff",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "nickname": "John",
  "role": "warehouse_staff",
  "is_active": true,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "Johnny",
  "phone": "+1234567890",
  "password": "NewPassword123"
}
```

## Products

### Get All Products
```http
GET /products
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Widget A",
    "sku": "WDG-001",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Electronics"
    },
    "unit_of_measure": "pcs",
    "initial_stock": 100,
    "current_stock": 85,
    "min_stock_level": 20,
    "is_active": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### Get Product by ID
```http
GET /products/:id
Authorization: Bearer <token>
```

### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Widget B",
  "sku": "WDG-002",
  "category": "507f1f77bcf86cd799439012",
  "unit_of_measure": "pcs",
  "initial_stock": 50,
  "min_stock_level": 10
}
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Widget B Updated",
  "min_stock_level": 15
}
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Get Low Stock Products
```http
GET /products/low-stock
Authorization: Bearer <token>
```

Returns products where `current_stock <= min_stock_level`.

## Categories

### Get All Categories
```http
GET /categories
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Electronics",
    "description": "Electronic components and devices",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Hardware",
  "description": "Hardware components"
}
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Update Category
```http
PUT /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Hardware Updated",
  "description": "Updated description"
}
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

**Permissions:** Requires `inventory_manager` or `admin` role.

## Warehouses

### Get All Warehouses
```http
GET /warehouses
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Main Warehouse",
    "location": "Building A, Floor 1",
    "is_active": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### Create Warehouse
```http
POST /warehouses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Secondary Warehouse",
  "location": "Building B, Floor 2"
}
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Update Warehouse
```http
PUT /warehouses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Secondary Warehouse Updated",
  "location": "Building B, Floor 3"
}
```

**Permissions:** Requires `inventory_manager` or `admin` role.

### Delete Warehouse
```http
DELETE /warehouses/:id
Authorization: Bearer <token>
```

**Permissions:** Requires `inventory_manager` or `admin` role.

## Stock Operations

### Get Stock Ledger
```http
GET /stock/ledger?product=<product_id>&warehouse=<warehouse_id>&operation_type=receipt&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `product` (optional): Filter by product ID
- `warehouse` (optional): Filter by warehouse ID
- `operation_type` (optional): Filter by operation type (receipt, delivery, transfer_in, transfer_out, adjustment)
- `limit` (optional): Number of records to return (default: 100)

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "product": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Widget A",
      "sku": "WDG-001"
    },
    "warehouse": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Main Warehouse"
    },
    "operation_type": "receipt",
    "operation_number": "RCP-001",
    "quantity_change": 50,
    "stock_before": 85,
    "stock_after": 135,
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "john_doe"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### Record Receipt
```http
POST /stock/receipt
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "507f1f77bcf86cd799439011",
  "warehouse_id": "507f1f77bcf86cd799439013",
  "quantity": 50,
  "operation_number": "RCP-001"
}
```

**Response:**
```json
{
  "message": "Receipt recorded successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "current_stock": 135
  }
}
```

### Record Delivery
```http
POST /stock/delivery
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "507f1f77bcf86cd799439011",
  "warehouse_id": "507f1f77bcf86cd799439013",
  "quantity": 25,
  "operation_number": "DEL-001"
}
```

**Response:**
```json
{
  "message": "Delivery recorded successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "current_stock": 110
  }
}
```

**Error Response (Insufficient Stock):**
```json
{
  "message": "Insufficient stock"
}
```

### Record Stock Adjustment
```http
POST /stock/adjustment
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "507f1f77bcf86cd799439011",
  "warehouse_id": "507f1f77bcf86cd799439013",
  "new_quantity": 100,
  "operation_number": "ADJ-001",
  "reason": "Physical count correction"
}
```

**Response:**
```json
{
  "message": "Stock adjustment recorded successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "current_stock": 100
  }
}
```

### Get Dashboard Statistics
```http
GET /stock/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalProducts": 150,
  "lowStockCount": 12,
  "recentReceipts": 25,
  "recentDeliveries": 18
}
```

**Note:** Recent receipts and deliveries count operations from the last 7 days.

## Error Responses

### 400 Bad Request
```json
{
  "message": "Product with this SKU already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message details"
}
```

## User Roles

- **admin**: Full access to all endpoints
- **inventory_manager**: Can manage products, categories, warehouses, and perform stock operations
- **warehouse_staff**: Can view data and perform stock operations, but cannot create/update/delete master data

## Rate Limiting

Currently not implemented. Consider adding rate limiting in production.

## Pagination

Currently not implemented for list endpoints. All endpoints return full result sets. Consider implementing pagination for large datasets.

## Testing with cURL

### Example: Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"Admin@123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Save the token from response
TOKEN="your_token_here"

# Get products
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## WebSocket Support

Not currently implemented. Consider adding Socket.io for real-time updates in future versions.
