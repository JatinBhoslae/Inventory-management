import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAdjustments } from '@/db/api';
import type { AdjustmentWithDetails } from '@/types/types';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<AdjustmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Adjustments</h1>
        <p className="text-muted-foreground">Manage stock corrections and adjustments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Adjustment List
          </CardTitle>
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
