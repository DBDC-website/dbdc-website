'use client';

import { useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { BaseRegistrationValues } from '@/lib/validations/registration';
import {
  uploadDocumentFile,
  uploadSignatureFile,
} from '@/lib/registrationUploads';
import {
  CheckboxField,
  FormSection,
  TextAreaField,
  TextField,
} from '@/components/forms/Fields';

const emptyContact = {
  name: '',
  position: '',
  telephone: '',
  signatureName: '',
};

const emptyProject = {
  projectName: '',
  projectAddress: '',
  contractSum: '',
  startDate: '',
  endDate: '',
  clientName: '',
  architectEngineer: '',
};

export function CompanyInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title="Company information"
      description="Details of the company applying for registration."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Company name"
          required
          error={errors.companyName?.message}
          className="sm:col-span-2"
          {...register('companyName')}
        />
        <TextAreaField
          label="Registered address"
          className="sm:col-span-2"
          error={errors.registeredAddress?.message}
          {...register('registeredAddress')}
        />
        <TextField
          label="Telephone"
          error={errors.telephone?.message}
          {...register('telephone')}
        />
        <TextField label="Fax" error={errors.fax?.message} {...register('fax')} />
        <TextField
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Website"
          type="url"
          placeholder="https://"
          error={errors.website?.message}
          {...register('website')}
        />
        <TextField
          label="Business registration no."
          error={errors.businessRegistrationNo?.message}
          {...register('businessRegistrationNo')}
        />
        <TextField
          label="Business registration date"
          type="date"
          error={errors.registrationDate?.message}
          {...register('registrationDate')}
        />
        <TextAreaField
          label="Scope of services"
          className="sm:col-span-2"
          hint="Briefly describe the services your company provides."
          error={errors.scopeOfServices?.message}
          {...register('scopeOfServices')}
        />
      </div>
    </FormSection>
  );
}

export function CapitalSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title="Company capital"
      description="Enter amounts in HKD (numbers only)."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Authorized capital"
          inputMode="decimal"
          error={errors.capitalAuthorized?.message}
          {...register('capitalAuthorized')}
        />
        <TextField
          label="Issued capital"
          inputMode="decimal"
          error={errors.capitalIssued?.message}
          {...register('capitalIssued')}
        />
        <TextField
          label="Available capital"
          inputMode="decimal"
          error={errors.capitalAvailable?.message}
          {...register('capitalAvailable')}
        />
      </div>
    </FormSection>
  );
}

export function ContactsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' });

  return (
    <FormSection
      title="Principals / Managers"
      description="Principals or managers authorised to sign documents on behalf of the company."
    >
      {typeof errors.contacts?.message === 'string' ? (
        <p className="mb-4 text-xs font-medium text-red-600" role="alert">
          {errors.contacts.message}
        </p>
      ) : null}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-cream-200 bg-cream-50/60 p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-brand-800">
                Contact {index + 1}
              </h3>
              {fields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Name"
                required
                error={errors.contacts?.[index]?.name?.message}
                {...register(`contacts.${index}.name`)}
              />
              <TextField
                label="Post"
                error={errors.contacts?.[index]?.position?.message}
                {...register(`contacts.${index}.position`)}
              />
              <TextField
                label="Telephone"
                error={errors.contacts?.[index]?.telephone?.message}
                {...register(`contacts.${index}.telephone`)}
              />
              <TextField
                label="Signature name"
                hint="Name as it appears on the signed form."
                error={errors.contacts?.[index]?.signatureName?.message}
                {...register(`contacts.${index}.signatureName`)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append(emptyContact)}
        className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add contact
      </button>
    </FormSection>
  );
}

export function PreviousProjectsSection({
  employerLabel = 'Architect / Engineer',
}: {
  employerLabel?: string;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousProjects',
  });

  return (
    <FormSection
      title="Portfolio of major projects"
      description="Major projects carried out in Hong Kong over the past 5 years. Please highlight any experience on Church projects. (Optional)"
    >
      {typeof errors.previousProjects?.message === 'string' ? (
        <p className="mb-4 text-xs font-medium text-red-600" role="alert">
          {errors.previousProjects.message}
        </p>
      ) : null}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-cream-200 bg-cream-50/60 p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-brand-800">
                Project {index + 1}
              </h3>
              {fields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Project name"
                required
                className="sm:col-span-2"
                error={errors.previousProjects?.[index]?.projectName?.message}
                {...register(`previousProjects.${index}.projectName`)}
              />
              <TextField
                label="Project address"
                className="sm:col-span-2"
                error={errors.previousProjects?.[index]?.projectAddress?.message}
                {...register(`previousProjects.${index}.projectAddress`)}
              />
              <TextField
                label="Contract sum (HKD)"
                inputMode="decimal"
                error={errors.previousProjects?.[index]?.contractSum?.message}
                {...register(`previousProjects.${index}.contractSum`)}
              />
              <TextField
                label="Client name"
                error={errors.previousProjects?.[index]?.clientName?.message}
                {...register(`previousProjects.${index}.clientName`)}
              />
              <TextField
                label="Start date"
                type="date"
                error={errors.previousProjects?.[index]?.startDate?.message}
                {...register(`previousProjects.${index}.startDate`)}
              />
              <TextField
                label="End date"
                type="date"
                error={errors.previousProjects?.[index]?.endDate?.message}
                {...register(`previousProjects.${index}.endDate`)}
              />
              <TextField
                label={employerLabel}
                className="sm:col-span-2"
                error={errors.previousProjects?.[index]?.architectEngineer?.message}
                {...register(`previousProjects.${index}.architectEngineer`)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append(emptyProject)}
        className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add project
      </button>
    </FormSection>
  );
}

