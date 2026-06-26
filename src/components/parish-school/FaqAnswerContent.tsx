import { ExternalLink, Mail, Phone, Printer } from 'lucide-react';
import type { FaqAnswerBlock } from '@/types/parishSchool';
import { cn } from '@/lib/cn';

const contactIcons = {
  email: Mail,
  fax: Printer,
  phone: Phone,
} as const;

type FaqAnswerContentProps = {
  blocks: FaqAnswerBlock[];
  className?: string;
};

export default function FaqAnswerContent({ blocks, className }: FaqAnswerContentProps) {
  return (
    <div className={cn('space-y-4 text-sm leading-relaxed text-stone-700 sm:text-base', className)}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'paragraph':
            return (
              <p key={index} className="text-stone-700">
                {block.text}
              </p>
            );

          case 'list':
            if (block.style === 'ordered') {
              return (
                <ol
                  key={index}
                  className="list-decimal space-y-3 pl-5 marker:font-medium marker:text-brand-800"
                >
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              );
            }

            return (
              <ul key={index} className="list-disc space-y-2 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );

          case 'link':
            return (
              <a
                key={index}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-gold-200/80 bg-gold-50/60 px-4 py-2.5 text-sm font-medium text-brand-900 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:bg-gold-50 sm:text-base"
              >
                {block.label}
                <ExternalLink
                  className="h-4 w-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            );

          case 'table':
            return (
              <div
                key={index}
                className="overflow-x-auto rounded-xl border border-cream-200/90 bg-cream-50/50"
              >
                <table className="min-w-full text-left text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-cream-200 bg-white/80">
                      <th className="px-4 py-3 font-semibold text-brand-900 sm:px-5">
                        {block.headers[0]}
                      </th>
                      <th className="px-4 py-3 font-semibold text-brand-900 sm:px-5">
                        {block.headers[1]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map(([cost, tenders], rowIndex) => (
                      <tr
                        key={`${cost}-${tenders}`}
                        className={cn(
                          'border-b border-cream-200/80 last:border-b-0',
                          rowIndex % 2 === 0 ? 'bg-white/60' : 'bg-cream-50/40',
                        )}
                      >
                        <td className="px-4 py-3 font-medium text-brand-900 sm:px-5">
                          {cost}
                        </td>
                        <td className="px-4 py-3 text-stone-700 sm:px-5">{tenders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'contacts':
            return (
              <ul key={index} className="flex flex-wrap gap-3">
                {block.items.map((item) => {
                  const Icon = contactIcons[item.type];
                  const content =
                    item.type === 'email' ? (
                      <a
                        href={`mailto:${item.value}`}
                        className="transition-colors hover:text-brand-950"
                      >
                        {item.value}
                      </a>
                    ) : item.type === 'phone' ? (
                      <a
                        href={`tel:${item.value.replace(/\s/g, '')}`}
                        className="transition-colors hover:text-brand-950"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    );

                  return (
                    <li
                      key={`${item.type}-${item.value}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-200/60 bg-white/80 px-4 py-2 text-sm text-brand-900 sm:text-base"
                    >
                      <Icon className="h-4 w-4 text-gold-600" aria-hidden="true" />
                      <span className="font-medium">{item.label}:</span>
                      {content}
                    </li>
                  );
                })}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
