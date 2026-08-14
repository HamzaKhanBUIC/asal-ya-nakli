import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asal ya Nakli? (اصل یا نقلی؟) — Product Authenticity Intelligence',
  description:
    'Evidence-based product authenticity intelligence platform for medicines in Pakistan. Corroborates DRAP registry records, WHO alerts, OCR packaging signals, and community reports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
