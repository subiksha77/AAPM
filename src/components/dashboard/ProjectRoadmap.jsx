import React from 'react';
import { Map, CheckCircle2, Clock, Circle, Layers } from 'lucide-react';
import { getProjectRoadmap } from '../../services/motivationService';

export const ProjectRoadmap = ({ project, tasks = [], milestones = [], planning = null, progress = 0 }) => {
  const stages = getProjectRoadmap(project, tasks, milestones, planning, progress);

  return (
    <div className="card project-roadmap-card">
      <div className="card-header" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Map size={16} />
            </div>
            <div>
              <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Academic Project Journey & Roadmap</h3>
              <p className="card-subtitle" style={{ fontSize: '0.75rem' }}>Automated phase status derived from deliverables</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
              Completed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
              Active Phase
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              Upcoming
            </span>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="roadmap-grid">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === 'Completed';
            const isCurrent = stage.status === 'Current';

            return (
              <div
                key={stage.id}
                className={`roadmap-step ${isCompleted ? 'step-completed' : isCurrent ? 'step-current' : 'step-upcoming'}`}
              >
                <div className="roadmap-step-header">
                  <div className="roadmap-step-badge">
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : isCurrent ? (
                      <span className="roadmap-pulse" />
                    ) : (
                      <span className="roadmap-step-num">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`badge badge-sm ${
                      isCompleted ? 'badge-status-completed' : isCurrent ? 'badge-status-inprogress' : 'badge-status-upcoming'
                    }`}
                    style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}
                  >
                    {stage.status}
                  </span>
                </div>

                <h4 className="roadmap-step-title">{stage.name}</h4>
                <p className="roadmap-step-desc">{stage.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
