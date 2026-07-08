'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import {
  consultantSchema,
  CONSULTANT_NATURE_OPTIONS,
  CONSULTANT_PROFESSIONAL_OPTIONS,
  type ConsultantRegistrationValues,
} from '@/lib/validations/registration';
import { submitConsultantRegistration } from '@/app/actions/registrations';
import {
  CapitalSection,
  CompanyInfoSection,
  ContactsSection,
  PreviousProjectsSection,
  RemarksSection,
} from '@/components/registration/SharedSections';
import {
  CheckboxField,
  FormSection,
  TextAreaField,
  TextField,
} from '@/components/forms/Fields';
import Button from '@/components/ui/Button';

const emptyProject = {
  projectName: '',
  projectAddress: '',
  contractSum: '',
  startDate: '',
  endDate: '',
  clientName: '',
  architectEngineer: '',
};

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
  capitalAuthorized: '',
  capitalIssued: '',
  capitalAvailable: '',
  otherApprovedLists: '',
  publishCompany: false,
  auditedAccountsProvided: false,
  natureOfBusiness: [],
  aacsbListed: false,
  aacsbDate: '',
  housingDeptApproved: false,
  housingDeptApprovedDate: '',
  professionalDetails: {
    authorizedPerson: false,
    apRegNo: '',
    registeredStructuralEngineer: false,
    registeredGeotechnicalEngineer: false,
    authorizedLandSurveyor: false,
    registeredInspector: false,
    registeredEnergyAssessor: false,
    otherProfessional: '',
    otherRegNo: '',
  },
  contacts: [{ name: '', position: '', telephone: '', signatureName: '' }],
  previousProjects: [{ ...emptyProject }, { ...emptyProject }, { ...emptyProject }],
};

export default function ConsultantForm() {
  const methods = useForm<ConsultantRegistrationValues>({
    resolver: zodResolver(consultantSchema),
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

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const result = await submitConsultantRegistration(values);
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
          Thank you. Your consultant registration has been received and will be
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
          description="Select all professional disciplines that apply."
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
        </FormSection>

        <CapitalSection />

        <FormSection
          title="Approved lists & professional registrations"
          description="Indicate any approved lists your company is included on."
        >
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                label="Listed under the AACSB List of Consultants"
                {...register('aacsbListed')}
              />
              <TextField
                label="AACSB list date"
                type="date"
                error={errors.aacsbDate?.message}
                {...register('aacsbDate')}
              />
              <CheckboxField
                label="Listed on the Housing Department List of Approved Consultants"
                {...register('housingDeptApproved')}
              />
              <TextField
                label="Housing Department list date"
                type="date"
                error={errors.housingDeptApprovedDate?.message}
                {...register('housingDeptApprovedDate')}
              />
            </div>
          </div>
          <TextAreaField
            label="Other approved lists"
            className="mt-5"
            hint="List any other government or institutional approved lists."
            error={errors.otherApprovedLists?.message}
            {...register('otherApprovedLists')}
          />
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-brand-900">
              In-house professionals
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {CONSULTANT_PROFESSIONAL_OPTIONS.map((option) => (
                <CheckboxField
                  key={option.key}
                  label={option.label}
                  {...register(`professionalDetails.${option.key}` as const)}
                />
              ))}
            </div>
            <TextField
              label="Authorised Person registration no."
              className="mt-4"
              error={errors.professionalDetails?.apRegNo?.message}
              {...register('professionalDetails.apRegNo')}
            />
            <TextField
              label="Other registered professional"
              className="mt-4"
              error={errors.professionalDetails?.otherProfessional?.message}
              {...register('professionalDetails.otherProfessional')}
            />
            <TextField
              label="Other professional registration no."
              className="mt-4"
              error={errors.professionalDetails?.otherRegNo?.message}
              {...register('professionalDetails.otherRegNo')}
            />
          </div>
        </FormSection>

        <ContactsSection />
        <PreviousProjectsSection employerLabel="Name of Employer" />
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
