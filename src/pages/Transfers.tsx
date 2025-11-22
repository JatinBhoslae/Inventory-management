import { useEffect, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getTransfers, validateTransfer, getWarehouses, getActiveProducts, createTransfer } from '@/db/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { TransferWithDetails } from '@/types/types';

export default function Transfers() {
  const [transfers, setTransfers] = useState<TransferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lines, setLines] = useState<{ product_id: string; quantity: number }[]>([{ product_id: '', quantity: 1 }]);
  const [form, setForm] = useState({
    transfer_number: '',
    from_warehouse_id: '',
    to_warehouse_id: '',
    transfer_date: new Date().toISOString().slice(0,10),
    notes: ''
  });

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      const data = await getTransfers();
      setTransfers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load transfers',
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
      if (!form.transfer_number || !form.from_warehouse_id || !form.to_warehouse_id || form.from_warehouse_id === form.to_warehouse_id) {
        toast({ title: 'Error', description: 'Please fill required fields and choose different warehouses', variant: 'destructive' });
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
      await createTransfer({
        transfer_number: form.transfer_number,
        from_warehouse_id: form.from_warehouse_id || null,
        to_warehouse_id: form.to_warehouse_id || null,
        status: 'draft',
        transfer_date: form.transfer_date,
        notes: form.notes || null,
        created_by: null,
        validated_by: null,
        validated_at: null
      } as any, validLines as any);
      toast({ title: 'Success', description: 'Transfer created' });
      setDialogOpen(false);
      setForm({ transfer_number: '', from_warehouse_id: '', to_warehouse_id: '', transfer_date: new Date().toISOString().slice(0,10), notes: '' });
      setLines([{ product_id: '', quantity: 1 }]);
      loadTransfers();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to create transfer', variant: 'destructive' });
    }
  };

  const validate = async (id: string) => {
    try {
      await validateTransfer(id);
      toast({ title: 'Validated', description: 'Transfer validated and ledger updated' });
      loadTransfers();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to validate transfer', variant: 'destructive' });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Internal Transfers</h1>
        <p className="text-muted-foreground">Manage stock movements between warehouses</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Transfer List
            </CardTitle>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" /> New Transfer
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
          ) : transfers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transfers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer #</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">{transfer.transfer_number}</TableCell>
                      <TableCell>{transfer.from_warehouse?.name || '-'}</TableCell>
                      <TableCell>{transfer.to_warehouse?.name || '-'}</TableCell>
                      <TableCell>{new Date(transfer.transfer_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={transfer.status === 'done' ? 'default' : 'outline'}>
                          {transfer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {transfer.status === 'draft' && (
                          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" onClick={() => validate(transfer.id)}>
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
              <DialogTitle>New Transfer</DialogTitle>
              <DialogDescription>Move stock between warehouses</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transfer #</Label>
                  <Input value={form.transfer_number} onChange={e => setForm({ ...form, transfer_number: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.transfer_date} onChange={e => setForm({ ...form, transfer_date: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Warehouse</Label>
                  <Select value={form.from_warehouse_id} onValueChange={(v) => setForm({ ...form, from_warehouse_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Warehouse</Label>
                  <Select value={form.to_warehouse_id} onValueChange={(v) => setForm({ ...form, to_warehouse_id: v })}>
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
