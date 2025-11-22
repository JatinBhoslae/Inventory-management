import { useEffect, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getTransfers } from '@/db/api';
import type { TransferWithDetails } from '@/types/types';

export default function Transfers() {
  const [transfers, setTransfers] = useState<TransferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Internal Transfers</h1>
        <p className="text-muted-foreground">Manage stock movements between warehouses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer List
          </CardTitle>
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
