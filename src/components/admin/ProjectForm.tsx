import Image from 'next/image';
import Button from '@/components/ui/Button';
import {
  createProject,
  deleteProject,
  updateProject,
} from '@/app/admin/actions/projects';
import type { AdminProject } from '@/lib/admin/projects';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-sm font-medium text-brand-900';

type ProjectFormProps = {
  project?: AdminProject;
};

export default function ProjectForm({ project }: ProjectFormProps) {
  const isEdit = Boolean(project);
  const action = isEdit ? updateProject : createProject;

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        {isEdit && project ? (
          <input type="hidden" name="id" value={project.id} />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={project?.title ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="building_name" className={labelClass}>
              Building name
            </label>
            <input
              id="building_name"
              name="building_name"
              defaultValue={project?.buildingName ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="year" className={labelClass}>
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min={1800}
              max={2100}
              defaultValue={project?.year ?? ''}
              className={fieldClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              name="address"
              defaultValue={project?.address ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={project?.slug ?? ''}
              placeholder="auto from title if blank"
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-stone-500">
              URL-safe id. Leave blank on create to generate from the title.
            </p>
          </div>

          <div>
            <label htmlFor="image_alt" className={labelClass}>
              Image alt text
            </label>
            <input
              id="image_alt"
              name="image_alt"
              defaultValue={project?.imageAlt ?? ''}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="rounded-lg border border-cream-200 bg-cream-50/60 p-4">
          <p className={labelClass}>Primary image</p>
          {project?.imageUrl ? (
            <div className="mt-3 overflow-hidden rounded-md border border-cream-200 bg-white">
              <Image
                src={project.imageUrl}
                alt={project.imageAlt ?? project.title}
                width={640}
                height={360}
                className="h-40 w-full object-cover"
              />
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-500">No image yet.</p>
          )}

          <div className="mt-4">
            <label htmlFor="image" className="text-sm text-stone-700">
              {isEdit ? 'Replace image' : 'Upload image'}
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
            />
            <p className="mt-1 text-xs text-stone-500">
              JPG, PNG, or WebP · max 8MB
            </p>
          </div>

          {isEdit && project?.imageUrl ? (
            <label className="mt-4 flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                name="clear_image"
                className="h-4 w-4 rounded border-cream-300 text-brand-700"
              />
              Remove current image
            </label>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-brand-900">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project?.published ?? true}
            className="h-4 w-4 rounded border-cream-300 text-brand-700"
          />
          Published on the public site
        </label>

        <div className="flex flex-wrap items-center gap-3 border-t border-cream-200 pt-6">
          <Button type="submit">
            {isEdit ? 'Save changes' : 'Create project'}
          </Button>
          <Button href="/admin/projects" variant="outline">
            Cancel
          </Button>
        </div>
      </form>

      {isEdit && project ? (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
          <p className="text-sm font-medium text-red-900">Delete project</p>
          <p className="mt-1 text-xs text-red-800/80">
            Removes this project and its gallery rows. Storage files are kept.
          </p>
          <form action={deleteProject} className="mt-3">
            <input type="hidden" name="id" value={project.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 hover:bg-red-50"
            >
              Delete permanently
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
