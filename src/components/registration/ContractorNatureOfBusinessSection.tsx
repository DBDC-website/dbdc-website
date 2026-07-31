'use client';

import {
  CONTRACTOR_MINOR_WORKS_OPTIONS,
  CONTRACTOR_NATURE_OPTIONS,
  type ContractorRegistrationValues,
} from '@/lib/validations/registration';
import { CheckboxField, TextField } from '@/components/forms/Fields';
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
};

const MINOR_WORKS_PARENT = 'Minor Works';

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
  selectedNatureOfBusiness,
  setValue,
}: {
  selectedNatureOfBusiness: string[];
  setValue: UseFormSetValue<ContractorRegistrationValues>;
}) {
  const hasParent = selectedNatureOfBusiness.includes(MINOR_WORKS_PARENT);

  function commit(next: string[]) {
    setValue('natureOfBusiness', next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function onSubChange(category: string, checked: boolean) {
    let next = selectedNatureOfBusiness.filter((value) => value !== category);

    if (checked) {
      next = [...next, category];
      if (!next.includes(MINOR_WORKS_PARENT)) {
        next = [...next, MINOR_WORKS_PARENT];
      }
    } else {
      const anySubLeft = CONTRACTOR_MINOR_WORKS_OPTIONS.some(
        (option) => option !== category && next.includes(option),
      );
      if (!anySubLeft) {
        next = next.filter((value) => value !== MINOR_WORKS_PARENT);
      }
    }

    commit(next);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
      <CheckboxField
        label="Minor works †"
        className="!shrink-0 !cursor-default !gap-1.5 opacity-90"
        checked={hasParent}
        disabled
        readOnly
        tabIndex={-1}
        aria-readonly="true"
      />
      <div className="ml-2 flex items-center gap-3">
        {CONTRACTOR_MINOR_WORKS_OPTIONS.map((category) => (
          <CheckboxField
            key={category}
            label={category.replace('Minor Works ', '')}
            className="!shrink-0 !gap-1.5"
            checked={selectedNatureOfBusiness.includes(category)}
            onChange={(event) => onSubChange(category, event.target.checked)}
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
          {col1.map((value) =>
            value === 'MINOR_WORKS' ? (
              <MinorWorksRow
                key="MINOR_WORKS"
                selectedNatureOfBusiness={selectedNatureOfBusiness}
                setValue={setValue}
              />
            ) : (
              <ContractorNatureOption
                key={value}
                {...optionByValue[value]}
                register={register}
              />
            ),
          )}
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
