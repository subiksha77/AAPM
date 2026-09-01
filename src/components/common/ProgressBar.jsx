import React from 'react';

export const ProgressBar = ({ progress = 0, size = 'normal', showLabel = false, labelText = '' }) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));
  const isComplete = clamped === 100;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.35rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#475569'
          }}
        >
          <span>{labelText || 'Overall Progress'}</span>
          <span style={{ color: isComplete ? '#16a34a' : '#2563eb' }}>{clamped}%</span>
        </div>
      )}
      <div className={`progress-track ${size === 'large' ? 'progress-track-lg' : ''}`}>
        <div
          className={`progress-fill ${isComplete ? 'progress-fill-success' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
