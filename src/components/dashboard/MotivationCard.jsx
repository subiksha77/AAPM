import React from 'react';
import { Sparkles, ArrowRight, Zap, Target, Award, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { getMotivationState } from '../../services/motivationService';

export const MotivationCard = ({ project, tasks, milestones, progress, overdueTasks }) => {
  const motivation = getMotivationState(project, tasks, milestones, progress, overdueTasks);

  const getIcon = (state) => {
    switch (state) {
      case 'PROJECT_COMPLETED':
        return <Award size={20} className="text-emerald-500" />;
      case 'ACHIEVEMENT':
        return <Zap size={20} className="text-purple-500" />;
      case 'BEHIND_SCHEDULE':
        return <AlertCircle size={20} className="text-rose-500" />;
      case 'DEADLINE_NEAR':
        return <Clock size={20} className="text-amber-500" />;
      case 'PROGRESSING':
        return <CheckCircle2 size={20} className="text-blue-500" />;
      default:
        return <Sparkles size={20} className="text-blue-500" />;
    }
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'emerald':
        return { backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#86efac' };
      case 'rose':
        return { backgroundColor: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5' };
      case 'amber':
        return { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' };
      case 'purple':
        return { backgroundColor: '#f3e8ff', color: '#7e22ce', borderColor: '#d8b4fe' };
      default:
        return { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' };
    }
  };

  return (
    <div
      className="card motivation-card"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #2563eb, #7c3aed, #06b6d4)'
        }}
      />
      <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #dbeafe',
                marginTop: '2px'
              }}
            >
              {getIcon(motivation.state)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: 700 }}>
                  AI Motivation & Guidance
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    ...getBadgeStyle(motivation.badgeColor)
                  }}
                >
                  {motivation.badgeText}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                {motivation.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, maxWidth: '750px' }}>
                {motivation.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
