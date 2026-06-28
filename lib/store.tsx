'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AppData, DEFAULT_DATA, Task, Category, Priority, Subtask } from './types';
import { dateKey } from './date';

const STORAGE_KEY = 'studytrack_data';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface AppContextValue {
  data: AppData;
  ready: boolean;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  getTasks: (key: string) => Task[];
  getHourTarget: (key: string) => number;
  setHourTarget: (key: string, val: number) => void;
  getLoggedHours: (key: string) => number;
  addTask: (key: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (key: string, id: string) => void;
  toggleSubtask: (key: string, taskId: string, index: number) => void;
  editTask: (key: string, id: string, updates: { name: string; category: Category; hours: number; priority: Priority; subtasks: Subtask[] }) => void;
  deleteTask: (key: string, id: string) => void;
  saveGoals: (goals: AppData['goals']) => void;
  downloadData: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toastId = useRef(0);

  useEffect(() => {
    let savedTheme = localStorage.getItem('studytrack_theme') as 'light' | 'dark' | null;
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dark' : 'light';
    }
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    let loaded = DEFAULT_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        loaded = { ...DEFAULT_DATA, ...parsed, goals: { ...DEFAULT_DATA.goals, ...(parsed.goals || {}) } };
      }
    } catch {
      // ignore corrupt data
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
    setData(loaded);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, ready]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2500);
  }, []);

  const getTasks = useCallback((key: string) => data.tasks[key] || [], [data]);

  const getHourTarget = useCallback(
    (key: string) => data.hourTargets[key] ?? data.goals.dailyHours,
    [data]
  );

  const setHourTarget = useCallback((key: string, val: number) => {
    setData((prev) => ({ ...prev, hourTargets: { ...prev.hourTargets, [key]: val } }));
  }, []);

  const getLoggedHours = useCallback(
    (key: string) => {
      const tasks = data.tasks[key] || [];
      return tasks.filter((t) => t.done).reduce((s, t) => s + (t.hours || 0), 0);
    },
    [data]
  );

  const addTask = useCallback((key: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setData((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [key]: [...(prev.tasks[key] || []), newTask] },
    }));
  }, []);

  const toggleTask = useCallback((key: string, id: string) => {
    setData((prev) => {
      const tasks = (prev.tasks[key] || []).map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      return { ...prev, tasks: { ...prev.tasks, [key]: tasks } };
    });
  }, []);

  const toggleSubtask = useCallback((key: string, taskId: string, index: number) => {
    setData((prev) => {
      const tasks = (prev.tasks[key] || []).map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks.map((st, i) => (i === index ? { ...st, done: !st.done } : st));
        return { ...t, subtasks };
      });
      return { ...prev, tasks: { ...prev.tasks, [key]: tasks } };
    });
  }, []);

  const editTask = useCallback(
    (
      key: string,
      id: string,
      updates: { name: string; category: Category; hours: number; priority: Priority; subtasks: Subtask[] }
    ) => {
      setData((prev) => {
        const tasks = (prev.tasks[key] || []).map((t) => (t.id === id ? { ...t, ...updates } : t));
        return { ...prev, tasks: { ...prev.tasks, [key]: tasks } };
      });
    },
    []
  );

  const deleteTask = useCallback((key: string, id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [key]: (prev.tasks[key] || []).filter((t) => t.id !== id) },
    }));
  }, []);

  const saveGoals = useCallback((goals: AppData['goals']) => {
    setData((prev) => ({ ...prev, goals }));
  }, []);

  const downloadData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `StudyTrack_${dateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [data]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('studytrack_theme', next);
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        ready,
        toasts,
        showToast,
        getTasks,
        getHourTarget,
        setHourTarget,
        getLoggedHours,
        addTask,
        toggleTask,
        toggleSubtask,
        editTask,
        deleteTask,
        saveGoals,
        downloadData,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
