'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Goals, Category, CATEGORY_LABELS } from '@/lib/types';

interface GoalsModalProps {
  open: boolean;
  goals: Goals;
  onClose: () => void;
  onSave: (goals: Goals) => void;
}

const FOCUS_CATEGORIES: Category[] = ['study', 'revision', 'practice', 'research', 'assignment'];

export default function GoalsModal({ open, goals, onClose, onSave }: GoalsModalProps) {
  if (!open) return null;
  return <GoalsModalInner key={JSON.stringify(goals)} goals={goals} onClose={onClose} onSave={onSave} />;
}

function GoalsModalInner({ goals, onClose, onSave }: Omit<GoalsModalProps, 'open'>) {
  const [dailyHours, setDailyHours] = useState(goals.dailyHours);
  const [weeklyTasks, setWeeklyTasks] = useState(goals.weeklyTasks);
  const [monthlyHours, setMonthlyHours] = useState(goals.monthlyHours);
  const [description, setDescription] = useState(goals.description || '');
  const [categories, setCategories] = useState<Category[]>(goals.categories || []);

  function toggleCategory(c: Category) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function handleSave() {
    onSave({ dailyHours, weeklyTasks, monthlyHours, description, categories });
  }

  const inputClass = 'w-full rounded-[9px] border px-3 py-2 text-sm outline-none focus:border-[var(--ink)]';
  const inputStyle = { background: '#fff', borderColor: 'var(--border)' };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Manage goals"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-[9px] border px-4 py-2 text-[13px] font-medium hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
          >
            Cancel
          </button>
          <button onClick={handleSave} className="rounded-[9px] px-4 py-2 text-[13px] font-medium text-white" style={{ background: 'var(--ink)' }}>
            Save goals
          </button>
        </>
      }
    >
      <div className="mb-3.5">
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Daily study goal (hours)
        </label>
        <input
          type="number"
          min={1}
          max={24}
          step={0.5}
          value={dailyHours}
          onChange={(e) => setDailyHours(parseFloat(e.target.value) || 8)}
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div className="mb-3.5">
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Weekly task goal
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={weeklyTasks}
          onChange={(e) => setWeeklyTasks(parseInt(e.target.value) || 20)}
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div className="mb-3.5">
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Monthly study goal (hours)
        </label>
        <input
          type="number"
          min={1}
          max={720}
          value={monthlyHours}
          onChange={(e) => setMonthlyHours(parseInt(e.target.value) || 200)}
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div className="mb-3.5">
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Focus categories
        </label>
        <div className="flex flex-wrap gap-2">
          {FOCUS_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className="rounded-full border px-3 py-1.5 text-[12px] transition-colors"
              style={{
                borderColor: categories.includes(c) ? 'var(--ink)' : 'var(--border)',
                background: categories.includes(c) ? 'var(--ink)' : '#fff',
                color: categories.includes(c) ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Goal description
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Prepare for UPSC 2025..."
          className={inputClass}
          style={inputStyle}
        />
      </div>
    </Modal>
  );
}