const SIGN_PAD_WIDTH = 900;
const SIGN_PAD_HEIGHT = 260;

export function SignatureAndDocumentsSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureUploading, setSignatureUploading] = useState(false);
  const [documentsUploading, setDocumentsUploading] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const documentUrls = watch('documentUrls');
  const signatureUrl = watch('signatureUrl');

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
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
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
    setSignatureError(null);
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
    setValue('signatureUrl', '', { shouldDirty: true, shouldValidate: true });
    setSignatureError(null);
  };

  const uploadCanvasSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasCanvasStroke()) {
      setSignatureError('Please draw a signature first or upload a signature image.');
      return;
    }

    setSignatureUploading(true);
    setSignatureError(null);
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
      setValue('signatureUrl', path, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      setSignatureError(
        error instanceof Error ? error.message : 'Failed to upload signature.',
      );
    } finally {
      setSignatureUploading(false);
    }
  };

  const onSignatureFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setSignatureUploading(true);
    setSignatureError(null);
    try {
      const path = await uploadSignatureFile(file);
      setValue('signatureUrl', path, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      setSignatureError(
        error instanceof Error ? error.message : 'Failed to upload signature.',
      );
    } finally {
      setSignatureUploading(false);
    }
  };

  const onDocumentsChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    setDocumentsUploading(true);
    setDocumentsError(null);

    try {
      const uploadedPaths: string[] = [];
      for (const file of files) {
        const path = await uploadDocumentFile(file);
        uploadedPaths.push(path);
      }
      const existing = watch('documentUrls') ?? [];
      setValue('documentUrls', [...existing, ...uploadedPaths], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      setDocumentsError(
        error instanceof Error ? error.message : 'Failed to upload documents.',
      );
    } finally {
      setDocumentsUploading(false);
    }
  };

  const removeDocumentAt = (index: number) => {
    const existing = watch('documentUrls') ?? [];
    setValue(
      'documentUrls',
      existing.filter((_, idx) => idx !== index),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  };

  return (
    <FormSection
      title="Signature and supporting documents"
      description="Signature is required. Supporting documents are optional (PDF, DOCX, JPG, PNG; max 10MB each)."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-medium text-brand-900">
            Signature
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
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
              disabled={signatureUploading}
              className="rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signatureUploading ? 'Uploading signature…' : 'Use drawn signature'}
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
                onChange={onSignatureFileChange}
              />
            </label>
          </div>
          {signatureUrl ? (
            <p className="text-xs text-sage-700">
              Signature uploaded: <span className="font-medium">{signatureUrl}</span>
            </p>
          ) : null}
          {signatureError ? (
            <p className="text-xs font-medium text-red-600">{signatureError}</p>
          ) : null}
          {typeof errors.signatureUrl?.message === 'string' ? (
            <p className="text-xs font-medium text-red-600" role="alert">
              {errors.signatureUrl.message}
            </p>
          ) : null}
          <input type="hidden" {...register('signatureUrl')} />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-brand-900">Supporting documents</p>
          <label className="inline-flex cursor-pointer items-center rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50">
            {documentsUploading ? 'Uploading documents…' : 'Upload documents'}
            <input
              type="file"
              multiple
              accept=".pdf,.docx,image/jpeg,image/png,.jpg,.png"
              className="sr-only"
              onChange={onDocumentsChange}
            />
          </label>
          <p className="text-xs text-stone-500">
            Accepted: PDF, DOCX, JPG, PNG (max 10MB per file).
          </p>
          {documentsError ? (
            <p className="text-xs font-medium text-red-600">{documentsError}</p>
          ) : null}
          <ul className="space-y-2">
            {documentUrls.map((path, index) => (
              <li
                key={`${path}-${index}`}
                className="flex items-start justify-between gap-3 rounded-md border border-cream-200 bg-cream-50/70 px-3 py-2 text-sm"
              >
                <span className="min-w-0 break-all text-stone-700">{path}</span>
                <button
                  type="button"
                  onClick={() => removeDocumentAt(index)}
                  className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FormSection>
  );
}

export function RemarksSection() {
  const { register } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection title="Remarks">
      <div className="space-y-3">
        <CheckboxField
          label="Please provide your company's audited accounts for the past 3 years, if available."
          {...register('auditedAccountsProvided')}
        />
        <CheckboxField
          label="We hereby agree DBDC may publish our company's particulars on the DBDC website."
          {...register('publishCompany')}
        />
      </div>
    </FormSection>
  );
}
