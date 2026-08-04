'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/constants/i18n';
import type { BaseRegistrationValues } from '@/lib/validations/registration';
import DocumentUploadField from '@/components/registration/DocumentUploadField';
import SignaturePad from '@/components/registration/SignaturePad';
import {
  CheckboxField,
  FormSection,
  TextAreaField,
  TextField,
} from '@/components/forms/Fields';
import { t } from '@/lib/i18n';

const emptyContact = {
  name: '',
  position: '',
  telephone: '',
  signatureUrl: '',
};

type LocaleProps = { locale: Locale };

export function CompanyInfoSection({ locale }: LocaleProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title={t(locale, 'forms.companyInformation')}
      description={t(locale, 'forms.companyInformationDescription')}
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
          required
          error={errors.telephone?.message}
          {...register('telephone')}
        />
        <TextField label="Fax" error={errors.fax?.message} {...register('fax')} />
        <TextField
          label="Email"
          type="email"
          required
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

export function BusinessRegistrationSection({ locale }: LocaleProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title={t(locale, 'forms.businessRegistration')}
      description={t(locale, 'forms.businessRegistrationDescription')}
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

export function ScopeOfServicesSection({ locale }: LocaleProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title={t(locale, 'forms.scopeOfServices')}
      description={t(locale, 'forms.scopeOfServicesDescription')}
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

export function CapitalSection({ locale }: LocaleProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <FormSection
      title={t(locale, 'forms.companyCapital')}
      description={t(locale, 'forms.companyCapitalDescription')}
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

export function ContactsSection({ locale }: LocaleProps) {
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
      title={t(locale, 'forms.principals')}
      description={t(locale, 'forms.principalsDescription')}
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
                label={t(locale, 'forms.signature')}
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

export function PreviousProjectsSection({ locale }: LocaleProps) {
  const {
    control,
    setValue,
    register,
    watch,
  } = useFormContext<BaseRegistrationValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousProjectUploads',
  });

  return (
    <FormSection
      title={t(locale, 'forms.portfolio')}
      description={t(locale, 'forms.portfolioDescription')}
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
        {t(locale, 'forms.addProjectUpload')}
      </button>
    </FormSection>
  );
}

export function RemarksSection({ locale }: LocaleProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const auditedAccountDocumentUrls = watch('auditedAccountDocumentUrls') ?? [];

  return (
    <FormSection title={t(locale, 'forms.remarks')}>
      <div className="space-y-5">
        <div className="rounded-lg border border-cream-200 bg-cream-50/50 p-4">
          <p className="text-sm font-medium text-brand-900">
            {t(locale, 'forms.auditedAccountsTitle')}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {t(locale, 'forms.auditedAccountsHint')}
          </p>
          <div className="mt-3">
            <DocumentUploadField
              label={t(locale, 'forms.auditedAccountsLabel')}
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
            label={t(locale, 'forms.privacyAgreedCheckbox')}
            required
            error={errors.privacyAgreed?.message}
            {...register('privacyAgreed')}
          />
          <p className="mt-2 text-xs text-stone-500">
            <Link
              href={`/${locale}/pics`}
              className="font-medium text-brand-800 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(locale, 'forms.privacyPicsLink')}
            </Link>
            {' · '}
            <Link
              href={`/${locale}/privacy-policy`}
              className="font-medium text-brand-800 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(locale, 'forms.privacyPolicyLink')}
            </Link>
          </p>
        </div>
      </div>
    </FormSection>
  );
}
