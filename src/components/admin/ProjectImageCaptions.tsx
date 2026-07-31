import Image from 'next/image';
import Button from '@/components/ui/Button';
import { updateProjectImageCaptions } from '@/app/admin/actions/projects';
import type { AdminProjectImage } from '@/lib/admin/projects';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-xs font-medium text-brand-900';

type ProjectImageCaptionsProps = {
  projectId: number;
  images: AdminProjectImage[];
};

export default function ProjectImageCaptions({
  projectId,
  images,
}: ProjectImageCaptionsProps) {
  if (images.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        No gallery images yet. Upload a project image and its caption fields
        appear here.
      </p>
    );
  }

  return (
    <form action={updateProjectImageCaptions} className="space-y-6">
      <input type="hidden" name="project_id" value={projectId} />

      {images.map((image) => (
        <div
          key={image.id}
          className="grid gap-4 rounded-lg border border-cream-200 bg-cream-50/60 p-4 sm:grid-cols-[8rem_1fr]"
        >
          <input type="hidden" name="image_id" value={image.id} />

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
      ))}

      <Button type="submit" size="sm">
        Save captions
      </Button>
    </form>
  );
}
