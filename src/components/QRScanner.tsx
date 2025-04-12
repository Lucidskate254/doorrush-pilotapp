
import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    const codeReader = new BrowserQRCodeReader();
    let controlsRef: any = null;
    
    const startScanning = async () => {
      try {
        controlsRef = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, _, controls) => {
            if (result) {
              const scannedText = result.getText();
              if (scannedText) {
                onScan(scannedText);
                controls.stop();
              }
            }
          }
        );
      } catch (error) {
        console.error('Error initializing QR scanner:', error);
      }
    };
    
    startScanning();
    
    return () => {
      if (controlsRef) {
        controlsRef.stop();
      }
    };
  }, [onScan]);
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={onClose}
      >
        <XCircle className="h-6 w-6" />
      </Button>
      
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-lg overflow-hidden border-4 border-primary">
          <video
            ref={videoRef}
            className="h-[300px] w-[300px]"
            autoPlay
            playsInline
          />
        </div>
        <p className="text-sm text-center text-muted-foreground mb-2">
          Position the QR code within the frame to scan
        </p>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default QRScanner;
