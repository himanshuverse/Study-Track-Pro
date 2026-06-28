'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Task, Category, Priority, CATEGORY_LABELS } from '@/lib/types';

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (updates: { name: string; category: Category; hours: number; priority: Priority; subtasks: { name: string; done: boolean }[] }) => void;
  onDelete: () => void;
}

const CATEGORIES: Category[] = ['study', 'revision', 'practice', 'research', 'assignment', 'other'];

export default function EditTaskModal({ task, onClose, onSave, onDelete }: EditTaskModalProps) {
  if (!task) return null;
  return (
    <EditTaskModalInner key={task.id} task={task} onClose={onClose} onSave={onSave} onDelete={onDelete} />
  );
}

function EditTaskModalInner({ task, onClose, onSave, onDelete }: { task: Task } & Omit<EditTaskModalProps, 'task'>) {
  const [name, setName] = useState(task.name);
  const [category, setCategory] = useState<Category>(task.category);
  const [hours, setHours] = useState(String(task.hours || 0));
  const [priority, setPriority] = useState<Priority>(task.priority || 'med');
  const [subtasks, setSubtasks] = useState<{ name: string; done: boolean }[]>(task.subtasks || []);

  function updateSubtaskName(i: number, val: string) {
    const next = [...subtasks];
    next[i] = { ...next[i], name: val };
    setSubtasks(next);
  }

  function handleSave() {
    if (!task) return;
    onSave({
      name: name.trim() || task.name,
      category,
      hours: parseFloat(hours) || 0,
      priority,
      subtasks: subtasks.filter((s) => s.name.trim()),
    });
  }

  const inputClass = 'w-full rounded-[9px] border px-3 py-2 text-sm outline-none focus:border-[var(--ink)]';
  const inputStyle = { background: 'var(--card-bg)', borderColor: 'var(--border)' };

  return (
    <Modal
      open={!!task}
      onClose={onClose}
      title="Edit task"
      footer={
        <>
          <button
            onClick={onDelete}
            className="mr-auto rounded-[9px] px-4 py-2 text-[13px] font-medium text-white"
            style={{ background: 'var(--danger)' }}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="rounded-[9px] border px-4 py-2 text-[13px] font-medium hover:bg-[var(--surface2)]"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
          >
            Cancel
          </button>
          <button onClick={handleSave} className="rounded-[9px] px-4 py-2 text-[13px] font-medium" style={{ background: 'var(--ink)', color: 'var(--ink-contrast)' }}>
            Save changes
          </button>
        </>
      }
    >
      <div className="mb-3.5">
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Task name
        </label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} style={inputStyle} />
      </div>
      <div className="mb-3.5 flex gap-2.5">
        <div className="flex-1">
          <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
            Category
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputClass} style={inputStyle}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
            Hours
          </label>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
            Priority
          </label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass} style={inputStyle}>
            <option value="high">High</option>
            <option value="med">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[12px]" style={{ color: 'var(--muted)' }}>
          Subtasks
        </label>
        <div className="flex flex-col gap-1.5">
          {subtasks.map((st, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={st.name}
                onChange={(e) => updateSubtaskName(i, e.target.value)}
                className="flex-1 rounded-[9px] border px-3 py-2 text-sm outline-none focus:border-[var(--ink)]"
                style={inputStyle}
              />
              <button
                onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))}
                className="rounded-md p-1.5 text-sm hover:bg-[var(--surface3)]"
                style={{ color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setSubtasks([...subtasks, { name: '', done: false }])}
          className="mt-2 rounded-[9px] border px-3 py-1.5 text-[12px] hover:bg-[var(--surface2)]"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
        >
          + Add subtask
        </button>
      </div>
    </Modal>
  );
}
