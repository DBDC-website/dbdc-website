'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { BaseRegistrationValues } from '@/lib/validations/registration';
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
      description="Major projects carried out in Hong Kong over the past 5 years (minimum 3). Please highlight any experience on Church projects."
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
