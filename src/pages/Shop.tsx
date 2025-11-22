import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveProducts, getCategories } from '@/db/api';
import type { Product } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    const run = async () => {
      const [p, c] = await Promise.all([getActiveProducts(), getCategories()]);
      setProducts(p);
      setCategories(c.map((x: any) => ({ id: x.id, name: x.name })));
      setLoading(false);
    };
    run();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter(p => {
      const matchesText = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesCat = category === 'all' || p.category_id === category;
      return matchesText && matchesCat;
    });
    setFiltered(list);
  }, [products, search, category]);

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
        <>
          <div className="flex items-center justify-between gap-3">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or SKU"
              className="max-w-xs"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
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
        </>
      )}
    </div>
  );
}