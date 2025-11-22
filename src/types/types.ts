export type UserRole = 'warehouse_staff' | 'inventory_manager' | 'admin';
export type OperationStatus = 'draft' | 'done';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  phone?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: string | null;
  avatar_url?: string | null;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string | null;
  unit_of_measure: string;
  initial_stock: number;
  current_stock: number;
  min_stock_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Receipt {
  id: string;
  receipt_number: string;
  supplier_id: string | null;
  warehouse_id: string | null;
  status: OperationStatus;
  receipt_date: string;
  notes: string | null;
  created_by: string | null;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
}

export interface ReceiptLine {
  id: string;
  receipt_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface Delivery {
  id: string;
  delivery_number: string;
  customer_id: string | null;
  warehouse_id: string | null;
  status: OperationStatus;
  delivery_date: string;
  notes: string | null;
  created_by: string | null;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
}

export interface DeliveryLine {
  id: string;
  delivery_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface Transfer {
  id: string;
  transfer_number: string;
  from_warehouse_id: string | null;
  to_warehouse_id: string | null;
  status: OperationStatus;
  transfer_date: string;
  notes: string | null;
  created_by: string | null;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
}

export interface TransferLine {
  id: string;
  transfer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface Adjustment {
  id: string;
  adjustment_number: string;
  warehouse_id: string | null;
  status: OperationStatus;
  adjustment_date: string;
  reason: string | null;
  notes: string | null;
  created_by: string | null;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
}

export interface AdjustmentLine {
  id: string;
  adjustment_id: string;
  product_id: string;
  old_quantity: number;
  new_quantity: number;
  difference: number;
  created_at: string;
}

export interface StockLedger {
  id: string;
  product_id: string;
  warehouse_id: string | null;
  operation_type: string;
  operation_id: string;
  operation_number: string;
  quantity_change: number;
  stock_before: number;
  stock_after: number;
  created_by: string | null;
  created_at: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  min_stock_level: number;
  category_name: string | null;
}

export interface ReceiptWithDetails extends Receipt {
  supplier?: Supplier;
  warehouse?: Warehouse;
  lines?: (ReceiptLine & { product?: Product })[];
  creator?: Profile;
}

export interface DeliveryWithDetails extends Delivery {
  customer?: Customer;
  warehouse?: Warehouse;
  lines?: (DeliveryLine & { product?: Product })[];
  creator?: Profile;
}

export interface TransferWithDetails extends Transfer {
  from_warehouse?: Warehouse;
  to_warehouse?: Warehouse;
  lines?: (TransferLine & { product?: Product })[];
  creator?: Profile;
}

export interface AdjustmentWithDetails extends Adjustment {
  warehouse?: Warehouse;
  lines?: (AdjustmentLine & { product?: Product })[];
  creator?: Profile;
}

export interface DashboardKPIs {
  totalProducts: number;
  lowStockItems: number;
  pendingReceipts: number;
  pendingDeliveries: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  sku: string;
  total_sold: number;
  category_name?: string | null;
}

export interface RecentPurchasedProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  receipt_date: string;
  category_name?: string | null;
}
