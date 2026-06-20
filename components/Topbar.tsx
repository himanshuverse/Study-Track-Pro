'use client';

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
  return (
    <nav
      className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b px-7 backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'var(--border)' }}
    >
      <div className="font-display flex items-center gap-2 text-lg font-bold tracking-tight">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: 'var(--ink)' }}
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
              color: active === tab.key ? '#fff' : 'var(--muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenGoals}
          className="rounded-[9px] border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-[var(--surface2)]"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
        >
          Goals
        </button>
        <button
          onClick={onDownload}
          className="rounded-[9px] px-4 py-2 text-[13px] font-medium text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'var(--ink)' }}
        >
          Save & Download
        </button>
      </div>
    </nav>
  );
}
