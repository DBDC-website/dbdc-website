const committeeMembers = [
  {
    name: 'Fr. John Chan',
    role: 'Chairman',
    responsibilities:
      'Provides overall leadership and guidance on diocesan building policy.',
  },
  {
    name: 'Mr. Peter Lee',
    role: 'Vice-Chairman',
    responsibilities:
      'Assists the Chairman and oversees project prioritisation.',
  },
  {
    name: 'Sr. Mary Wong',
    role: 'Secretary',
    responsibilities:
      'Coordinates meetings, records minutes, and manages correspondence.',
  },
];

export default function CommitteePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Committee</h1>
      <p className="mt-4 text-gray-600">
        Members of the Diocesan Building and Development Commission.
      </p>

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {committeeMembers.map((member) => (
          <li
            key={member.name}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {member.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-blue-800">
              {member.role}
            </p>
            <p className="mt-3 text-sm text-gray-600">{member.responsibilities}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
