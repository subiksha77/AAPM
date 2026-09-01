import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderPlus,
  Compass,
  CheckSquare,
  Milestone,
  FileText,
  AlertTriangle,
  TrendingUp,
  Bot,
  BookOpen,
  GraduationCap,
  Clock,
  Zap,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const Sidebar = () => {
  const navigate = useNavigate();
  const {
    project,
    tasks,
    risks,
    progress,
    dailyFocusTime,
    readiness,
    mentorMode
  } = useProject();
  const { user, logout, updateProfile } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    institution: user?.institution || '',
    domain: user?.domain || '',
    academicLevel: user?.academicLevel || '',
    guideName: user?.guideName || ''
  });

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const highRisks = risks.filter((r) => r.severity === 'High' || r.severity === 'Critical').length;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: project ? `${progress}%` : null
    },
    {
      to: '/create-project',
      label: 'Create Project',
      icon: FolderPlus
    },
    {
      to: '/project-overview',
      label: 'Project Overview',
      icon: Compass
    },
    {
      to: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingTasks > 0 ? pendingTasks : null
    },
    {
      to: '/milestones',
      label: 'Milestones',
      icon: Milestone
    },
    {
      to: '/planning',
      label: 'Planning',
      icon: FileText
    },
    {
      to: '/focus',
      label: 'Focus Mode',
      icon: Clock,
      badge: dailyFocusTime?.totalMinutes > 0 ? dailyFocusTime.formatted : 'Sprint'
    },
    {
      to: '/readiness',
      label: 'Readiness & Mode',
      icon: GraduationCap,
      badge: readiness ? `${readiness.readinessLevel}` : 'Assess'
    },
    {
      to: '/risks',
      label: 'Risks',
      icon: AlertTriangle,
      badge: highRisks > 0 ? highRisks : null,
      badgeColor: 'danger'
    },
    {
      to: '/progress',
      label: 'Progress Tracking',
      icon: TrendingUp
    },
    {
      to: '/ai-mentor',
      label: 'AI Mentor',
      icon: Bot,
      badge: mentorMode || 'AI'
    },
    {
      to: '/documentation',
      label: 'Documentation',
      icon: BookOpen
    }
  ];

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setShowProfileModal(false);
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
    <aside className="sidebar" aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <GraduationCap size={20} />
        </div>
        <div>
          <div className="sidebar-brand-text">AI Project Mentor</div>
          <div className="sidebar-brand-subtitle">Academic Suite</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} className="sidebar-icon" />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className="sidebar-badge"
                  style={
                    item.badgeColor === 'danger'
                      ? { backgroundColor: '#fee2e2', color: '#dc2626' }
                      : {}
                  }
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer with User Profile & Logout */}
      <div className="sidebar-footer" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
        <div className="sidebar-user-info" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.fullName || 'Student Researcher'}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.academicLevel || 'Undergraduate'} · {user?.institution ? user.institution.split(' ')[0] : 'Workspace'}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon btn-sm"
            onClick={() => setShowLogoutConfirm(true)}
            title="Sign Out"
            style={{ color: '#dc2626', border: 'none', background: 'transparent' }}
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Action Shortcuts: Profile & Settings */}
        <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.4rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            className="sidebar-link"
            style={{ padding: '0.35rem 0.5rem', fontSize: '0.76rem', flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setProfileData({
                fullName: user?.fullName || '',
                institution: user?.institution || '',
                domain: user?.domain || '',
                academicLevel: user?.academicLevel || '',
                guideName: user?.guideName || ''
              });
              setShowProfileModal(true);
            }}
          >
            <User size={13} />
            <span>Profile</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            style={{ padding: '0.35rem 0.5rem', fontSize: '0.76rem', flex: 1, justifyContent: 'center' }}
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out of AI Academic Mentor?"
        message="Are you sure you want to sign out? Your active project data, tasks, and progress will remain safely saved in localStorage."
        confirmText="Sign Out"
        isDanger={false}
      />

      {/* Profile Modal */}
      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Student Profile">
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Academic Level</label>
              <input
                type="text"
                className="form-input"
                value={profileData.academicLevel}
                onChange={(e) => setProfileData({ ...profileData, academicLevel: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Domain</label>
              <input
                type="text"
                className="form-input"
                value={profileData.domain}
                onChange={(e) => setProfileData({ ...profileData, domain: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Institution / University</label>
              <input
                type="text"
                className="form-input"
                value={profileData.institution}
                onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Guide / Mentor</label>
              <input
                type="text"
                className="form-input"
                value={profileData.guideName}
                onChange={(e) => setProfileData({ ...profileData, guideName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowProfileModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Platform Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.2rem' }}>
              Data Layer Configuration
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Current mode: <strong>Client LocalStorage State</strong>. Ready for connection with PostgreSQL + FastAPI backend service.
            </p>
          </div>

          <div style={{ padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.2rem' }}>
              AI Intelligence Pipeline
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              LLM Mentorship Agent & Thesis Synthesizer will activate upon FastAPI backend provisioning.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowSettingsModal(false)}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};
