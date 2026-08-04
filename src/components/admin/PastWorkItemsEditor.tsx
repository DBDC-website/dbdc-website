'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Button from '@/components/ui/Button';
import {
  createPastWorkItem,
  deletePastWorkBulkGroup,
  deletePastWorkItem,
  savePastWorkBulkText,
  updatePastWorkItem,
} from '@/app/admin/actions/pastWork';
import type { AdminPastWorkItem } from '@/lib/admin/pastWork';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-sm font-medium text-brand-900';

function itemHasLink(item: AdminPastWorkItem): boolean {
  return Boolean(item.linkUrl || item.fileUrl);
}

type Segment =
  | { kind: 'linked'; item: AdminPastWorkItem }
  | { kind: 'bulk'; items: AdminPastWorkItem[] };

function groupIntoSegments(items: AdminPastWorkItem[]): Segment[] {
  const segments: Segment[] = [];

  for (const item of items) {
    if (itemHasLink(item)) {
      segments.push({ kind: 'linked', item });
      continue;
    }

    const last = segments[segments.length - 1];
    if (last?.kind === 'bulk') {
      last.items.push(item);
    } else {
      segments.push({ kind: 'bulk', items: [item] });
    }
  }

  return segments;
}

function fileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const name = path.split('/').pop();
    return name ? decodeURIComponent(name) : 'Current file';
  } catch {
    return 'Current file';
  }
}

/** Tracks edits so the save button leaves the green “Saved” state. */
function FormWithSaveState({
  initiallySaved,
  idleLabel,
  savedLabel,
  className,
  action,
  children,
}: {
  initiallySaved: boolean;
  idleLabel: string;
  savedLabel: string;
  className?: string;
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [dirty, setDirty] = useState(false);
  const showSaved = initiallySaved && !dirty;

  return (
    <form
      action={action}
      className={className}
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
    >
      {children}
      <SavedSubmitButtonInner
        showSaved={showSaved}
        idleLabel={idleLabel}
        savedLabel={savedLabel}
      />
    </form>
  );
}

function SavedSubmitButtonInner({
  showSaved,
  idleLabel,
  savedLabel,
}: {
  showSaved: boolean;
  idleLabel: string;
  savedLabel: string;
}) {
  const { pending } = useFormStatus();
  const isSaved = showSaved && !pending;

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      className={
        isSaved
          ? '!border !border-emerald-200 !bg-emerald-50 !text-emerald-900 hover:!bg-emerald-100 focus-visible:!outline-emerald-600'
          : undefined
      }
    >
      {pending ? 'Saving…' : isSaved ? savedLabel : idleLabel}
    </Button>
  );
}

