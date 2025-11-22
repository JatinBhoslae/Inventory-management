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
\n## 2. Landing Page\n
### 2.1 Brand Name
JSHS

### 2.2 Landing Page Purpose
The landing page serves as the entry point for visitors, introducing the StockMaster inventory management system and the JSHS brand. It provides an overview of key features, benefits, and a call-to-action for user registration or login.

### 2.3 Landing Page Sections
- **Hero Section:** Brand name'JSHS' with tagline, brief introduction to StockMaster, and primary CTA button (Get Started / Sign Up)
- **Features Overview:** Highlight core capabilities (Real-time tracking, Multi-warehouse support, Automated alerts, Comprehensive audit trail)
- **Benefits Section:** Explain how StockMaster replaces manual processes and improves efficiency
- **Call-to-Action:** Encourage visitors to register or request a demo
- **Footer:** Contact information, links to documentation, and social media

### 2.4 Landing Page Design
- **Color Scheme:** Consistent with main application (primary blue #2563EB, neutral grays, accent green and red)
- **Layout:** Single-page scrollable design with clear section divisions, hero image or illustration showcasing warehouse operations\n- **Typography:** Bold headings for section titles, readable body text withample spacing\n- **Interactive Elements:** Smooth scroll navigation, hover effects on CTA buttons, responsive design for mobile and desktop
\n## 3. Target Users

### 3.1 Inventory Managers
Oversee overall inventory operations, manage incoming and outgoing stock, monitor KPIs, and make strategic decisions based on stock levels and movement patterns.

### 3.2 Warehouse Staff
Execute physical operations including picking, shelving, counting, and transferring items between locations.

## 4. Core Functional Modules

### 4.1 Authentication & Security
- User registration and login system
- OTP-based password reset functionality
- Secure session management\n
### 4.2 Dashboard (Control Center)
\n#### Key Performance Indicators (KPIs)
- Total products count
- Low stock items alert\n- Pending receipts count\n- Pending deliveries count\n
#### Filtering Capabilities
- Filter by document type (Receipts, Delivery Orders, Transfers, Adjustments)
- Filter by status (Draft, Done)
- Filter by warehouse location\n- Filter by product category

### 4.3 Product Management

#### Product Master Data
- Product Name\n- SKU/Product Code\n- Category
- Unit of Measure
- Initial Stock quantity
- Create, view, edit, and manage product records
\n### 4.4 Core Stock Operations

#### 4.4.1 Receipts (Incoming Stock)
- Select supplier
- Input received quantities
- Validate receipt
- Automatic stock increase upon validation\n- Track receipt status (Draft/Done)
- **Error Handling:** Implement proper validation and error handling to prevent failures during stock addition, with clear error messages for troubleshooting

#### 4.4.2 Delivery Orders (Outgoing Stock)
- Create delivery orders for customers
- Pick and pack items
- Validate delivery
- Automatic stock decrease upon validation
- Track delivery status (Draft/Done)

#### 4.4.3 Internal Transfers
- Transfer items between warehouses (e.g., Main Warehouse to Production Floor)
- Transfer items between storage locations (e.g., Rack A to Rack B)
- Update location records without changing total stock count
- Log all transfer movements

#### 4.4.4 Stock Adjustments
- Manual quantity entry for physical count corrections
- Record discrepancies (damage, theft, counting errors)
- Update system records to match physical reality
- Log adjustment reasons and differences

### 4.5 Advanced Features

#### Multi-Warehouse Support
- Manage stock across multiple physical locations
- Location-specific inventory tracking
- Cross-warehouse visibility
\n#### Low Stock Alerts
- Automatic notifications when items reach minimum threshold
- Alert delivery to inventory managers
- Reorder point management

#### Stock Ledger
- Permanent logging of all stock movements
- Audit trail for receipts, deliveries, transfers, and adjustments
- Historical data tracking
- Movement timestamp and user attribution

## 5. Data Flow Logic\n
### 5.1 Inbound Flow
Vendor → Receipt Creation → Validation → Stock Increase → Ledger Entry

### 5.2 Internal Movement Flow
Warehouse Staff → Internal Transfer → Location Update → Ledger Entry

### 5.3 Outbound Flow
Customer Order → Delivery Order Creation → Picking/Packing → Validation → Stock Decrease → Ledger Entry

### 5.4 Correction Flow
Physical Count → Discrepancy Identification → Stock Adjustment → Stock Correction → Ledger Entry

## 6. Database Schema (MongoDB Atlas)
\n### Collections Structure
- **users:** User authentication and profile data\n- **products:** Product master data with SKU, category, unit of measure
- **warehouses:** Warehouse location information
- **receipts:** Incoming stock records\n- **deliveries:** Outgoing stock records
- **transfers:** Internal transfer records
- **adjustments:** Stock adjustment records
- **stock_ledger:** Complete audit trail of all stock movements
- **alerts:** Low stock alert notifications

### Data Relationships
- Use MongoDB references (ObjectId) to link related documents
- Implement proper indexing for frequently queried fields (SKU, warehouse_id, product_id)
- Utilize MongoDB transactions for operations requiring atomicity (stock updates)
\n## 7. Design Style\n
- **Color Scheme:** Professional blue (#2563EB) as primary color with neutral grays (#F3F4F6 for backgrounds, #1F2937 for text), green (#10B981) for success states and stock increases, red (#EF4444) for alerts and stock decreases
- **Layout:** Dashboard-centric design with card-based KPI display, sidebar navigation for main modules, tabular data views with inline actions for operations management
- **Visual Elements:** Clean sans-serif typography, subtle shadows for depth (shadow-sm for cards), rounded corners (border-radius: 8px), icon-based action buttons for quick operations
- **Interactive Features:** Real-time status badges (Draft/Done), color-coded stock level indicators, hover states for interactive elements, modal dialogs for form inputs

## 8. Deployment Documentation

The application should include a comprehensive README file covering:
- Local development setup instructions
- Environment variable configuration (including MongoDB Atlas connection string)
- MongoDB Atlas cluster setup and configuration
- Database connection and initialization steps
- Frontend and backend installation commands
- Local server startup procedures
- Full web application hosting guidelines
- Production deployment best practices
- MongoDB Atlas security configuration (IP whitelist, database user permissions)