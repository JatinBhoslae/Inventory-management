import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getDeliveries } from '@/db/api';
import type { DeliveryWithDetails } from '@/types/types';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<DeliveryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deliveries</h1>
        <p className="text-muted-foreground">Manage outgoing stock operations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery List
          </CardTitle>
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
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.delivery_number}</TableCell>
                      <TableCell>{delivery.customer?.name || '-'}</TableCell>
                      <TableCell>{delivery.warehouse?.name || '-'}</TableCell>
                      <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={delivery.status === 'done' ? 'default' : 'outline'}>
                          {delivery.status}
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
