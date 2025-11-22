import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import type { Product } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        setProduct(data as Product);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((c: any) => c.product_id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product_id: product.id, name: product.name, sku: product.sku, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  return (
    <div className="container py-6">
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-muted" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full bg-muted" />
          </CardContent>
        </Card>
      ) : !product ? (
        <div className="text-center text-muted-foreground">Product not found</div>
      ) : (
        <Card className="bg-gradient-to-r from-pink-500/10 to-yellow-500/10">
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline">SKU: {product.sku}</Badge>
              <Badge variant="outline">Stock: {product.current_stock}</Badge>
            </div>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Unit: {product.unit_of_measure}</div>
              <div className="text-sm text-muted-foreground">Category: {product.category_id || 'N/A'}</div>
            </div>
            <Button className="w-full" onClick={addToCart}>Add to Cart</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}