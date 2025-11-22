# StockMaster Inventory Management System Requirements Document

## 1. Application Overview

### 1.1 Application Name
StockMaster

### 1.2 Application Description
StockMaster is a centralized, real-time inventory management system designed to replace manual registers and Excel-based tracking methods. The application digitizes and streamlines all stock-related operations across multiple warehouses, providing automated stock tracking, movement logging, real-time visibility into inventory levels, AI-powered demand forecasting, QR code-based operations, visual warehouse management, and voice-activated commands.

### 1.3 Technology Stack
- **Frontend:** React
- **Backend:** Express.js (ES Module syntax)
- **Database:** MongoDB Atlas
- **Additional Technologies:** QR Code generation library, Camera API for scanning, Voice recognition API
\n## 2. Landing Page\n
### 2.1 Brand Name
JSHS

### 2.2 Landing Page Purpose
The landing page serves as the entry point for visitors, introducing the StockMaster inventory management system and the JSHS brand. It provides an overview of key features, benefits, and a call-to-action for user registration or login.

### 2.3 Landing Page Sections
- **Hero Section:** Brand name 'JSHS' with tagline, brief introduction to StockMaster, and primary CTA button (Get Started / Sign Up)
- **Features Overview:** Highlight core capabilities (Real-time tracking, Multi-warehouse support, AI demand forecasting, QR code scanning, Warehouse heatmap, Voice commands, Automated alerts, Comprehensive audit trail)
- **Benefits Section:** Explain how StockMaster replaces manual processes and improves efficiency
- **Call-to-Action:** Encourage visitors to register or request a demo
- **Footer:** Contact information, links to documentation, and social media
\n### 2.4 Landing Page Design
- **Color Scheme:** Consistent with main application (primary blue #2563EB, neutral grays, accent green and red)
- **Layout:** Single-page scrollable design with clear section divisions, hero image or illustration showcasing warehouse operations
- **Typography:** Bold headings for section titles, readable body text with ample spacing
- **Interactive Elements:** Smooth scroll navigation, hover effects on CTA buttons, responsive design for mobile and desktop
\n## 3. Target Users\n
### 3.1 Inventory Managers
Oversee overall inventory operations, manage incoming and outgoing stock, monitor KPIs, make strategic decisions based on stock levels and movement patterns, and review AI-powered demand forecasts.

### 3.2 Warehouse Staff
Execute physical operations including picking, shelving, counting, and transferring items between locations using QR code scanning and voice commands for hands-free operations.

## 4. Core Functional Modules

### 4.1 Authentication & Security
- User registration and login system
- OTP-based password reset functionality\n- Secure session management

### 4.2 Dashboard (Control Center)

#### Key Performance Indicators (KPIs)
- Total products count\n- Low stock items alert
- Pending receipts count
- Pending deliveries count
- AI-powered stock depletion predictions
\n#### Filtering Capabilities
- Filter by document type (Receipts, Delivery Orders, Transfers, Adjustments)
- Filter by status (Draft, Done)
- Filter by warehouse location
- Filter by product category

### 4.3 Product Management

#### Product Master Data
- Product Name
- SKU/Product Code
- Category
- Unit of Measure
- Initial Stock quantity
- Auto-generated QR code image
- Create, view, edit, and manage product records

### 4.4 Core Stock Operations

#### 4.4.1 Receipts (Incoming Stock)
- Select supplier
- Input received quantities (manual entry or QR code scan)
- Validate receipt
- Automatic stock increase upon validation
- Track receipt status (Draft/Done)
- **Error Handling:** Implement proper validation and error handling to prevent failures during stock addition, with clear error messages for troubleshooting

#### 4.4.2 Delivery Orders (Outgoing Stock)\n- Create delivery orders for customers\n- Pick and pack items (with QR code scanning support)
- Validate delivery
- Automatic stock decrease upon validation\n- Track delivery status (Draft/Done)

#### 4.4.3 Internal Transfers
- Transfer items between warehouses (e.g., Main Warehouse to Production Floor)
- Transfer items between storage locations (e.g., Rack A to Rack B)\n- Update location records without changing total stock count
- Log all transfer movements
- Support QR code scanning for quick item identification

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

#### AI-Based Demand Forecasting
- Analyze historical stock movement data from the Stock Ledger
- Calculate average daily consumption rate for each product
- Predict stock depletion timeline (e.g., 'Product will run out in 4 days based on past trends')
- Display proactive alerts on dashboard with predicted depletion dates
- Update forecasts automatically as new movement data is recorded

#### QR Code Generation & Scanning
- Auto-generate unique QR code image for every product upon creation
- Store QR code image reference in product record
- 'Scan' button on mobile view to activate camera\n- Scan QR code to instantly identify product or add to Delivery Order
- Reduce manual SKU entry errors and speed up warehouse operations

#### Warehouse Heatmap Visualization
- Visual 2D grid representation of warehouse layout
- Display storageracks and locations
- Color-coded indicators (Green to Red) based on:\n  - Rack occupancy level (how full each rack is)
  - Movement frequency (how often items are moved from each location)
- Interactive heatmap with click-to-view details for each rack
- Real-time updates as stock movements occur

#### Voice-Activated Commands
- Voice recognition integration for hands-free operations
- Supported commands include:
  - 'StockMaster, check availability of [Product Name]'
  - 'Create Receipt for [quantity] units'
  - 'Show low stock items'
  - 'Transfer [Product Name] from [Location A] to [Location B]'
- Designed for warehouse staff carrying boxes or performing physical tasks
- Voice feedback confirmation for executed commands

#### Low Stock Alerts
- Automatic notifications when items reach minimum threshold
- Alert delivery to inventory managers
- Reorder point management
- Enhanced with AI predictions for proactive restocking

#### Stock Ledger
- Permanent logging of all stock movements
- Audit trail for receipts, deliveries, transfers, and adjustments
- Historical data tracking
- Movement timestamp and user attribution
- Data source for AI demand forecasting algorithm

## 5. Data Flow Logic

### 5.1 Inbound Flow
Vendor → Receipt Creation (QR Scan or Manual Entry) → Validation → Stock Increase → Ledger Entry → AI Forecast Update

### 5.2 Internal Movement Flow
Warehouse Staff → Internal Transfer (QR Scan or Voice Command) → Location Update → Ledger Entry → Heatmap Update

### 5.3 Outbound Flow
Customer Order → Delivery Order Creation → Picking/Packing (QR Scan) → Validation → Stock Decrease → Ledger Entry → AI Forecast Update

### 5.4 Correction Flow
Physical Count → Discrepancy Identification → Stock Adjustment → Stock Correction → Ledger Entry → AI Forecast Update

## 6. Database Schema (MongoDB Atlas)

### Collections Structure\n- **users:** User authentication and profile data
- **products:** Product master data with SKU, category, unit of measure, QR code image reference
- **warehouses:** Warehouse location information with rack layout data
- **receipts:** Incoming stock records
- **deliveries:** Outgoing stock records\n- **transfers:** Internal transfer records
- **adjustments:** Stock adjustment records
- **stock_ledger:** Complete audit trail of all stock movements (used for AI forecasting)
- **alerts:** Low stock alert notifications and AI predictions
- **heatmap_data:** Real-time rack occupancy and movement frequency data

### Data Relationships
- Use MongoDB references (ObjectId) to link related documents\n- Implement proper indexing for frequently queried fields (SKU, warehouse_id, product_id)\n- Utilize MongoDB transactions for operations requiring atomicity (stock updates)
\n## 7. Design Style\n
- **Color Scheme:** Professional blue (#2563EB) as primary color with neutral grays (#F3F4F6 for backgrounds, #1F2937 for text), green (#10B981) for success states and stock increases, red (#EF4444) for alerts and stock decreases, gradient colors for heatmap visualization (green to yellow to red)
- **Layout:** Dashboard-centric design with card-based KPI display, sidebar navigation for main modules, tabular data views with inline actions for operations management, dedicated heatmap visualization panel
- **Visual Elements:** Clean sans-serif typography, subtle shadows for depth (shadow-sm for cards), rounded corners (border-radius: 8px), icon-based action buttons for quick operations, QR code display in product cards, microphone icon for voice command activation
- **Interactive Features:** Real-time status badges (Draft/Done), color-coded stock level indicators, hover states for interactive elements, modal dialogs for form inputs, camera overlay for QR scanning, interactive heatmap grid with tooltips, voice command feedback animations

## 8. Deployment Documentation

The application should include a comprehensive README file covering:
- Local development setup instructions\n- Environment variable configuration (including MongoDB Atlas connection string, QR code library API keys, voice recognition API credentials)
- MongoDB Atlas cluster setup and configuration
- Database connection and initialization steps
- Frontend and backend installation commands
- Local server startup procedures
- Camera and microphone permissions setup for QR scanning and voice commands
- Full web application hosting guidelines
- Production deployment best practices
- MongoDB Atlas security configuration (IP whitelist, database user permissions)
- Third-party API integration documentation (QR code generation, voice recognition services)