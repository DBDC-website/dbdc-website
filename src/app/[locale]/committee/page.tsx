import { committees } from '@/constants/about';

export default function CommitteePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Committees</h1>
      <p className="mt-4 text-gray-600">
        Detailed committee information will be added in a future release. Select
        a committee from the list below.
      </p>

      <ul className="mt-10 space-y-8">
        {committees.map((committee) => (
          <li
            key={committee.slug}
            id={committee.slug}
            className="scroll-mt-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {committee.name}
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Committee details and responsibilities will be published here.
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
