import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Flame, Calendar, Play, CheckCircle2, TrendingUp } from 'lucide-react';

export const FocusActivityCard = ({ dailyFocusTime, weeklyFocusActivity, streakStats, totalSessions }) => {
  const navigate = useNavigate();

  return (
    <div className="card focus-activity-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
              <Clock size={16} />
            </div>
            <div>
              <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Focus Activity</h3>
              <p className="card-subtitle" style={{ fontSize: '0.75rem' }}>Real elapsed focus work</p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => navigate('/focus')}
            style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
          >
            <Play size={12} />
            <span>Focus Mode</span>
          </button>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem' }}>
        {/* 5-Metric Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }}>
          {/* Today */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Today
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {dailyFocusTime?.formatted || '0m'}
            </div>
          </div>

          {/* This Week */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              This Week
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {weeklyFocusActivity?.formattedTotal || '0m'}
            </div>
          </div>

          {/* Sessions */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Sessions
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {totalSessions || 0}
            </div>
          </div>

          {/* Active Days */}
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Days
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {weeklyFocusActivity?.activeDaysCount || 0} / 7
            </div>
          </div>

          {/* Current Streak */}
          <div style={{ padding: '0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 600 }}>
              Streak
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>🔥</span>
              <span>{streakStats?.currentStreak || 0}d</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={13} style={{ color: '#16a34a' }} />
          <span>Active day recorded upon completing ≥ 10 minutes of verified focus work.</span>
        </div>
      </div>
    </div>
  );
};
