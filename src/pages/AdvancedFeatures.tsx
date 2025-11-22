import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DemandForecastCard from '@/components/forecast/DemandForecastCard';
import ProductQRCode from '@/components/qrcode/ProductQRCode';
import QRScanner from '@/components/qrcode/QRScanner';
import WarehouseHeatmap from '@/components/warehouse/WarehouseHeatmap';
import VoiceCommand from '@/components/voice/VoiceCommand';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, QrCode, Map, Mic, Sparkles } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { calculateDemandForecast } from '@/utils/demandForecasting';
import type { Product, StockLedger } from '@/types/types';
import type { ForecastResult } from '@/utils/demandForecasting';
import { useToast } from '@/hooks/use-toast';

export default function AdvancedFeatures() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<StockLedger[]>([]);
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;

      const { data: ledgerData, error: ledgerError } = await supabase
        .from('stock_ledger')
        .select('*')
        .order('created_at', { ascending: false });

      if (ledgerError) throw ledgerError;

      setProducts(Array.isArray(productsData) ? productsData : []);
      setLedgerEntries(Array.isArray(ledgerData) ? ledgerData : []);

      if (productsData && productsData.length > 0) {
        const forecastResults = productsData.map(product =>
          calculateDemandForecast(
            product.id,
            product.current_stock,
            ledgerData || [],
            30
          )
        );
        setForecasts(forecastResults);
        setSelectedProduct(productsData[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (data: { id: string; sku: string; type: string }) => {
    const product = products.find(p => p.id === data.id || p.sku === data.sku);
    if (product) {
      setSelectedProduct(product);
      setShowScanner(false);
      toast({
        title: 'Product Found',
        description: `${product.name} (${product.sku})`,
      });
    } else {
      toast({
        title: 'Product Not Found',
        description: 'The scanned product is not in the system',
        variant: 'destructive',
      });
    }
  };

  const handleVoiceCommand = (command: string, params: Record<string, string>) => {
    switch (command) {
      case 'check_stock':
        const product = products.find(p => 
          p.name.toLowerCase().includes(params.product.toLowerCase()) ||
          p.sku.toLowerCase().includes(params.product.toLowerCase())
        );
        if (product) {
          setSelectedProduct(product);
          toast({
            title: 'Stock Check',
            description: `${product.name}: ${product.current_stock} units`,
          });
        } else {
          toast({
            title: 'Product Not Found',
            description: `Could not find product: ${params.product}`,
            variant: 'destructive',
          });
        }
        break;

      case 'create_receipt':
        navigate('/receipts');
        break;

      case 'create_delivery':
        navigate('/deliveries');
        break;

      case 'navigate':
        navigate(`/${params.page}`);
        break;

      case 'show_alerts':
        const lowStockForecasts = forecasts.filter(f => f.daysUntilStockout <= 7 && f.daysUntilStockout !== Infinity);
        toast({
          title: 'Low Stock Alerts',
          description: `${lowStockForecasts.length} products need attention`,
        });
        break;

      default:
        toast({
          title: 'Unknown Command',
          description: 'Command not recognized',
          variant: 'destructive',
        });
    }
  };

  const mockRacks = [
    { id: 'r1', name: 'A1', capacity: 100, currentStock: 95, movementFrequency: 25, products: [{ name: 'Steel Rods', quantity: 50 }, { name: 'Bolts', quantity: 45 }] },
    { id: 'r2', name: 'A2', capacity: 100, currentStock: 75, movementFrequency: 18, products: [{ name: 'Screws', quantity: 75 }] },
    { id: 'r3', name: 'A3', capacity: 100, currentStock: 60, movementFrequency: 12, products: [{ name: 'Nuts', quantity: 60 }] },
    { id: 'r4', name: 'A4', capacity: 100, currentStock: 40, movementFrequency: 8, products: [{ name: 'Washers', quantity: 40 }] },
    { id: 'r5', name: 'A5', capacity: 100, currentStock: 20, movementFrequency: 4, products: [{ name: 'Brackets', quantity: 20 }] },
    { id: 'r6', name: 'A6', capacity: 100, currentStock: 10, movementFrequency: 2, products: [{ name: 'Clips', quantity: 10 }] },
    { id: 'r7', name: 'B1', capacity: 100, currentStock: 88, movementFrequency: 22, products: [{ name: 'Pipes', quantity: 88 }] },
    { id: 'r8', name: 'B2', capacity: 100, currentStock: 72, movementFrequency: 16, products: [{ name: 'Fittings', quantity: 72 }] },
    { id: 'r9', name: 'B3', capacity: 100, currentStock: 55, movementFrequency: 11, products: [{ name: 'Valves', quantity: 55 }] },
    { id: 'r10', name: 'B4', capacity: 100, currentStock: 35, movementFrequency: 7, products: [{ name: 'Connectors', quantity: 35 }] },
    { id: 'r11', name: 'B5', capacity: 100, currentStock: 18, movementFrequency: 3, products: [{ name: 'Adapters', quantity: 18 }] },
    { id: 'r12', name: 'B6', capacity: 100, currentStock: 8, movementFrequency: 1, products: [{ name: 'Caps', quantity: 8 }] },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Advanced Features</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            AI-powered insights and smart warehouse management tools
          </p>
        </div>
      </div>

      <Tabs defaultValue="forecast" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden xl:inline">AI Forecasting</span>
            <span className="xl:hidden">Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden xl:inline">QR Codes</span>
            <span className="xl:hidden">QR</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span className="hidden xl:inline">Warehouse Map</span>
            <span className="xl:hidden">Map</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden xl:inline">Voice Control</span>
            <span className="xl:hidden">Voice</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI-Based Demand Forecasting
              </CardTitle>
              <CardDescription>
                Predictive analytics based on historical consumption patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI analyzes your stock movement history to predict when products will run out, 
                helping you make proactive ordering decisions.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            {forecasts.length > 0 ? (
              forecasts.slice(0, 6).map((forecast) => {
                const product = products.find(p => p.id === forecast.productId);
                return (
                  <DemandForecastCard
                    key={forecast.productId}
                    forecast={forecast}
                    productName={product?.name}
                  />
                );
              })
            ) : (
              <Card className="xl:col-span-2">
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No products available for forecasting. Add products and create some transactions to see predictions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="qrcode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QR Code Generation & Scanning
              </CardTitle>
              <CardDescription>
                Streamline warehouse operations with QR code technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate unique QR codes for each product and scan them for quick identification. 
                Reduces manual entry errors and speeds up stock operations.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product QR Codes</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(!showScanner)}
                >
                  {showScanner ? 'Hide Scanner' : 'Scan QR Code'}
                </Button>
              </div>

              {showScanner ? (
                <QRScanner
                  onScan={handleQRScan}
                  onClose={() => setShowScanner(false)}
                />
              ) : selectedProduct ? (
                <ProductQRCode
                  productId={selectedProduct.id}
                  productName={selectedProduct.name}
                  sku={selectedProduct.sku}
                />
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">
                      No product selected. Add products to generate QR codes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Product</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {products.map((product) => (
                  <Button
                    key={product.id}
                    variant={selectedProduct?.id === product.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        SKU: {product.sku} | Stock: {product.current_stock}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Warehouse Heatmap
              </CardTitle>
              <CardDescription>
                Visual representation of warehouse rack utilization and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                See at a glance which racks are full, which are empty, and which areas have the most activity. 
                Optimize your warehouse layout based on movement patterns.
              </p>
            </CardContent>
          </Card>

          <WarehouseHeatmap racks={mockRacks} rows={4} cols={6} />

          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">High Utilization Racks:</span> A1, B1 (Consider redistribution)
              </p>
              <p className="text-sm">
                <span className="font-medium">Most Active Areas:</span> A1, A2, B1 (Optimize for quick access)
              </p>
              <p className="text-sm">
                <span className="font-medium">Low Activity Racks:</span> A6, B6 (Consider for slow-moving items)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Voice-Activated Commands
              </CardTitle>
              <CardDescription>
                Hands-free control for warehouse operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use voice commands to check stock, create operations, and navigate the system 
                without touching your device. Perfect for warehouse staff carrying boxes.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <VoiceCommand onCommand={handleVoiceCommand} />

            <Card>
              <CardHeader>
                <CardTitle>Voice Command Guide</CardTitle>
                <CardDescription>Learn how to use voice commands effectively</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Stock Checking</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Check stock of [product name]"</li>
                    <li>• "Check availability for [product name]"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Creating Operations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Create receipt for [quantity] [product]"</li>
                    <li>• "Create delivery for [quantity] [product]"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Navigation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Show dashboard"</li>
                    <li>• "Go to products"</li>
                    <li>• "Show low stock alerts"</li>
                  </ul>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">💡 Tips for Best Results</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Speak clearly and at a normal pace</li>
                    <li>• Use exact product names when possible</li>
                    <li>• Wait for the system to respond before next command</li>
                    <li>• Minimize background noise</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
