
import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://silas-momoh.vercel.app';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Silas Momoh',
  alternateName: 'Momoh Silas Enemona',
  url: siteUrl,
  jobTitle: [
    'AI Automation Engineer',
    'Software Developer',
  ],
  description:
    'AI Automation Engineer and Software Developer specializing in intelligent automation, AI agents, software development, web applications, and API integrations.',
  sameAs: [
    'https://www.linkedin.com/in/silas-momoh/',
    'https://github.com/Limitlessnotions',
    'https://www.fiverr.com/silasenemona',
    'https://contra.com/silas_momoh/about',
    'https://www.instagram.com/silas_momoh/',
    'https://web.facebook.com/sem.momoh',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

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
    url: siteUrl,
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
