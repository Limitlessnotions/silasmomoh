
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://silas-momoh.vercel.app'),

  title: {
    default: 'Silas Momoh | AI Automation Engineer & Software Developer',
    template: '%s | Silas Momoh',
  },

  description:
    'Portfolio of Silas Momoh, an AI Automation Engineer and Software Developer building intelligent automation systems, AI agents, web applications, and reliable software integrations.',

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    title: 'Silas Momoh | AI Automation Engineer & Software Developer',
    description:
      'Building intelligent automation systems, AI agents, web applications and software products.',
    url: 'https://silas-momoh.vercel.app',
    siteName: 'Silas Momoh',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Silas Momoh | AI Automation Engineer & Software Developer',
    description:
      'Building intelligent automation systems, AI agents, web applications and software products.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
