'use client';

import React from 'react';

interface StatCardProps {
  icon: string;
  value: React.ReactNode;
  label: string;
  accent?: string;
  progressPct?: number;
}

export default function StatCard({ icon, value, label, accent = 'var(--ink)', progressPct }: StatCardProps) {
  return (
    <div
      className="fade-up relative overflow-hidden rounded-[14px] border p-4.5 transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <div className="mb-2 text-xl">{icon}</div>
      <div className="font-display text-[1.7rem] font-bold leading-none">{value}</div>
      <div className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
      {progressPct !== undefined && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--surface3)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(progressPct, 100)}%`, background: accent }} />
        </div>
      )}
    </div>
  );
}
