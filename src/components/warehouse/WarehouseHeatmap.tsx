import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Warehouse, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RackData {
  id: string;
  name: string;
  capacity: number;
  currentStock: number;
  movementFrequency: number;
  products: Array<{ name: string; quantity: number }>;
}

interface WarehouseHeatmapProps {
  racks: RackData[];
  rows?: number;
  cols?: number;
}

export default function WarehouseHeatmap({ racks, rows = 4, cols = 6 }: WarehouseHeatmapProps) {
  const [selectedRack, setSelectedRack] = useState<RackData | null>(null);
  const [viewMode, setViewMode] = useState<'utilization' | 'activity'>('utilization');

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-destructive hover:bg-destructive/90';
    if (utilization >= 70) return 'bg-orange-500 hover:bg-orange-600';
    if (utilization >= 50) return 'bg-yellow-500 hover:bg-yellow-600';
    if (utilization >= 30) return 'bg-green-500 hover:bg-green-600';
    return 'bg-muted hover:bg-muted/80';
  };

  const getActivityColor = (frequency: number) => {
    if (frequency >= 20) return 'bg-blue-600 hover:bg-blue-700';
    if (frequency >= 15) return 'bg-blue-500 hover:bg-blue-600';
    if (frequency >= 10) return 'bg-blue-400 hover:bg-blue-500';
    if (frequency >= 5) return 'bg-blue-300 hover:bg-blue-400';
    return 'bg-muted hover:bg-muted/80';
  };

  const getRackColor = (rack: RackData) => {
    const utilization = (rack.currentStock / rack.capacity) * 100;
    return viewMode === 'utilization' 
      ? getUtilizationColor(utilization)
      : getActivityColor(rack.movementFrequency);
  };

  const gridRacks = Array.from({ length: rows * cols }, (_, i) => {
    return racks[i] || {
      id: `empty-${i}`,
      name: `R${Math.floor(i / cols) + 1}-${(i % cols) + 1}`,
      capacity: 0,
      currentStock: 0,
      movementFrequency: 0,
      products: [],
    };
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              <CardTitle>Warehouse Heatmap</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={viewMode === 'utilization' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setViewMode('utilization')}
              >
                Utilization
              </Badge>
              <Badge
                variant={viewMode === 'activity' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setViewMode('activity')}
              >
                Activity
              </Badge>
            </div>
          </div>
          <CardDescription>
            {viewMode === 'utilization' 
              ? 'Color intensity shows how full each rack is'
              : 'Color intensity shows movement frequency'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {gridRacks.map((rack) => {
              const utilization = rack.capacity > 0 
                ? ((rack.currentStock / rack.capacity) * 100).toFixed(0)
                : '0';
              const isEmpty = rack.capacity === 0;

              return (
                <button
                  key={rack.id}
                  onClick={() => !isEmpty && setSelectedRack(rack)}
                  disabled={isEmpty}
                  className={`
                    aspect-square rounded-lg transition-all duration-200
                    flex flex-col items-center justify-center p-2
                    ${isEmpty ? 'bg-muted/30 cursor-not-allowed' : getRackColor(rack)}
                    ${!isEmpty && 'cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md'}
                  `}
                >
                  <span className={`text-xs font-medium ${isEmpty ? 'text-muted-foreground' : 'text-white'}`}>
                    {rack.name}
                  </span>
                  {!isEmpty && (
                    <span className="text-[10px] text-white/80 mt-1">
                      {viewMode === 'utilization' ? `${utilization}%` : `${rack.movementFrequency} moves`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Click rack for details</span>
            </div>
          </div>

          {viewMode === 'utilization' && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Legend:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-muted rounded" />
                <span className="text-muted-foreground">&lt;30%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-muted-foreground">30-50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-muted-foreground">50-70%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-muted-foreground">70-90%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-destructive rounded" />
                <span className="text-muted-foreground">&gt;90%</span>
              </div>
            </div>
          )}

          {viewMode === 'activity' && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Legend:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-muted rounded" />
                <span className="text-muted-foreground">&lt;5</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-300 rounded" />
                <span className="text-muted-foreground">5-10</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-400 rounded" />
                <span className="text-muted-foreground">10-15</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-muted-foreground">15-20</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-600 rounded" />
                <span className="text-muted-foreground">&gt;20</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRack} onOpenChange={() => setSelectedRack(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rack Details: {selectedRack?.name}</DialogTitle>
            <DialogDescription>
              Current stock and product information
            </DialogDescription>
          </DialogHeader>
          {selectedRack && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-2xl font-bold">{selectedRack.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="text-2xl font-bold">{selectedRack.currentStock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                  <p className="text-2xl font-bold">
                    {((selectedRack.currentStock / selectedRack.capacity) * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Movement Frequency</p>
                  <p className="text-2xl font-bold">{selectedRack.movementFrequency}</p>
                </div>
              </div>

              {selectedRack.products.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Products in this rack:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedRack.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{product.name}</span>
                        <Badge variant="secondary">{product.quantity} units</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
