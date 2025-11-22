import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle } from 'lucide-react';
import type { ForecastResult } from '@/utils/demandForecasting';
import { formatForecastMessage, getForecastColor } from '@/utils/demandForecasting';

interface DemandForecastCardProps {
  forecast: ForecastResult;
  productName?: string;
}

export default function DemandForecastCard({ forecast, productName }: DemandForecastCardProps) {
  const getTrendIcon = () => {
    switch (forecast.trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (forecast.trend) {
      case 'increasing':
        return 'text-destructive';
      case 'decreasing':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConfidenceBadge = () => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      high: 'default',
      medium: 'secondary',
      low: 'outline',
    };
    return (
      <Badge variant={variants[forecast.confidence]}>
        {forecast.confidence} confidence
      </Badge>
    );
  };

  const forecastMessage = formatForecastMessage(forecast);
  const forecastColor = getForecastColor(forecast.daysUntilStockout);
  const showWarning = forecast.daysUntilStockout <= 7 && forecast.daysUntilStockout !== Infinity;

  return (
    <Card className={showWarning ? 'border-destructive' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Demand Forecast</CardTitle>
          </div>
          {getConfidenceBadge()}
        </div>
        {productName && (
          <CardDescription>{productName}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {showWarning && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              Low stock alert!
            </span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Stock</span>
            <span className="font-semibold">{forecast.currentStock} units</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Daily Usage</span>
            <span className="font-semibold">
              {forecast.averageDailyConsumption.toFixed(2)} units/day
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Consumption Trend</span>
            <div className={`flex items-center gap-1 font-semibold ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="capitalize">{forecast.trend}</span>
            </div>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prediction</span>
              <span className={`font-bold ${forecastColor}`}>
                {forecastMessage}
              </span>
            </div>
          </div>

          {forecast.predictedStockoutDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expected Stockout</span>
              <span className="text-sm font-medium">
                {forecast.predictedStockoutDate.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {forecast.confidence === 'low' && (
          <p className="text-xs text-muted-foreground mt-2">
            ℹ️ More transaction history needed for accurate predictions
          </p>
        )}
      </CardContent>
    </Card>
  );
}
