'use client';

import Image from 'next/image';
import { useEffect, useOptimistic, useRef, useState, useTransition, type DragEvent } from 'react';
import { GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  addProjectGalleryImages,
  deleteProjectGalleryImage,
  reorderProjectImages,
  updateProjectImageCaptions,
} from '@/app/admin/actions/projects';
import type { AdminProjectImage } from '@/lib/admin/projects';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-xs font-medium text-brand-900';

type ProjectImageCaptionsProps = {
  projectId: number;
  images: AdminProjectImage[];
  primaryImageUrl: string | null;
};

export default function ProjectImageCaptions({
  projectId,
  images,
  primaryImageUrl,
}: ProjectImageCaptionsProps) {
  const [rows, setRows] = useState(images);
  const [optimisticRows, setOptimisticRows] = useOptimistic(
    rows,
    (_current: AdminProjectImage[], next: AdminProjectImage[]) => next,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dragFrom = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const hasImages = images.length > 0;

  useEffect(() => {
    setRows(images);
  }, [images]);

  const moveItem = (
    list: AdminProjectImage[],
    from: number,
    to: number,
  ): AdminProjectImage[] => {
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
  };

  const persistOrder = (next: AdminProjectImage[]) => {
    setError(null);
    startTransition(async () => {
      setOptimisticRows(next);
      const result = await reorderProjectImages(
        projectId,
        next.map((row) => row.id),
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRows(next);
    });
  };

  const onHandleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    index: number,
  ) => {
    dragFrom.current = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
    const card = event.currentTarget.closest('[data-caption-card]');
    if (card) {
      event.dataTransfer.setDragImage(card, 20, 20);
    }
  };

  const onDragOver = (
    event: DragEvent<HTMLDivElement>,
    index: number,
  ) => {
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
    persistOrder(next);
  };

  const onDragEnd = () => {
    dragFrom.current = null;
    setDragOver(null);
  };

  return (
    <div className="space-y-6">
      <form
        action={addProjectGalleryImages}
        className="rounded-lg border border-cream-200 bg-cream-50/60 p-4"
      >
        <input type="hidden" name="project_id" value={projectId} />
        <p className="text-sm font-medium text-brand-900">Add gallery images</p>
        <p className="mt-1 text-xs text-stone-600">
          Upload multiple JPG, PNG, or WebP files at once (8MB each max).
        </p>
        <input
          id="gallery_images"
          name="gallery_images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="mt-3 block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
        />
        <div className="mt-3">
          <Button type="submit" size="sm">
            Upload images
          </Button>
        </div>
      </form>

      {!hasImages ? (
        <p className="text-sm text-stone-600">
          No gallery images yet. Upload images above to create captions.
        </p>
      ) : (
        <>
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <form action={updateProjectImageCaptions} className="space-y-6">
            <input type="hidden" name="project_id" value={projectId} />

            {optimisticRows.map((image, index) => {
              const isPrimary =
                Boolean(primaryImageUrl) && image.imageUrl === primaryImageUrl;
              const deleteImageAction = deleteProjectGalleryImage.bind(
                null,
                projectId,
                image.id,
              );
              return (
                <div
                  key={image.id}
                  data-caption-card
                  onDragOver={(event) => onDragOver(event, index)}
                  onDrop={() => onDrop(index)}
                  onDragEnd={onDragEnd}
                  className={`rounded-lg border border-cream-200 bg-cream-50/60 p-4 ${
                    dragOver === index ? 'bg-brand-50/60' : ''
                  } ${isPending ? 'opacity-70' : ''}`}
                >
                  <input type="hidden" name="image_id" value={image.id} />

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => onHandleDragStart(event, index)}
                        className="inline-flex cursor-grab touch-none rounded p-1 text-stone-400 hover:bg-cream-100 hover:text-brand-800 active:cursor-grabbing"
                        aria-label="Drag to reorder image"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="text-xs text-stone-600">Order {index + 1}</span>
                      {isPrimary ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                          Primary image
                        </span>
                      ) : null}
                    </div>

                    {!isPrimary ? (
                      <button
                        type="submit"
                        formAction={deleteImageAction}
                        className="inline-flex items-center justify-center rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                      >
                        Delete image
                      </button>
                    ) : (
                      <p className="text-xs text-stone-500">
                        Delete from Primary image section.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                    {image.imageUrl ? (
                      <div className="overflow-hidden rounded-md border border-cream-200 bg-white">
                        <Image
                          src={image.imageUrl}
                          alt={image.captionEn ?? ''}
                          width={256}
                          height={160}
                          className="h-24 w-full object-cover sm:h-full"
                        />
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-cream-300 p-4 text-xs text-stone-500">
                        No preview
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label htmlFor={`caption_en_${image.id}`} className={labelClass}>
                          Caption (English)
                        </label>
                        <input
                          id={`caption_en_${image.id}`}
                          name={`caption_en_${image.id}`}
                          defaultValue={image.captionEn ?? ''}
                          className={fieldClass}
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`caption_zh_hant_${image.id}`}
                            className={labelClass}
                          >
                            Caption (Traditional Chinese)
                          </label>
                          <input
                            id={`caption_zh_hant_${image.id}`}
                            name={`caption_zh_hant_${image.id}`}
                            defaultValue={image.captionZhHant ?? ''}
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`caption_zh_hans_${image.id}`}
                            className={labelClass}
                          >
                            Caption (Simplified Chinese)
                          </label>
                          <input
                            id={`caption_zh_hans_${image.id}`}
                            name={`caption_zh_hans_${image.id}`}
                            defaultValue={image.captionZhHans ?? ''}
                            className={fieldClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button type="submit" size="sm">
              Save captions
            </Button>
          </form>
          <p className="text-xs text-stone-500">
            Drag the handle to reorder gallery images. Changes save automatically.
          </p>
        </>
      )}
    </div>
  );
}
