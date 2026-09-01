import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  Layers,
  Play,
  CheckCircle2,
  Circle,
  PlayCircle,
  FolderPlus
} from 'lucide-react';
import { StatusBadge } from '../common/Badges';

const formatPlanDate = (dateStr) => {
  const parsed = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return parsed.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusVisual = (status) => {
  const norm = (status || '').toLowerCase();
  if (norm === 'completed') {
    return {
      Icon: CheckCircle2,
      color: '#16a34a',
      background: '#f0fdf4',
      border: '#bbf7d0',
      label: 'Completed'
    };
  }
  if (norm === 'in progress') {
    return {
      Icon: PlayCircle,
      color: '#2563eb',
      background: '#eff6ff',
      border: '#bfdbfe',
      label: 'In Progress'
    };
  }
  return {
    Icon: Circle,
    color: '#64748b',
    background: '#f8fafc',
    border: '#e2e8f0',
    label: status || 'Pending'
  };
};

const getPlanMotivation = (todayPlan) => {
  if (!todayPlan) {
    return 'Generate an AI project plan to receive a personalized daily work sequence.';
  }

  const items = todayPlan.items || [];
  if (items.length === 0) {
    return todayPlan.rationale || 'Complete your project setup so AI can recommend a focused plan for today.';
  }

  const goal = todayPlan.focusGoalMinutes;
  const goalText = goal ? ` Aim for a ${goal}-minute focus session.` : '';
  return `Stay consistent: complete these ${items.length} recommended ${items.length === 1 ? 'task' : 'tasks'} in order.${goalText}`;
};

export const TodayAIPlanCard = ({ todayPlan }) => {
  const navigate = useNavigate();
  const items = todayPlan?.items || [];
  const motivation = getPlanMotivation(todayPlan);

  const handleStartFocus = (taskId) => {
    navigate('/focus', { state: taskId ? { taskId } : undefined });
  };

  return (
    <div className="card today-ai-plan-card">
      <div className="card-header today-ai-plan-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', minWidth: 0, flex: 1 }}>
          <div className="today-ai-plan-icon">
            <Sparkles size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 className="card-title">Today's AI Plan</h3>
            <p className="card-subtitle">Recommended work sequence from your live project tasks</p>
          </div>
        </div>
        <div className="today-ai-plan-date">
          <Calendar size={14} />
          <span>{formatPlanDate(todayPlan?.date)}</span>
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="today-ai-plan-reason">
          <span className="today-ai-plan-reason-label">AI Priority</span>
          <p>{todayPlan?.rationale || 'No daily plan is available yet. Create a project so AI can generate tasks and today’s sequence.'}</p>
        </div>

        {items.length === 0 ? (
          <div className="today-ai-plan-empty">
            <FolderPlus size={22} style={{ color: '#94a3b8' }} />
            <p>
              {todayPlan?.rationale
                || 'No recommended tasks for today. Generate an AI project plan to populate this card from real tasks.'}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/create-project')}
            >
              Open Project Setup
            </button>
          </div>
        ) : (
          <div className="today-ai-plan-items">
            {items.map((item) => {
              const task = item.task;
              if (!task) return null;

              const visual = getStatusVisual(task.status);
              const StatusIcon = visual.Icon;
              const isActionable = task.status !== 'Completed';

              return (
                <div
                  key={task.id || item.order}
                  className="today-ai-plan-item"
                  style={{ backgroundColor: visual.background, borderColor: visual.border }}
                >
                  <div className="today-ai-plan-item-top">
                    <div className="today-ai-plan-order" style={{ color: visual.color, borderColor: visual.border }}>
                      {item.order || ''}
                    </div>
                    <div className="today-ai-plan-item-main">
                      <div className="today-ai-plan-item-title-row">
                        <StatusIcon size={16} style={{ color: visual.color, flexShrink: 0 }} />
                        <h4>{task.name}</h4>
                      </div>
                      {item.why && (
                        <p className="today-ai-plan-item-why">{item.why}</p>
                      )}
                      <div className="today-ai-plan-meta">
                        <span>
                          <Clock size={12} />
                          {item.estimatedTime || task.estimatedDuration || 'Estimate pending'}
                        </span>
                        <span>
                          <Layers size={12} />
                          {task.phase || 'Unassigned phase'}
                        </span>
                        <StatusBadge status={task.status || 'To Do'} />
                      </div>
                    </div>
                  </div>
                  {isActionable && (
                    <div className="today-ai-plan-item-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStartFocus(task.id)}
                      >
                        <Play size={13} />
                        <span>Start Focus</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="today-ai-plan-motivation">
          <Sparkles size={14} />
          <p>{motivation}</p>
        </div>
      </div>
    </div>
  );
};
