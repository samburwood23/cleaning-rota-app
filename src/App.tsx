import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { HousemateManager } from './components/HousemateManager';
import { TaskManager } from './components/TaskManager';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { AuthModal } from './components/AuthModal';
import { HouseholdSelector } from './components/HouseholdSelector';
import { useAuth } from './contexts/AuthContext';
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
  getTasks as getTasksLocal,
  saveTasks as saveTasksLocal,
  getAssignments as getAssignmentsLocal,
  saveAssignments as saveAssignmentsLocal,
  getHistory,
  saveHistory,
  getSettings,
  saveSettings,
} from './utils/storage';
import * as dataService from './services/data';
import { getHouseholdMembers } from './services/household';
import { DEFAULT_TASKS } from './utils/defaults';
import {
  getCurrentWeekStart,
  generateWeeklyAssignments,
  needsNewAssignments,
} from './utils/rotation';

function App() {
  const { user, loading: authLoading, isConfigured, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentHouseholdId, setCurrentHouseholdId] = useState<string | null>(null);

  const [housemates, setHousemates] = useState<Housemate[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [history, setHistory] = useState<CompletionHistory[]>([]);
  const [theme, setTheme] = useState<Theme>('purple');
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!authLoading && isConfigured && !user) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, authLoading, isConfigured]);

  useEffect(() => {
    const initializeData = async () => {
      const settings = getSettings();
      setTheme(settings.theme);

      if (!isConfigured || !user) {
        const loadedHousemates = getHousemates();
        const loadedTasks = getTasksLocal();
        const loadedAssignments = getAssignmentsLocal();
        const loadedHistory = getHistory();

        setHousemates(loadedHousemates);
        setTasks(loadedTasks.length > 0 ? loadedTasks : DEFAULT_TASKS);
        setAssignments(loadedAssignments);
        setHistory(loadedHistory);

        if (loadedTasks.length === 0) {
          saveTasksLocal(DEFAULT_TASKS);
        }

        const weekStart = getCurrentWeekStart(settings.rotationDay);
        setCurrentWeekStart(weekStart);

        if (loadedHousemates.length > 0 && loadedTasks.length > 0) {
          if (needsNewAssignments(loadedAssignments, weekStart)) {
            const newAssignments = generateWeeklyAssignments(
              loadedHousemates,
              loadedTasks.length > 0 ? loadedTasks : DEFAULT_TASKS,
              loadedAssignments,
              weekStart
            );
            setAssignments([...loadedAssignments, ...newAssignments]);
            saveAssignmentsLocal([...loadedAssignments, ...newAssignments]);
          }
        }
      }
    };

    initializeData();
  }, [user, isConfigured]);

  useEffect(() => {
    if (!currentHouseholdId || !isConfigured || !user) return;

    const loadHouseholdData = async () => {
      const { members } = await getHouseholdMembers(currentHouseholdId);
      const housematesData: Housemate[] = members.map(m => ({
        id: m.user_id,
        name: m.display_name,
        color: m.color,
      }));
      setHousemates(housematesData);

      const loadedTasks = await dataService.getTasks(currentHouseholdId);
      setTasks(loadedTasks.length > 0 ? loadedTasks : DEFAULT_TASKS);

      const loadedAssignments = await dataService.getAssignments(currentHouseholdId);
      setAssignments(loadedAssignments);

      const settings = getSettings();
      const weekStart = getCurrentWeekStart(settings.rotationDay);
      setCurrentWeekStart(weekStart);

      if (housematesData.length > 0 && loadedTasks.length > 0) {
        if (needsNewAssignments(loadedAssignments, weekStart)) {
          const newAssignments = generateWeeklyAssignments(
            housematesData,
            loadedTasks.length > 0 ? loadedTasks : DEFAULT_TASKS,
            loadedAssignments,
            weekStart
          );
          for (const assignment of newAssignments) {
            await dataService.addAssignment(currentHouseholdId, assignment);
          }
          setAssignments([...loadedAssignments, ...newAssignments]);
        }
      }
    };

    loadHouseholdData();

    const unsubTasks = dataService.subscribeToTasks(currentHouseholdId, setTasks);
    const unsubAssignments = dataService.subscribeToAssignments(currentHouseholdId, setAssignments);

    return () => {
      unsubTasks?.();
      unsubAssignments?.();
    };
  }, [currentHouseholdId, user, isConfigured]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAddHousemate = (housemate: Housemate) => {
    const updated = [...housemates, housemate];
    setHousemates(updated);
    saveHousemates(updated);

    if (tasks.length > 0 && currentWeekStart) {
      const newAssignments = generateWeeklyAssignments(
        updated,
        tasks,
        assignments,
        currentWeekStart
      );
      setAssignments(newAssignments);
      saveAssignmentsLocal(newAssignments);
    }
  };

  const handleRemoveHousemate = (id: string) => {
    const updated = housemates.filter((h) => h.id !== id);
    setHousemates(updated);
    saveHousemates(updated);

    if (updated.length > 0 && tasks.length > 0 && currentWeekStart) {
      const newAssignments = generateWeeklyAssignments(
        updated,
        tasks,
        [],
        currentWeekStart
      );
      setAssignments(newAssignments);
      saveAssignmentsLocal(newAssignments);
    } else {
      setAssignments([]);
      saveAssignmentsLocal([]);
    }
  };

  const handleAddTask = async (task: CleaningTask) => {
    if (isConfigured && currentHouseholdId) {
      await dataService.addTask(currentHouseholdId, task);
    } else {
      const updated = [...tasks, task];
      setTasks(updated);
      saveTasksLocal(updated);

      if (housemates.length > 0 && currentWeekStart) {
        const newAssignments = generateWeeklyAssignments(
          housemates,
          updated,
          assignments,
          currentWeekStart
        );
        setAssignments(newAssignments);
        saveAssignmentsLocal(newAssignments);
      }
    }
  };

  const handleRemoveTask = async (id: string) => {
    if (isConfigured && currentHouseholdId) {
      await dataService.deleteTask(currentHouseholdId, id);
    } else {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      saveTasksLocal(updated);

      const updatedAssignments = assignments.filter((a) => a.taskId !== id);
      setAssignments(updatedAssignments);
      saveAssignmentsLocal(updatedAssignments);
    }
  };

  const handleCompleteTask = async (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    if (isConfigured && currentHouseholdId) {
      await dataService.updateAssignment(currentHouseholdId, assignmentId, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
    } else {
      const updatedAssignments = assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, completed: true, completedAt: new Date().toISOString() }
          : a
      );
      setAssignments(updatedAssignments);
      saveAssignmentsLocal(updatedAssignments);

      const historyEntry: CompletionHistory = {
        id: 'history-' + Date.now(),
        taskId: assignment.taskId,
        housemateId: assignment.housemateId,
        completedAt: new Date().toISOString(),
        weekStartDate: assignment.weekStartDate,
      };
      const updatedHistory = [...history, historyEntry];
      setHistory(updatedHistory);
      saveHistory(updatedHistory);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const settings = getSettings();
    saveSettings({ ...settings, theme: newTheme });
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <div style={{ marginBottom: '2rem' }}>
        {isConfigured && user && (
          <div className="mb-3">
            <HouseholdSelector
              currentHouseholdId={currentHouseholdId}
              onSelectHousehold={setCurrentHouseholdId}
            />
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="flex gap-2 items-center">
            {isConfigured && user && (
              <button
                className="btn-small"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            )}
            <button
              className="btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? '← Back to Dashboard' : '⚙️ Settings'}
            </button>
          </div>
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
