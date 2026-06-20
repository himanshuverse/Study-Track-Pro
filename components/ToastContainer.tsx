'use client';

import { useAppData } from '@/lib/store';

export default function ToastContainer() {
  const { toasts } = useAppData();
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="slide-in flex min-w-[220px] max-w-[300px] items-center gap-2.5 rounded-[10px] border px-4 py-3 text-sm shadow-lg"
          style={{
            background: 'var(--bg)',
            borderColor: t.type === 'error' ? 'var(--danger)' : 'var(--border)',
            color: 'var(--ink)',
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: t.type === 'error' ? 'var(--danger)' : 'var(--success)' }}
          />
          {t.message}
        </div>
      ))}
    </div>
  );
}
