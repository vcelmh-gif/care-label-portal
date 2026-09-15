'use client';

import { useState } from 'react';

const labels = {
  en: 'English',
  'zh-Hant': '繁體中文',
  'zh-Hans': '简体中文',
} as const;

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<keyof typeof labels>('en');

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">Language</span>
      <select
        className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm outline-none focus:border-ink"
        value={language}
        onChange={(event) => setLanguage(event.target.value as keyof typeof labels)}
        aria-label="Language"
      >
        {Object.entries(labels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </label>
  );
}
