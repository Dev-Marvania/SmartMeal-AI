import { useState, useEffect } from 'react';
import { Meal } from '../types';

export type LogEntry = {
  id: string;
  date: string;
  meal: Meal;
  reasoning: string;
  betterThan: string;
};

const LOG_KEY = 'smartmeal_log';

export function useHistory() {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const item = localStorage.getItem(LOG_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  const addLog = (entry: Omit<LogEntry, 'id' | 'date'>) => {
    const newLogs = [{ ...entry, id: Date.now().toString(), date: new Date().toISOString() }, ...logs];
    setLogs(newLogs);
    localStorage.setItem(LOG_KEY, JSON.stringify(newLogs));
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem(LOG_KEY);
  };

  return { logs, addLog, clearLogs };
}
