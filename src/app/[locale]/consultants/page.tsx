const consultants = [
  { name: 'ABC Engineering Ltd.', url: 'https://example.com' },
  { name: 'Pacific Architects', url: 'https://example.com' },
  { name: 'Harbour Construction Co.', url: 'https://example.com' },
];

export default function ConsultantsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">
        Consultants &amp; Contractors
      </h1>
      <p className="mt-4 text-gray-600">
        Directory of consultants and contractors registered with the DBDC.
      </p>

      <ul className="mt-8 space-y-3">
        {consultants.map((consultant) => (
          <li key={consultant.name}>
            <a
              href={consultant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 hover:underline"
            >
              {consultant.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Register as a Consultant or Contractor
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Online registration will be available in a future release.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 cursor-not-allowed rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
        >
          Registration form (coming soon)
        </button>
      </div>
    </div>
  );
}
