import React, { useState } from 'react';
import { CleaningTask } from '../types';
import { generateTaskDescription } from '../services/ai';

interface TaskManagerProps {
  tasks: CleaningTask[];
  onAddTask: (task: CleaningTask) => void;
  onRemoveTask: (id: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState<{
    name: string;
    description: string;
    frequency: CleaningTask['frequency'];
    icon: string;
  }>({
    name: '',
    description: '',
    frequency: 'weekly',
    icon: '✨',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTips, setGeneratedTips] = useState<string[]>([]);

  const handleGenerateDescription = async () => {
    if (!newTask.name.trim()) {
      alert('Please enter a task name first!');
      return;
    }

    setIsGenerating(true);
    setGeneratedTips([]);

    try {
      const result = await generateTaskDescription(
        newTask.name,
        newTask.description
      );

      setNewTask({
        ...newTask,
        description: result.description,
      });
      setGeneratedTips(result.tips);
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert('Failed to generate description. Please check your API key or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.name.trim()) {
      const task: CleaningTask = {
        id: `task-${Date.now()}`,
        ...newTask,
        name: newTask.name.trim(),
        description: newTask.description.trim() || undefined,
      };
      onAddTask(task);
      setNewTask({ name: '', description: '', frequency: 'weekly', icon: '✨' });
      setGeneratedTips([]);
      setShowForm(false);
    }
  };

  return (
    <div className="glass p-4 fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          📋 Cleaning Tasks
        </h2>
        <button
          className="btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Emoji (optional)"
              value={newTask.icon}
              onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
              style={{ width: '80px' }}
              maxLength={2}
            />
            <input
              type="text"
              placeholder="Task name..."
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="flex-1"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="flex-1"
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleGenerateDescription}
              disabled={isGenerating || !newTask.name.trim()}
              title="Generate AI description and tips"
              style={{ whiteSpace: 'nowrap' }}
            >
              {isGenerating ? '🤖 Generating...' : '✨ AI Generate'}
            </button>
          </div>

          {generatedTips.length > 0 && (
            <div className="glass p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                💡 AI-Generated Tips:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                {generatedTips.map((tip, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <select
              value={newTask.frequency}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  frequency: e.target.value as CleaningTask['frequency'],
                })
              }
              className="flex-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button type="submit" className="btn btn-success">
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
            No tasks yet. Add some cleaning tasks!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="glass p-3 flex items-center justify-between slide-in"
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1.5rem' }}>{task.icon}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                    {task.name}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {task.description}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {task.frequency}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => {
                  if (confirm(`Remove "${task.name}"?`)) {
                    onRemoveTask(task.id);
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
