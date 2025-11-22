import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getStockLedger } from '@/db/api';
import type { StockLedger } from '@/types/types';

export default function StockLedgerPage() {
  const [ledger, setLedger] = useState<StockLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    try {
      setLoading(true);
      const data = await getStockLedger();
      setLedger(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load stock ledger',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Ledger</h1>
        <p className="text-muted-foreground">Complete audit trail of all stock movements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Movement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : ledger.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stock movements recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Before</TableHead>
                    <TableHead className="text-right">After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.operation_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{(entry as any).product?.name || '-'}</TableCell>
                      <TableCell className="font-medium">{entry.operation_number}</TableCell>
                      <TableCell className="text-right">
                        <span className={entry.quantity_change > 0 ? 'text-success' : 'text-destructive'}>
                          {entry.quantity_change > 0 ? '+' : ''}{entry.quantity_change}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{entry.stock_before}</TableCell>
                      <TableCell className="text-right font-medium">{entry.stock_after}</TableCell>
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
