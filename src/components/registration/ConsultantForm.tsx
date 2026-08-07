'use client';

import { useState } from 'react';
import { FormProvider, useForm, useFormContext, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import {
  createConsultantSchema,
  CONSULTANT_NATURE_OPTIONS,
  AUTHORIZED_PERSON_CATEGORIES,
  type ConsultantRegistrationValues,
} from '@/lib/validations/registration';
import { submitConsultantRegistration } from '@/app/actions/registrations';
import {
  BusinessRegistrationSection,
  CapitalSection,
  CompanyInfoSection,
  ContactsSection,
  PreviousProjectsSection,
  RemarksSection,
  ScopeOfServicesSection,
} from '@/components/registration/SharedSections';
import OtherApprovedListsField from '@/components/registration/OtherApprovedListsField';
import DocumentUploadField from '@/components/registration/DocumentUploadField';
import {
  CheckboxField,
  FormSection,
  TextField,
} from '@/components/forms/Fields';
import Button from '@/components/ui/Button';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

const defaultValues: ConsultantRegistrationValues = {
  companyName: '',
  registeredAddress: '',
  telephone: '',
  fax: '',
  email: '',
  website: '',
  scopeOfServices: '',
  businessRegistrationNo: '',
  registrationDate: '',
  businessRegistrationDocumentUrls: [],
  capitalAuthorized: '',
  capitalIssued: '',
  capitalAvailable: '',
  auditedAccountDocumentUrls: [],
  privacyAgreed: false,
  natureOfBusiness: [],
  natureOfBusinessOther: '',
  aacsbListed: false,
  aacsbDate: '',
  eacsbListed: false,
  eacsbDate: '',
  professionalDetails: {
    authorizedPersonCategories: [],
    professionalName: '',
    professionalNo: '',
    registeredStructuralEngineer: false,
    registeredGeotechnicalEngineer: false,
    authorizedLandSurveyor: false,
    registeredInspector: false,
    registeredEnergyAssessor: false,
    otherRegisteredProfessionals: [],
    aacsbDocumentUrls: [],
    eacsbDocumentUrls: [],
    otherApprovedListEntries: [],
  },
  contacts: [{ name: '', position: '', telephone: '', signatureUrl: '' }],
  previousProjectUploads: [{ documentUrls: [] }],
};

function InHouseProfessionalSection() {
  const { register, watch, setValue, control } =
    useFormContext<ConsultantRegistrationValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'professionalDetails.otherRegisteredProfessionals',
  });
  const categories = watch('professionalDetails.authorizedPersonCategories') ?? [];

  const toggleCategory = (cat: (typeof AUTHORIZED_PERSON_CATEGORIES)[number]) => {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat];
    setValue('professionalDetails.authorizedPersonCategories', next, {
      shouldDirty: true,
    });
  };

  return (
    <FormSection
      title="In-house professional"
      description="Registered professionals employed by the company."
    >
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-medium text-brand-900">Authorised Person</p>
          <div className="flex flex-wrap gap-6">
            {AUTHORIZED_PERSON_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-2 text-sm text-brand-900"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-cream-300 text-brand-700"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField
            label="Registered Structural Eng."
            {...register('professionalDetails.registeredStructuralEngineer')}
          />
          <CheckboxField
            label="Registered Geotechnical Eng."
            {...register('professionalDetails.registeredGeotechnicalEngineer')}
          />
          <CheckboxField
            label="Authorised Land Surveyor"
            {...register('professionalDetails.authorizedLandSurveyor')}
          />
          <CheckboxField
            label="Registered Inspector (R.I.) under Section 3(3B) of the Building Ordinance"
            {...register('professionalDetails.registeredInspector')}
          />
          <CheckboxField
            label="Registered Energy Assessors (REA)"
            {...register('professionalDetails.registeredEnergyAssessor')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Professional:"
            {...register('professionalDetails.professionalName')}
          />
          <TextField
            label="No.:"
            {...register('professionalDetails.professionalNo')}
          />
        </div>

        <div className="space-y-4 border-t border-cream-200 pt-5">
          <p className="text-sm font-medium text-brand-900">
            Other Registered Professional, please specify:
          </p>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 rounded-lg border border-cream-200 bg-cream-50/60 p-4 sm:grid-cols-2"
            >
              <TextField
                label="Professional:"
                {...register(
                  `professionalDetails.otherRegisteredProfessionals.${index}.professional`,
                )}
              />
              <div className="flex items-end gap-2">
                <TextField
                  label="No.:"
                  className="flex-1"
                  {...register(
                    `professionalDetails.otherRegisteredProfessionals.${index}.no`,
                  )}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mb-0.5 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ professional: '', no: '' })}
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add more registered professional
          </button>
        </div>
      </div>
    </FormSection>
  );
}

