import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Warehouse,
  CheckCircle2,
  ArrowRight,
  Brain,
  QrCode,
  Map,
  Mic
} from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'AI Demand Forecasting',
      description: 'Predict stockouts before they happen with intelligent consumption analysis',
    },
    {
      icon: QrCode,
      title: 'QR Code System',
      description: 'Generate and scan QR codes for lightning-fast product identification',
    },
    {
      icon: Map,
      title: 'Warehouse Heatmap',
      description: 'Visual 2D grid showing rack utilization and movement patterns',
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Hands-free control for warehouse staff carrying boxes',
    },
    {
      icon: Package,
      title: 'Product Management',
      description: 'Complete control over your product catalog with SKU tracking',
    },
    {
      icon: Warehouse,
      title: 'Multi-Warehouse',
      description: 'Manage inventory across multiple locations with real-time visibility',
    },
    {
      icon: TrendingUp,
      title: 'Stock Operations',
      description: 'Streamline receipts, deliveries, transfers, and adjustments',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor KPIs and track stock movements with comprehensive reporting',
    },
  ];

  const benefits = [
    'AI predicts stockouts before they happen',
    'QR codes eliminate manual entry errors',
    'Visual heatmap optimizes warehouse layout',
    'Voice commands for hands-free operation',
    'Real-time inventory visibility',
    'Complete audit compliance',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">JSHS</span>
              <span className="text-xs text-muted-foreground ml-2">StockMaster</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 xl:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Powered by JSHS
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight xl:text-6xl">
            AI-Powered Inventory Management
            <span className="block text-primary mt-2">Made Simple</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground xl:text-xl max-w-2xl mx-auto">
            StockMaster combines AI forecasting, QR code scanning, warehouse heatmaps, and voice commands 
            to revolutionize your inventory operations. Real-time tracking with predictive insights.
          </p>
          <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
            <Button asChild size="lg" className="text-lg h-12 px-8">
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg h-12 px-8">
              <Link to="/login">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your inventory efficiently
            </p>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 xl:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Choose JSHS StockMaster?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Transform your inventory management with our comprehensive solution designed 
                for modern businesses.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Trusted by inventory managers worldwide
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">1M+</div>
                      <div className="text-sm text-muted-foreground">Products Tracked</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Managing millions of items daily
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Reliable and always available
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of businesses already using JSHS StockMaster
          </p>
          <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
            <Button asChild size="lg" className="text-lg h-12 px-8">
              <Link to="/login">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 xl:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">JSHS StockMaster</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2025 JSHS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
