import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtext, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    emerald: { bg: '#f0fdf4', color: '#16a34a' },
    amber: { bg: '#fffbeb', color: '#d97706' },
    rose: { bg: '#fef2f2', color: '#dc2626' },
    purple: { bg: '#faf5ff', color: '#9333ea' }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon" style={{ backgroundColor: scheme.bg, color: scheme.color }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {subtext && <div className="stat-card-sub">{subtext}</div>}
    </div>
  );
};
