import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Fraunces } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
});

export const metadata: Metadata = {
  title: 'Togetherly — find your twin',
  description: 'A real-time group similarity game. Find out who thinks like you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} dark h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
