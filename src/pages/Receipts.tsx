import { useEffect, useState } from 'react';
import { TrendingUp, Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getReceipts, getReceiptById, validateReceipt, getSuppliers, getWarehouses, getActiveProducts, createReceipt } from '@/db/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { ReceiptWithDetails } from '@/types/types';
import { Button } from '@/components/ui/button';

export default function Receipts() {
  const [receipts, setReceipts] = useState<ReceiptWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lines, setLines] = useState<{ product_id: string; quantity: number }[]>([{ product_id: '', quantity: 1 }]);
  const [form, setForm] = useState({
    receipt_number: '',
    supplier_id: '',
    warehouse_id: '',
    receipt_date: new Date().toISOString().slice(0,10),
    notes: ''
  });

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const data = await getReceipts();
      setReceipts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load receipts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (id: string) => {
    try {
      const receipt = await getReceiptById(id);
      if (!receipt) {
        toast({ title: 'Error', description: 'Receipt not found', variant: 'destructive' });
        return;
      }
      const supplier = receipt.supplier?.name || '-';
      const warehouse = receipt.warehouse?.name || '-';
      const date = new Date(receipt.receipt_date).toLocaleDateString();
      const lines = (receipt.lines || []).map((l) => `<tr><td style="padding:8px;border:1px solid #ddd;">${l.product?.name || ''}</td><td style="padding:8px;border:1px solid #ddd;">${l.product?.sku || ''}</td><td style="padding:8px;border:1px solid #ddd;">${l.quantity}</td></tr>`).join('');
      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Receipt ${receipt.receipt_number}</title>
            <style>
              body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color:#111; }
              .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
              .title { font-size:20px; font-weight:700; }
              .meta { font-size:12px; color:#555; }
              table { width:100%; border-collapse:collapse; }
              thead th { text-align:left; padding:8px; border:1px solid #ddd; background:#f7f7f7; }
              tfoot td { padding:8px; border:1px solid #ddd; font-weight:700; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Receipt ${receipt.receipt_number}</div>
              <div class="meta">Date: ${date}</div>
            </div>
            <div class="meta">Supplier: ${supplier}</div>
            <div class="meta">Warehouse: ${warehouse}</div>
            <hr/>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${lines}
              </tbody>
            </table>
          </body>
        </html>
      `;
      const win = window.open('', '_blank');
      if (!win) {
        toast({ title: 'Error', description: 'Popup blocked. Please enable popups to download.', variant: 'destructive' });
        return;
      }
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate receipt PDF', variant: 'destructive' });
    }
  };

  const openNewDialog = async () => {
    try {
      const [s, w, p] = await Promise.all([getSuppliers(), getWarehouses(), getActiveProducts()]);
      setSuppliers(s);
      setWarehouses(w);
      setProducts(p);
      setDialogOpen(true);
    } catch {
      toast({ title: 'Error', description: 'Failed to load dependencies', variant: 'destructive' });
    }
  };

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.receipt_number || !form.warehouse_id) {
        toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
        return;
      }
      const validLines = lines.filter(l => l.product_id && l.quantity > 0);
      if (validLines.length === 0) {
        toast({ title: 'Error', description: 'Add at least one line', variant: 'destructive' });
        return;
      }
      await createReceipt({
        receipt_number: form.receipt_number,
        supplier_id: form.supplier_id || null,
        warehouse_id: form.warehouse_id || null,
        status: 'draft',
        receipt_date: form.receipt_date,
        notes: form.notes || null,
        created_by: null,
        validated_by: null,
        validated_at: null
      } as any, validLines as any);
      toast({ title: 'Success', description: 'Receipt created' });
      setDialogOpen(false);
      setForm({ receipt_number: '', supplier_id: '', warehouse_id: '', receipt_date: new Date().toISOString().slice(0,10), notes: '' });
      setLines([{ product_id: '', quantity: 1 }]);
      loadReceipts();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to create receipt', variant: 'destructive' });
    }
  };

  const validate = async (id: string) => {
    try {
      await validateReceipt(id);
      toast({ title: 'Validated', description: 'Receipt validated and stock updated' });
      loadReceipts();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to validate receipt', variant: 'destructive' });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Receipts</h1>
        <p className="text-muted-foreground">Manage incoming stock operations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Receipt List
            </CardTitle>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> New Receipt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No receipts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.receipt_number}</TableCell>
                      <TableCell>{receipt.supplier?.name || '-'}</TableCell>
                      <TableCell>{receipt.warehouse?.name || '-'}</TableCell>
                      <TableCell>{new Date(receipt.receipt_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={receipt.status === 'done' ? 'default' : 'outline'}>
                          {receipt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {receipt.status === 'draft' ? (
                          <Button onClick={() => validate(receipt.id)}>
                            Validate
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => downloadReceipt(receipt.id)} title="Download PDF">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submitNew}>
            <DialogHeader>
              <DialogTitle>New Receipt</DialogTitle>
              <DialogDescription>Record incoming goods</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Receipt #</Label>
                  <Input value={form.receipt_number} onChange={e => setForm({ ...form, receipt_number: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.receipt_date} onChange={e => setForm({ ...form, receipt_date: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Select value={form.supplier_id} onValueChange={(v) => setForm({ ...form, supplier_id: v === 'none' ? '' : v })}>
                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {suppliers.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Select value={form.warehouse_id} onValueChange={(v) => setForm({ ...form, warehouse_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Items</Label>
                {lines.map((l, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-3">
                    <Select value={l.product_id} onValueChange={(v) => setLines(lines.map((x,i) => i===idx ? { ...x, product_id: v } : x))}>
                      <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input type="number" min={1} value={l.quantity} onChange={e => setLines(lines.map((x,i) => i===idx ? { ...x, quantity: Number(e.target.value) } : x))} />
                    <Button type="button" variant="destructive" onClick={() => setLines(lines.filter((_,i)=>i!==idx))}>Remove</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setLines([...lines, { product_id: '', quantity: 1 }])}>Add Line</Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
