import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface Props {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
        if (result) {
          onScan(result.getText());
        }
        if (err && !(err instanceof TypeError)) {
          // TypeError is thrown continuously when no barcode is detected — ignore it
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Camera access failed');
      });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream | null;
        stream?.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Scan Barcode</h2>
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        {error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
          <video
            ref={videoRef}
            className="max-h-[70vh] w-full max-w-md rounded-lg"
          />
        )}
      </div>
      <p className="pb-6 text-center text-sm text-gray-400">
        Point your camera at a barcode on the record sleeve
      </p>
    </div>
  );
}
