'use client';

import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import {
  contractorSchema,
  CONTRACTOR_NATURE_OPTIONS,
  CONTRACTOR_MINOR_WORKS_OPTIONS,
  type ContractorRegistrationValues,
} from '@/lib/validations/registration';
import { submitContractorRegistration } from '@/app/actions/registrations';
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

const defaultValues: ContractorRegistrationValues = {
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
  publishCompany: false,
  auditedAccountsProvided: false,
  auditedAccountDocumentUrls: [],
  natureOfBusiness: [],
  natureOfBusinessOther: '',
  buildingsDeptRegNo: '',
  buildingsDeptDate: '',
  buildingsDeptDocumentUrls: [],
  devbApproved: false,
  devbDate: '',
  professionalDetails: {
    authorizedPerson: false,
    architect: false,
    siteEngineer: false,
    buildingSurveyor: false,
    quantitySurveyor: false,
    registeredInspector: false,
    registeredEnergyAssessor: false,
    otherProfessional: false,
    otherProfessionalSpecify: '',
    devbDocumentUrls: [],
    otherApprovedListEntries: [],
  },
  contacts: [{ name: '', position: '', telephone: '', signatureUrl: '' }],
  previousProjects: [],
};

function InHouseProfessionalSection() {
  const { register, watch } = useFormContext<ContractorRegistrationValues>();
  const otherSelected = watch('professionalDetails.otherProfessional');

  return (
    <FormSection
      title="In-house professional"
      description="Registered professionals employed by the company."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField
          label="Authorized Person (A.P.)"
          {...register('professionalDetails.authorizedPerson')}
        />
        <CheckboxField
          label="Architect"
          {...register('professionalDetails.architect')}
        />
        <CheckboxField
          label="Site Engineer"
          {...register('professionalDetails.siteEngineer')}
        />
        <CheckboxField
          label="Building Surveyor"
          {...register('professionalDetails.buildingSurveyor')}
        />
        <CheckboxField
          label="Quantity Surveyor"
          {...register('professionalDetails.quantitySurveyor')}
        />
        <CheckboxField
          label="Registered Inspector (R.I.) under Section 3(3B) of the Building Ordinance"
          {...register('professionalDetails.registeredInspector')}
        />
        <CheckboxField
          label="Registered Energy Assessors (REA)"
          {...register('professionalDetails.registeredEnergyAssessor')}
        />
        <CheckboxField
          label="Others (please specify)"
          {...register('professionalDetails.otherProfessional')}
        />
      </div>
      {otherSelected ? (
        <TextField
          label="Others (please specify):"
          className="mt-4"
          {...register('professionalDetails.otherProfessionalSpecify')}
        />
      ) : null}
    </FormSection>
  );
}

function BuildingsDepartmentSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContractorRegistrationValues>();

  return (
    <FormSection
      title="Building Department registration"
      description="Buildings Department registration details."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Buildings Department Registration No."
          error={errors.buildingsDeptRegNo?.message}
          {...register('buildingsDeptRegNo')}
        />
        <TextField
          label="Date of Registration / Renewal"
          type="date"
          error={errors.buildingsDeptDate?.message}
          {...register('buildingsDeptDate')}
        />
      </div>
      <div className="mt-5">
        <DocumentUploadField
          label="Buildings Department registration"
          value={watch('buildingsDeptDocumentUrls') ?? []}
          onChange={(paths) =>
            setValue('buildingsDeptDocumentUrls', paths, {
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

function ApprovedListsSection() {
  const { register, watch, setValue, formState: { errors } } =
    useFormContext<ContractorRegistrationValues>();

  return (
    <FormSection
      title="Approved lists"
      description="Indicate the government approved lists your company is included on, with dates where applicable."
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-cream-200 bg-cream-50/50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckboxField
              label="DevB List of Approved Contractors"
              {...register('devbApproved')}
            />
            <TextField
              label="Date of listed"
              type="date"
              error={errors.devbDate?.message}
              {...register('devbDate')}
            />
          </div>
          <div className="mt-4">
            <DocumentUploadField
              label="DevB list documents"
              value={watch('professionalDetails.devbDocumentUrls') ?? []}
              onChange={(paths) =>
                setValue('professionalDetails.devbDocumentUrls', paths, {
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

export default function ContractorForm() {
  const methods = useForm<ContractorRegistrationValues>({
    resolver: zodResolver(contractorSchema),
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

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const result = await submitContractorRegistration(values);
    if (result.ok) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitError(result.message);
    }
  });

  if (submitted) {
    return (
      <div className="rounded-xl border border-sage-200 bg-sage-50/70 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage-600" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-brand-900">
          Registration submitted
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
          Thank you. Your contractor registration has been received and will be
          reviewed by the DBDC office. We will be in touch if further information
          is required.
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        <CompanyInfoSection />

        <FormSection
          title="Nature of business"
          description="Select all contractor classifications that apply."
        >
          {typeof errors.natureOfBusiness?.message === 'string' ? (
            <p className="mb-4 text-xs font-medium text-red-600" role="alert">
              {errors.natureOfBusiness.message}
            </p>
          ) : null}
          <p className="mb-4 text-xs text-stone-500">
            † = Registered under Buildings Department
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONTRACTOR_NATURE_OPTIONS.map((option) => (
              <CheckboxField
                key={option.value}
                label={
                  option.bdRegistered ? `${option.label} †` : option.label
                }
                value={option.value}
                {...register('natureOfBusiness')}
              />
            ))}
          </div>

          <div className="mt-4">
            <p className="mb-3 text-sm font-medium text-brand-900">Minor works</p>
            <div className="flex flex-wrap gap-6">
              {CONTRACTOR_MINOR_WORKS_OPTIONS.map((category) => (
                <CheckboxField
                  key={category}
                  label={category.replace('Minor Works ', '')}
                  value={category}
                  {...register('natureOfBusiness')}
                />
              ))}
            </div>
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

        <BusinessRegistrationSection />
        <ScopeOfServicesSection />
        <BuildingsDepartmentSection />
        <ApprovedListsSection />
        <InHouseProfessionalSection />
        <CapitalSection />
        <ContactsSection />
        <PreviousProjectsSection employerLabel="Name of Architect(s) / Engineer(s)" />
        <RemarksSection />

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
            {isSubmitting ? 'Submitting…' : 'Submit registration'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
