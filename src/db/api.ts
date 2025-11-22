import { supabase } from './supabase';
import type {
  Profile,
  Warehouse,
  Category,
  Product,
  Supplier,
  Customer,
  Receipt,
  ReceiptLine,
  Delivery,
  DeliveryLine,
  Transfer,
  TransferLine,
  Adjustment,
  AdjustmentLine,
  StockLedger,
  LowStockProduct,
  DashboardKPIs,
  ReceiptWithDetails,
  DeliveryWithDetails,
  TransferWithDetails,
  AdjustmentWithDetails,
} from '@/types/types';

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Profile not found');
  return data;
};

// Warehouse APIs
export const getWarehouses = async (): Promise<Warehouse[]> => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getActiveWarehouses = async (): Promise<Warehouse[]> => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createWarehouse = async (warehouse: Omit<Warehouse, 'id' | 'created_at'>): Promise<Warehouse> => {
  const { data, error } = await supabase
    .from('warehouses')
    .insert(warehouse)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Failed to create warehouse');
  return data;
};

export const updateWarehouse = async (id: string, updates: Partial<Warehouse>): Promise<Warehouse> => {
  const { data, error } = await supabase
    .from('warehouses')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Warehouse not found');
  return data;
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('warehouses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Category APIs
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Failed to create category');
  return data;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Category not found');
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Product APIs
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getActiveProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'current_stock'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      current_stock: product.initial_stock || 0,
    })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Failed to create product');
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Product not found');
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Supplier APIs
export const getSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getActiveSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier> => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Failed to create supplier');
  return data;
};

export const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Supplier not found');
  return data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Customer APIs
export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getActiveCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Failed to create customer');
  return data;
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Customer not found');
  return data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Receipt APIs
