import React from 'react';
import { FolderPlus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderPlus,
  title,
  description,
  actionText,
  onAction,
  extra
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon-wrapper">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionText && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
      {extra && <div style={{ marginTop: '1rem' }}>{extra}</div>}
    </div>
  );
};
