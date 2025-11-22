import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type CartItem = { product_id: string; name: string; sku: string; quantity: number };

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = items.map(i => i.product_id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.product_id !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const checkout = () => navigate('/checkout');

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Link to="/shop" className="text-primary hover:underline">Continue Shopping</Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-muted-foreground">Your cart is empty</div>
      ) : (
        <Card className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map(item => (
              <div key={item.product_id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => updateQuantity(item.product_id, -1)}>-</Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" onClick={() => updateQuantity(item.product_id, 1)}>+</Button>
                  <Button variant="destructive" onClick={() => removeItem(item.product_id)}>Remove</Button>
                </div>
              </div>
            ))}
            <Button className="w-full" onClick={checkout}>Proceed to Checkout</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}