export const getReceipts = async (): Promise<ReceiptWithDetails[]> => {
  const { data, error } = await supabase
    .from('receipts')
    .select(`
      *,
      supplier:suppliers(*),
      warehouse:warehouses(*),
      creator:profiles!receipts_created_by_fkey(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getReceiptById = async (id: string): Promise<ReceiptWithDetails | null> => {
  const { data, error } = await supabase
    .from('receipts')
    .select(`
      *,
      supplier:suppliers(*),
      warehouse:warehouses(*),
      creator:profiles!receipts_created_by_fkey(*),
      lines:receipt_lines(*, product:products(*))
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createReceipt = async (
  receipt: Omit<Receipt, 'id' | 'created_at' | 'validated_by' | 'validated_at'>,
  lines: Omit<ReceiptLine, 'id' | 'receipt_id' | 'created_at'>[]
): Promise<Receipt> => {
  const { data: receiptData, error: receiptError } = await supabase
    .from('receipts')
    .insert(receipt)
    .select()
    .maybeSingle();
  
  if (receiptError) throw receiptError;
  if (!receiptData) throw new Error('Failed to create receipt');
  
  if (lines.length > 0) {
    const linesWithReceiptId = lines.map(line => ({
      ...line,
      receipt_id: receiptData.id,
    }));
    
    const { error: linesError } = await supabase
      .from('receipt_lines')
      .insert(linesWithReceiptId);
    
    if (linesError) throw linesError;
  }
  
  return receiptData;
};

export const updateReceipt = async (id: string, updates: Partial<Receipt>): Promise<Receipt> => {
  const { data, error } = await supabase
    .from('receipts')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Receipt not found');
  return data;
};

export const deleteReceipt = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('receipts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Delivery APIs
export const getDeliveries = async (): Promise<DeliveryWithDetails[]> => {
  const { data, error } = await supabase
    .from('deliveries')
    .select(`
      *,
      customer:customers(*),
      warehouse:warehouses(*),
      creator:profiles!deliveries_created_by_fkey(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getDeliveryById = async (id: string): Promise<DeliveryWithDetails | null> => {
  const { data, error } = await supabase
    .from('deliveries')
    .select(`
      *,
      customer:customers(*),
      warehouse:warehouses(*),
      creator:profiles!deliveries_created_by_fkey(*),
      lines:delivery_lines(*, product:products(*))
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createDelivery = async (
  delivery: Omit<Delivery, 'id' | 'created_at' | 'validated_by' | 'validated_at'>,
  lines: Omit<DeliveryLine, 'id' | 'delivery_id' | 'created_at'>[]
): Promise<Delivery> => {
  const { data: deliveryData, error: deliveryError } = await supabase
    .from('deliveries')
    .insert(delivery)
    .select()
    .maybeSingle();
  
  if (deliveryError) throw deliveryError;
  if (!deliveryData) throw new Error('Failed to create delivery');
  
  if (lines.length > 0) {
    const linesWithDeliveryId = lines.map(line => ({
      ...line,
      delivery_id: deliveryData.id,
    }));
    
    const { error: linesError } = await supabase
      .from('delivery_lines')
      .insert(linesWithDeliveryId);
    
    if (linesError) throw linesError;
  }
  
  return deliveryData;
};

export const updateDelivery = async (id: string, updates: Partial<Delivery>): Promise<Delivery> => {
  const { data, error } = await supabase
    .from('deliveries')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Delivery not found');
  return data;
};

export const deleteDelivery = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Transfer APIs
export const getTransfers = async (): Promise<TransferWithDetails[]> => {
  const { data, error } = await supabase
    .from('transfers')
    .select(`
      *,
      from_warehouse:warehouses!transfers_from_warehouse_id_fkey(*),
      to_warehouse:warehouses!transfers_to_warehouse_id_fkey(*),
      creator:profiles!transfers_created_by_fkey(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getTransferById = async (id: string): Promise<TransferWithDetails | null> => {
  const { data, error } = await supabase
    .from('transfers')
    .select(`
      *,
      from_warehouse:warehouses!transfers_from_warehouse_id_fkey(*),
      to_warehouse:warehouses!transfers_to_warehouse_id_fkey(*),
      creator:profiles!transfers_created_by_fkey(*),
      lines:transfer_lines(*, product:products(*))
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createTransfer = async (
  transfer: Omit<Transfer, 'id' | 'created_at' | 'validated_by' | 'validated_at'>,
  lines: Omit<TransferLine, 'id' | 'transfer_id' | 'created_at'>[]
): Promise<Transfer> => {
  const { data: transferData, error: transferError } = await supabase
    .from('transfers')
    .insert(transfer)
    .select()
    .maybeSingle();
  
  if (transferError) throw transferError;
  if (!transferData) throw new Error('Failed to create transfer');
  
  if (lines.length > 0) {
    const linesWithTransferId = lines.map(line => ({
      ...line,
      transfer_id: transferData.id,
    }));
    
    const { error: linesError } = await supabase
      .from('transfer_lines')
      .insert(linesWithTransferId);
    
    if (linesError) throw linesError;
  }
  
  return transferData;
};

export const updateTransfer = async (id: string, updates: Partial<Transfer>): Promise<Transfer> => {
  const { data, error } = await supabase
    .from('transfers')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Transfer not found');
  return data;
};

export const deleteTransfer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('transfers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Adjustment APIs
export const getAdjustments = async (): Promise<AdjustmentWithDetails[]> => {
  const { data, error } = await supabase
    .from('adjustments')
    .select(`
      *,
      warehouse:warehouses(*),
      creator:profiles!adjustments_created_by_fkey(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAdjustmentById = async (id: string): Promise<AdjustmentWithDetails | null> => {
  const { data, error } = await supabase
    .from('adjustments')
    .select(`
      *,
      warehouse:warehouses(*),
      creator:profiles!adjustments_created_by_fkey(*),
      lines:adjustment_lines(*, product:products(*))
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createAdjustment = async (
  adjustment: Omit<Adjustment, 'id' | 'created_at' | 'validated_by' | 'validated_at'>,
  lines: Omit<AdjustmentLine, 'id' | 'adjustment_id' | 'created_at'>[]
): Promise<Adjustment> => {
  const { data: adjustmentData, error: adjustmentError } = await supabase
    .from('adjustments')
    .insert(adjustment)
    .select()
    .maybeSingle();
  
  if (adjustmentError) throw adjustmentError;
  if (!adjustmentData) throw new Error('Failed to create adjustment');
  
  if (lines.length > 0) {
    const linesWithAdjustmentId = lines.map(line => ({
      ...line,
      adjustment_id: adjustmentData.id,
    }));
    
    const { error: linesError } = await supabase
      .from('adjustment_lines')
      .insert(linesWithAdjustmentId);
    
    if (linesError) throw linesError;
  }
  
  return adjustmentData;
};

export const updateAdjustment = async (id: string, updates: Partial<Adjustment>): Promise<Adjustment> => {
  const { data, error } = await supabase
    .from('adjustments')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Adjustment not found');
  return data;
};

export const deleteAdjustment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('adjustments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Stock Ledger APIs
export const getStockLedger = async (productId?: string, warehouseId?: string): Promise<StockLedger[]> => {
  let query = supabase
    .from('stock_ledger')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (productId) {
    query = query.eq('product_id', productId);
  }
  
  if (warehouseId) {
    query = query.eq('warehouse_id', warehouseId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Low Stock APIs
export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const { data, error } = await supabase
    .from('low_stock_products')
    .select('*');
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Dashboard KPIs
export const getDashboardKPIs = async (): Promise<DashboardKPIs> => {
  const [productsResult, lowStockResult, receiptsResult, deliveriesResult] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('low_stock_products').select('id', { count: 'exact', head: true }),
    supabase.from('receipts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('deliveries').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
  ]);
  
  return {
    totalProducts: productsResult.count || 0,
    lowStockItems: lowStockResult.count || 0,
    pendingReceipts: receiptsResult.count || 0,
    pendingDeliveries: deliveriesResult.count || 0,
  };
};
