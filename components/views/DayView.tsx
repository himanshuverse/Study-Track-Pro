'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/store';
import { dateKey, formatDateLong } from '@/lib/date';
import { Task } from '@/lib/types';
import StatCard from '../StatCard';
import TaskItem from '../TaskItem';
import AddTaskForm from '../AddTaskForm';
import EditTaskModal from '../EditTaskModal';

interface DayViewProps {
  selectedDate: Date;
  onDateChange: (d: Date) => void;
}

type Filter = 'all' | 'pending' | 'done';

export default function DayView({ selectedDate, onDateChange }: DayViewProps) {
  const { getTasks, getHourTarget, getLoggedHours, addTask, toggleTask, toggleSubtask, editTask, deleteTask, showToast } = useAppData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const key = dateKey(selectedDate);
  const tasks = getTasks(key);
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const loggedH = getLoggedHours(key);
  const targetH = getHourTarget(key);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const subtasksDone = tasks.reduce((s, t) => s + (t.subtasks || []).filter((st) => st.done).length, 0);
  const subtasksTotal = tasks.reduce((s, t) => s + (t.subtasks || []).length, 0);

  let filtered = tasks;
  if (filter === 'pending') filtered = tasks.filter((t) => !t.done);
  if (filter === 'done') filtered = tasks.filter((t) => t.done);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-[1.6rem] font-bold">
            Daily <span style={{ color: 'var(--muted)' }}>Planner</span>
          </div>
          <div className="mt-0.5 text-sm" style={{ color: 'var(--muted)' }}>
            {formatDateLong(selectedDate)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={key}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m, d] = e.target.value.split('-').map(Number);
                onDateChange(new Date(y, m - 1, d));
              }
            }}
            className="rounded-[9px] border px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-[9px] px-4 py-2 text-[13px] font-medium"
            style={{ background: 'var(--ink)', color: 'var(--ink-contrast)' }}
          >
            + Add task
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <StatCard
          icon="✓"
          value={
            <>
              {done}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                /{total}
              </span>
            </>
          }
          label="Tasks completed"
          accent="var(--accent-study)"
          progressPct={pct}
        />
        <StatCard
          icon="⏱"
          value={
            <>
              {loggedH.toFixed(1)}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                h
              </span>
            </>
          }
          label={`Hours logged / ${targetH}h target`}
          accent="var(--accent-practice)"
          progressPct={Math.min((loggedH / Math.max(targetH, 1)) * 100, 100)}
        />
        <StatCard
          icon="◆"
          value={
            <>
              {subtasksDone}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                /{subtasksTotal}
              </span>
            </>
          }
          label="Subtasks completed"
          accent="var(--accent-revision)"
        />
        <StatCard
          icon="◎"
          value={
            <>
              {pct}
              <span className="text-base" style={{ color: 'var(--muted2)' }}>
                %
              </span>
            </>
          }
          label="Day completion rate"
          accent="var(--accent-assignment)"
        />
      </div>

      <div className="fade-up rounded-[14px] border p-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="font-display flex items-center gap-2.5 text-[15px] font-semibold">
            Tasks
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: 'var(--surface2)', color: 'var(--ink-soft)' }}>
              {tasks.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            {(['all', 'pending', 'done'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full border px-3 py-1 text-[12px] capitalize transition-colors"
                style={{
                  borderColor: filter === f ? 'var(--ink)' : 'var(--border)',
                  background: filter === f ? 'var(--ink)' : 'transparent',
                  color: filter === f ? 'var(--ink-contrast)' : 'var(--muted)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="text-2xl" style={{ color: 'var(--muted2)' }}>
              ○
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {tasks.length ? 'No tasks match this filter.' : 'No tasks for this day. Click "+ Add task" to get started.'}
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => {
                toggleTask(key, task.id);
                showToast(task.done ? 'Task marked as not done' : 'Task completed', 'success');
              }}
              onToggleSubtask={(i) => toggleSubtask(key, task.id, i)}
              onEdit={() => setEditingTask(task)}
            />
          ))
        )}

        {showAddForm && (
          <div className="mt-2.5">
            <AddTaskForm
              onAdd={(t) => {
                addTask(key, { ...t, done: false });
                setShowAddForm(false);
                showToast('Task added', 'success');
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
      </div>

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(updates) => {
          if (editingTask) {
            editTask(key, editingTask.id, updates);
            setEditingTask(null);
            showToast('Task updated', 'success');
          }
        }}
        onDelete={() => {
          if (editingTask) {
            deleteTask(key, editingTask.id);
            setEditingTask(null);
            showToast('Task deleted', 'error');
          }
        }}
      />
    </div>
  );
}
