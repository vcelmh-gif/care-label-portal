import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Care Label Portal',
  description: 'B2B care label ordering system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
