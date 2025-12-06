import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { HousemateManager } from './components/HousemateManager';
import { TaskManager } from './components/TaskManager';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import {
  Housemate,
  CleaningTask,
  TaskAssignment,
  CompletionHistory,
  Theme,
} from './types';
import {
  getHousemates,
  saveHousemates,
  getTasks,
  saveTasks,
  getAssignments,
  saveAssignments,
  getHistory,
  saveHistory,
  getSettings,
  saveSettings,
} from './utils/storage';
import { DEFAULT_TASKS } from './utils/defaults';
import {
  getCurrentWeekStart,
  generateWeeklyAssignments,
  needsNewAssignments,
} from './utils/rotation';

function App() {
  const [housemates, setHousemates] = useState<Housemate[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [history, setHistory] = useState<CompletionHistory[]>([]);
  const [theme, setTheme] = useState<Theme>('purple');
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // Initialize data from localStorage
  useEffect(() => {
    const loadedHousemates = getHousemates();
    const loadedTasks = getTasks();
    const loadedAssignments = getAssignments();
    const loadedHistory = getHistory();
    const settings = getSettings();

    setHousemates(loadedHousemates);
    setTasks(loadedTasks.length > 0 ? loadedTasks : DEFAULT_TASKS);
    setAssignments(loadedAssignments);
    setHistory(loadedHistory);
    setTheme(settings.theme);

    // If no tasks in storage, save defaults
    if (loadedTasks.length === 0) {
      saveTasks(DEFAULT_TASKS);
    }

    // Set current week start
    const weekStart = getCurrentWeekStart(settings.rotationDay);
    setCurrentWeekStart(weekStart);

    // Generate assignments for current week if needed
    if (loadedHousemates.length > 0 && loadedTasks.length > 0) {
      if (needsNewAssignments(loadedAssignments, weekStart)) {
        const newAssignments = generateWeeklyAssignments(
          loadedHousemates,
          loadedTasks.length > 0 ? loadedTasks : DEFAULT_TASKS,
          loadedAssignments,
          weekStart
        );
        setAssignments([...loadedAssignments, ...newAssignments]);
        saveAssignments([...loadedAssignments, ...newAssignments]);
      }
    }
  }, []);

  // Update theme in DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check for new week and generate assignments
  useEffect(() => {
    if (housemates.length === 0 || tasks.length === 0) return;

    const settings = getSettings();
    const weekStart = getCurrentWeekStart(settings.rotationDay);

    if (weekStart !== currentWeekStart) {
      setCurrentWeekStart(weekStart);
      if (needsNewAssignments(assignments, weekStart)) {
        const newAssignments = generateWeeklyAssignments(
          housemates,
          tasks,
          assignments,
          weekStart
        );
        const updatedAssignments = [...assignments, ...newAssignments];
        setAssignments(updatedAssignments);
        saveAssignments(updatedAssignments);
      }
    }
  }, [housemates, tasks]);

  const handleAddHousemate = (housemate: Housemate) => {
    const updated = [...housemates, housemate];
    setHousemates(updated);
    saveHousemates(updated);

    // Generate new assignments if we have tasks
    if (tasks.length > 0 && currentWeekStart) {
      const newAssignments = generateWeeklyAssignments(
        updated,
        tasks,
        assignments,
        currentWeekStart
      );
      setAssignments(newAssignments);
      saveAssignments(newAssignments);
    }
  };

  const handleRemoveHousemate = (id: string) => {
    const updated = housemates.filter((h) => h.id !== id);
    setHousemates(updated);
    saveHousemates(updated);

    // Regenerate assignments
    if (updated.length > 0 && tasks.length > 0 && currentWeekStart) {
      const newAssignments = generateWeeklyAssignments(
        updated,
        tasks,
        [],
        currentWeekStart
      );
      setAssignments(newAssignments);
      saveAssignments(newAssignments);
    } else {
      setAssignments([]);
      saveAssignments([]);
    }
  };

  const handleAddTask = (task: CleaningTask) => {
    const updated = [...tasks, task];
    setTasks(updated);
    saveTasks(updated);

    // Generate new assignments if we have housemates
    if (housemates.length > 0 && currentWeekStart) {
      const newAssignments = generateWeeklyAssignments(
        housemates,
        updated,
        assignments,
        currentWeekStart
      );
      setAssignments(newAssignments);
      saveAssignments(newAssignments);
    }
  };

  const handleRemoveTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);

    // Remove assignments for this task
    const updatedAssignments = assignments.filter((a) => a.taskId !== id);
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
  };

  const handleCompleteTask = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    // Update assignment
    const updatedAssignments = assignments.map((a) =>
      a.id === assignmentId
        ? { ...a, completed: true, completedAt: new Date().toISOString() }
        : a
    );
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);

    // Add to history
    const historyEntry: CompletionHistory = {
      id: `history-${Date.now()}`,
      taskId: assignment.taskId,
      housemateId: assignment.housemateId,
      completedAt: new Date().toISOString(),
      weekStartDate: assignment.weekStartDate,
    };
    const updatedHistory = [...history, historyEntry];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const settings = getSettings();
    saveSettings({ ...settings, theme: newTheme });
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <button
            className="btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? '← Back to Dashboard' : '⚙️ Settings'}
          </button>
        </div>

        {!showSettings ? (
          <>
            <Dashboard
              assignments={assignments}
              housemates={housemates}
              tasks={tasks}
              weekStartDate={currentWeekStart}
              onCompleteTask={handleCompleteTask}
            />
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            <div>
              <HousemateManager
                housemates={housemates}
                onAddHousemate={handleAddHousemate}
                onRemoveHousemate={handleRemoveHousemate}
              />
            </div>
            <div>
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onRemoveTask={handleRemoveTask}
              />
            </div>
            <div>
              <ThemeSwitcher
                currentTheme={theme}
                onThemeChange={handleThemeChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
