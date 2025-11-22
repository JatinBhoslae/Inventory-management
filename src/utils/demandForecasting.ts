import type { StockLedger } from '@/types/types';

export interface ForecastResult {
  productId: string;
  currentStock: number;
  averageDailyConsumption: number;
  daysUntilStockout: number;
  predictedStockoutDate: Date | null;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: 'high' | 'medium' | 'low';
}

export function calculateDemandForecast(
  productId: string,
  currentStock: number,
  ledgerEntries: StockLedger[],
  daysToAnalyze: number = 30
): ForecastResult {
  const now = new Date();
  const startDate = new Date(now.getTime() - daysToAnalyze * 24 * 60 * 60 * 1000);

  const relevantEntries = ledgerEntries
    .filter(entry => 
      entry.product_id === productId &&
      new Date(entry.created_at) >= startDate &&
      (entry.operation_type === 'delivery' || entry.operation_type === 'adjustment')
    )
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (relevantEntries.length < 2) {
    return {
      productId,
      currentStock,
      averageDailyConsumption: 0,
      daysUntilStockout: Infinity,
      predictedStockoutDate: null,
      trend: 'stable',
      confidence: 'low',
    };
  }

  let totalConsumption = 0;
  relevantEntries.forEach(entry => {
    if (entry.quantity_change < 0) {
      totalConsumption += Math.abs(entry.quantity_change);
    }
  });

  const firstEntry = new Date(relevantEntries[0].created_at);
  const lastEntry = new Date(relevantEntries[relevantEntries.length - 1].created_at);
  const daysCovered = Math.max(1, (lastEntry.getTime() - firstEntry.getTime()) / (24 * 60 * 60 * 1000));

  const averageDailyConsumption = totalConsumption / daysCovered;

  const daysUntilStockout = averageDailyConsumption > 0 
    ? currentStock / averageDailyConsumption 
    : Infinity;

  const predictedStockoutDate = averageDailyConsumption > 0 && daysUntilStockout < 365
    ? new Date(now.getTime() + daysUntilStockout * 24 * 60 * 60 * 1000)
    : null;

  const recentEntries = relevantEntries.slice(-7);
  const olderEntries = relevantEntries.slice(0, Math.max(1, relevantEntries.length - 7));
  
  const recentConsumption = recentEntries.reduce((sum, e) => 
    sum + (e.quantity_change < 0 ? Math.abs(e.quantity_change) : 0), 0);
  const olderConsumption = olderEntries.reduce((sum, e) => 
    sum + (e.quantity_change < 0 ? Math.abs(e.quantity_change) : 0), 0);

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (recentConsumption > olderConsumption * 1.2) {
    trend = 'increasing';
  } else if (recentConsumption < olderConsumption * 0.8) {
    trend = 'decreasing';
  }

  const confidence: 'high' | 'medium' | 'low' = 
    relevantEntries.length >= 10 ? 'high' :
    relevantEntries.length >= 5 ? 'medium' : 'low';

  return {
    productId,
    currentStock,
    averageDailyConsumption,
    daysUntilStockout,
    predictedStockoutDate,
    trend,
    confidence,
  };
}

export function formatForecastMessage(forecast: ForecastResult): string {
  if (forecast.averageDailyConsumption === 0) {
    return 'No consumption data available';
  }

  if (forecast.daysUntilStockout === Infinity) {
    return 'Stock level stable';
  }

  const days = Math.floor(forecast.daysUntilStockout);
  
  if (days < 0) {
    return 'Out of stock';
  }

  if (days === 0) {
    return 'Stock will run out today';
  }

  if (days === 1) {
    return 'Stock will run out tomorrow';
  }

  if (days <= 7) {
    return `⚠️ Stock will run out in ${days} days`;
  }

  if (days <= 30) {
    return `Stock will run out in ${days} days`;
  }

  return `Stock sufficient for ${days} days`;
}

export function getForecastColor(daysUntilStockout: number): string {
  if (daysUntilStockout === Infinity) return 'text-muted-foreground';
  if (daysUntilStockout <= 3) return 'text-destructive';
  if (daysUntilStockout <= 7) return 'text-orange-500';
  if (daysUntilStockout <= 14) return 'text-yellow-500';
  return 'text-green-500';
}