function LinkedFields({
  yearId,
  defaultText,
  defaultZhHant,
  defaultZhHans,
  defaultLinkUrl,
  defaultFileUrl,
  itemId,
  existingFileUrl,
  afterSortOrder,
}: {
  yearId: number;
  defaultText?: string;
  defaultZhHant?: string;
  defaultZhHans?: string;
  defaultLinkUrl?: string;
  defaultFileUrl?: string | null;
  itemId?: number;
  existingFileUrl?: string | null;
  afterSortOrder?: number;
}) {
  const isEdit = itemId != null;
  const action = isEdit ? updatePastWorkItem : createPastWorkItem;
  const suffix = isEdit ? String(itemId) : `new-${afterSortOrder ?? 0}`;

  return (
    <FormWithSaveState
      action={action}
      initiallySaved={isEdit}
      idleLabel={isEdit ? 'Save linked bullet' : 'Add linked bullet'}
      savedLabel="Saved"
      className="space-y-4 rounded-lg border border-brand-200/70 bg-brand-50/30 p-4"
    >
      <input type="hidden" name="year_id" value={yearId} />
      <input type="hidden" name="has_link" value="on" />
      {isEdit ? <input type="hidden" name="id" value={itemId} /> : null}
      {!isEdit ? (
        <input type="hidden" name="after_sort_order" value={afterSortOrder ?? 0} />
      ) : null}
      {existingFileUrl ? (
        <input type="hidden" name="existing_file_url" value={existingFileUrl} />
      ) : null}

      <p className="text-sm font-semibold text-brand-900">
        {isEdit ? 'Linked bullet' : 'New linked bullet'}
      </p>

      <div>
        <label className={labelClass} htmlFor={`text_en_${suffix}`}>
          Bullet text (English)
        </label>
        <textarea
          id={`text_en_${suffix}`}
          name="text_en"
          required
          rows={3}
          defaultValue={defaultText ?? ''}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`text_zh_hant_${suffix}`}>
            Traditional Chinese
          </label>
          <textarea
            id={`text_zh_hant_${suffix}`}
            name="text_zh_hant"
            rows={2}
            defaultValue={defaultZhHant ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`text_zh_hans_${suffix}`}>
            Simplified Chinese
          </label>
          <textarea
            id={`text_zh_hans_${suffix}`}
            name="text_zh_hans"
            rows={2}
            defaultValue={defaultZhHans ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={`link_url_${suffix}`}>
          External link URL
        </label>
        <input
          id={`link_url_${suffix}`}
          name="link_url"
          type="url"
          placeholder="https://…"
          defaultValue={defaultLinkUrl ?? ''}
          className={fieldClass}
        />
      </div>

      <div>
        <p className={labelClass}>Or upload PDF / image</p>
        {defaultFileUrl ? (
          <p className="mt-2 text-sm text-stone-700">
            Current file:{' '}
            <a
              href={defaultFileUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-800 hover:underline"
            >
              {fileName(defaultFileUrl)}
            </a>
          </p>
        ) : null}
        <input
          name="file"
          type="file"
          accept="application/pdf,.pdf,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="mt-2 block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
        />
        {defaultFileUrl ? (
          <label className="mt-2 flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="clear_file"
              className="h-4 w-4 rounded border-cream-300 text-brand-700"
            />
            Remove current attachment
          </label>
        ) : null}
      </div>
    </FormWithSaveState>
  );
}

function BulkFields({
  yearId,
  items,
  afterSortOrder,
}: {
  yearId: number;
  items?: AdminPastWorkItem[];
  afterSortOrder?: number;
}) {
  const isEdit = Boolean(items && items.length > 0);
  const bulkEn = items?.map((item) => item.textEn).join('\n') ?? '';
  const bulkZhHant =
    items
      ?.map((item) => item.textZhHant ?? '')
      .join('\n')
      .trim() ?? '';
  const bulkZhHans =
    items
      ?.map((item) => item.textZhHans ?? '')
      .join('\n')
      .trim() ?? '';

  return (
    <FormWithSaveState
      action={savePastWorkBulkText}
      initiallySaved={isEdit}
      idleLabel={isEdit ? 'Save bulk bullets' : 'Add bulk bullets'}
      savedLabel="Saved"
      className="space-y-4 rounded-lg border border-cream-200 bg-cream-50/50 p-4"
    >
      <input type="hidden" name="year_id" value={yearId} />
      {!isEdit ? (
        <input type="hidden" name="after_sort_order" value={afterSortOrder ?? 0} />
      ) : (
        <input
          type="hidden"
          name="replace_ids"
          value={items!.map((item) => item.id).join(',')}
        />
      )}

      <p className="text-sm font-semibold text-brand-900">
        {isEdit ? 'Bulk bullets (no links)' : 'New bulk bullets (no links)'}
      </p>

      <div>
        <label
          className={labelClass}
          htmlFor={`bulk_en_${isEdit ? items![0]?.id : afterSortOrder ?? 'new'}`}
        >
          English — one bullet per line
        </label>
        <textarea
          id={`bulk_en_${isEdit ? items![0]?.id : afterSortOrder ?? 'new'}`}
          name="bulk_text_en"
          required
          rows={6}
          defaultValue={bulkEn}
          placeholder={'Line one\nLine two\nLine three'}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Traditional Chinese (optional)</label>
          <textarea
            name="bulk_text_zh_hant"
            rows={4}
            defaultValue={bulkZhHant}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Simplified Chinese (optional)</label>
          <textarea
            name="bulk_text_zh_hans"
            rows={4}
            defaultValue={bulkZhHans}
            className={fieldClass}
          />
        </div>
      </div>
    </FormWithSaveState>
  );
}

function AddChooser({
  yearId,
  afterSortOrder,
}: {
  yearId: number;
  afterSortOrder: number;
}) {
  const [mode, setMode] = useState<'idle' | 'linked' | 'bulk'>('idle');

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-cream-300 bg-white/60 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Add next
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === 'linked' ? 'primary' : 'outline'}
          onClick={() => setMode(mode === 'linked' ? 'idle' : 'linked')}
        >
          Bullet with link
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'bulk' ? 'primary' : 'outline'}
          onClick={() => setMode(mode === 'bulk' ? 'idle' : 'bulk')}
        >
          Bulk bullets (no links)
        </Button>
      </div>

      {mode === 'linked' ? (
        <LinkedFields yearId={yearId} afterSortOrder={afterSortOrder} />
      ) : null}
      {mode === 'bulk' ? (
        <BulkFields yearId={yearId} afterSortOrder={afterSortOrder} />
      ) : null}
    </div>
  );
}

