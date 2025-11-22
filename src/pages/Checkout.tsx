import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { placeCustomerOrder } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';

type CartItem = { product_id: string; name: string; sku: string; quantity: number };

export default function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
  }, []);

  const payAndPlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const payload = items.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
      await placeCustomerOrder(payload, profile?.id || null, null);
      localStorage.removeItem('cart');
      navigate('/user/orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 ? (
              <div className="text-muted-foreground">No items</div>
            ) : (
              items.map(i => (
                <div key={i.product_id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {i.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Qty</p>
                    <p className="font-bold">{i.quantity}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-rose-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery address" />
            </div>
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
            </div>
            <Button className="w-full" disabled={loading || items.length === 0} onClick={payAndPlaceOrder}>
              {loading ? 'Processing...' : 'Pay & Place Order'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}