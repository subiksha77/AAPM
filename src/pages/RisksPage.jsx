import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Flame,
  AlertCircle,
  HelpCircle,
  FolderPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SeverityBadge } from '../components/common/Badges';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { calculateRiskSeverity } from '../services/storageService';

export const RisksPage = () => {
  const navigate = useNavigate();
  const { project, risks, addRisk, updateRisk, deleteRisk } = useProject();

  // Add Risk Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    probability: 'Medium',
    impact: 'Medium',
    mitigation: ''
  });
  const [formError, setFormError] = useState('');

  // Edit Risk Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Live computed preview severity
  const previewSeverity = calculateRiskSeverity(formData.probability, formData.impact);
  const editPreviewSeverity = editingRisk ? calculateRiskSeverity(editingRisk.probability, editingRisk.impact) : 'Low';

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Risk Name is required.');
      return;
    }

    addRisk(formData);
    setFormData({
      name: '',
      description: '',
      probability: 'Medium',
      impact: 'Medium',
      mitigation: ''
    });
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleEditOpen = (r) => {
    setEditingRisk(r);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingRisk.name.trim()) return;

    updateRisk(editingRisk);
    setIsEditModalOpen(false);
    setEditingRisk(null);
  };

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for Risk Management"
        description="Please create your academic project before cataloging technical, architectural, or timeline risks."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  // Count by severity
  const criticalCount = risks.filter((r) => r.severity === 'Critical').length;
  const highCount = risks.filter((r) => r.severity === 'High').length;
  const mediumCount = risks.filter((r) => r.severity === 'Medium').length;
  const lowCount = risks.filter((r) => r.severity === 'Low').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={24} style={{ color: '#dc2626' }} />
            <span>Risk Management Register</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Systematic threat modeling with automated Probability × Impact severity matrix.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>+ Add Risk</span>
        </button>
      </div>

      {/* Severity Metric Tiles */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid #e11d48' }}>
          <div className="stat-card-header">
            <span className="stat-card-title">Critical</span>
            <Flame size={18} style={{ color: '#e11d48' }} />
          </div>
          <div className="stat-card-value" style={{ color: '#e11d48' }}>{criticalCount}</div>
          <span className="stat-card-sub">Immediate blocker mitigation</span>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-card-header">
            <span className="stat-card-title">High</span>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          </div>
          <div className="stat-card-value" style={{ color: '#ef4444' }}>{highCount}</div>
          <span className="stat-card-sub">Significant architectural threat</span>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-header">
            <span className="stat-card-title">Medium</span>
            <AlertCircle size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-card-value" style={{ color: '#d97706' }}>{mediumCount}</div>
          <span className="stat-card-sub">Manageable with fallback</span>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div className="stat-card-header">
            <span className="stat-card-title">Low</span>
            <ShieldCheck size={18} style={{ color: '#22c55e' }} />
          </div>
          <div className="stat-card-value" style={{ color: '#16a34a' }}>{lowCount}</div>
          <span className="stat-card-sub">Standard operating variance</span>
        </div>
      </div>

      {/* Risk Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Assessed Risks Register</h3>
            <p className="card-subtitle">Calculated severity based on Probability and Impact weights</p>
          </div>
        </div>

        {risks.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <EmptyState
              icon={ShieldCheck}
              title="No risks have been identified."
              description="Identify potential bottlenecks, dependency delays, or algorithm performance limitations."
              actionText="+ Identify First Risk"
              onAction={() => setIsAddModalOpen(true)}
            />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Risk Name & Description</th>
                  <th style={{ width: '120px' }}>Probability</th>
                  <th style={{ width: '120px' }}>Impact</th>
                  <th style={{ width: '130px' }}>Calculated Severity</th>
                  <th>Mitigation Strategy</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                        {r.name}
                      </div>
                      {r.description && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem', lineHeight: 1.4 }}>
                          {r.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', fontWeight: 500, color: '#334155' }}>
                        {r.probability}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', fontWeight: 500, color: '#334155' }}>
                        {r.impact}
                      </span>
                    </td>
                    <td>
                      <SeverityBadge severity={r.severity} />
                    </td>
                    <td>
                      <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                        {r.mitigation || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>None specified</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleEditOpen(r)}
                          title="Edit Risk"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#dc2626' }}
                          onClick={() => setDeleteTargetId(r.id)}
                          title="Delete Risk"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Risk Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Project Risk">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">
              Risk Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dataset scarcity for specialized edge cases"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formError) setFormError('');
              }}
              autoFocus
            />
            {formError && <div className="form-error">{formError}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Why this risk exists and how it could compromise project delivery..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Probability</label>
              <select
                className="form-select"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
              >
                <option value="Low">Low (Unlikely)</option>
                <option value="Medium">Medium (Moderate chance)</option>
                <option value="High">High (Very likely)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Impact</label>
              <select
                className="form-select"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              >
                <option value="Low">Low (Minor deviation)</option>
                <option value="Medium">Medium (Moderate delay/scope cut)</option>
                <option value="High">High (Critical project failure)</option>
              </select>
            </div>
          </div>

          {/* Auto Calculated Severity Preview */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.84rem', color: '#475569' }}>
              <strong>Calculated Severity Matrix:</strong> {formData.probability} Prob × {formData.impact} Impact
            </div>
            <SeverityBadge severity={previewSeverity} />
          </div>

          <div className="form-group">
            <label className="form-label">Mitigation Plan</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Preventative actions or contingency fallback plan..."
              value={formData.mitigation}
              onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              + Save Risk
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Risk Modal */}
      {editingRisk && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Risk">
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Risk Name</label>
              <input
                type="text"
                className="form-input"
                value={editingRisk.name}
                onChange={(e) => setEditingRisk({ ...editingRisk, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={editingRisk.description || ''}
                onChange={(e) => setEditingRisk({ ...editingRisk, description: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Probability</label>
                <select
                  className="form-select"
                  value={editingRisk.probability}
                  onChange={(e) => setEditingRisk({ ...editingRisk, probability: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Impact</label>
                <select
                  className="form-select"
                  value={editingRisk.impact}
                  onChange={(e) => setEditingRisk({ ...editingRisk, impact: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Calculated Severity Preview */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                <strong>Updated Calculated Severity:</strong> {editingRisk.probability} Prob × {editingRisk.impact} Impact
              </div>
              <SeverityBadge severity={editPreviewSeverity} />
            </div>

            <div className="form-group">
              <label className="form-label">Mitigation</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={editingRisk.mitigation || ''}
                onChange={(e) => setEditingRisk({ ...editingRisk, mitigation: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Risk
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
          if (deleteTargetId) deleteRisk(deleteTargetId);
        }}
        title="Delete Risk Entry?"
        message="Are you sure you want to remove this risk entry from your project risk register?"
      />
    </div>
  );
};
