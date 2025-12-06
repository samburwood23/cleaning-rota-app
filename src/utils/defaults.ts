import { CleaningTask } from '../types';

export const DEFAULT_TASKS: CleaningTask[] = [
  {
    id: 'task-kitchen',
    name: 'Kitchen',
    description: 'Clean counters, dishes, sink, and floors',
    frequency: 'weekly',
    icon: '🍳',
  },
  {
    id: 'task-bathroom',
    name: 'Bathroom',
    description: 'Clean toilet, shower, sink, and mirrors',
    frequency: 'weekly',
    icon: '🚿',
  },
  {
    id: 'task-vacuum',
    name: 'Vacuum',
    description: 'Vacuum all floors and carpets',
    frequency: 'weekly',
    icon: '🧹',
  },
  {
    id: 'task-trash',
    name: 'Take Out Trash',
    description: 'Empty all bins and take to outside',
    frequency: 'weekly',
    icon: '🗑️',
  },
  {
    id: 'task-living-room',
    name: 'Living Room',
    description: 'Tidy up and dust living areas',
    frequency: 'weekly',
    icon: '🛋️',
  },
];

export const AVATAR_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B500', // Orange
  '#7FCDCD', // Aqua
];
