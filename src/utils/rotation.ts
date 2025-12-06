import { Housemate, CleaningTask, TaskAssignment } from '../types';

/**
 * Get the start of the week (Monday) for a given date
 */
export const getWeekStart = (date: Date, rotationDay: number = 1): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < rotationDay ? 7 : 0) + day - rotationDay;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get current week's start date as ISO string
 */
export const getCurrentWeekStart = (rotationDay: number = 1): string => {
  return formatDateISO(getWeekStart(new Date(), rotationDay));
};

/**
 * Generate task assignments for the current week using rotation
 * This rotates assignments so everyone gets different tasks each week
 */
export const generateWeeklyAssignments = (
  housemates: Housemate[],
  tasks: CleaningTask[],
  previousAssignments: TaskAssignment[],
  weekStartDate: string
): TaskAssignment[] => {
  if (housemates.length === 0 || tasks.length === 0) {
    return [];
  }

  const newAssignments: TaskAssignment[] = [];

  // Get the last week's assignments to determine rotation
  const lastWeekAssignments = previousAssignments.filter(
    (a) => a.weekStartDate !== weekStartDate
  );

  // For each task, assign to the next housemate in rotation
  tasks.forEach((task, taskIndex) => {
    // Find who had this task last week
    const lastAssignment = lastWeekAssignments.find((a) => a.taskId === task.id);
    let assignedHousemateIndex = 0;

    if (lastAssignment) {
      // Find the housemate who had it last and assign to the next one
      const lastHousemateIndex = housemates.findIndex(
        (h) => h.id === lastAssignment.housemateId
      );
      if (lastHousemateIndex !== -1) {
        assignedHousemateIndex = (lastHousemateIndex + 1) % housemates.length;
      }
    } else {
      // No previous assignment, distribute tasks evenly
      assignedHousemateIndex = taskIndex % housemates.length;
    }

    const assignedHousemate = housemates[assignedHousemateIndex];

    newAssignments.push({
      id: `assignment-${task.id}-${weekStartDate}`,
      taskId: task.id,
      housemateId: assignedHousemate.id,
      weekStartDate,
      completed: false,
    });
  });

  return newAssignments;
};

/**
 * Check if we need to generate new assignments for the current week
 */
export const needsNewAssignments = (
  currentAssignments: TaskAssignment[],
  weekStartDate: string
): boolean => {
  return !currentAssignments.some((a) => a.weekStartDate === weekStartDate);
};
