import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { Result } from '@zxing/library';

interface QrScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (code: string) => void;
}

export const QrScannerDialog: React.FC<QrScannerDialogProps> = ({
  open,
  onOpenChange,
  onScanComplete
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(true);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    if (open && scanning && !scanError && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      
      codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result: Result | null, error: Error | null) => {
        if (result) {
          const scannedText = result.getText();
          if (scannedText) {
            setScanning(false);
            onScanComplete(scannedText);
          }
        }
        if (error) {
          console.error('QR scan error:', error);
          setScanError('Could not access camera. Please enter the code manually.');
          toast.error('Camera access failed. Use manual entry instead.');
        }
      }).then((controls) => {
        controlsRef.current = controls;
      }).catch((error) => {
        console.error('QR scanner initialization error:', error);
        setScanError('Could not initialize camera. Please enter the code manually.');
        toast.error('Camera initialization failed. Use manual entry instead.');
      });
    }

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, [open, scanning, scanError, onScanComplete]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanComplete(manualCode.trim());
      setManualCode('');
    } else {
      toast.error('Please enter a valid code');
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setScanning(true);
      setScanError(null);
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Delivery QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {scanning && !scanError && (
            <div className="w-full max-w-[300px] h-[300px] overflow-hidden rounded-lg">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />
            </div>
          )}
          
          {scanError && (
            <div className="bg-muted rounded-lg w-full max-w-[300px] h-[300px] flex items-center justify-center">
              <p className="text-center text-muted-foreground px-4">
                {scanError}
              </p>
            </div>
          )}
          
          <form onSubmit={handleManualSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="deliveryCode" className="text-sm font-medium">
                Enter Delivery Code Manually
              </label>
              <input
                id="deliveryCode"
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. DEL-123456"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Verify Code</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
