
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // Mock QR scanning - in a real app, you would implement a proper QR scanner
  // This uses a simple timeout to simulate scanning (for development purposes)
  useEffect(() => {
    if (open && !scanning) {
      setScanning(true);
      
      // For testing, we'll use a mock scanner with a timeout
      const timer = setTimeout(() => {
        // In a real implementation, you would use a browser QR scanner API
        // or a library like react-qr-reader
        
        // For testing, you can enter the code manually
        toast.info('For testing: Please enter the delivery code manually', {
          duration: 5000
        });
      }, 500);
      
      return () => {
        clearTimeout(timer);
        setScanning(false);
      };
    }
  }, [open, scanning]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanComplete(manualCode.trim());
      setManualCode('');
    } else {
      toast.error('Please enter a valid code');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Delivery QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="bg-muted rounded-lg w-full max-w-[300px] h-[300px] flex items-center justify-center">
            <p className="text-center text-muted-foreground px-4">
              QR Scanner would appear here in production.
              <br /><br />
              For development, please use manual entry below.
            </p>
          </div>
          
          <form onSubmit={handleManualSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="deliveryCode" className="text-sm font-medium">
                Enter Delivery Code
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
