import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';

interface ProductQRCodeProps {
  productId: string;
  productName: string;
  sku: string;
}

export default function ProductQRCode({ productId, productName, sku }: ProductQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (canvasRef.current) {
      const qrData = JSON.stringify({
        id: productId,
        sku: sku,
        type: 'product',
      });

      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch(err => {
        console.error('QR Code generation error:', err);
      });

      QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error('QR Code data URL error:', err);
      });
    }
  }, [productId, sku]);

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `${sku}-qrcode.png`;
      link.href = qrDataUrl;
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Product QR Code</CardTitle>
        </div>
        <CardDescription>Scan to quickly identify this product</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <canvas ref={canvasRef} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">{productName}</p>
          <p className="text-xs text-muted-foreground">SKU: {sku}</p>
        </div>
        <Button onClick={handleDownload} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