type PastWorkItemsEditorProps = {
  yearId: number;
  items: AdminPastWorkItem[];
};

export default function PastWorkItemsEditor({
  yearId,
  items,
}: PastWorkItemsEditorProps) {
  const segments = groupIntoSegments(items);
  let cursor = 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-brand-900">Bullet points</h2>
        <p className="mt-1 text-sm text-stone-600">
          Mix linked bullets and bulk (no-link) groups in any order. A green{' '}
          <span className="font-medium text-emerald-900">Saved</span> button
          means that block is stored; edit the text to save again.
        </p>
      </div>

      {segments.length === 0 ? (
        <AddChooser yearId={yearId} afterSortOrder={0} />
      ) : null}

      {segments.map((segment, index) => {
        if (segment.kind === 'linked') {
          cursor = segment.item.sortOrder;
          return (
            <div key={`linked-${segment.item.id}`} className="space-y-3">
              <LinkedFields
                yearId={yearId}
                itemId={segment.item.id}
                defaultText={segment.item.textEn}
                defaultZhHant={segment.item.textZhHant ?? ''}
                defaultZhHans={segment.item.textZhHans ?? ''}
                defaultLinkUrl={segment.item.linkUrl ?? ''}
                defaultFileUrl={segment.item.fileUrl}
                existingFileUrl={segment.item.fileUrl}
              />
              <form action={deletePastWorkItem}>
                <input type="hidden" name="id" value={segment.item.id} />
                <input type="hidden" name="year_id" value={yearId} />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-800 hover:bg-red-50"
                >
                  Delete linked bullet
                </Button>
              </form>
              <AddChooser yearId={yearId} afterSortOrder={cursor} />
            </div>
          );
        }

        const last = segment.items[segment.items.length - 1];
        cursor = last?.sortOrder ?? cursor;

        return (
          <div
            key={`bulk-${segment.items.map((i) => i.id).join('-')}`}
            className="space-y-3"
          >
            <BulkFields yearId={yearId} items={segment.items} />
            <form action={deletePastWorkBulkGroup}>
              <input type="hidden" name="year_id" value={yearId} />
              <input
                type="hidden"
                name="replace_ids"
                value={segment.items.map((item) => item.id).join(',')}
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-red-300 text-red-800 hover:bg-red-50"
              >
                Delete this bulk group
              </Button>
            </form>
            <AddChooser
              key={`chooser-${index}-${cursor}`}
              yearId={yearId}
              afterSortOrder={cursor}
            />
          </div>
        );
      })}
    </div>
  );
}
