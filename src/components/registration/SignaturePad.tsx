'use client';

import { useRef, useState } from 'react';
import { uploadSignatureFile } from '@/lib/registrationUploads';

const SIGN_PAD_WIDTH = 900;
const SIGN_PAD_HEIGHT = 260;

type SignaturePadProps = {
  value: string;
  onChange: (path: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
};

export default function SignaturePad({
  value,
  onChange,
  error,
  label = 'Signature',
  required,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasCanvasStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const context = canvas.getContext('2d');
    if (!context) return false;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] !== 0) return true;
    }
    return false;
  };

  const getRelativeCoords = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const { x, y } = getRelativeCoords(event);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setUploadError(null);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const { x, y } = getRelativeCoords(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
    setUploadError(null);
  };

  const uploadCanvasSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasCanvasStroke()) {
      setUploadError('Please draw a signature first or upload a signature image.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error('Could not capture signature image.'));
          },
          'image/png',
          0.95,
        );
      });
      const file = new File([blob], 'signature.png', { type: 'image/png' });
      const path = await uploadSignatureFile(file);
      onChange(path);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to upload signature.',
      );
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const path = await uploadSignatureFile(file);
      onChange(path);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to upload signature.',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-brand-900">
        {label}
        {required ? (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </p>
      <canvas
        ref={canvasRef}
        width={SIGN_PAD_WIDTH}
        height={SIGN_PAD_HEIGHT}
        className="h-44 w-full touch-none rounded-md border border-cream-300 bg-white shadow-sm"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={uploadCanvasSignature}
          disabled={uploading}
          className="rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Use drawn signature'}
        </button>
        <button
          type="button"
          onClick={clearSignature}
          className="rounded-md border border-cream-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          Clear
        </button>
        <label className="rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50">
          Upload image instead
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={onFileChange}
          />
        </label>
      </div>
      {value ? (
        <p className="text-xs text-sage-700">
          Signature uploaded: <span className="font-medium">{value}</span>
        </p>
      ) : null}
      {uploadError ? (
        <p className="text-xs font-medium text-red-600">{uploadError}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
