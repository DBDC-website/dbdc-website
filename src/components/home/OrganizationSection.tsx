import { aboutDbdc } from '@/constants/about';
import Image from 'next/image'; // ← added missing import

export default function OrganizationSection() {
  // Optional: control whether the real image is shown (e.g., via env flag or prop)
  const showOrganizationChart = true; // ← set to true when image is ready

  return (
    <section className="border-t border-gray-200 py-16" aria-labelledby="organization-heading">
      <h2
        id="organization-heading"
        className="text-2xl font-bold text-gray-900 md:text-3xl"
      >
        Organization
      </h2>

      <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-gray-700">
        {aboutDbdc.organization.map((paragraph, idx) => ( // ← use index as fallback key
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-900">
          Organization structure
        </h3>
        <div className="relative mt-4 aspect-[16/10] overflow-hidden ...">    
          {showOrganizationChart ? (
            <Image
              src="/images/organization-chart.png"
              alt="DBDC organization structure"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center p-8 text-center text-sm text-gray-500">
              <p>
                Organization chart image placeholder
                <br />
                <span className="text-xs">
                  Add your image to{' '}
                  <code className="rounded bg-gray-200 px-1">
                    public/images/organization-chart.jpg
                  </code>
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}