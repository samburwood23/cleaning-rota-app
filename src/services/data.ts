import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CleaningTask, TaskAssignment } from '../types';
import * as storage from '../utils/storage';

const useSupabase = () => isSupabaseConfigured();

// ============================================================================
// TASKS
// ============================================================================

export async function getTasks(householdId: string): Promise<CleaningTask[]> {
  if (!useSupabase()) {
    return storage.getTasks();
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return (data || []).map(task => ({
    id: task.id,
    name: task.name,
    description: task.description || undefined,
    frequency: task.frequency,
    icon: task.icon || undefined,
  }));
}

export async function addTask(householdId: string, task: CleaningTask): Promise<CleaningTask | null> {
  if (!useSupabase()) {
    storage.saveTasks([...storage.getTasks(), task]);
    return task;
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: task.id,
      household_id: householdId,
      name: task.name,
      description: task.description || null,
      frequency: task.frequency,
      icon: task.icon || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding task:', error);
    return null;
  }

  return data ? {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    frequency: data.frequency,
    icon: data.icon || undefined,
  } : null;
}

export async function updateTask(householdId: string, task: CleaningTask): Promise<CleaningTask | null> {
  if (!useSupabase()) {
    const tasks = storage.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      storage.saveTasks(tasks);
    }
    return task;
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({
      name: task.name,
      description: task.description || null,
      frequency: task.frequency,
      icon: task.icon || null,
    })
    .eq('id', task.id)
    .eq('household_id', householdId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  return data ? {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    frequency: data.frequency,
    icon: data.icon || undefined,
  } : null;
}

export async function deleteTask(householdId: string, taskId: string): Promise<boolean> {
  if (!useSupabase()) {
    const tasks = storage.getTasks().filter(t => t.id !== taskId);
    storage.saveTasks(tasks);
    return true;
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('household_id', householdId);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }

  return true;
}

// ============================================================================
// TASK ASSIGNMENTS
// ============================================================================

export async function getAssignments(householdId: string): Promise<TaskAssignment[]> {
  if (!useSupabase()) {
    return storage.getAssignments();
  }

  const { data, error } = await supabase
    .from('task_assignments')
    .select('*')
    .eq('household_id', householdId)
    .order('week_start_date', { ascending: false });

  if (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }

  return (data || []).map(assignment => ({
    id: assignment.id,
    taskId: assignment.task_id,
    housemateId: assignment.user_id,
    weekStartDate: assignment.week_start_date,
    completed: assignment.completed,
    completedAt: assignment.completed_at || undefined,
  }));
}

export async function addAssignment(
  householdId: string,
  assignment: TaskAssignment
): Promise<TaskAssignment | null> {
  if (!useSupabase()) {
    const assignments = storage.getAssignments();
    const newAssignments = [...assignments, assignment];
    storage.saveAssignments(newAssignments);
    return assignment;
  }

  const { data, error } = await supabase
    .from('task_assignments')
    .insert({
      id: assignment.id,
      task_id: assignment.taskId,
      user_id: assignment.housemateId,
      household_id: householdId,
      week_start_date: assignment.weekStartDate,
      completed: assignment.completed,
      completed_at: assignment.completedAt || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding assignment:', error);
    return null;
  }

  return {
    id: data.id,
    taskId: data.task_id,
    housemateId: data.user_id,
    weekStartDate: data.week_start_date,
    completed: data.completed,
    completedAt: data.completed_at || undefined,
  };
}

export async function updateAssignment(
  householdId: string,
  assignmentId: string,
  updates: Partial<TaskAssignment>
): Promise<TaskAssignment | null> {
  if (!useSupabase()) {
    const assignments = storage.getAssignments();
    const index = assignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updates };
      storage.saveAssignments(assignments);
      return assignments[index];
    }
    return null;
  }

  const dbUpdates: any = {};
  if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
  if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt || null;

  const { data, error } = await supabase
    .from('task_assignments')
    .update(dbUpdates)
    .eq('id', assignmentId)
    .eq('household_id', householdId)
    .select()
    .single();

  if (error) {
    console.error('Error updating assignment:', error);
    return null;
  }

  return {
    id: data.id,
    taskId: data.task_id,
    housemateId: data.user_id,
    weekStartDate: data.week_start_date,
    completed: data.completed,
    completedAt: data.completed_at || undefined,
  };
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToTasks(
  householdId: string,
  callback: (tasks: CleaningTask[]) => void
): (() => void) | null {
  if (!useSupabase()) {
    return null;
  }

  const channel = supabase
    .channel(`tasks:${householdId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `household_id=eq.${householdId}`,
      },
      async () => {
        const tasks = await getTasks(householdId);
        callback(tasks);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToAssignments(
  householdId: string,
  callback: (assignments: TaskAssignment[]) => void
): (() => void) | null {
  if (!useSupabase()) {
    return null;
  }

  const channel = supabase
    .channel(`assignments:${householdId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'task_assignments',
        filter: `household_id=eq.${householdId}`,
      },
      async () => {
        const assignments = await getAssignments(householdId);
        callback(assignments);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
