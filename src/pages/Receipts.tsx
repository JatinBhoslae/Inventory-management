import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getReceipts } from '@/db/api';
import type { ReceiptWithDetails } from '@/types/types';

export default function Receipts() {
  const [receipts, setReceipts] = useState<ReceiptWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Receipts</h1>
        <p className="text-muted-foreground">Manage incoming stock operations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Receipt List
          </CardTitle>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
