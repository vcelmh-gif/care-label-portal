import './globals.css';
import type { Metadata } from 'next';
import LanguageSwitcher from '@/components/language-switcher';

export const metadata: Metadata = {
  title: 'Care Label Portal',
  description: 'B2B care label ordering system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-border bg-white">
          <div className="mx-auto flex max-w-6xl justify-end px-6 py-3">
            <LanguageSwitcher />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
