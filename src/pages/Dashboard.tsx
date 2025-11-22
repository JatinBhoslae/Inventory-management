import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, FileText, Truck, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardKPIs, getLowStockProducts } from '@/db/api';
import type { DashboardKPIs, LowStockProduct } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [kpisData, lowStockData] = await Promise.all([
        getDashboardKPIs(),
        getLowStockProducts(),
      ]);
      setKpis(kpisData);
      setLowStockProducts(lowStockData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Products',
      value: kpis?.totalProducts || 0,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/products',
    },
    {
      title: 'Low Stock Items',
      value: kpis?.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      link: '/products',
    },
    {
      title: 'Pending Receipts',
      value: kpis?.pendingReceipts || 0,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      link: '/receipts',
    },
    {
      title: 'Pending Deliveries',
      value: kpis?.pendingDeliveries || 0,
      icon: TrendingDown,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      link: '/deliveries',
    },
  ];

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to StockMaster Control Center</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 grid-cols-1">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-muted" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          kpiCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`h-8 w-8 rounded-full ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {!loading && lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    {product.category_name && (
                      <Badge variant="outline" className="mt-1">
                        {product.category_name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <p className="text-lg font-bold text-destructive">
                      {product.current_stock}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Min: {product.min_stock_level}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <Link to="/products" className="block text-center text-sm text-primary hover:underline">
                  View all {lowStockProducts.length} low stock items
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-2 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              to="/receipts"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">New Receipt</p>
                <p className="text-sm text-muted-foreground">Record incoming stock</p>
              </div>
            </Link>
            <Link
              to="/deliveries"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">New Delivery</p>
                <p className="text-sm text-muted-foreground">Create outgoing order</p>
              </div>
            </Link>
            <Link
              to="/transfers"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Package className="h-5 w-5 text-chart-4" />
              <div>
                <p className="font-medium">Internal Transfer</p>
                <p className="text-sm text-muted-foreground">Move stock between warehouses</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Products</span>
              <span className="font-medium">{kpis?.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Items Needing Attention</span>
              <span className="font-medium text-destructive">{kpis?.lowStockItems || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending Operations</span>
              <span className="font-medium">
                {(kpis?.pendingReceipts || 0) + (kpis?.pendingDeliveries || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
