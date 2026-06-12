import { PICS_SHORT } from '@/constants/legal';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs leading-relaxed text-gray-600">{PICS_SHORT}</p>
        <p className="mt-4 text-xs text-gray-500">
          &copy; {year} Diocesan Building and Development Commission, Catholic
          Diocese of Hong Kong. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
