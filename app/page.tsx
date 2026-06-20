'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/store';
import { nowIST } from '@/lib/date';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import ToastContainer from '@/components/ToastContainer';
import GoalsModal from '@/components/GoalsModal';
import DayView from '@/components/views/DayView';
import WeekView from '@/components/views/WeekView';
import MonthView from '@/components/views/MonthView';
import AnalyticsView from '@/components/views/AnalyticsView';

type ViewKey = 'day' | 'week' | 'month' | 'analytics';

export default function Home() {
  const { ready, data, saveGoals, downloadData, showToast } = useAppData();
  const [view, setView] = useState<ViewKey>('day');
  const [selectedDate, setSelectedDate] = useState(nowIST());
  const [goalsOpen, setGoalsOpen] = useState(false);
  const today = nowIST();

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div
          className="h-8 w-8 rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--ink)', animation: 'spin 0.8s linear infinite' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Topbar
        active={view}
        onChange={setView}
        onOpenGoals={() => setGoalsOpen(true)}
        onDownload={() => {
          downloadData();
          showToast('Data downloaded', 'success');
        }}
      />
      <div className="flex">
        <Sidebar today={today} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <main className="flex-1 px-7 py-6" style={{ maxWidth: 'calc(100% - 260px)' }}>
          <div className="mx-auto max-w-[1100px]">
            {view === 'day' && <DayView selectedDate={selectedDate} onDateChange={setSelectedDate} />}
            {view === 'week' && (
              <WeekView selectedDate={selectedDate} onSelectDay={setSelectedDate} onGoToDay={() => setView('day')} />
            )}
            {view === 'month' && (
              <MonthView selectedDate={selectedDate} onSelectDay={setSelectedDate} onGoToDay={() => setView('day')} />
            )}
            {view === 'analytics' && <AnalyticsView />}
          </div>
        </main>
      </div>

      <GoalsModal
        open={goalsOpen}
        goals={data.goals}
        onClose={() => setGoalsOpen(false)}
        onSave={(goals) => {
          saveGoals(goals);
          setGoalsOpen(false);
          showToast('Goals updated', 'success');
        }}
      />

      <ToastContainer />
    </div>
  );
}
