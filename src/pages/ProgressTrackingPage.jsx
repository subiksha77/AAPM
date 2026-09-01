import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Milestone,
  ShieldAlert,
  ArrowRight,
  FolderPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';

export const ProgressTrackingPage = () => {
  const navigate = useNavigate();
  const {
    project,
    tasks,
    milestones,
    progress,
    projectStatus,
    taskStats,
    milestoneStats,
    overdueTasks,
    toggleTask
  } = useProject();

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for Progress Tracking"
        description="Please create your academic project and assign tasks to view detailed velocity analytics."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={24} style={{ color: '#2563eb' }} />
            <span>Progress Tracking & Analytics</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Detailed breakdown calculated live from your {tasks.length} task deliverables.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/tasks')}>
            Manage Tasks
          </button>
        </div>
      </div>

      {/* Hero Progress Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                Mathematical Completion Formula: (Completed / Total) × 100
              </span>
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '1rem' }}>
              {progress}% <span style={{ fontSize: '1.1rem', fontWeight: 400, color: '#94a3b8' }}>Overall Progress</span>
            </h2>
            <div style={{ maxWidth: '600px', marginBottom: '1rem' }}>
              <ProgressBar progress={progress} size="large" />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <span>✓ <strong>{taskStats.completed}</strong> Completed</span>
              <span>⚡ <strong>{taskStats.inProgress}</strong> In Progress</span>
              <span>⏳ <strong>{taskStats.todo}</strong> To Do</span>
              {overdueTasks.length > 0 && (
                <span style={{ color: '#f87171' }}>⚠️ <strong>{overdueTasks.length}</strong> Overdue</span>
              )}
            </div>
          </div>

          <div
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: '8px solid rgba(59, 130, 246, 0.2)',
              borderTopColor: '#3b82f6',
              borderRightColor: progress > 25 ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
              borderBottomColor: progress > 50 ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
              borderLeftColor: progress > 75 ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>{progress}%</span>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#94a3b8' }}>Status</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid-3">
        {/* Task Velocity Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Completion</h3>
          </div>
          <div className="card-body">
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {taskStats.completed} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 400 }}>/ {taskStats.total} Tasks</span>
            </div>
            <ProgressBar progress={progress} />
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Completion Rate:</span>
                <strong>{progress}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Pending Work:</span>
                <strong>{taskStats.total - taskStats.completed} Tasks</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Completion Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Milestone Phases</h3>
          </div>
          <div className="card-body">
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {milestoneStats.completed} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 400 }}>/ {milestoneStats.total} Phases</span>
            </div>
            <ProgressBar
              progress={milestoneStats.total > 0 ? Math.round((milestoneStats.completed / milestoneStats.total) * 100) : 0}
            />
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>In Progress:</span>
                <strong>{milestoneStats.inProgress} Phases</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Upcoming:</span>
                <strong>{milestoneStats.upcoming} Phases</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Health Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Schedule Adherence</h3>
          </div>
          <div className="card-body">
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: overdueTasks.length > 0 ? '#dc2626' : '#16a34a',
                marginBottom: '0.5rem'
              }}
            >
              {overdueTasks.length}{' '}
              <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 400 }}>Overdue</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginTop: '0.5rem' }}>
              {overdueTasks.length === 0
                ? 'All pending tasks are currently within their designated target deadlines.'
                : `${overdueTasks.length} task(s) require immediate rescheduling or delivery.`}
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Tasks Section (If any) */}
      {overdueTasks.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: '#dc2626' }}>
                <ShieldAlert size={18} />
                <span>Overdue Tasks Requiring Attention ({overdueTasks.length})</span>
              </h3>
              <p className="card-subtitle">Calculated based on current system date and task deadline</p>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTasks.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{t.name}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>
                        {new Date(t.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => toggleTask(t.id)}
                        >
                          Mark Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pending vs Completed Tasks Lists */}
      <div className="grid-2">
        {/* Pending Tasks */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={18} style={{ color: '#2563eb' }} />
                <span>Active & Pending Tasks ({pendingTasks.length})</span>
              </h3>
            </div>
          </div>
          <div className="card-body">
            {pendingTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                {tasks.length === 0 ? 'No tasks created yet.' : 'All tasks completed!'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {pendingTasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {t.deadline ? `Due: ${new Date(t.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : 'No deadline'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <PriorityBadge priority={t.priority} />
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => toggleTask(t.id)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                <span>Completed Tasks ({completedTasks.length})</span>
              </h3>
            </div>
          </div>
          <div className="card-body">
            {completedTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                No completed tasks yet. Mark tasks as complete in the Tasks view to build velocity.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {completedTasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#166534', textDecoration: 'line-through' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '0.15rem' }}>
                        Completed Deliverable
                      </div>
                    </div>
                    <span className="badge badge-status-completed">Completed</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
