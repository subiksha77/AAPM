import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Layers,
  RotateCcw,
  Plus,
  User,
  LogOut
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badges';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const TopHeader = () => {
  const navigate = useNavigate();
  const { project, projectStatus, progress, taskStats, deleteProject } = useProject();
  const { user, logout } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleReset = () => {
    deleteProject();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
    : 'IN';

  return (
    <header className="top-header">
      <div className="header-left">
        {project ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '320px'
              }}
              title={project.name}
            >
              {project.name}
            </h2>
            <div className="header-project-badge">
              <Layers size={13} style={{ color: '#2563eb' }} />
              <span>{project.domain}</span>
            </div>
            <StatusBadge status={projectStatus} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#64748b'
              }}
            >
              No Active Project Selected
            </span>
          </div>
        )}
      </div>

      <div className="header-right">
        {project && (
          <>
            <div className="header-meta-item">
              <Calendar size={14} />
              <span>
                Target: {project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
              </span>
            </div>

            <div
              className="header-meta-item"
              style={{
                backgroundColor: '#eff6ff',
                borderColor: '#bfdbfe',
                color: '#1d4ed8',
                fontWeight: 600
              }}
            >
              <Sparkles size={14} />
              <span>
                {progress}% Complete ({taskStats.completed}/{taskStats.total} Tasks)
              </span>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowResetConfirm(true)}
              title="Reset all project data for a fresh start"
              style={{ color: '#dc2626' }}
            >
              <RotateCcw size={14} />
              <span>Reset Data</span>
            </button>
          </>
        )}

        {!project && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/create-project')}
          >
            <Plus size={15} />
            <span>New Project</span>
          </button>
        )}

        {/* User Avatar Badge with Logout Dropdown / Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem', paddingLeft: '0.5rem', borderLeft: '1px solid #e2e8f0' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
            title={user?.fullName || 'User'}
          >
            {initials}
          </div>

          <button
            type="button"
            className="btn-icon btn-sm"
            onClick={() => setShowLogoutConfirm(true)}
            title="Sign Out"
            style={{ color: '#64748b' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset Project & All Data?"
        message="This will completely clear your active project, tasks, milestones, planning data, and risks from localStorage. Are you sure?"
        confirmText="Yes, Reset Everything"
      />

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
        message="Are you sure you want to sign out? Your project work will remain saved."
        confirmText="Sign Out"
        isDanger={false}
      />
    </header>
  );
};
