'use client';

import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppData } from '@/lib/store';
import { dateKey, getWeekStart, WEEKDAY_SHORT, formatDateShort } from '@/lib/date';
import StatCard from '../StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface WeekViewProps {
  selectedDate: Date;
  onSelectDay: (d: Date) => void;
  onGoToDay: () => void;
}

export default function WeekView({ selectedDate, onSelectDay, onGoToDay }: WeekViewProps) {
  const { data, getTasks, getHourTarget, getLoggedHours, theme } = useAppData();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = getWeekStart(selectedDate);
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [selectedDate, weekOffset]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const weekStats = days.map((d) => {
    const k = dateKey(d);
    const tasks = getTasks(k);
    return {
      date: d,
      key: k,
      total: tasks.length,
      done: tasks.filter((t) => t.done).length,
      hours: getLoggedHours(k),
      target: getHourTarget(k),
    };
  });

  const totalTasks = weekStats.reduce((s, d) => s + d.total, 0);
  const doneTasks = weekStats.reduce((s, d) => s + d.done, 0);
  const totalHours = weekStats.reduce((s, d) => s + d.hours, 0);
  const totalTarget = weekStats.reduce((s, d) => s + d.target, 0);
  const weeklyGoal = data.goals.weeklyTasks;

  const chartData = {
    labels: WEEKDAY_SHORT,
    datasets: [
      {
        label: 'Hours logged',
        data: weekStats.map((d) => d.hours),
        backgroundColor: theme === 'dark' ? '#f4f4f5' : '#0a0a0a',
        borderRadius: 6,
        maxBarThickness: 36,
      },
      {
        label: 'Target',
        data: weekStats.map((d) => d.target),
        backgroundColor: theme === 'dark' ? '#27272a' : '#e3e3e3',
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const today = new Date();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-[1.6rem] font-bold">
            Weekly <span style={{ color: 'var(--muted)' }}>Overview</span>
          </div>
          <div className="mt-0.5 text-sm" style={{ color: 'var(--muted)' }}>
            {formatDateShort(days[0])} – {formatDateShort(days[6])}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="rounded-[9px] border px-3 py-2 text-sm hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)' }}
          >
            ‹ Prev
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="rounded-[9px] border px-3 py-2 text-sm hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)' }}
          >
            This week
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="rounded-[9px] border px-3 py-2 text-sm hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)' }}
          >
            Next ›
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <StatCard
          icon="✓"
          value={
            <>
              {doneTasks}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                /{totalTasks}
              </span>
            </>
          }
          label={`Tasks completed (goal: ${weeklyGoal})`}
          accent="var(--accent-study)"
          progressPct={(doneTasks / Math.max(weeklyGoal, 1)) * 100}
        />
        <StatCard
          icon="⏱"
          value={
            <>
              {totalHours.toFixed(1)}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                h
              </span>
            </>
          }
          label={`Hours / ${totalTarget}h target`}
          accent="var(--accent-practice)"
          progressPct={(totalHours / Math.max(totalTarget, 1)) * 100}
        />
        <StatCard
          icon="◎"
          value={`${totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0}%`}
          label="Completion rate"
          accent="var(--accent-revision)"
        />
        <StatCard icon="◆" value={(totalHours / 7).toFixed(1) + 'h'} label="Avg hours / day" accent="var(--accent-assignment)" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3.5 lg:grid-cols-7">
        {weekStats.map((d) => {
          const isToday = d.key === dateKey(today);
          const isSelected = d.key === dateKey(selectedDate);
          return (
            <button
              key={d.key}
              onClick={() => {
                onSelectDay(d.date);
                onGoToDay();
              }}
              className="fade-up rounded-[12px] border p-3.5 text-left transition-transform hover:-translate-y-0.5"
              style={{
                background: isSelected ? 'var(--ink)' : 'var(--card-bg)',
                borderColor: isSelected ? 'var(--ink)' : isToday ? 'var(--ink)' : 'var(--border)',
                color: isSelected ? 'var(--ink-contrast)' : 'var(--ink)',
              }}
            >
              <div className="text-[12px] font-bold uppercase" style={{ opacity: isSelected ? 0.7 : 0.4 }}>
                {WEEKDAY_SHORT[d.date.getDay()]}
              </div>
              <div className="font-display my-1 text-2xl font-bold">{d.date.getDate()}</div>
              <div className="text-[11px] font-semibold" style={{ color: isSelected ? 'var(--ink-contrast-soft)' : 'var(--muted)' }}>
                {d.done}/{d.total} tasks
              </div>
              <div className="font-mono text-[11px]" style={{ color: isSelected ? 'var(--ink-contrast-soft)' : 'var(--muted)' }}>
                {d.hours.toFixed(1)}h
              </div>
            </button>
          );
        })}
      </div>

      <div className="fade-up rounded-[14px] border p-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="font-display mb-4 text-[15px] font-semibold">Hours logged vs target</div>
        <div style={{ height: 280 }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: theme === 'dark' ? '#a1a1aa' : '#767676'
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: theme === 'dark' ? '#27272a' : '#f0f0f0' },
                  ticks: { color: theme === 'dark' ? '#a1a1aa' : '#767676' }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: theme === 'dark' ? '#a1a1aa' : '#767676' }
                }
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
