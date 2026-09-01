import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Target,
  CheckCircle,
  XCircle,
  Layers,
  Package,
  Plus,
  Trash2,
  Save,
  Check,
  FolderPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { EmptyState } from '../components/common/EmptyState';

export const PlanningPage = () => {
  const navigate = useNavigate();
  const {
    project,
    objectives,
    saveObjectives,
    planning,
    savePlanning
  } = useProject();

  // Local state for planning sections
  const [activeTab, setActiveTab] = useState('objectives'); // 'objectives' | 'scope' | 'requirements' | 'deliverables'

  // Objectives Local List
  const [localObjectives, setLocalObjectives] = useState(objectives || []);
  const [newObjective, setNewObjective] = useState('');

  // Scope Local List
  const [inScope, setInScope] = useState(planning.inScope || []);
  const [outOfScope, setOutOfScope] = useState(planning.outOfScope || []);
  const [newInScope, setNewInScope] = useState('');
  const [newOutOfScope, setNewOutOfScope] = useState('');

  // Requirements Local List
  const [funcReqs, setFuncReqs] = useState(planning.functionalRequirements || []);
  const [nonFuncReqs, setNonFuncReqs] = useState(planning.nonFunctionalRequirements || []);
  const [newFuncReq, setNewFuncReq] = useState('');
  const [newNonFuncReq, setNewNonFuncReq] = useState('');

  // Deliverables Local List
  const [deliverables, setDeliverables] = useState(planning.deliverables || []);
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    format: 'PDF Report / Code Repo',
    dueDate: '',
    status: 'Pending'
  });

  // Save all planning changes
  const handleSaveAll = () => {
    saveObjectives(localObjectives);
    savePlanning({
      inScope,
      outOfScope,
      functionalRequirements: funcReqs,
      nonFunctionalRequirements: nonFuncReqs,
      deliverables
    });
  };

  // Objectives handlers
  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    const updated = [...localObjectives, newObjective.trim()];
    setLocalObjectives(updated);
    saveObjectives(updated);
    setNewObjective('');
  };

  const handleRemoveObjective = (index) => {
    const updated = localObjectives.filter((_, i) => i !== index);
    setLocalObjectives(updated);
    saveObjectives(updated);
  };

  // Scope Handlers
  const handleAddInScope = () => {
    if (!newInScope.trim()) return;
    const updated = [...inScope, newInScope.trim()];
    setInScope(updated);
    savePlanning({ ...planning, inScope: updated, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables });
    setNewInScope('');
  };

  const handleRemoveInScope = (index) => {
    const updated = inScope.filter((_, i) => i !== index);
    setInScope(updated);
    savePlanning({ ...planning, inScope: updated, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables });
  };

  const handleAddOutOfScope = () => {
    if (!newOutOfScope.trim()) return;
    const updated = [...outOfScope, newOutOfScope.trim()];
    setOutOfScope(updated);
    savePlanning({ ...planning, inScope, outOfScope: updated, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables });
    setNewOutOfScope('');
  };

  const handleRemoveOutOfScope = (index) => {
    const updated = outOfScope.filter((_, i) => i !== index);
    setOutOfScope(updated);
    savePlanning({ ...planning, inScope, outOfScope: updated, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables });
  };

  // Requirements Handlers
  const handleAddFuncReq = () => {
    if (!newFuncReq.trim()) return;
    const updated = [...funcReqs, newFuncReq.trim()];
    setFuncReqs(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: updated, nonFunctionalRequirements: nonFuncReqs, deliverables });
    setNewFuncReq('');
  };

  const handleRemoveFuncReq = (index) => {
    const updated = funcReqs.filter((_, i) => i !== index);
    setFuncReqs(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: updated, nonFunctionalRequirements: nonFuncReqs, deliverables });
  };

  const handleAddNonFuncReq = () => {
    if (!newNonFuncReq.trim()) return;
    const updated = [...nonFuncReqs, newNonFuncReq.trim()];
    setNonFuncReqs(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: updated, deliverables });
    setNewNonFuncReq('');
  };

  const handleRemoveNonFuncReq = (index) => {
    const updated = nonFuncReqs.filter((_, i) => i !== index);
    setNonFuncReqs(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: updated, deliverables });
  };

  // Deliverables Handlers
  const handleAddDeliverable = () => {
    if (!newDeliverable.title.trim()) return;
    const item = {
      id: 'del_' + Date.now(),
      title: newDeliverable.title.trim(),
      format: newDeliverable.format.trim(),
      dueDate: newDeliverable.dueDate,
      status: newDeliverable.status
    };
    const updated = [...deliverables, item];
    setDeliverables(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables: updated });
    setNewDeliverable({
      title: '',
      format: 'PDF Report / Code Repo',
      dueDate: '',
      status: 'Pending'
    });
  };

  const handleRemoveDeliverable = (id) => {
    const updated = deliverables.filter((d) => d.id !== id);
    setDeliverables(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables: updated });
  };

  const handleToggleDeliverableStatus = (id) => {
    const updated = deliverables.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status: d.status === 'Completed' ? 'Pending' : 'Completed'
        };
      }
      return d;
    });
    setDeliverables(updated);
    savePlanning({ ...planning, inScope, outOfScope, functionalRequirements: funcReqs, nonFunctionalRequirements: nonFuncReqs, deliverables: updated });
  };

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for Planning"
        description="Please create your academic project before defining requirements, scope, and deliverables."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={24} style={{ color: '#2563eb' }} />
            <span>Academic Project Planning</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Structure your project scope boundaries, system requirements, and major academic deliverables.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleSaveAll}>
          <Save size={16} />
          <span>Save All Specifications</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        {[
          { id: 'objectives', label: '1. Objectives', icon: Target, count: localObjectives.length },
          { id: 'scope', label: '2. Project Scope', icon: Layers, count: inScope.length + outOfScope.length },
          { id: 'requirements', label: '3. Requirements (SRS)', icon: FileText, count: funcReqs.length + nonFuncReqs.length },
          { id: 'deliverables', label: '4. Deliverables', icon: Package, count: deliverables.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                border: 'none',
                background: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#1d4ed8' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                borderRadius: '8px 8px 0 0',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#dbeafe' : '#f1f5f9',
                  color: isActive ? '#1e40af' : '#475569',
                  fontWeight: 600
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Objectives */}
      {activeTab === 'objectives' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Target size={18} style={{ color: '#2563eb' }} />
                <span>Core Research & Technical Objectives</span>
              </h3>
              <p className="card-subtitle">Objectives established during project inception and planning</p>
            </div>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add a new objective..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddObjective();
                }}
              />
              <button type="button" className="btn btn-primary" onClick={handleAddObjective}>
                <Plus size={16} />
                <span>Add Objective</span>
              </button>
            </div>

            {localObjectives.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No objectives listed. Add your project objectives above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {localObjectives.map((obj, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#dbeafe',
                          color: '#1d4ed8',
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
                      <span style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.4 }}>{obj}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: '#dc2626' }}
                      onClick={() => handleRemoveObjective(i)}
                      title="Remove objective"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Scope (In Scope & Out of Scope) */}
      {activeTab === 'scope' && (
        <div className="grid-2">
          {/* In Scope Card */}
          <div className="card">
            <div className="card-header" style={{ borderLeft: '4px solid #16a34a' }}>
              <div>
                <h3 className="card-title" style={{ color: '#16a34a' }}>
                  <CheckCircle size={18} />
                  <span>In Scope</span>
                </h3>
                <p className="card-subtitle">Features and domains included in this project</p>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Model inference on edge devices"
                  value={newInScope}
                  onChange={(e) => setNewInScope(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddInScope();
                  }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddInScope}>
                  <Plus size={16} />
                </button>
              </div>

              {inScope.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No items in scope defined yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {inScope.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: '#166534'
                      }}
                    >
                      <span>✓ {item}</span>
                      <button
                        type="button"
                        className="btn-icon btn-sm"
                        style={{ border: 'none', background: 'none', color: '#dc2626' }}
                        onClick={() => handleRemoveInScope(i)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Out of Scope Card */}
          <div className="card">
            <div className="card-header" style={{ borderLeft: '4px solid #dc2626' }}>
              <div>
                <h3 className="card-title" style={{ color: '#dc2626' }}>
                  <XCircle size={18} />
                  <span>Out of Scope</span>
                </h3>
                <p className="card-subtitle">Explicit boundaries and non-goals</p>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Real-time satellite hardware telemetry"
                  value={newOutOfScope}
                  onChange={(e) => setNewOutOfScope(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddOutOfScope();
                  }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddOutOfScope}>
                  <Plus size={16} />
                </button>
              </div>

              {outOfScope.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No out-of-scope boundaries defined.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {outOfScope.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: '#991b1b'
                      }}
                    >
                      <span>✗ {item}</span>
                      <button
                        type="button"
                        className="btn-icon btn-sm"
                        style={{ border: 'none', background: 'none', color: '#dc2626' }}
                        onClick={() => handleRemoveOutOfScope(i)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Requirements (Functional & Non-Functional) */}
      {activeTab === 'requirements' && (
        <div className="grid-2">
          {/* Functional Requirements */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Functional Requirements</h3>
                <p className="card-subtitle">What the system must perform</p>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. FR-01: User authentication via JWT"
                  value={newFuncReq}
                  onChange={(e) => setNewFuncReq(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFuncReq();
                  }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddFuncReq}>
                  <Plus size={16} />
                </button>
              </div>

              {funcReqs.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No functional requirements added.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {funcReqs.map((req, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{ color: '#1e293b' }}>{req}</span>
                      <button
                        type="button"
                        className="btn-icon btn-sm"
                        style={{ color: '#dc2626' }}
                        onClick={() => handleRemoveFuncReq(i)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Non-Functional Requirements */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Non-Functional Requirements</h3>
                <p className="card-subtitle">Performance, security, and scalability</p>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. NFR-01: Sub-200ms latency for API requests"
                  value={newNonFuncReq}
                  onChange={(e) => setNewNonFuncReq(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNonFuncReq();
                  }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddNonFuncReq}>
                  <Plus size={16} />
                </button>
              </div>

              {nonFuncReqs.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No non-functional requirements added.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {nonFuncReqs.map((req, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{ color: '#1e293b' }}>{req}</span>
                      <button
                        type="button"
                        className="btn-icon btn-sm"
                        style={{ color: '#dc2626' }}
                        onClick={() => handleRemoveNonFuncReq(i)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Deliverables */}
      {activeTab === 'deliverables' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Package size={18} style={{ color: '#2563eb' }} />
                <span>Project Deliverables</span>
              </h3>
              <p className="card-subtitle">Tangible outputs required for academic evaluation</p>
            </div>
          </div>
          <div className="card-body">
            {/* Add Deliverable Form */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr auto',
                gap: '0.75rem',
                alignItems: 'center',
                marginBottom: '1.25rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Deliverable Title (e.g. System Design Document)..."
                value={newDeliverable.title}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, title: e.target.value })}
              />

              <input
                type="text"
                className="form-input"
                placeholder="Format (e.g. PDF / Git Repo)"
                value={newDeliverable.format}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, format: e.target.value })}
              />

              <input
                type="date"
                className="form-input"
                value={newDeliverable.dueDate}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, dueDate: e.target.value })}
              />

              <button type="button" className="btn btn-primary" onClick={handleAddDeliverable}>
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>

            {/* Deliverables List */}
            {deliverables.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No deliverables listed yet. Add your required academic submissions above.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Deliverable Item</th>
                      <th>Format / Specification</th>
                      <th>Target Date</th>
                      <th>Status</th>
                      <th style={{ width: '80px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliverables.map((del) => {
                      const isDone = del.status === 'Completed';
                      return (
                        <tr key={del.id}>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleDeliverableStatus(del.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isDone ? '#16a34a' : '#94a3b8',
                                padding: 0
                              }}
                              title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                            >
                              {isDone ? <CheckCircle size={18} /> : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1' }} />}
                            </button>
                          </td>
                          <td style={{ fontWeight: 600, color: isDone ? '#64748b' : '#0f172a', textDecoration: isDone ? 'line-through' : 'none' }}>
                            {del.title}
                          </td>
                          <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{del.format}</td>
                          <td style={{ color: '#475569', fontSize: '0.82rem' }}>
                            {del.dueDate ? new Date(del.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </td>
                          <td>
                            <span
                              className={`badge ${isDone ? 'badge-status-completed' : 'badge-status-todo'}`}
                            >
                              {del.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-icon btn-sm"
                              style={{ color: '#dc2626' }}
                              onClick={() => handleRemoveDeliverable(del.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
