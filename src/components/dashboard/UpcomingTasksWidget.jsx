import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { PriorityBadge } from '../common/Badges';

export const UpcomingTasksWidget = ({ tasks = [], onToggleTask }) => {
  const navigate = useNavigate();

  // Filter pending tasks and sort by deadline
  const pendingTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    })
    .slice(0, 5);

  if (pendingTasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
        {tasks.length === 0
          ? 'No tasks created yet. Add tasks in the Tasks module to track here.'
          : 'All tasks completed! Great job.'}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
              <button
                type="button"
                onClick={() => onToggleTask(task.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Mark Complete"
              >
                <Circle size={18} />
              </button>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {task.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
                  {task.deadline ? (
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={12} />
                      Due {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>No deadline</span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginLeft: '0.75rem' }}>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/tasks')}
        >
          <span>View All Tasks</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
