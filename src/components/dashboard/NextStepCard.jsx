import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { getNextRecommendedAction } from '../../services/motivationService';

export const NextStepCard = ({ project, tasks, milestones, risks, planning, progress }) => {
  const navigate = useNavigate();
  const nextStep = getNextRecommendedAction(project, tasks, milestones, risks, planning, progress);

  return (
    <div className="card next-step-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ paddingBottom: '0.85rem' }}>
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
            <Compass size={16} />
          </div>
          <div>
            <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Your Next Step</h3>
            <p className="card-subtitle" style={{ fontSize: '0.75rem' }}>Context-aware workflow recommendation</p>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
            {nextStep.title}
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
            {nextStep.action}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => navigate(nextStep.route)}
            style={{ fontSize: '0.8rem' }}
          >
            <span>{nextStep.buttonText}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
