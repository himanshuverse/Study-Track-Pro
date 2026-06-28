'use client';

import { useState } from 'react';
import { Task, CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_DOT } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onToggleSubtask: (index: number) => void;
  onEdit: () => void;
}

export default function TaskItem({ task, onToggle, onToggleSubtask, onEdit }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const subtasks = task.subtasks || [];
  const stDone = subtasks.filter((s) => s.done).length;

  return (
    <div
      className="mb-2.5 rounded-[12px] border p-3.5 transition-colors"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ink)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex items-center gap-2.5">
        <div
          onClick={onToggle}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 text-[11px] transition-colors"
          style={{
            borderColor: task.done ? 'var(--ink)' : 'var(--border)',
            background: task.done ? 'var(--ink)' : 'transparent',
            color: 'var(--ink-contrast)',
          }}
        >
          {task.done ? '✓' : ''}
        </div>
        <div
          className="flex-1 text-[14px] font-medium"
          style={{
            textDecoration: task.done ? 'line-through' : 'none',
            color: task.done ? 'var(--muted2)' : 'var(--ink)',
          }}
        >
          {task.name}
        </div>
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-[13px] transition-colors hover:bg-[var(--surface3)]"
          style={{ color: 'var(--muted)' }}
          title="Edit"
        >
          ✎
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 pl-[30px]">
        <span
          className="rounded-full border px-2.5 py-0.5 text-[11px]"
          style={{ borderColor: 'var(--border)', color: CATEGORY_COLORS[task.category] }}
        >
          {CATEGORY_LABELS[task.category]}
        </span>
        {task.hours > 0 && (
          <span className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
            {task.hours}h
          </span>
        )}
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: PRIORITY_DOT[task.priority] }}
          title={task.priority}
        />
        {subtasks.length > 0 && (
          <span className="text-[11px]" style={{ color: 'var(--muted2)' }}>
            {stDone}/{subtasks.length} subtasks
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1.5 ml-[30px] flex items-center gap-1 rounded px-1.5 py-0.5 text-[12px] transition-colors hover:text-[var(--ink)]"
            style={{ color: 'var(--muted)' }}
          >
            <span>{expanded ? '▼' : '▶'}</span> Subtasks ({stDone}/{subtasks.length})
          </button>
          {expanded && (
            <div className="mt-2 flex flex-col gap-1.5 pl-[30px]">
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    onClick={() => onToggleSubtask(i)}
                    className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border text-[9px] transition-colors"
                    style={{
                      borderColor: st.done ? 'var(--ink)' : 'var(--border)',
                      background: st.done ? 'var(--ink)' : 'transparent',
                      color: 'var(--ink-contrast)',
                    }}
                  >
                    {st.done ? '✓' : ''}
                  </div>
                  <span
                    className="text-[13px]"
                    style={{
                      textDecoration: st.done ? 'line-through' : 'none',
                      color: st.done ? 'var(--muted2)' : 'var(--ink-soft)',
                    }}
                  >
                    {st.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
