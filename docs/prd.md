# StockMaster Inventory Management System Requirements Document

## 1. Application Overview

### 1.1 Application Name
StockMaster

### 1.2 Application Description
StockMaster is a centralized, real-time inventory management system designed to replace manual registers and Excel-based tracking methods. The application digitizes and streamlines all stock-related operations across multiple warehouses, providing automated stock tracking, movement logging, and real-time visibility into inventory levels.

### 1.3 Technology Stack
- **Frontend:** React
- **Backend:** Express.js (ES Module syntax)
- **Database:** MongoDB Atlas
\n## 2. Target Users\n
### 2.1 Inventory Managers
Oversee overall inventory operations, manage incoming and outgoing stock, monitor KPIs, and make strategic decisions based on stock levels and movement patterns.
\n### 2.2 Warehouse Staff
Execute physical operations including picking, shelving, counting, and transferring items between locations.

## 3. Core Functional Modules

### 3.1 Authentication & Security
- User registration and login system
- OTP-based password reset functionality
- Secure session management

### 3.2 Dashboard (Control Center)\n
#### Key Performance Indicators (KPIs)
- Total products count
- Low stock items alert
- Pending receipts count
- Pending deliveries count

#### Filtering Capabilities
- Filter by document type (Receipts, Delivery Orders, Transfers, Adjustments)
- Filter by status (Draft, Done)
- Filter by warehouse location
- Filter by product category

### 3.3 Product Management

#### Product Master Data
- Product Name
- SKU/Product Code
- Category
- Unit of Measure
- Initial Stock quantity
- Create, view, edit, and manage product records\n
### 3.4 Core Stock Operations

#### 3.4.1 Receipts (Incoming Stock)\n- Select supplier
- Input received quantities
- Validate receipt
- Automatic stock increase upon validation
- Track receipt status (Draft/Done)
- **Error Handling:** Implement proper validation and error handling to prevent failures during stock addition, with clear error messages for troubleshooting

#### 3.4.2 Delivery Orders (Outgoing Stock)\n- Create delivery orders for customers\n- Pick and pack items
- Validate delivery
- Automatic stock decrease upon validation
- Track delivery status (Draft/Done)\n\n#### 3.4.3 Internal Transfers
- Transfer items between warehouses (e.g., Main Warehouse to Production Floor)\n- Transfer items between storage locations (e.g., Rack A to Rack B)
- Update location records without changing total stock count
- Log all transfer movements
\n#### 3.4.4 Stock Adjustments
- Manual quantity entry for physical count corrections\n- Record discrepancies (damage, theft, counting errors)
- Update system records to match physical reality\n- Log adjustment reasons and differences\n
### 3.5 Advanced Features

#### Multi-Warehouse Support
- Manage stock across multiple physical locations\n- Location-specific inventory tracking\n- Cross-warehouse visibility

#### Low Stock Alerts\n- Automatic notifications when items reach minimum threshold
- Alert delivery to inventory managers
- Reorder point management

#### Stock Ledger
- Permanent logging of all stock movements
- Audit trail for receipts, deliveries, transfers, and adjustments\n- Historical data tracking
- Movement timestamp and user attribution
\n## 4. Data Flow Logic

### 4.1 Inbound Flow
Vendor → Receipt Creation → Validation → Stock Increase → Ledger Entry

### 4.2 Internal Movement Flow\nWarehouse Staff → Internal Transfer → Location Update → Ledger Entry\n
### 4.3 Outbound Flow
Customer Order → Delivery Order Creation → Picking/Packing → Validation → Stock Decrease → Ledger Entry

### 4.4 Correction Flow\nPhysical Count → Discrepancy Identification → Stock Adjustment → Stock Correction → Ledger Entry

## 5. Database Schema (MongoDB Atlas)

### Collections Structure
- **users:** User authentication and profile data
- **products:** Product master data with SKU, category, unit of measure\n- **warehouses:** Warehouse location information
- **receipts:** Incoming stock records
- **deliveries:** Outgoing stock records
- **transfers:** Internal transfer records
- **adjustments:** Stock adjustment records
- **stock_ledger:** Complete audit trail of all stock movements
- **alerts:** Low stock alert notifications
\n### Data Relationships
- Use MongoDB references (ObjectId) to link related documents
- Implement proper indexing for frequently queried fields (SKU, warehouse_id, product_id)
- Utilize MongoDB transactions for operations requiring atomicity (stock updates)

## 6. Design Style

- **Color Scheme:** Professional blue (#2563EB) as primary color with neutral grays (#F3F4F6 for backgrounds, #1F2937 for text), green (#10B981) for success states and stock increases, red (#EF4444) for alerts and stock decreases
- **Layout:** Dashboard-centric design with card-based KPI display, sidebar navigation for main modules, tabular data views with inline actions for operations management
- **Visual Elements:** Clean sans-serif typography, subtle shadows for depth (shadow-sm for cards), rounded corners (border-radius: 8px), icon-based action buttons for quick operations
- **Interactive Features:** Real-time status badges (Draft/Done), color-coded stock level indicators, hover states for interactive elements, modal dialogs for form inputs

## 7. Deployment Documentation
\nThe application should include a comprehensive README file covering:
- Local development setup instructions
- Environment variable configuration (including MongoDB Atlas connection string)
- MongoDB Atlas cluster setup and configuration
- Database connection and initialization steps
- Frontend and backend installation commands
- Local server startup procedures\n- Full web application hosting guidelines\n- Production deployment best practices
- MongoDB Atlas security configuration (IP whitelist, database user permissions)