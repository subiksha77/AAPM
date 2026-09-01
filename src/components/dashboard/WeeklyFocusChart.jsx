import React from 'react';
import { BarChart3, Clock } from 'lucide-react';

export const WeeklyFocusChart = ({ weeklyFocusActivity }) => {
  const weekData = weeklyFocusActivity?.weekData || [];
  const totalMinutes = weeklyFocusActivity?.totalMinutes || 0;

  // Find max minutes to compute relative bar height
  const maxMinutes = Math.max(60, ...weekData.map((d) => d.minutes));

  return (
    <div className="card weekly-focus-chart-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              <BarChart3 size={16} />
            </div>
            <div>
              <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Weekly Focus Activity</h3>
              <p className="card-subtitle" style={{ fontSize: '0.75rem' }}>Monday – Sunday focus distribution</p>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 600,
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #bfdbfe'
            }}
          >
            Total: {weeklyFocusActivity?.formattedTotal || '0m'}
          </span>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.25rem' }}>
        {totalMinutes === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
            <Clock size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.88rem', fontWeight: 500 }}>No focus activity recorded yet.</p>
            <p style={{ fontSize: '0.76rem', marginTop: '0.2rem' }}>
              Complete a focus session in Focus Mode to begin tracking your weekly distribution.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', height: '160px', paddingTop: '1.5rem' }}>
            {weekData.map((d) => {
              const heightPercent = Math.max(6, Math.round((d.minutes / maxMinutes) * 100));
              const isToday = d.date === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={d.day}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '0.4rem'
                  }}
                >
                  {/* Tooltip text above bar */}
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: d.minutes > 0 ? '#1e293b' : '#cbd5e1' }}>
                    {d.minutes > 0 ? d.formatted : '0m'}
                  </span>

                  {/* Visual Bar */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      backgroundColor: d.minutes >= 10 ? '#2563eb' : d.minutes > 0 ? '#93c5fd' : '#f1f5f9',
                      borderRadius: '6px 6px 2px 2px',
                      transition: 'height 0.3s ease',
                      border: isToday ? '2px solid #1d4ed8' : 'none'
                    }}
                    title={`${d.day}: ${d.formatted} (${d.sessionsCount} session${d.sessionsCount !== 1 ? 's' : ''})`}
                  />

                  {/* Day Label */}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? '#2563eb' : '#64748b'
                    }}
                  >
                    {d.day.substring(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
