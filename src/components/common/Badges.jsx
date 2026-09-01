import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle, Flame, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'To Do' }) => {
  const norm = (status || '').toLowerCase().replace(/\s+/g, '');

  let className = 'badge-status-todo';
  let Icon = Clock;

  if (norm === 'completed') {
    className = 'badge-status-completed';
    Icon = CheckCircle2;
  } else if (norm === 'inprogress') {
    className = 'badge-status-inprogress';
    Icon = PlayCircle;
  } else if (norm === 'notstarted' || norm === 'upcoming') {
    className = 'badge-status-upcoming';
    Icon = Clock;
  }

  return (
    <span className={`badge ${className}`}>
      <Icon size={12} />
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  const norm = (priority || '').toLowerCase();

  let className = 'badge-priority-medium';
  if (norm === 'high') {
    className = 'badge-priority-high';
  } else if (norm === 'low') {
    className = 'badge-priority-low';
  }

  return (
    <span className={`badge ${className}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor'
        }}
      />
      <span>{priority}</span>
    </span>
  );
};

export const SeverityBadge = ({ severity = 'Low' }) => {
  const norm = (severity || '').toLowerCase();

  let className = 'badge-severity-low';
  let Icon = AlertCircle;

  if (norm === 'critical') {
    className = 'badge-severity-critical';
    Icon = Flame;
  } else if (norm === 'high') {
    className = 'badge-severity-high';
    Icon = AlertTriangle;
  } else if (norm === 'medium') {
    className = 'badge-severity-medium';
    Icon = AlertCircle;
  }

  return (
    <span className={`badge ${className}`}>
      <Icon size={12} />
      <span>{severity}</span>
    </span>
  );
};
