import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Order = { id: string; delivery_number: string; delivery_date: string; status: string };

export default function Orders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!profile) { setLoading(false); return; }
      try {
        const { data } = await supabase
          .from('deliveries')
          .select('id, delivery_number, delivery_date, status')
          .eq('created_by', profile.id)
          .order('delivery_date', { ascending: false });
        setOrders(Array.isArray(data) ? (data as Order[]) : []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [profile]);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Track Orders</h1>
      </div>
      <Card className="bg-gradient-to-r from-sky-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full bg-muted" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground">No orders</div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{o.delivery_number}</p>
                    <p className="text-sm text-muted-foreground">{new Date(o.delivery_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Status</p>
                    <p className="font-bold">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}