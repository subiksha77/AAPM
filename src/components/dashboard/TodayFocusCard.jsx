import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, Circle, Calendar, Plus, ArrowRight, Flame } from 'lucide-react';
import { getTodayFocus } from '../../services/motivationService';
import { PriorityBadge } from '../common/Badges';

export const TodayFocusCard = ({ tasks = [], onToggleTask }) => {
  const navigate = useNavigate();
  const focus = getTodayFocus(tasks);

  return (
    <div className="card today-focus-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ paddingBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Target size={16} />
          </div>
          <div>
            <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Today's Focus</h3>
            <p className="card-subtitle" style={{ fontSize: '0.75rem' }}>Prioritized by deadline and technical weight</p>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {focus && focus.task ? (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: focus.priorityRank <= 2 ? '#dc2626' : '#2563eb',
                  backgroundColor: focus.priorityRank <= 2 ? '#fee2e2' : '#eff6ff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px'
                }}
              >
                {focus.reason}
              </span>
              <PriorityBadge priority={focus.task.priority} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => onToggleTask(focus.task.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Mark this focus task completed"
              >
                <Circle size={20} />
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
                  {focus.task.name}
                </h4>
                {focus.task.description && (
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {focus.task.description}
                  </p>
                )}
                {focus.task.deadline && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#475569', marginTop: '0.4rem' }}>
                    <Calendar size={12} />
                    <span>Target Due: <strong>{new Date(focus.task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => onToggleTask(focus.task.id)}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
              >
                <CheckCircle2 size={13} />
                <span>Complete Task</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
            <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '0.85rem' }}>
              {tasks.length === 0
                ? 'Start by creating your first task.'
                : 'All scheduled tasks completed! Add new tasks to set today’s focus.'}
            </p>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => navigate('/tasks')}
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
