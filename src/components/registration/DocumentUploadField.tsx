'use client';

import { useState } from 'react';
import {
  removeUploadedFile,
  uploadDocumentFile,
} from '@/lib/registrationUploads';

type DocumentUploadFieldProps = {
  label: string;
  hint?: string;
  value: string[];
  onChange: (paths: string[]) => void;
  attachNote?: string;
};

function displayDocumentName(path: string): string {
  const lastSegment = path.split('/').pop() ?? path;
  const decoded = decodeURIComponent(lastSegment);
  // Stored as `${Date.now()}-${uuid}-${originalName}`; show original only.
  return decoded.replace(/^\d{13}-[0-9a-fA-F-]{36}-/, '');
}

export default function DocumentUploadField({
  label,
  hint,
  value,
  onChange,
  attachNote = '(copy to be attached)',
}: DocumentUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await uploadDocumentFile(file));
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload documents.');
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    const discarded = value[index];
    onChange(value.filter((_, idx) => idx !== index));
    if (discarded) void removeUploadedFile(discarded);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-brand-900">
        {label}{' '}
        <span className="font-normal text-stone-500">{attachNote}</span>
      </p>
      {hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
      <label className="inline-flex cursor-pointer items-center rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50">
        {uploading ? 'Uploading…' : 'Upload documents'}
        <input
          type="file"
          multiple
          accept=".pdf,.docx,image/jpeg,image/png,.jpg,.png"
          className="sr-only"
          onChange={onFilesChange}
        />
      </label>
      <p className="text-xs text-stone-500">
        Accepted: PDF, DOCX, JPG, PNG (max 10MB per file).
      </p>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      {value.length > 0 ? (
        <ul className="space-y-2">
          {value.map((path, index) => (
            <li
              key={`${path}-${index}`}
              className="flex items-start justify-between gap-3 rounded-md border border-cream-200 bg-cream-50/70 px-3 py-2 text-sm"
            >
              <span className="min-w-0 break-all text-stone-700">
                {displayDocumentName(path)}
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
