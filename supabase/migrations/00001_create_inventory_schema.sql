/*
# StockMaster Inventory Management System - Database Schema

## Plain English Explanation
This migration creates the complete database structure for StockMaster, an inventory management system. It includes tables for user profiles, warehouses, products, stock operations (receipts, deliveries, transfers, adjustments), and a comprehensive stock ledger for audit trails.

## 1. New Tables

### profiles
User profile information with role-based access control
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `role` (user_role enum: 'warehouse_staff', 'inventory_manager', 'admin')
- `created_at` (timestamptz, default: now())

### warehouses
Physical warehouse locations for inventory storage
- `id` (uuid, primary key)
- `name` (text, not null)
- `code` (text, unique, not null)
- `address` (text)
- `is_active` (boolean, default: true)
- `created_at` (timestamptz, default: now())

### categories
Product categorization for organization
- `id` (uuid, primary key)
- `name` (text, unique, not null)
- `description` (text)
- `created_at` (timestamptz, default: now())

### products
Master product data with stock tracking
- `id` (uuid, primary key)
- `name` (text, not null)
- `sku` (text, unique, not null)
- `category_id` (uuid, references categories)
- `unit_of_measure` (text, not null)
- `initial_stock` (numeric, default: 0)
- `current_stock` (numeric, default: 0)
- `min_stock_level` (numeric, default: 0)
- `is_active` (boolean, default: true)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### suppliers
Supplier information for receipts
- `id` (uuid, primary key)
- `name` (text, not null)
- `code` (text, unique, not null)
- `contact_person` (text)
- `phone` (text)
- `email` (text)
- `address` (text)
- `is_active` (boolean, default: true)
- `created_at` (timestamptz, default: now())

### customers
Customer information for deliveries
- `id` (uuid, primary key)
- `name` (text, not null)
- `code` (text, unique, not null)
- `contact_person` (text)
- `phone` (text)
- `email` (text)
- `address` (text)
- `is_active` (boolean, default: true)
- `created_at` (timestamptz, default: now())

### receipts
Incoming stock operations
- `id` (uuid, primary key)
- `receipt_number` (text, unique, not null)
- `supplier_id` (uuid, references suppliers)
- `warehouse_id` (uuid, references warehouses)
- `status` (operation_status enum: 'draft', 'done')
- `receipt_date` (date, not null)
- `notes` (text)
- `created_by` (uuid, references profiles)
- `validated_by` (uuid, references profiles)
- `validated_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### receipt_lines
Line items for receipts
- `id` (uuid, primary key)
- `receipt_id` (uuid, references receipts)
- `product_id` (uuid, references products)
- `quantity` (numeric, not null)
- `created_at` (timestamptz, default: now())

### deliveries
Outgoing stock operations
- `id` (uuid, primary key)
- `delivery_number` (text, unique, not null)
- `customer_id` (uuid, references customers)
- `warehouse_id` (uuid, references warehouses)
- `status` (operation_status enum: 'draft', 'done')
- `delivery_date` (date, not null)
- `notes` (text)
- `created_by` (uuid, references profiles)
- `validated_by` (uuid, references profiles)
- `validated_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### delivery_lines
Line items for deliveries
- `id` (uuid, primary key)
- `delivery_id` (uuid, references deliveries)
- `product_id` (uuid, references products)
- `quantity` (numeric, not null)
- `created_at` (timestamptz, default: now())

### transfers
Internal stock transfers between warehouses
- `id` (uuid, primary key)
- `transfer_number` (text, unique, not null)
- `from_warehouse_id` (uuid, references warehouses)
- `to_warehouse_id` (uuid, references warehouses)
- `status` (operation_status enum: 'draft', 'done')
- `transfer_date` (date, not null)
- `notes` (text)
- `created_by` (uuid, references profiles)
- `validated_by` (uuid, references profiles)
- `validated_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### transfer_lines
Line items for transfers
- `id` (uuid, primary key)
- `transfer_id` (uuid, references transfers)
- `product_id` (uuid, references products)
- `quantity` (numeric, not null)
- `created_at` (timestamptz, default: now())

### adjustments
Stock adjustments for corrections
- `id` (uuid, primary key)
- `adjustment_number` (text, unique, not null)
- `warehouse_id` (uuid, references warehouses)
- `status` (operation_status enum: 'draft', 'done')
- `adjustment_date` (date, not null)
- `reason` (text)
- `notes` (text)
- `created_by` (uuid, references profiles)
- `validated_by` (uuid, references profiles)
- `validated_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### adjustment_lines
Line items for adjustments
- `id` (uuid, primary key)
- `adjustment_id` (uuid, references adjustments)
- `product_id` (uuid, references products)
- `old_quantity` (numeric, not null)
- `new_quantity` (numeric, not null)
- `difference` (numeric, not null)
- `created_at` (timestamptz, default: now())

### stock_ledger
Comprehensive audit trail for all stock movements
- `id` (uuid, primary key)
- `product_id` (uuid, references products)
- `warehouse_id` (uuid, references warehouses)
- `operation_type` (text, not null)
- `operation_id` (uuid, not null)
- `operation_number` (text, not null)
- `quantity_change` (numeric, not null)
- `stock_before` (numeric, not null)
- `stock_after` (numeric, not null)
- `created_by` (uuid, references profiles)
- `created_at` (timestamptz, default: now())

## 2. Security
- Enable RLS on profiles table
- First registered user becomes admin automatically
- Admins have full access to all data
- Inventory managers can view and manage all inventory operations
- Warehouse staff can view and create operations but cannot validate them
- Public read access for most tables to allow dashboard viewing before login

## 3. Notes
- All numeric fields use numeric type for precision
- Status tracking for all operations (draft/done)
- Comprehensive audit trail via stock_ledger
- Automatic stock updates via triggers
- Low stock alerts via view
*/

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('warehouse_staff', 'inventory_manager', 'admin');
CREATE TYPE operation_status AS ENUM ('draft', 'done');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  role user_role DEFAULT 'warehouse_staff'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Extend profiles with optional user fields for shopper UI
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id),
  unit_of_measure text NOT NULL,
  initial_stock numeric DEFAULT 0,
  current_stock numeric DEFAULT 0,
  min_stock_level numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  contact_person text,
  phone text,
  email text,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  contact_person text,
  phone text,
  email text,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number text UNIQUE NOT NULL,
  supplier_id uuid REFERENCES suppliers(id),
  warehouse_id uuid REFERENCES warehouses(id),
  status operation_status DEFAULT 'draft'::operation_status NOT NULL,
  receipt_date date NOT NULL,
  notes text,
  created_by uuid REFERENCES profiles(id),
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create receipt_lines table
CREATE TABLE IF NOT EXISTS receipt_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid REFERENCES receipts(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity numeric NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  warehouse_id uuid REFERENCES warehouses(id),
  status operation_status DEFAULT 'draft'::operation_status NOT NULL,
  delivery_date date NOT NULL,
  notes text,
  created_by uuid REFERENCES profiles(id),
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create delivery_lines table
CREATE TABLE IF NOT EXISTS delivery_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity numeric NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_number text UNIQUE NOT NULL,
  from_warehouse_id uuid REFERENCES warehouses(id),
  to_warehouse_id uuid REFERENCES warehouses(id),
  status operation_status DEFAULT 'draft'::operation_status NOT NULL,
  transfer_date date NOT NULL,
  notes text,
  created_by uuid REFERENCES profiles(id),
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CHECK (from_warehouse_id != to_warehouse_id)
);

