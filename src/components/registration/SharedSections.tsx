'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { BaseRegistrationValues } from '@/lib/validations/registration';
import DocumentUploadField from '@/components/registration/DocumentUploadField';
import SignaturePad from '@/components/registration/SignaturePad';
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
  signatureUrl: '',
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
      </div>
    </FormSection>
  );
}

export function BusinessRegistrationSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title="Business registration certificate"
      description="Business registration certificate details."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Business registration cert. no."
          error={errors.businessRegistrationNo?.message}
          {...register('businessRegistrationNo')}
        />
        <TextField
          label="Business registration date"
          type="date"
          error={errors.registrationDate?.message}
          {...register('registrationDate')}
        />
      </div>
      <div className="mt-5">
        <DocumentUploadField
          label="Business registration certificate"
          value={watch('businessRegistrationDocumentUrls') ?? []}
          onChange={(paths) =>
            setValue('businessRegistrationDocumentUrls', paths, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        />
      </div>
    </FormSection>
  );
}

export function ScopeOfServicesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title="Scope of services"
      description="Briefly describe the services your company provides."
    >
      <TextAreaField
        label="Scope of services"
        rows={3}
        error={errors.scopeOfServices?.message}
        {...register('scopeOfServices')}
      />
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
      description="Provide capital amounts in your preferred format (e.g. 2 million)."
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
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' });

  return (
    <FormSection
      title="Principals / Directors"
      description="Principals or directors authorised to sign documents on behalf of the company."
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
            </div>
            <div className="mt-4">
              <SignaturePad
                label="Signature"
                required
                value={watch(`contacts.${index}.signatureUrl`) ?? ''}
                onChange={(path) =>
                  setValue(`contacts.${index}.signatureUrl`, path, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                error={errors.contacts?.[index]?.signatureUrl?.message}
              />
              <input type="hidden" {...register(`contacts.${index}.signatureUrl`)} />
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

export function PreviousProjectsSection() {
  const {
    control,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousProjectUploads',
  });

  return (
    <FormSection
      title="Portfolio of major projects"
      description="Major projects carried out in Hong Kong over the past 5 years. Please highlight any experience on Church projects. (Optional)"
    >
      <div className="space-y-4">
        {fields.map((field, index) => {
          const uploadedDocuments =
            watch(`previousProjectUploads.${index}.documentUrls`) ?? [];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-cream-200 bg-cream-50/60 p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-800">
                  Project upload {index + 1}
                </p>
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
              <DocumentUploadField
                label="Portfolio documents"
                value={uploadedDocuments}
                onChange={(paths) =>
                  setValue(`previousProjectUploads.${index}.documentUrls`, paths, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              />
              <input
                type="hidden"
                {...register(`previousProjectUploads.${index}.documentUrls`)}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ documentUrls: [] })}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add project upload box
      </button>
    </FormSection>
  );
}

export function RemarksSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const auditedAccountDocumentUrls = watch('auditedAccountDocumentUrls') ?? [];
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';

  return (
    <FormSection title="Remarks">
      <div className="space-y-5">
        <div className="rounded-lg border border-cream-200 bg-cream-50/50 p-4">
          <p className="text-sm font-medium text-brand-900">
            Audited accounts for the past 3 years
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Please upload your company&apos;s audited accounts for the past 3
            years, if available.
          </p>
          <div className="mt-3">
            <DocumentUploadField
              label="Audited accounts"
              value={auditedAccountDocumentUrls}
              onChange={(paths) =>
                setValue('auditedAccountDocumentUrls', paths, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              attachNote=""
            />
          </div>
        </div>
        <div>
          <CheckboxField
            label="I have read and agree to the Personal Information Collection Statement. I understand that confidential information submitted in this form will be used only for DBDC registration purposes and handled in accordance with the Diocese’s privacy policy."
            {...register('privacyAgreed')}
          />
          {errors.privacyAgreed?.message ? (
            <p className="mt-2 text-xs font-medium text-red-600" role="alert">
              {errors.privacyAgreed.message}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-stone-500">
            <Link
              href={`/${locale}/pics`}
              className="font-medium text-brand-800 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the Personal Information Collection Statement
            </Link>
            {' · '}
            <Link
              href={`/${locale}/privacy-policy`}
              className="font-medium text-brand-800 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </FormSection>
  );
}
