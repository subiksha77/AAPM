import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Edit,
  Calendar,
  Users,
  UserCheck,
  Layers,
  GraduationCap,
  Target,
  Clock,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/Badges';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';

const DOMAINS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Data Science',
  'IoT',
  'Cybersecurity',
  'Cloud Computing',
  'Other'
];

const ACADEMIC_LEVELS = [
  'Diploma',
  'Undergraduate',
  'Postgraduate'
];

export const ProjectOverviewPage = () => {
  const navigate = useNavigate();
  const { project, objectives, projectStatus, progress, updateProject } = useProject();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    domain: '',
    academicLevel: '',
    startDate: '',
    expectedCompletionDate: '',
    teamSize: 1,
    guideName: ''
  });

  const openEditModal = () => {
    if (!project) return;
    setEditData({
      name: project.name,
      description: project.description,
      domain: project.domain,
      academicLevel: project.academicLevel,
      startDate: project.startDate,
      expectedCompletionDate: project.expectedCompletionDate,
      teamSize: project.teamSize,
      guideName: project.guideName || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProject(editData);
    setIsEditModalOpen(false);
  };

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="No Project Created Yet"
        description="You need to set up your project first to view its comprehensive executive summary and parameters."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header with Title and Edit Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={24} style={{ color: '#2563eb' }} />
            <span>Project Overview</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Executive synopsis, academic credentials, and core metadata.
          </p>
        </div>

        <button type="button" className="btn btn-secondary" onClick={openEditModal}>
          <Edit size={16} />
          <span>Edit Project Info</span>
        </button>
      </div>

      {/* Main Project Card */}
      <div className="card">
        <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <StatusBadge status={projectStatus} />
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Real calculated project state based on tasks
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>
            {progress}% Completed
          </span>
        </div>

        <div className="card-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
              {project.name}
            </h2>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {project.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              backgroundColor: '#f8fafc',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                <Layers size={14} />
                <span>Domain</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {project.domain}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                <GraduationCap size={14} />
                <span>Academic Level</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {project.academicLevel}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                <UserCheck size={14} />
                <span>Guide / Mentor</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {project.guideName || 'Self-Guided'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                <Users size={14} />
                <span>Team Size</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {project.teamSize} Member{project.teamSize > 1 ? 's' : ''}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                <Calendar size={14} />
                <span>Start Date</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                <Calendar size={14} />
                <span>Target Completion</span>
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Objectives Section */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Target size={18} style={{ color: '#2563eb' }} />
              <span>Project Objectives</span>
            </h3>

            {objectives.length === 0 ? (
              <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                No objectives entered yet. You can add objectives in the Planning section.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {objectives.map((obj, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.5 }}>
                      {obj}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project Information">
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-input"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Domain</label>
              <select
                className="form-select"
                value={editData.domain}
                onChange={(e) => setEditData({ ...editData, domain: e.target.value })}
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Level</label>
              <select
                className="form-select"
                value={editData.academicLevel}
                onChange={(e) => setEditData({ ...editData, academicLevel: e.target.value })}
              >
                {ACADEMIC_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={editData.startDate}
                onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Completion Date</label>
              <input
                type="date"
                className="form-input"
                value={editData.expectedCompletionDate}
                onChange={(e) => setEditData({ ...editData, expectedCompletionDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Team Size</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={editData.teamSize}
                onChange={(e) => setEditData({ ...editData, teamSize: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guide / Mentor Name</label>
              <input
                type="text"
                className="form-input"
                value={editData.guideName}
                onChange={(e) => setEditData({ ...editData, guideName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
