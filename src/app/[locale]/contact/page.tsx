export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Contact</h1>
      <p className="mt-4 text-gray-600">
        Contact details and enquiry form will be added here.
      </p>
      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-gray-900">Address</dt>
          <dd className="text-gray-600">
            16 Caine Road, Central, Hong Kong (placeholder)
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">Email</dt>
          <dd className="text-gray-600">dbdc@catholic.org.hk (placeholder)</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">Phone</dt>
          <dd className="text-gray-600">+852 0000 0000 (placeholder)</dd>
        </div>
      </dl>
    </div>
  );
}
