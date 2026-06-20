import type { Metadata } from 'next';
import './globals.css';
import { AppDataProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'StudyTrack Pro — Goal Planner',
  description: 'Plan your study days, track hours, and hit your goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
