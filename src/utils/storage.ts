import { Housemate, CleaningTask, TaskAssignment, CompletionHistory, AppSettings } from '../types';

const STORAGE_KEYS = {
  HOUSEMATES: 'cleaning-rota-housemates',
  TASKS: 'cleaning-rota-tasks',
  ASSIGNMENTS: 'cleaning-rota-assignments',
  HISTORY: 'cleaning-rota-history',
  SETTINGS: 'cleaning-rota-settings',
};

// Housemates
export const getHousemates = (): Housemate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HOUSEMATES);
  return data ? JSON.parse(data) : [];
};

export const saveHousemates = (housemates: Housemate[]): void => {
  localStorage.setItem(STORAGE_KEYS.HOUSEMATES, JSON.stringify(housemates));
};

// Tasks
export const getTasks = (): CleaningTask[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: CleaningTask[]): void => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

// Assignments
export const getAssignments = (): TaskAssignment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveAssignments = (assignments: TaskAssignment[]): void => {
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
};

// History
export const getHistory = (): CompletionHistory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const saveHistory = (history: CompletionHistory[]): void => {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
};

// Settings
export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : { theme: 'purple', rotationDay: 1 }; // Default: Monday
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
