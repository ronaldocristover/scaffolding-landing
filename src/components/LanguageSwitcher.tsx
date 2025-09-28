'use client';

import {useRouter, usePathname} from '@/i18n/routing';
import {useParams} from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchLanguage = (locale: string) => {
    router.replace(pathname, {locale});
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => switchLanguage('zh')}
        className={`px-2 py-1 text-sm rounded ${
          params.locale === 'zh'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2 py-1 text-sm rounded ${
          params.locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}