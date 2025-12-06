import React from 'react';
import { TaskAssignment, Housemate, CleaningTask } from '../types';

interface DashboardProps {
  assignments: TaskAssignment[];
  housemates: Housemate[];
  tasks: CleaningTask[];
  weekStartDate: string;
  onCompleteTask: (assignmentId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  assignments,
  housemates,
  tasks,
  weekStartDate,
  onCompleteTask,
}) => {
  const getHousemateById = (id: string) =>
    housemates.find((h) => h.id === id);

  const getTaskById = (id: string) =>
    tasks.find((t) => t.id === id);

  const formatWeekDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    return `${date.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const currentAssignments = assignments.filter(
    (a) => a.weekStartDate === weekStartDate
  );

  const completedCount = currentAssignments.filter((a) => a.completed).length;
  const totalCount = currentAssignments.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (housemates.length === 0 || tasks.length === 0) {
    return (
      <div className="glass p-4 text-center fade-in">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>
          🧹 Welcome to Cleaning Rota!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {housemates.length === 0 && tasks.length === 0
            ? 'Get started by adding housemates and cleaning tasks below.'
            : housemates.length === 0
            ? 'Add some housemates to get started!'
            : 'Add some cleaning tasks to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="glass-strong p-4 mb-4">
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          ✨ This Week's Cleaning
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          {formatWeekDate(weekStartDate)}
        </p>

        {/* Progress Bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Progress</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              {completedCount} / {totalCount} completed
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: 'var(--success)',
                transition: 'width 0.5s ease',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {currentAssignments.map((assignment) => {
          const housemate = getHousemateById(assignment.housemateId);
          const task = getTaskById(assignment.taskId);

          if (!housemate || !task) return null;

          return (
            <div
              key={assignment.id}
              className={`glass p-4 slide-in ${assignment.completed ? 'completed-task' : ''}`}
              style={{
                opacity: assignment.completed ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full"
                    style={{
                      width: '35px',
                      height: '35px',
                      backgroundColor: housemate.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  >
                    {housemate.name[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '600' }}>{housemate.name}</span>
                </div>
                {assignment.completed && (
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '2rem' }}>{task.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                    {task.name}
                  </h3>
                  {task.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {!assignment.completed ? (
                <button
                  className="btn btn-success w-full mt-3"
                  onClick={() => onCompleteTask(assignment.id)}
                >
                  Mark as Complete
                </button>
              ) : (
                <div
                  className="mt-3 p-2 rounded"
                  style={{
                    backgroundColor: 'var(--success)',
                    textAlign: 'center',
                    fontWeight: '600',
                  }}
                >
                  Completed! 🎉
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
