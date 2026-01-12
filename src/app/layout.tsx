import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PT_Sans, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AppInitializer } from '@/components/AppInitializer';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Mumbai LifeLink',
  description: 'Your all-in-one urban companion for Mumbai.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          'font-body antialiased',
          ptSans.variable,
          spaceGrotesk.variable
        )}
      >
        <FirebaseClientProvider>
          <AppInitializer />
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
