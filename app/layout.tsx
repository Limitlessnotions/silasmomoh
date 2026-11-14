import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silas Momoh | AI Automation Engineer & Software Developer',
  description: 'Portfolio of Silas Momoh — AI Automation Engineer and Software Developer building intelligent workflows, AI-powered products, and reliable software.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Silas Momoh | AI Automation Engineer & Software Developer',
    description: 'Building intelligent systems and software that move businesses forward.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
