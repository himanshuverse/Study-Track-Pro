'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAppData } from '@/lib/store';
import { dateKey } from '@/lib/date';
import { CATEGORY_COLORS, CATEGORY_LABELS, Category } from '@/lib/types';
import StatCard from '../StatCard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsView() {
  const { data, getLoggedHours } = useAppData();

  const allKeys = useMemo(() => Object.keys(data.tasks), [data.tasks]);

  const totalHoursAllTime = useMemo(() => allKeys.reduce((s, k) => s + getLoggedHours(k), 0), [allKeys, getLoggedHours]);
  const totalTasksAllTime = useMemo(() => allKeys.reduce((s, k) => s + (data.tasks[k]?.length || 0), 0), [allKeys, data.tasks]);
  const totalDoneAllTime = useMemo(
    () => allKeys.reduce((s, k) => s + (data.tasks[k]?.filter((t) => t.done).length || 0), 0),
    [allKeys, data.tasks]
  );

  // Streaks
  const { currentStreak, bestStreak } = useMemo(() => {
    const sortedKeys = [...allKeys].filter((k) => (data.tasks[k] || []).some((t) => t.done)).sort();
    if (sortedKeys.length === 0) return { currentStreak: 0, bestStreak: 0 };

    let best = 1;
    let run = 1;
    for (let i = 1; i < sortedKeys.length; i++) {
      const prev = new Date(sortedKeys[i - 1]);
      const cur = new Date(sortedKeys[i]);
      const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
      if (diffDays === 1) {
        run++;
      } else {
        run = 1;
      }
      best = Math.max(best, run);
    }

    // Current streak: count backward from today
    let current = 0;
    const cursor = new Date();
    while (true) {
      const k = dateKey(cursor);
      const tasks = data.tasks[k] || [];
      if (tasks.some((t) => t.done)) {
        current++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return { currentStreak: current, bestStreak: best };
  }, [allKeys, data.tasks]);

  // Category breakdown (all time, by hours of completed tasks)
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    allKeys.forEach((k) => {
      (data.tasks[k] || []).forEach((t) => {
        if (t.done) totals[t.category] = (totals[t.category] || 0) + (t.hours || 0);
      });
    });
    return totals;
  }, [allKeys, data.tasks]);

  const categoryEntries = Object.entries(categoryTotals).filter(([, v]) => v > 0);
  const doughnutData = {
    labels: categoryEntries.map(([c]) => CATEGORY_LABELS[c as Category]),
    datasets: [
      {
        data: categoryEntries.map(([, v]) => v),
        backgroundColor: categoryEntries.map(([c]) => CATEGORY_COLORS[c as Category]),
        borderWidth: 0,
      },
    ],
  };

  // Heatmap: last 16 weeks (112 days)
  const heatmapDays = useMemo(() => {
    const days: { key: string; hours: number; date: Date }[] = [];
    const today = new Date();
    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      days.push({ key: k, hours: getLoggedHours(k), date: d });
    }
    return days;
  }, [getLoggedHours]);

  function heatColor(hours: number) {
    if (hours <= 0) return 'var(--surface3)';
    const intensity = Math.min(hours / 8, 1);
    return `rgba(10,10,10,${0.15 + intensity * 0.75})`;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="font-display text-[1.6rem] font-bold">
          Analytics <span style={{ color: 'var(--muted)' }}>& Insights</span>
        </div>
        <div className="mt-0.5 text-sm" style={{ color: 'var(--muted)' }}>
          Your full study history at a glance
        </div>
      </div>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <StatCard
          icon="⏱"
          value={
            <>
              {totalHoursAllTime.toFixed(0)}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                h
              </span>
            </>
          }
          label="Total hours logged"
          accent="var(--accent-study)"
        />
        <StatCard
          icon="✓"
          value={
            <>
              {totalDoneAllTime}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                /{totalTasksAllTime}
              </span>
            </>
          }
          label="All-time tasks completed"
          accent="var(--accent-practice)"
        />
        <StatCard icon="🔥" value={currentStreak} label="Current streak (days)" accent="var(--accent-revision)" />
        <StatCard icon="★" value={bestStreak} label="Best streak (days)" accent="var(--accent-assignment)" />
      </div>

      <div className="mb-6 fade-up rounded-[14px] border p-5" style={{ background: '#fff', borderColor: 'var(--border)' }}>
        <div className="font-display mb-4 text-[15px] font-semibold">Activity heatmap (last 16 weeks)</div>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: 'max-content' }}>
            {heatmapDays.map((d) => (
              <div
                key={d.key}
                title={`${d.key}: ${d.hours.toFixed(1)}h`}
                className="h-3 w-3 rounded-[3px]"
                style={{ background: heatColor(d.hours) }}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
          Less
          {[0, 2, 4, 6, 8].map((h) => (
            <div key={h} className="h-3 w-3 rounded-[3px]" style={{ background: heatColor(h) }} />
          ))}
          More
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="fade-up rounded-[14px] border p-5" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="font-display mb-4 text-[15px] font-semibold">Hours by category</div>
          {categoryEntries.length === 0 ? (
            <p className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
              No completed tasks yet.
            </p>
          ) : (
            <div style={{ height: 240 }}>
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } } },
                }}
              />
            </div>
          )}
        </div>

        <div className="fade-up rounded-[14px] border p-5" style={{ background: '#fff', borderColor: 'var(--border)' }}>
          <div className="font-display mb-4 text-[15px] font-semibold">Goal description</div>
          {data.goals.description ? (
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              {data.goals.description}
            </p>
          ) : (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              No goal description set. Open Goals to add one.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {data.goals.categories.map((c) => (
              <span
                key={c}
                className="rounded-full border px-3 py-1 text-[12px]"
                style={{ borderColor: 'var(--border)', color: CATEGORY_COLORS[c] }}
              >
                {CATEGORY_LABELS[c]}
              </span>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-mono text-lg font-semibold">{data.goals.dailyHours}h</div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Daily goal
              </div>
            </div>
            <div>
              <div className="font-mono text-lg font-semibold">{data.goals.weeklyTasks}</div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Weekly tasks
              </div>
            </div>
            <div>
              <div className="font-mono text-lg font-semibold">{data.goals.monthlyHours}h</div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Monthly goal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
