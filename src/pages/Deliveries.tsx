import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getDeliveries, validateDelivery, getCustomers, getWarehouses, getActiveProducts, createDelivery } from '@/db/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { DeliveryWithDetails } from '@/types/types';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<DeliveryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lines, setLines] = useState<{ product_id: string; quantity: number }[]>([{ product_id: '', quantity: 1 }]);
  const [form, setForm] = useState({
    delivery_number: '',
    customer_id: '',
    warehouse_id: '',
    delivery_date: new Date().toISOString().slice(0,10),
    notes: ''
  });

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await getDeliveries();
      setDeliveries(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load deliveries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = async () => {
    try {
      const [c, w, p] = await Promise.all([getCustomers(), getWarehouses(), getActiveProducts()]);
      setCustomers(c);
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
      if (!form.delivery_number || !form.warehouse_id) {
        toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
        return;
      }
      const validLines = lines.filter(l => l.product_id && l.quantity > 0);
      if (validLines.length === 0) {
        toast({ title: 'Error', description: 'Add at least one line', variant: 'destructive' });
        return;
      }
      for (const l of validLines) {
        const prod = products.find((p: any) => p.id === l.product_id);
        const available = Number(prod?.current_stock || 0);
        if (l.quantity > available) {
          toast({ title: 'Insufficient stock', description: `${prod?.name || 'Item'} has only ${available} available`, variant: 'destructive' });
          return;
        }
      }
      await createDelivery({
        delivery_number: form.delivery_number,
        customer_id: form.customer_id || null,
        warehouse_id: form.warehouse_id || null,
        status: 'draft',
        delivery_date: form.delivery_date,
        notes: form.notes || null,
        created_by: null,
        validated_by: null,
        validated_at: null
      } as any, validLines as any);
      toast({ title: 'Success', description: 'Delivery created' });
      setDialogOpen(false);
      setForm({ delivery_number: '', customer_id: '', warehouse_id: '', delivery_date: new Date().toISOString().slice(0,10), notes: '' });
      setLines([{ product_id: '', quantity: 1 }]);
      loadDeliveries();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to create delivery', variant: 'destructive' });
    }
  };

  const validate = async (id: string) => {
    try {
      await validateDelivery(id);
      toast({ title: 'Validated', description: 'Delivery validated and stock updated' });
      loadDeliveries();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to validate delivery', variant: 'destructive' });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deliveries</h1>
        <p className="text-muted-foreground">Manage outgoing stock operations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery List
            </CardTitle>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> New Delivery
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
          ) : deliveries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No deliveries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.delivery_number}</TableCell>
                      <TableCell>{delivery.customer?.name || '-'}</TableCell>
                      <TableCell>{delivery.warehouse?.name || '-'}</TableCell>
                      <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm">
                        {(delivery.lines || [])
                          .map((l) => `${l.product?.name || ''} × ${l.quantity}`)
                          .join(', ') || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={delivery.status === 'done' ? 'default' : 'outline'}>
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {delivery.status === 'draft' && (
                          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" onClick={() => validate(delivery.id)}>
                            Validate
                          </button>
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
              <DialogTitle>New Delivery</DialogTitle>
              <DialogDescription>Create outgoing shipment</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery #</Label>
                  <Input value={form.delivery_number} onChange={e => setForm({ ...form, delivery_number: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.delivery_date} onChange={e => setForm({ ...form, delivery_date: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select value={form.customer_id} onValueChange={(v) => setForm({ ...form, customer_id: v === 'none' ? '' : v })}>
                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {customers.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
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