function ApprovedListsSection() {
  const { register, watch, setValue, formState: { errors } } =
    useFormContext<ConsultantRegistrationValues>();

  return (
    <FormSection
      title="Approved lists & professional registrations"
      description="Indicate any approved lists your company is included on."
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-cream-200 bg-cream-50/50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckboxField
              label="List of Consultants of AACSB"
              {...register('aacsbListed')}
            />
            <TextField
              label="Date of listed"
              type="date"
              error={errors.aacsbDate?.message}
              {...register('aacsbDate')}
            />
          </div>
          <div className="mt-4">
            <DocumentUploadField
              label="AACSB list documents"
              value={watch('professionalDetails.aacsbDocumentUrls') ?? []}
              onChange={(paths) =>
                setValue('professionalDetails.aacsbDocumentUrls', paths, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-cream-200 bg-cream-50/50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckboxField
              label="List of consultants of EACSB"
              {...register('eacsbListed')}
            />
            <TextField
              label="Date of listed"
              type="date"
              error={errors.eacsbDate?.message}
              {...register('eacsbDate')}
            />
          </div>
          <div className="mt-4">
            <DocumentUploadField
              label="EACSB list documents"
              value={watch('professionalDetails.eacsbDocumentUrls') ?? []}
              onChange={(paths) =>
                setValue('professionalDetails.eacsbDocumentUrls', paths, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          </div>
        </div>

        <OtherApprovedListsField name="professionalDetails.otherApprovedListEntries" />
      </div>
    </FormSection>
  );
}

export default function ConsultantForm({ locale }: { locale: Locale }) {
  const methods = useForm<ConsultantRegistrationValues>({
    resolver: zodResolver(createConsultantSchema(locale)),
    defaultValues,
    mode: 'onBlur',
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const natureOfBusiness = methods.watch('natureOfBusiness') ?? [];
  const othersSelected = natureOfBusiness.includes('Others');

  const onInvalid = () => {
    setSubmitError(t(locale, 'forms.errors.invalidFields'));
    window.setTimeout(() => {
      const firstError = document.querySelector<HTMLElement>(
        'form [aria-invalid="true"]',
      );
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError?.focus?.();
    }, 50);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const result = await submitConsultantRegistration(values);
    if (result.ok) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitError(result.message || t(locale, 'forms.errors.submitFailed'));
    }
  }, onInvalid);

  if (submitted) {
    return (
      <div className="rounded-xl border border-sage-200 bg-sage-50/70 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage-600" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-brand-900">
          {t(locale, 'forms.success')}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
          {t(locale, 'forms.successBody')}
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        <CompanyInfoSection locale={locale} />

        <FormSection
          title={t(locale, 'forms.natureOfBusiness')}
          description={t(locale, 'forms.natureOfBusinessConsultantHint')}
        >
          {typeof errors.natureOfBusiness?.message === 'string' ? (
            <p className="mb-4 text-xs font-medium text-red-600" role="alert">
              {errors.natureOfBusiness.message}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONSULTANT_NATURE_OPTIONS.map((option) => (
              <CheckboxField
                key={option}
                label={option}
                value={option}
                {...register('natureOfBusiness')}
              />
            ))}
          </div>
          {othersSelected ? (
            <TextField
              label="Others (please specify):"
              className="mt-4"
              error={errors.natureOfBusinessOther?.message}
              {...register('natureOfBusinessOther')}
            />
          ) : null}
        </FormSection>

        <BusinessRegistrationSection locale={locale} />
        <ScopeOfServicesSection locale={locale} />
        <ApprovedListsSection />
        <InHouseProfessionalSection />
        <CapitalSection locale={locale} />
        <ContactsSection locale={locale} />
        <PreviousProjectsSection locale={locale} />
        <RemarksSection locale={locale} />

        {submitError ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? t(locale, 'forms.submitting') : t(locale, 'forms.submit')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
