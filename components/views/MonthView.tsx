'use client';

import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { useAppData } from '@/lib/store';
import { dateKey, WEEKDAY_INITIAL } from '@/lib/date';
import StatCard from '../StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface MonthViewProps {
  selectedDate: Date;
  onSelectDay: (d: Date) => void;
  onGoToDay: () => void;
}

export default function MonthView({ selectedDate, onSelectDay, onGoToDay }: MonthViewProps) {
  const { data, getTasks, getLoggedHours } = useAppData();
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const { y, m } = useMemo(() => ({ y: viewDate.getFullYear(), m: viewDate.getMonth() }), [viewDate]);
  const last = new Date(y, m + 1, 0);
  const today = new Date();

  const cells = useMemo(() => {
    const firstOfMonth = new Date(y, m, 1);
    const lastOfMonth = new Date(y, m + 1, 0);
    const arr: { date: Date; otherMonth: boolean }[] = [];
    for (let i = 0; i < firstOfMonth.getDay(); i++) {
      arr.push({ date: new Date(y, m, 1 - firstOfMonth.getDay() + i), otherMonth: true });
    }
    for (let d = 1; d <= lastOfMonth.getDate(); d++) {
      arr.push({ date: new Date(y, m, d), otherMonth: false });
    }
    while (arr.length % 7 !== 0 || arr.length < 35) {
      const idx = arr.length - (firstOfMonth.getDay() + lastOfMonth.getDate());
      arr.push({ date: new Date(y, m + 1, idx + 1), otherMonth: true });
    }
    return arr;
  }, [y, m]);

  let monthHours = 0;
  let monthTasks = 0;
  let monthDone = 0;
  const dailySeries: number[] = [];
  const dailyLabels: string[] = [];
  for (let d = 1; d <= last.getDate(); d++) {
    const k = dateKey(new Date(y, m, d));
    const tasks = getTasks(k);
    monthTasks += tasks.length;
    monthDone += tasks.filter((t) => t.done).length;
    const h = getLoggedHours(k);
    monthHours += h;
    dailySeries.push(h);
    dailyLabels.push(String(d));
  }

  const monthlyGoal = data.goals.monthlyHours;

  const chartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Hours',
        data: dailySeries,
        borderColor: '#0a0a0a',
        backgroundColor: 'rgba(10,10,10,0.06)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-[1.6rem] font-bold">
            Monthly <span style={{ color: 'var(--muted)' }}>View</span>
          </div>
          <div className="mt-0.5 text-sm" style={{ color: 'var(--muted)' }}>
            {viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewDate(new Date(y, m - 1, 1))}
            className="rounded-[9px] border px-3 py-2 text-sm hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)' }}
          >
            ‹ Prev
          </button>
          <button
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="rounded-[9px] border px-3 py-2 text-sm hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)' }}
          >
            This month
          </button>
          <button
            onClick={() => setViewDate(new Date(y, m + 1, 1))}
            className="rounded-[9px] border px-3 py-2 text-sm hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)' }}
          >
            Next ›
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <StatCard
          icon="⏱"
          value={
            <>
              {monthHours.toFixed(0)}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                h
              </span>
            </>
          }
          label={`Hours / ${monthlyGoal}h goal`}
          accent="var(--accent-study)"
          progressPct={(monthHours / Math.max(monthlyGoal, 1)) * 100}
        />
        <StatCard
          icon="✓"
          value={
            <>
              {monthDone}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                /{monthTasks}
              </span>
            </>
          }
          label="Tasks completed"
          accent="var(--accent-practice)"
        />
        <StatCard
          icon="◎"
          value={`${monthTasks ? Math.round((monthDone / monthTasks) * 100) : 0}%`}
          label="Completion rate"
          accent="var(--accent-revision)"
        />
        <StatCard icon="◆" value={(monthHours / last.getDate()).toFixed(1) + 'h'} label="Avg hours / day" accent="var(--accent-assignment)" />
      </div>

      <div className="mb-6 fade-up rounded-[14px] border p-5" style={{ background: '#fff', borderColor: 'var(--border)' }}>
        <div className="mb-3 grid grid-cols-7 gap-1">
          {WEEKDAY_INITIAL.map((d, i) => (
            <div key={i} className="py-1 text-center text-[11px] font-semibold" style={{ color: 'var(--muted2)' }}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map(({ date, otherMonth }, i) => {
            const k = dateKey(date);
            const tasks = getTasks(k);
            const hours = getLoggedHours(k);
            const isToday = k === dateKey(today);
            const isSelected = k === dateKey(selectedDate);
            const intensity = Math.min(hours / 8, 1);
            return (
              <button
                key={i}
                onClick={() => {
                  if (!otherMonth) {
                    onSelectDay(date);
                    onGoToDay();
                  }
                }}
                className="flex aspect-square flex-col items-center justify-center rounded-[10px] border text-left transition-transform hover:-translate-y-0.5"
                style={{
                  opacity: otherMonth ? 0.3 : 1,
                  borderColor: isSelected ? 'var(--ink)' : isToday ? 'var(--ink)' : 'var(--border)',
                  background: tasks.length ? `rgba(10,10,10,${0.06 + intensity * 0.3})` : '#fff',
                }}
              >
                <span className="font-mono text-[12px] font-medium">{date.getDate()}</span>
                {tasks.length > 0 && (
                  <span className="text-[9px]" style={{ color: 'var(--muted)' }}>
                    {hours.toFixed(1)}h
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fade-up rounded-[14px] border p-5" style={{ background: '#fff', borderColor: 'var(--border)' }}>
        <div className="font-display mb-4 text-[15px] font-semibold">Daily hours trend</div>
        <div style={{ height: 240 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
