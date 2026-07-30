'use client';

import {
  CONTRACTOR_MINOR_WORKS_OPTIONS,
  CONTRACTOR_NATURE_OPTIONS,
  type ContractorRegistrationValues,
} from '@/lib/validations/registration';
import { CheckboxField, TextField } from '@/components/forms/Fields';
import { useEffect } from 'react';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

type NatureOfBusinessSectionProps = {
  register: UseFormRegister<ContractorRegistrationValues>;
  setValue: UseFormSetValue<ContractorRegistrationValues>;
  errors: FieldErrors<ContractorRegistrationValues>;
  selectedNatureOfBusiness: string[];
  othersSelected: boolean;
  hasMinorWorks: boolean;
};

function ContractorNatureOption({
  label,
  value,
  bdRegistered,
  register,
}: {
  label: string;
  value: string;
  bdRegistered: boolean;
  register: UseFormRegister<ContractorRegistrationValues>;
}) {
  return (
    <CheckboxField
      label={bdRegistered ? `${label} †` : label}
      value={value}
      {...register('natureOfBusiness')}
    />
  );
}

function MinorWorksRow({
  register,
  hasMinorWorks,
}: {
  register: UseFormRegister<ContractorRegistrationValues>;
  hasMinorWorks: boolean;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
      <CheckboxField
        label="Minor works †"
        value="Minor Works"
        className="!shrink-0 !gap-1.5"
        {...register('natureOfBusiness')}
      />
      <div className="ml-2 flex items-center gap-3">
        {CONTRACTOR_MINOR_WORKS_OPTIONS.map((category) => (
          <CheckboxField
            key={category}
            label={category.replace('Minor Works ', '')}
            value={category}
            className="!shrink-0 !gap-1.5"
            disabled={!hasMinorWorks}
            {...register('natureOfBusiness')}
          />
        ))}
      </div>
    </div>
  );
}

export function ContractorNatureOfBusinessSection({
  register,
  setValue,
  errors,
  selectedNatureOfBusiness,
  othersSelected,
  hasMinorWorks,
}: NatureOfBusinessSectionProps) {
  const optionByValue = Object.fromEntries(
    CONTRACTOR_NATURE_OPTIONS.map((option) => [option.value, option]),
  ) as Record<string, (typeof CONTRACTOR_NATURE_OPTIONS)[number]>;
  const orderedValues = [
    'General Building contractor',
    'Demolition contractor',
    'Foundation contractor',
    'Site formation / geotechnical contractor',
    'Ventilation contractor',
    'Ground investigation contractor',
    'MINOR_WORKS',
    'Repair & maintenance contractor',
    'Interior fitting out contractor',
    'Landscaping / horticulture contractor',
    'Air-conditioning contractor',
    'Fire services contractor',
    'Plumbing & drainage contractor',
    'Electrical contractor',
    'Lift & escalator contractor',
    'Others',
  ] as const;
  const col1 = orderedValues.slice(0, 8);
  const col2 = orderedValues.slice(8);

  useEffect(() => {
    if (hasMinorWorks) return;

    const minorValues = new Set(CONTRACTOR_MINOR_WORKS_OPTIONS);
    const filtered = selectedNatureOfBusiness.filter(
      (value) =>
        !minorValues.has(
          value as (typeof CONTRACTOR_MINOR_WORKS_OPTIONS)[number],
        ),
    );
    if (filtered.length !== selectedNatureOfBusiness.length) {
      setValue('natureOfBusiness', filtered, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [hasMinorWorks, selectedNatureOfBusiness, setValue]);

  return (
    <>
      {typeof errors.natureOfBusiness?.message === 'string' ? (
        <p className="mb-4 text-xs font-medium text-red-600" role="alert">
          {errors.natureOfBusiness.message}
        </p>
      ) : null}
      <p className="mb-4 text-xs text-stone-500">
        † Registered under Buildings Department
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          {col1.map((value) => (
            value === 'MINOR_WORKS' ? (
              <MinorWorksRow
                key="MINOR_WORKS"
                register={register}
                hasMinorWorks={hasMinorWorks}
              />
            ) : (
              <ContractorNatureOption
                key={value}
                {...optionByValue[value]}
                register={register}
              />
            )
          ))}
        </div>
        <div className="space-y-3">
          {col2.map((value) => {
            const option = optionByValue[value];
            if (!option) return null;
            return (
              <ContractorNatureOption
                key={value}
                {...option}
                register={register}
              />
            );
          })}
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
    </>
  );
}
