'use client';

import { useState } from 'react';
import { Category, Priority, CATEGORY_LABELS } from '@/lib/types';

interface AddTaskFormProps {
  onAdd: (task: { name: string; category: Category; hours: number; priority: Priority; subtasks: { name: string; done: boolean }[] }) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['study', 'revision', 'practice', 'research', 'assignment', 'other'];

export default function AddTaskForm({ onAdd, onCancel }: AddTaskFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('study');
  const [hours, setHours] = useState('');
  const [priority, setPriority] = useState<Priority>('med');
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>(['']);

  function handleAdd() {
    if (!name.trim()) return;
    const subtasks = subtaskInputs.filter((s) => s.trim()).map((s) => ({ name: s.trim(), done: false }));
    onAdd({ name: name.trim(), category, hours: parseFloat(hours) || 0, priority, subtasks });
  }

  return (
    <div className="rounded-[12px] border border-dashed p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="mb-2.5 flex flex-wrap gap-2.5">
        <input
          type="text"
          placeholder="Task name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-[160px] flex-[2] rounded-[9px] border px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="rounded-[9px] border px-3 py-2 text-sm outline-none"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Hours"
          min={0}
          max={24}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-20 rounded-[9px] border px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-[110px] rounded-[9px] border px-3 py-2 text-sm outline-none"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <option value="high">High priority</option>
          <option value="med">Medium priority</option>
          <option value="low">Low priority</option>
        </select>
      </div>

      <div className="mb-2.5 flex flex-col gap-1.5">
        {subtaskInputs.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Subtask ${i + 1}...`}
              value={val}
              onChange={(e) => {
                const next = [...subtaskInputs];
                next[i] = e.target.value;
                setSubtaskInputs(next);
              }}
              className="flex-1 rounded-[9px] border px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            />
            {i === subtaskInputs.length - 1 ? (
              <button
                onClick={() => setSubtaskInputs([...subtaskInputs, ''])}
                className="rounded-md p-1.5 text-sm transition-colors hover:bg-[var(--surface3)]"
                style={{ color: 'var(--muted)' }}
                title="Add subtask"
              >
                +
              </button>
            ) : (
              <button
                onClick={() => setSubtaskInputs(subtaskInputs.filter((_, idx) => idx !== i))}
                className="rounded-md p-1.5 text-sm transition-colors hover:bg-[var(--surface3)]"
                style={{ color: 'var(--muted)' }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2.5">
        <button onClick={handleAdd} className="rounded-[9px] px-4 py-2 text-[13px] font-medium" style={{ background: 'var(--ink)', color: 'var(--ink-contrast)' }}>
          Add task
        </button>
        <button
          onClick={onCancel}
          className="rounded-[9px] border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-[var(--surface2)]"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
