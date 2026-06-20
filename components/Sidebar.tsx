'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/store';
import { dateKey, formatDateShort, WEEKDAY_INITIAL } from '@/lib/date';
import ProgressRing from './ProgressRing';

interface SidebarProps {
  today: Date;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}

export default function Sidebar({ today, selectedDate, onSelectDate }: SidebarProps) {
  const { data, getHourTarget, setHourTarget, getLoggedHours, getTasks } = useAppData();
  const [calViewDate, setCalViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const key = dateKey(selectedDate);
  const target = getHourTarget(key);
  const logged = getLoggedHours(key);
  const pct = Math.min(logged / Math.max(target, 1), 1);

  const y = calViewDate.getFullYear();
  const m = calViewDate.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const cells: { date: Date; otherMonth: boolean }[] = [];
  for (let i = 0; i < first.getDay(); i++) {
    cells.push({ date: new Date(y, m, 1 - first.getDay() + i), otherMonth: true });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push({ date: new Date(y, m, d), otherMonth: false });
  }

  const tasksToday = getTasks(key);
  const doneToday = tasksToday.filter((t) => t.done).length;

  return (
    <aside
      className="sticky top-[60px] flex max-h-[calc(100vh-60px)] w-[260px] min-w-[260px] flex-col gap-5 overflow-y-auto border-r px-4 py-5"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Mini Calendar */}
      <div>
        <div className="mb-2 px-2 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
          Calendar
        </div>
        <div className="mb-3 flex items-center justify-between px-1">
          <button
            onClick={() => setCalViewDate(new Date(y, m - 1, 1))}
            className="rounded-md px-2 py-1 text-sm hover:bg-[var(--surface2)]"
            style={{ color: 'var(--muted)' }}
          >
            ‹
          </button>
          <div className="font-display text-sm font-semibold">
            {calViewDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </div>
          <button
            onClick={() => setCalViewDate(new Date(y, m + 1, 1))}
            className="rounded-md px-2 py-1 text-sm hover:bg-[var(--surface2)]"
            style={{ color: 'var(--muted)' }}
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-[2px]">
          {WEEKDAY_INITIAL.map((d, i) => (
            <div key={i} className="py-1 text-center text-[11px] font-semibold" style={{ color: 'var(--muted2)' }}>
              {d}
            </div>
          ))}
          {cells.map(({ date, otherMonth }, i) => {
            const k = dateKey(date);
            const isToday = k === dateKey(today);
            const isSelected = k === dateKey(selectedDate);
            const tasks = data.tasks[k] || [];
            const hasTasks = tasks.length > 0;
            const allDone = hasTasks && tasks.every((t) => t.done);
            return (
              <div
                key={i}
                onClick={() => !otherMonth && onSelectDate(date)}
                className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md text-[12px] transition-colors"
                style={{
                  opacity: otherMonth ? 0.3 : 1,
                  background: isSelected ? 'var(--ink)' : 'transparent',
                  color: isSelected ? '#fff' : isToday ? 'var(--ink)' : allDone ? 'var(--success)' : 'var(--ink-soft)',
                  fontWeight: isToday || isSelected ? 700 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--surface2)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {date.getDate()}
                {hasTasks && (
                  <span
                    className="absolute bottom-[3px] left-1/2 h-[4px] w-[4px] -translate-x-1/2 rounded-full"
                    style={{ background: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--accent-practice)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hours Widget */}
      <div>
        <div className="mb-2 px-2 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
          Study Hours
        </div>
        <div className="rounded-[14px] border p-3.5" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="mb-2 text-xs" style={{ color: 'var(--muted)' }}>
            Target for {key === dateKey(today) ? 'today' : formatDateShort(selectedDate)}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={target}
              onChange={(e) => setHourTarget(key, parseFloat(e.target.value) || 0)}
              className="font-mono flex-1 rounded-[9px] border px-2.5 py-2 text-center text-base font-medium outline-none focus:border-[var(--ink)]"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            />
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setHourTarget(key, Math.min(24, target + 0.5))}
                className="flex h-[22px] w-6 items-center justify-center rounded border text-xs transition-colors hover:bg-[var(--ink)] hover:text-white"
                style={{ borderColor: 'var(--border)', background: 'var(--surface2)' }}
              >
                ▲
              </button>
              <button
                onClick={() => setHourTarget(key, Math.max(0, target - 0.5))}
                className="flex h-[22px] w-6 items-center justify-center rounded border text-xs transition-colors hover:bg-[var(--ink)] hover:text-white"
                style={{ borderColor: 'var(--border)', background: 'var(--surface2)' }}
              >
                ▼
              </button>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            <ProgressRing pct={pct} />
            <div>
              <div className="font-mono text-sm">
                {logged.toFixed(1)}h / {target}h
              </div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                completed today
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <div className="mb-2 px-2 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: 'var(--muted)' }}>
          Quick Stats
        </div>
        <div className="flex flex-col gap-1.5 rounded-[14px] border p-3.5 text-[13px]" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <Row label="Tasks" value={`${doneToday}/${tasksToday.length}`} />
          <Row label="Hours" value={`${logged.toFixed(1)}h`} valueColor="var(--accent-practice)" />
          <Row label="Target" value={`${target}h`} />
          <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--surface3)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${tasksToday.length ? (doneToday / tasksToday.length) * 100 : 0}%`, background: 'var(--ink)' }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ color: valueColor || 'var(--ink)' }}>{value}</span>
    </div>
  );
}
