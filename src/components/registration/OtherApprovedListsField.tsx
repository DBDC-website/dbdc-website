'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { OtherApprovedListEntry } from '@/lib/validations/registration';
import DocumentUploadField from '@/components/registration/DocumentUploadField';
import { TextField } from '@/components/forms/Fields';

const emptyEntry: OtherApprovedListEntry = {
  listName: '',
  listedDate: '',
  documentUrls: [],
};

type OtherApprovedListsFieldProps = {
  name: string;
};

export default function OtherApprovedListsField({
  name,
}: OtherApprovedListsFieldProps) {
  const { register, control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-brand-900">
        Other Approved Lists{' '}
        <span className="font-normal text-stone-500">(copy to be attached)</span>
      </p>

      {fields.length === 0 ? (
        <p className="text-xs text-stone-500">
          Add any other approved lists your company is included on.
        </p>
      ) : null}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-lg border border-cream-200 bg-cream-50/60 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-brand-800">
              Other list {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="List name"
              className="sm:col-span-2"
              {...register(`${name}.${index}.listName`)}
            />
            <TextField
              label="Date of listed"
              type="date"
              {...register(`${name}.${index}.listedDate`)}
            />
          </div>
          <div className="mt-4">
            <DocumentUploadField
              label="Supporting documents"
              value={watch(`${name}.${index}.documentUrls`) ?? []}
              onChange={(paths) =>
                setValue(`${name}.${index}.documentUrls`, paths, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(emptyEntry)}
        className="inline-flex items-center gap-1.5 rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add more
      </button>
    </div>
  );
}
