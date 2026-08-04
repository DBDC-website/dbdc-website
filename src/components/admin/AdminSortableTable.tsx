'use client';

import Link from 'next/link';
import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type DragEvent,
  type ReactNode,
} from 'react';
import { GripVertical } from 'lucide-react';
import type { ReorderResult } from '@/lib/admin/reorder';

export type { ReorderResult };

type AdminSortableTableProps<T extends { id: number }> = {
  items: T[];
  headers: string[];
  /** Extra data cells only (name, role, …) — drag + edit columns are added. */
  renderCells: (item: T, index: number) => ReactNode;
  editHref: (item: T) => string;
  onReorder: (orderedIds: number[]) => Promise<ReorderResult>;
};

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= list.length ||
    to >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function AdminSortableTable<T extends { id: number }>({
  items,
  headers,
  renderCells,
  editHref,
  onReorder,
}: AdminSortableTableProps<T>) {
  const [rows, setRows] = useState(items);
  const [optimisticRows, setOptimisticRows] = useOptimistic(
    rows,
    (_current: T[], next: T[]) => next,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dragFrom = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    setRows(items);
  }, [items]);

  const persist = (next: T[]) => {
    setError(null);
    startTransition(async () => {
      setOptimisticRows(next);
      const result = await onReorder(next.map((row) => row.id));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRows(next);
    });
  };

  const onHandleDragStart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    dragFrom.current = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
    const row = event.currentTarget.closest('tr');
    if (row) {
      event.dataTransfer.setDragImage(row, 24, 24);
    }
  };

  const onDragOver = (event: DragEvent<HTMLTableRowElement>, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (dragOver !== index) setDragOver(index);
  };

  const onDrop = (index: number) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    setDragOver(null);
    if (from == null || from === index) return;

    const next = moveItem(optimisticRows, from, index);
    persist(next);
  };

  const onDragEnd = () => {
    dragFrom.current = null;
    setDragOver(null);
  };

  return (
    <div>
      {error ? (
        <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div
        className={`overflow-x-auto rounded-xl border border-cream-200 bg-white shadow-sm ${
          isPending ? 'opacity-70' : ''
        }`}
      >
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cream-200 bg-cream-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="w-10 px-2 py-3 font-semibold" aria-label="Reorder" />
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {optimisticRows.map((item, index) => (
              <tr
                key={item.id}
                onDragOver={(event) => onDragOver(event, index)}
                onDrop={() => onDrop(index)}
                onDragEnd={onDragEnd}
                className={`border-b border-cream-100 last:border-0 ${
                  dragOver === index ? 'bg-brand-50/60' : ''
                }`}
              >
                <td className="px-2 py-3">
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => onHandleDragStart(event, index)}
                    className="inline-flex cursor-grab touch-none rounded p-1 text-stone-400 hover:bg-cream-100 hover:text-brand-800 active:cursor-grabbing"
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                  >
                    <GripVertical className="h-4 w-4" aria-hidden />
                  </button>
                </td>
                {renderCells(item, index)}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={editHref(item)}
                    className="font-medium text-brand-800 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-stone-500">
        Drag the handle to change display order. Changes save automatically.
      </p>
    </div>
  );
}
