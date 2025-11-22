import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: { id: string; sku: string; type: string }) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please use file upload instead.',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: 'Feature Note',
      description: 'QR scanning from images requires additional setup. Please use camera scanning or manual entry.',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <CardTitle>Scan QR Code</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Point camera at product QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isScanning ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />
              <div className="absolute inset-0 border-2 border-primary/50 m-8 rounded-lg pointer-events-none" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Position QR code within the frame
            </p>
            <Button onClick={stopCamera} variant="destructive" className="w-full">
              Stop Camera
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Camera access required for QR scanning
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </CardContent>
    </Card>
  );
}
