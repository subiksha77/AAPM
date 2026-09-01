import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  CheckCircle2,
  ListTodo,
  Milestone,
  AlertTriangle,
  Calendar,
  Users,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { UpcomingTasksWidget } from '../components/dashboard/UpcomingTasksWidget';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge, SeverityBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';

// Enhanced Motivational & Intelligence Components
import { MotivationCard } from '../components/dashboard/MotivationCard';
import { TodayAIPlanCard } from '../components/dashboard/TodayAIPlanCard';
import { TodayFocusCard } from '../components/dashboard/TodayFocusCard';
import { NextStepCard } from '../components/dashboard/NextStepCard';
import { ProjectHealthCard } from '../components/dashboard/ProjectHealthCard';
import { ProjectRoadmap } from '../components/dashboard/ProjectRoadmap';
import { AchievementsWidget } from '../components/dashboard/AchievementsWidget';
import { FocusActivityCard } from '../components/dashboard/FocusActivityCard';
import { WeeklyFocusChart } from '../components/dashboard/WeeklyFocusChart';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    project,
    tasks,
    milestones,
    risks,
    planning,
    activities,
    progress,
    projectStatus,
    taskStats,
    milestoneStats,
    overdueTasks,
    toggleTask,
    dailyFocusTime,
    weeklyFocusActivity,
    streakStats,
    focusSessions,
    readiness,
    mentorMode,
    todayPlan
  } = useProject();

  // If no project exists, show attractive empty state
  if (!project) {
    return (
      <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
        <EmptyState
          icon={Sparkles}
          title="Welcome to AI Project Mentor"
          description="Create your first academic project to start planning, managing tasks, and tracking your real progress."
          actionText="+ Create New Project"
          onAction={() => navigate('/create-project')}
          extra={
            <div style={{ marginTop: '1.75rem' }}>
              <div className="ai-journey-flow" aria-label="AI guided project workflow" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
                {['Student Project', 'AI Analysis', 'AI Tasks', "Today's AI Plan", 'Focus Mode', 'Progress'].map((label, idx, arr) => (
                  <React.Fragment key={label}>
                    <div className={`ai-journey-step${idx === 0 ? ' is-current' : ''}`}>
                      <span className="ai-journey-step-index">{idx + 1}</span>
                      <span className="ai-journey-step-label">{label}</span>
                    </div>
                    {idx < arr.length - 1 && <span className="ai-journey-arrow" aria-hidden="true">→</span>}
                  </React.Fragment>
                ))}
              </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ color: '#2563eb', marginBottom: '0.5rem' }}>
                  <ListTodo size={20} />
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Real Progress Engine
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Dynamic mathematical calculation calculated directly from your deliverables and tasks.
                </div>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ color: '#9333ea', marginBottom: '0.5rem' }}>
                  <Milestone size={20} />
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Timeline & Milestones
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Track development phases, academic deadlines, and project deliverables with ease.
                </div>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={20} />
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Risk & Scope Register
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Automated risk matrix calculations and structured requirements scoping.
                </div>
              </div>
            </div>
            </div>
          }
        />
      </div>
    );
  }

  // Active Project Dashboard
  const activeRisks = risks.filter((r) => r.severity === 'High' || r.severity === 'Critical');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner / Project Overview Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderColor: '#334155'
        }}
      >
        <div style={{ padding: '1.75rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {project.domain}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#e2e8f0',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  {project.academicLevel}
                </span>
                <StatusBadge status={projectStatus} />
              </div>
              <h1 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {project.name}
              </h1>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.88rem',
                  maxWidth: '750px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {project.description}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                onClick={() => navigate('/project-overview')}
              >
                <span>Project Details</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick Info Strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.82rem',
              color: '#cbd5e1'
            }}
          >
            {project.guideName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={15} style={{ color: '#60a5fa' }} />
                <span>Guide: <strong style={{ color: '#ffffff' }}>{project.guideName}</strong></span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={15} style={{ color: '#60a5fa' }} />
              <span>Team Size: <strong style={{ color: '#ffffff' }}>{project.teamSize} Member{project.teamSize > 1 ? 's' : ''}</strong></span>
            </div>
            {project.startDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} style={{ color: '#60a5fa' }} />
                <span>Started: <strong style={{ color: '#ffffff' }}>{new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
              </div>
            )}
            {project.expectedCompletionDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} style={{ color: '#60a5fa' }} />
                <span>Target: <strong style={{ color: '#ffffff' }}>{new Date(project.expectedCompletionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guided workflow: Student Project → AI Analysis → AI Tasks → Today's AI Plan → Focus Mode → Progress */}
      <div className="ai-journey-flow" aria-label="AI guided project workflow">
        {[
          { label: 'Student Project', done: true },
          { label: 'AI Analysis', done: true },
          { label: 'AI Tasks', done: tasks.length > 0 },
          { label: "Today's AI Plan", current: true },
          { label: 'Focus Mode', done: (dailyFocusTime?.totalMinutes || 0) > 0 },
          { label: 'Progress', done: progress > 0 }
        ].map((step, idx, arr) => (
          <React.Fragment key={step.label}>
            <div
              className={`ai-journey-step${step.current ? ' is-current' : ''}${step.done && !step.current ? ' is-done' : ''}`}
            >
              <span className="ai-journey-step-index">{idx + 1}</span>
              <span className="ai-journey-step-label">{step.label}</span>
            </div>
            {idx < arr.length - 1 && <span className="ai-journey-arrow" aria-hidden="true">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Today's AI Plan — live recommendations from ProjectContext.todayPlan */}
      <TodayAIPlanCard todayPlan={todayPlan} />

      {/* AI Motivation & Guidance Card */}
      <MotivationCard
        project={project}
        tasks={tasks}
        milestones={milestones}
        progress={progress}
        overdueTasks={overdueTasks}
      />

      {/* Progress & Quick Stats Grid */}
      <div className="grid-4">
        {/* Real Progress Card */}
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="stat-card-header">
            <span className="stat-card-title">Real Project Progress</span>
            <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#2563eb' }}>
            {progress}%
          </div>
          <div style={{ marginTop: '0.2rem' }}>
            <ProgressBar progress={progress} />
          </div>
          <div className="stat-card-sub" style={{ marginTop: '0.4rem' }}>
            <span>{taskStats.completed} of {taskStats.total} tasks completed</span>
          </div>
        </div>

        {/* Task Summary */}
        <StatCard
          title="Task Breakdown"
          value={taskStats.total}
          icon={ListTodo}
          color="blue"
          subtext={`${taskStats.inProgress} In Progress · ${taskStats.todo} To Do`}
        />

        {/* Milestones Summary */}
        <StatCard
          title="Milestones"
          value={milestoneStats.total}
          icon={Milestone}
          color="purple"
          subtext={`${milestoneStats.completed} Completed · ${milestoneStats.upcoming} Upcoming`}
        />

        {/* Risk Register Summary */}
        <StatCard
          title="Identified Risks"
          value={risks.length}
          icon={AlertTriangle}
          color={activeRisks.length > 0 ? 'rose' : 'emerald'}
          subtext={activeRisks.length > 0 ? `${activeRisks.length} High/Critical Severity` : 'All risks moderate or low'}
        />
      </div>

      {/* Tactical Focus & Health Row (Today's Focus, Your Next Step, Project Health) */}
      <div className="grid-3">
        <TodayFocusCard tasks={tasks} onToggleTask={toggleTask} />
        <NextStepCard
          project={project}
          tasks={tasks}
          milestones={milestones}
          risks={risks}
          planning={planning}
          progress={progress}
        />
        <ProjectHealthCard
          tasks={tasks}
          overdueTasks={overdueTasks}
          milestones={milestones}
          risks={risks}
          progress={progress}
        />
      </div>

      {/* Overdue Tasks Alert Banner (if any) */}
      {overdueTasks.length > 0 && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={22} style={{ color: '#dc2626', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: '#991b1b', fontSize: '0.9rem' }}>
                {overdueTasks.length} Task{overdueTasks.length > 1 ? 's' : ''} Past Deadline
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
                Please review your tasks to update timelines or expedite pending deliverables.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => navigate('/progress')}
            style={{ color: '#dc2626' }}
          >
            Review Overdue
          </button>
        </div>
      )}

      {/* Academic Project Roadmap */}
      <ProjectRoadmap
        project={project}
        tasks={tasks}
        milestones={milestones}
        planning={planning}
        progress={progress}
      />

      {/* Earned Achievements Widget */}
      <AchievementsWidget
        project={project}
        tasks={tasks}
        milestones={milestones}
        progress={progress}
      />

      {/* Focus & Consistency Engine */}
      <div className="grid-2">
        <FocusActivityCard
          dailyFocusTime={dailyFocusTime}
          weeklyFocusActivity={weeklyFocusActivity}
          streakStats={streakStats}
          totalSessions={focusSessions.length}
        />
        <WeeklyFocusChart
          weeklyFocusActivity={weeklyFocusActivity}
        />
      </div>

      {/* Main Content Split: Tasks & Timeline on Left, Activity & Risks on Right */}
      <div className="grid-2">
        {/* Left Column: Upcoming Tasks */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ListTodo size={18} style={{ color: '#2563eb' }} />
                <span>Upcoming Tasks</span>
              </h3>
              <p className="card-subtitle">Prioritized by deadline</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/tasks')}
            >
              + Add Task
            </button>
          </div>
          <div className="card-body">
            <UpcomingTasksWidget tasks={tasks} onToggleTask={toggleTask} />
          </div>
        </div>

        {/* Right Column: Real Activity Stream */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={18} style={{ color: '#16a34a' }} />
                <span>Recent Activity</span>
              </h3>
              <p className="card-subtitle">Real-time audit log of project changes</p>
            </div>
          </div>
          <div className="card-body">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* Secondary Row: Milestones Snapshot & Active Risks */}
      <div className="grid-2">
        {/* Milestones Snapshot */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Milestone size={18} style={{ color: '#9333ea' }} />
                <span>Milestone Trajectory</span>
              </h3>
              <p className="card-subtitle">Current status across key project phases</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/milestones')}
            >
              Manage Milestones
            </button>
          </div>
          <div className="card-body">
            {milestones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                No milestones defined. Add major project phases to track timeline delivery.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {milestones.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {m.endDate ? `Target: ${new Date(m.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` : 'No date'}
                      </div>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Risks Register Snapshot */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <AlertTriangle size={18} style={{ color: '#dc2626' }} />
                <span>Risk Exposure</span>
              </h3>
              <p className="card-subtitle">Assessed threats & calculated severity</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/risks')}
            >
              Risk Register
            </button>
          </div>
          <div className="card-body">
            {risks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                No risks registered yet. Document project hurdles and mitigation plans.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {risks.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: '1rem' }}>
                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {r.name}
                      </div>
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
                        Mitigation: {r.mitigation || 'Under assessment'}
                      </div>
                    </div>
                    <SeverityBadge severity={r.severity} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
