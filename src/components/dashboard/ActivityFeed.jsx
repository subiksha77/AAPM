import React from 'react';
import {
  FolderPlus,
  CheckSquare,
  Milestone,
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';

export const ActivityFeed = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'project':
        return <FolderPlus size={14} style={{ color: '#2563eb' }} />;
      case 'task':
        return <CheckSquare size={14} style={{ color: '#16a34a' }} />;
      case 'milestone':
        return <Milestone size={14} style={{ color: '#9333ea' }} />;
      case 'risk':
        return <AlertTriangle size={14} style={{ color: '#dc2626' }} />;
      case 'planning':
        return <FileText size={14} style={{ color: '#0284c7' }} />;
      default:
        return <Clock size={14} style={{ color: '#64748b' }} />;
    }
  };

  const formatTimeAgo = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
        No actions recorded yet. Your real-time project actions will appear here.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {activities.slice(0, 8).map((act) => (
        <div
          key={act.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            {getIcon(act.type)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
              {act.action}
            </div>
            {act.details && (
              <div
                style={{
                  fontSize: '0.76rem',
                  color: '#64748b',
                  marginTop: '0.15rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {act.details}
              </div>
            )}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', flexShrink: 0 }}>
            {formatTimeAgo(act.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
};
