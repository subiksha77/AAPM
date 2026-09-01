import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { calculateProjectHealth } from '../../services/motivationService';

export const ProjectHealthCard = ({ tasks = [], overdueTasks = [], milestones = [], risks = [], progress = 0 }) => {
  const health = calculateProjectHealth(tasks, overdueTasks, milestones, risks, progress);

  const getIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return <ShieldCheck size={18} style={{ color: '#16a34a' }} />;
      case 'Needs Attention':
        return <AlertTriangle size={18} style={{ color: '#d97706' }} />;
      case 'At Risk':
        return <AlertOctagon size={18} style={{ color: '#dc2626' }} />;
      default:
        return <Activity size={18} style={{ color: '#2563eb' }} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Healthy':
        return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'Needs Attention':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'At Risk':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      default:
        return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' };
    }
  };

  const badgeStyle = getStatusBadge(health.status);

  return (
    <div className="card project-health-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ paddingBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: badgeStyle.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getIcon(health.status)}
            </div>
            <div>
              <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Project Health</h3>
              <p className="card-subtitle" style={{ fontSize: '0.75rem' }}>Calculated schedule & risk velocity score</p>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              border: `1px solid ${badgeStyle.border}`
            }}
          >
            {health.status} ({health.score}/100)
          </span>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.65rem' }}>
        {/* Health Score Progress Line */}
        <div style={{ width: '100%' }}>
          <div className="progress-track" style={{ height: '6px' }}>
            <div
              style={{
                width: `${health.score}%`,
                height: '100%',
                borderRadius: '9999px',
                backgroundColor:
                  health.status === 'Healthy' ? '#16a34a' : health.status === 'Needs Attention' ? '#f59e0b' : '#dc2626',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500, lineHeight: 1.45 }}>
          {health.summary}
        </p>

        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
          <strong>Action:</strong> {health.recommendation}
        </p>
      </div>
    </div>
  );
};
