import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Milestone,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
  Edit2,
  Trash2,
  FolderPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/Badges';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const MilestonesPage = () => {
  const navigate = useNavigate();
  const {
    project,
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    milestoneStats
  } = useProject();

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming'
  });
  const [formError, setFormError] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Milestone Name is required.');
      return;
    }

    addMilestone(formData);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Upcoming'
    });
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleEditOpen = (m) => {
    setEditingMilestone(m);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMilestone.name.trim()) return;

    updateMilestone(editingMilestone);
    setIsEditModalOpen(false);
    setEditingMilestone(null);
  };

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for Milestones"
        description="Please create your academic project before organizing project phases and delivery milestones."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Milestone size={24} style={{ color: '#9333ea' }} />
            <span>Milestones & Timeline</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Track major academic stages ({milestoneStats.completed}/{milestones.length} completed).
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>+ Add Milestone</span>
        </button>
      </div>

      {/* Timeline View */}
      {milestones.length === 0 ? (
        <EmptyState
          icon={Milestone}
          title="No milestones created yet."
          description="Break your academic project into key stages like Literature Survey, Prototype, Testing, and Final Review."
          actionText="+ Add First Milestone"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="timeline">
          {milestones.map((m, index) => {
            const isCompleted = m.status === 'Completed';
            const isInProgress = m.status === 'In Progress';

            return (
              <div key={m.id} className="timeline-item">
                <div
                  className={`timeline-dot ${isCompleted ? 'completed' : isInProgress ? 'inprogress' : ''}`}
                />
                <div className="timeline-content">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#9333ea', textTransform: 'uppercase' }}>
                          Phase {index + 1}
                        </span>
                        <StatusBadge status={m.status} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                        {m.name}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleEditOpen(m)}
                        title="Edit Milestone"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ color: '#dc2626' }}
                        onClick={() => setDeleteTargetId(m.id)}
                        title="Delete Milestone"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {m.description && (
                    <p style={{ color: '#475569', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                      {m.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '1.25rem',
                      fontSize: '0.78rem',
                      color: '#64748b',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    {m.startDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} />
                        <span>Start: {new Date(m.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {m.endDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} />
                        <span>Target: <strong>{new Date(m.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Project Milestone">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">
              Milestone Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Phase 1: Literature Review & Architecture Design"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
            {formError && <div className="form-error">{formError}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Key outputs, deliverables, and review criteria for this milestone..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target End Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              + Save Milestone
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Milestone">
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Milestone Name</label>
              <input
                type="text"
                className="form-input"
                value={editingMilestone.name}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={editingMilestone.description || ''}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
              />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingMilestone.startDate || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingMilestone.endDate || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, endDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editingMilestone.status}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, status: e.target.value })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Milestone
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteMilestone(deleteTargetId);
        }}
        title="Delete Milestone?"
        message="Are you sure you want to remove this milestone from your project timeline?"
      />
    </div>
  );
};
