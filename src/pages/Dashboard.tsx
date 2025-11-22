import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, FileText, Truck, TrendingUp, TrendingDown, Trophy, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardKPIs, getLowStockProducts, getTopSellingProductsByMonth, getRecentPurchasedProducts } from '@/db/api';
import type { DashboardKPIs, LowStockProduct, TopSellingProduct, RecentPurchasedProduct } from '@/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([]);
  const [recentPurchasedProducts, setRecentPurchasedProducts] = useState<RecentPurchasedProduct[]>([]);
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [selectedYear, selectedMonth]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [kpisData, lowStockData, topSellingData, recentPurchasedData] = await Promise.all([
        getDashboardKPIs(),
        getLowStockProducts(),
        getTopSellingProductsByMonth(selectedYear, selectedMonth, 10),
        getRecentPurchasedProducts(10),
      ]);
      setKpis(kpisData);
      setLowStockProducts(lowStockData);
      setTopSellingProducts(topSellingData);
      setRecentPurchasedProducts(recentPurchasedData);
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
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-background to-muted/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`h-8 w-8 rounded-full ${card.bgColor} flex items-center justify-center shadow-sm`}> 
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold transition-all duration-300">{card.value}</div>
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
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-sm"
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
              <Trophy className="h-5 w-5 text-primary" />
              Top Selling Products
            </CardTitle>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
              <div className="w-32">
                <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jan</SelectItem>
                    <SelectItem value="2">Feb</SelectItem>
                    <SelectItem value="3">Mar</SelectItem>
                    <SelectItem value="4">Apr</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">Jun</SelectItem>
                    <SelectItem value="7">Jul</SelectItem>
                    <SelectItem value="8">Aug</SelectItem>
                    <SelectItem value="9">Sep</SelectItem>
                    <SelectItem value="10">Oct</SelectItem>
                    <SelectItem value="11">Nov</SelectItem>
                    <SelectItem value="12">Dec</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-28">
                <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }).map((_, i) => {
                      const y = now.getFullYear() - i;
                      return (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {topSellingProducts.length > 0 && (
              <ChartContainer
                className="mb-6"
                config={{ sales: { label: 'Sales', color: 'hsl(var(--primary))' } }}
              >
                <BarChart data={topSellingProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={50} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="total_sold" fill="hsl(var(--primary))" name="Sales" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : topSellingProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No sales found.</div>
            ) : (
              <div className="space-y-3">
                {topSellingProducts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Sold</p>
                      <p className="text-lg font-bold">{item.total_sold}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-chart-4" />
              Recent Purchased Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : recentPurchasedProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent purchases.</div>
            ) : (
              <div className="space-y-3">
                {recentPurchasedProducts.map((item) => (
                  <div key={`${item.id}-${item.receipt_date}`} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Qty</p>
                      <p className="text-lg font-bold">{item.quantity}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.receipt_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-success/10 to-success/20"
            >
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">New Receipt</p>
                <p className="text-sm text-muted-foreground">Record incoming stock</p>
              </div>
            </Link>
            <Link
              to="/deliveries"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-primary/10 to-primary/20"
            >
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">New Delivery</p>
                <p className="text-sm text-muted-foreground">Create outgoing order</p>
              </div>
            </Link>
            <Link
              to="/transfers"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-chart-4/10 to-chart-4/20"
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
