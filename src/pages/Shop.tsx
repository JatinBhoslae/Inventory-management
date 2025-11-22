import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveProducts } from '@/db/api';
import type { Product } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">Shop</h1>
        <p className="text-muted-foreground">Explore and buy products</p>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-muted-foreground">No products available</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-violet-500/10 to-indigo-500/10">
                <CardHeader>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">SKU: {p.sku}</Badge>
                    <span className="text-sm">Stock: {p.current_stock}</span>
                  </div>
                  <Button className="w-full" variant="default">View Details</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}