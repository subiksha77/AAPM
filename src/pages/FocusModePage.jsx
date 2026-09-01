import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  ListTodo
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { PriorityBadge } from '../components/common/Badges';
import { Modal } from '../components/common/Modal';
import { getTodayFocus } from '../services/motivationService';
import { formatDuration } from '../services/focusService';

const DURATION_PRESETS = [
  { label: '25 min', minutes: 25, desc: 'Pomodoro Sprint' },
  { label: '45 min', minutes: 45, desc: 'Deep Work' },
  { label: '60 min', minutes: 60, desc: 'Extended Block' }
];

export const FocusModePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    project,
    tasks,
    toggleTask,
    saveFocusSession,
    dailyFocusTime,
    streakStats
  } = useProject();

  // Pick default prioritized task (prefer a task passed from Today's AI Plan)
  const focusRecommendation = getTodayFocus(tasks);
  const incompleteTasks = tasks.filter((t) => t.status !== 'Completed');
  const requestedTaskId = location.state?.taskId;
  const requestedTaskExists = requestedTaskId && tasks.some((t) => t.id === requestedTaskId);

  const [selectedTaskId, setSelectedTaskId] = useState(
    (requestedTaskExists ? requestedTaskId : null) ||
      focusRecommendation?.task?.id ||
      (incompleteTasks.length > 0 ? incompleteTasks[0].id : '')
  );

  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(25);
  const [sessionState, setSessionState] = useState('idle'); // 'idle' | 'running' | 'paused' | 'ended'
  
  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  // Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState(null);

  const timerRef = useRef(null);

  const activeTask = tasks.find((t) => t.id === selectedTaskId);

  // Update seconds when preset changes in idle state
  const handleSelectPreset = (mins) => {
    if (sessionState === 'idle') {
      setSelectedDurationMinutes(mins);
      setSecondsRemaining(mins * 60);
    }
  };

  // Timer Tick Effect
  useEffect(() => {
    if (sessionState === 'running') {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleEndSession(true);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [sessionState]);

  const handleStartSession = () => {
    setSessionState('running');
    setSessionStartTime(new Date().toISOString());
  };

  const handlePauseSession = () => {
    setSessionState('paused');
  };

  const handleResumeSession = () => {
    setSessionState('running');
  };

  const handleEndSession = (isNaturalFinish = false) => {
    clearInterval(timerRef.current);
    setSessionState('ended');

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const now = new Date().toISOString();

    const logged = saveFocusSession({
      taskId: activeTask?.id || null,
      taskName: activeTask?.name || 'General Academic Focus',
      startTime: sessionStartTime || now,
      endTime: now,
      durationMinutes,
      durationSeconds: elapsedSeconds,
      status: 'completed',
      date: now.split('T')[0]
    });

    setCompletedSessionData({
      logged,
      elapsedSeconds,
      durationMinutes,
      task: activeTask,
      isNaturalFinish
    });

    setShowCompletionModal(true);
  };

  const handleMarkTaskComplete = () => {
    if (activeTask && activeTask.status !== 'Completed') {
      toggleTask(activeTask.id);
    }
    setShowCompletionModal(false);
    navigate('/dashboard');
  };

  const handleContinueWorking = () => {
    setShowCompletionModal(false);
    setSessionState('idle');
    setElapsedSeconds(0);
    setSecondsRemaining(selectedDurationMinutes * 60);
  };

  // Time format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / (selectedDurationMinutes * 60)) * 100)
  );

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={24} style={{ color: '#2563eb' }} />
            <span>Focus Mode</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.15rem' }}>
            One task at a time. Make meaningful progress towards your deadlines.
          </p>
        </div>

        {/* Quick Streak Stats */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.4rem 0.85rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              color: '#b45309',
              fontWeight: 600
            }}
          >
            <Flame size={15} style={{ color: '#f59e0b' }} />
            <span>Streak: {streakStats.currentStreak} Day{streakStats.currentStreak !== 1 ? 's' : ''}</span>
          </div>

          <div
            style={{
              padding: '0.4rem 0.85rem',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              color: '#1d4ed8',
              fontWeight: 600
            }}
          >
            <Clock size={15} style={{ color: '#2563eb' }} />
            <span>Today: {dailyFocusTime.formatted}</span>
          </div>
        </div>
      </div>

      {/* Main Focus Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          padding: '2rem'
        }}
      >
        {/* Task Selection Bar */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
            Target Sprint Task
          </label>

          {incompleteTasks.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                className="form-select"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                disabled={sessionState === 'running' || sessionState === 'paused'}
                style={{ fontWeight: 600, fontSize: '0.94rem' }}
              >
                {incompleteTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.priority} Priority · {t.deadline ? `Due ${t.deadline}` : 'No deadline'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                color: '#166534',
                fontSize: '0.88rem'
              }}
            >
              All current tasks are completed! You can still run a general research session or add new tasks in the Task Board.
            </div>
          )}

          {/* Active Task Details */}
          {activeTask && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <PriorityBadge priority={activeTask.priority} />
                  {activeTask.deadline && (
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={12} />
                      Due {new Date(activeTask.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  {activeTask.name}
                </h3>
                {activeTask.description && (
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.45 }}>
                    {activeTask.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timer Duration Presets (Idle State) */}
        {sessionState === 'idle' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            {DURATION_PRESETS.map((preset) => {
              const isSelected = selectedDurationMinutes === preset.minutes;
              return (
                <button
                  key={preset.minutes}
                  type="button"
                  onClick={() => handleSelectPreset(preset.minutes)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#1d4ed8' : '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    minWidth: '120px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>{preset.label}</span>
                  <span style={{ fontSize: '0.72rem', color: isSelected ? '#3b82f6' : '#94a3b8' }}>
                    {preset.desc}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Timer Clock Circle Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '8px solid',
              borderColor:
                sessionState === 'running' ? '#2563eb' : sessionState === 'paused' ? '#f59e0b' : '#e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
              position: 'relative',
              transition: 'border-color 0.3s ease'
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1
              }}
            >
              {formatTime(secondsRemaining)}
            </span>

            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color:
                  sessionState === 'running'
                    ? '#2563eb'
                    : sessionState === 'paused'
                    ? '#d97706'
                    : '#94a3b8',
                marginTop: '0.5rem'
              }}
            >
              {sessionState === 'running'
                ? 'Session Active'
                : sessionState === 'paused'
                ? 'Paused'
                : 'Ready'}
            </span>

            {elapsedSeconds > 0 && (
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                Elapsed: {formatDuration(Math.round(elapsedSeconds / 60))}
              </span>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          {sessionState === 'idle' && (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleStartSession}
              style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem' }}
            >
              <Play size={18} />
              <span>Start Focus Session</span>
            </button>
          )}

          {sessionState === 'running' && (
            <>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={handlePauseSession}
                style={{ minWidth: '130px' }}
              >
                <Pause size={18} />
                <span>Pause</span>
              </button>
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={() => handleEndSession(false)}
                style={{ minWidth: '140px' }}
              >
                <span>End Session</span>
              </button>
            </>
          )}

          {sessionState === 'paused' && (
            <>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleResumeSession}
                style={{ minWidth: '130px' }}
              >
                <Play size={18} />
                <span>Resume</span>
              </button>
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={() => handleEndSession(false)}
                style={{ minWidth: '140px' }}
              >
                <span>End Session</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sustainable Productivity Note */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <Sparkles size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
        <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
          <strong>Sustainable Progress Principle:</strong> 25 to 45 minutes of focused, distraction-free execution each day yields far greater academic output and thesis retention than irregular multi-hour marathons.
        </p>
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Focus session completed! 🎉"
        maxWidth="500px"
      >
        {completedSessionData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                Recorded Work Duration
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', margin: '0.25rem 0' }}>
                {completedSessionData.durationMinutes} Minute{completedSessionData.durationMinutes !== 1 ? 's' : ''}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#166534' }}>
                Exact elapsed focus time saved to your project consistency record.
              </p>
            </div>

            {completedSessionData.task && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Task Worked On:
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                  {completedSessionData.task.name}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
              {completedSessionData.task && completedSessionData.task.status !== 'Completed' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleMarkTaskComplete}
                  style={{ width: '100%' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Mark Task Complete</span>
                </button>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleContinueWorking}
                  style={{ flex: 1 }}
                >
                  Continue Working
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCompletionModal(false);
                    navigate('/dashboard');
                  }}
                  style={{ flex: 1 }}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
