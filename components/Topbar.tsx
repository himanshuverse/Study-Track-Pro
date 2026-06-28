'use client';

import { useAppData } from '@/lib/store';

type ViewKey = 'day' | 'week' | 'month' | 'analytics';

interface TopbarProps {
  active: ViewKey;
  onChange: (v: ViewKey) => void;
  onOpenGoals: () => void;
  onDownload: () => void;
}

const TABS: { key: ViewKey; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'analytics', label: 'Analytics' },
];

export default function Topbar({ active, onChange, onOpenGoals, onDownload }: TopbarProps) {
  const { theme, toggleTheme } = useAppData();

  return (
    <nav
      className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b px-7 backdrop-blur-md"
      style={{ background: 'var(--topbar-bg)', borderColor: 'var(--border)' }}
    >
      <div className="font-display flex items-center gap-2 text-lg font-bold tracking-tight">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold"
          style={{ background: 'var(--ink)', color: 'var(--ink-contrast)' }}
        >
          S
        </span>
        StudyTrack <span style={{ color: 'var(--muted)' }}>Pro</span>
      </div>

      <div className="flex gap-1 rounded-full border p-1" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
            style={{
              background: active === tab.key ? 'var(--ink)' : 'transparent',
              color: active === tab.key ? 'var(--ink-contrast)' : 'var(--muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-[9px] border transition-colors hover:bg-[var(--surface2)]"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
              <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM4 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 4 10ZM14 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 10ZM14.243 4.243a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM4.243 14.243a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM16.364 14.243a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM6.364 4.243a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
              <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .624.86 7.5 7.5 0 0 0 9.057 9.057.75.75 0 0 1 .86.624 8.25 8.25 0 1 1-10.54-10.54.75.75 0 0 1 .625-.001Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={onOpenGoals}
          className="rounded-[9px] border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-[var(--surface2)]"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
        >
          Goals
        </button>
        <button
          onClick={onDownload}
          className="rounded-[9px] px-4 py-2 text-[13px] font-medium transition-transform hover:-translate-y-0.5"
          style={{ background: 'var(--ink)', color: 'var(--ink-contrast)' }}
        >
          Save & Download
        </button>
      </div>
    </nav>
  );
}
