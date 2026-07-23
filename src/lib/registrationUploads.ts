'use client';

import { supabase } from '@/lib/supabaseClient';

const REGISTRATION_BUCKET = 'registration-documents';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]);
const ALLOWED_SIGNATURE_TYPES = new Set(['image/png', 'image/jpeg']);

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(-120);
}

function ensureSize(file: File) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`"${file.name}" exceeds 10MB.`);
  }
}

export function validateDocumentFile(file: File) {
  ensureSize(file);
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    throw new Error(`"${file.name}" has an unsupported file type.`);
  }
}

export function validateSignatureFile(file: File) {
  ensureSize(file);
  if (!ALLOWED_SIGNATURE_TYPES.has(file.type)) {
    throw new Error('Signature must be a PNG or JPG image.');
  }
}

async function uploadFile(file: File, kind: 'signatures' | 'documents') {
  const fileName = sanitizeFileName(file.name);
  const path = `${kind}/${Date.now()}-${crypto.randomUUID()}-${fileName}`;

  const { error } = await supabase.storage
    .from(REGISTRATION_BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error(error.message);
  }

  // Bucket is private; store a stable identifier for later signed URL retrieval.
  return `${REGISTRATION_BUCKET}/${path}`;
}

export async function uploadSignatureFile(file: File): Promise<string> {
  validateSignatureFile(file);
  return uploadFile(file, 'signatures');
}

export async function uploadDocumentFile(file: File): Promise<string> {
  validateDocumentFile(file);
  return uploadFile(file, 'documents');
}
