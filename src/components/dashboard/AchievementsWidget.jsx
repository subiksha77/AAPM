import React from 'react';
import { Award, Zap, CheckSquare, Milestone, TrendingUp, FolderPlus } from 'lucide-react';
import { getEarnedAchievements } from '../../services/motivationService';

export const AchievementsWidget = ({ project, tasks = [], milestones = [], progress = 0 }) => {
  const achievements = getEarnedAchievements(project, tasks, milestones, progress);

  const getIcon = (name) => {
    switch (name) {
      case 'FolderPlus':
        return <FolderPlus size={16} />;
      case 'CheckSquare':
        return <CheckSquare size={16} />;
      case 'Zap':
        return <Zap size={16} />;
      case 'Milestone':
        return <Milestone size={16} />;
      case 'TrendingUp':
        return <TrendingUp size={16} />;
      default:
        return <Award size={16} />;
    }
  };

  const getTierStyle = (tier) => {
    switch (tier) {
      case 'platinum':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      case 'gold':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'silver':
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
      default:
        return { bg: '#fafaf9', color: '#78716c', border: '#e7e5e4' };
    }
  };

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="card achievements-widget">
      <div className="card-header" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={16} style={{ color: '#d97706' }} />
            <h3 className="card-title" style={{ fontSize: '0.94rem' }}>
              Academic Milestones Earned ({achievements.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Verified from project deliverables</span>
        </div>
      </div>

      <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {achievements.map((item) => {
            const style = getTierStyle(item.tier);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: style.bg,
                  border: `1px solid ${style.border}`,
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: style.color,
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  {getIcon(item.icon)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
