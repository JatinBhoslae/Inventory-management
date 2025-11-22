import { useEffect, useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAdjustments, validateAdjustment, getWarehouses, getActiveProducts, createAdjustment } from '@/db/api';
import type { AdjustmentWithDetails } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<AdjustmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lines, setLines] = useState<{ product_id: string; new_quantity: number }[]>([{ product_id: '', new_quantity: 0 }]);
  const [form, setForm] = useState({
    adjustment_number: '',
    warehouse_id: '',
    adjustment_date: new Date().toISOString().slice(0,10),
    reason: '',
    notes: ''
  });

  useEffect(() => {
    loadAdjustments();
  }, []);

  const loadAdjustments = async () => {
    try {
      setLoading(true);
      const data = await getAdjustments();
      setAdjustments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load adjustments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = async () => {
    try {
      const [w, p] = await Promise.all([getWarehouses(), getActiveProducts()]);
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
      if (!form.adjustment_number || !form.warehouse_id) {
        toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
        return;
      }
      const validLines = lines.filter(l => l.product_id);
      if (validLines.length === 0) {
        toast({ title: 'Error', description: 'Add at least one line', variant: 'destructive' });
        return;
      }
      for (const l of validLines) {
        if (l.new_quantity < 0) {
          toast({ title: 'Invalid quantity', description: 'New quantity cannot be negative', variant: 'destructive' });
          return;
        }
      }
      const linesPayload = validLines.map(l => {
        const prod = products.find((p: any) => p.id === l.product_id);
        const oldQty = Number(prod?.current_stock || 0);
        const newQty = Number(l.new_quantity || 0);
        return {
          product_id: l.product_id,
          old_quantity: oldQty,
          new_quantity: newQty,
          difference: newQty - oldQty,
        } as any;
      });
      await createAdjustment({
        adjustment_number: form.adjustment_number,
        warehouse_id: form.warehouse_id || null,
        status: 'draft',
        adjustment_date: form.adjustment_date,
        reason: form.reason || null,
        notes: form.notes || null,
        created_by: null,
        validated_by: null,
        validated_at: null
      } as any, linesPayload);
      toast({ title: 'Success', description: 'Adjustment created' });
      setDialogOpen(false);
      setForm({ adjustment_number: '', warehouse_id: '', adjustment_date: new Date().toISOString().slice(0,10), reason: '', notes: '' });
      setLines([{ product_id: '', new_quantity: 0 }]);
      loadAdjustments();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to create adjustment', variant: 'destructive' });
    }
  };

  const validate = async (id: string) => {
    try {
      await validateAdjustment(id);
      toast({ title: 'Validated', description: 'Adjustment validated and stock updated' });
      loadAdjustments();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to validate adjustment', variant: 'destructive' });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Adjustments</h1>
        <p className="text-muted-foreground">Manage stock corrections and adjustments</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Adjustment List
            </CardTitle>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90" onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> New Adjustment
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : adjustments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No adjustments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adjustment #</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-medium">{adjustment.adjustment_number}</TableCell>
                      <TableCell>{adjustment.warehouse?.name || '-'}</TableCell>
                      <TableCell>{adjustment.reason || '-'}</TableCell>
                      <TableCell>{new Date(adjustment.adjustment_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={adjustment.status === 'done' ? 'default' : 'outline'}>
                          {adjustment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {adjustment.status === 'draft' && (
                          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" onClick={() => validate(adjustment.id)}>
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
              <DialogTitle>New Adjustment</DialogTitle>
              <DialogDescription>Correct stock quantities</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Adjustment #</Label>
                  <Input value={form.adjustment_number} onChange={e => setForm({ ...form, adjustment_number: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.adjustment_date} onChange={e => setForm({ ...form, adjustment_date: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Select value={form.warehouse_id} onValueChange={(v) => setForm({ ...form, warehouse_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="e.g., damaged, mismatch" />
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
                    <Input type="number" min={0} value={l.new_quantity} onChange={e => setLines(lines.map((x,i) => i===idx ? { ...x, new_quantity: Number(e.target.value) } : x))} />
                    <button type="button" className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90" onClick={() => setLines(lines.filter((_,i)=>i!==idx))}>Remove</button>
                  </div>
                ))}
                <button type="button" className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm" onClick={() => setLines([...lines, { product_id: '', new_quantity: 0 }])}>Add Line</button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm" onClick={() => setDialogOpen(false)}>Cancel</button>
              <button type="submit" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow">Create</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