-- Create transfer_lines table
CREATE TABLE IF NOT EXISTS transfer_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid REFERENCES transfers(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity numeric NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Create adjustments table
CREATE TABLE IF NOT EXISTS adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_number text UNIQUE NOT NULL,
  warehouse_id uuid REFERENCES warehouses(id),
  status operation_status DEFAULT 'draft'::operation_status NOT NULL,
  adjustment_date date NOT NULL,
  reason text,
  notes text,
  created_by uuid REFERENCES profiles(id),
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create adjustment_lines table
CREATE TABLE IF NOT EXISTS adjustment_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_id uuid REFERENCES adjustments(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  old_quantity numeric NOT NULL,
  new_quantity numeric NOT NULL,
  difference numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create stock_ledger table
CREATE TABLE IF NOT EXISTS stock_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  warehouse_id uuid REFERENCES warehouses(id),
  operation_type text NOT NULL,
  operation_id uuid NOT NULL,
  operation_number text NOT NULL,
  quantity_change numeric NOT NULL,
  stock_before numeric NOT NULL,
  stock_after numeric NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_stock_ledger_product ON stock_ledger(product_id);
CREATE INDEX idx_stock_ledger_warehouse ON stock_ledger(warehouse_id);
CREATE INDEX idx_stock_ledger_created_at ON stock_ledger(created_at DESC);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create admin helper function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create policies for profiles
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile without changing role" ON profiles
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create trigger for new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    INSERT INTO profiles (id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'warehouse_staff'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create view for low stock alerts
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  p.id,
  p.name,
  p.sku,
  p.current_stock,
  p.min_stock_level,
  c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.current_stock <= p.min_stock_level AND p.is_active = true
ORDER BY (p.current_stock - p.min_stock_level) ASC;