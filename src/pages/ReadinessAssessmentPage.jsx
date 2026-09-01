import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Sliders,
  Shield,
  ArrowRight,
  Zap,
  Bot,
  Brain,
  FileCode,
  Search,
  BookOpen,
  Presentation
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import {
  READINESS_CATEGORIES,
  calculateReadinessScore
} from '../services/focusService';

const LEVEL_OPTIONS = ['Beginner', 'Developing', 'Intermediate', 'Advanced'];

const MENTOR_MODES = [
  {
    mode: 'Guided',
    title: 'Guided Mode',
    desc: 'Step-by-step guidance, structured templates, and granular task instructions for beginners.',
    icon: Bot,
    color: '#2563eb'
  },
  {
    mode: 'Balanced',
    title: 'Balanced Mode',
    desc: 'Guidance with room for independent problem solving and milestone checkpoints.',
    icon: Sparkles,
    color: '#7c3aed'
  },
  {
    mode: 'Expert',
    title: 'Expert Mode',
    desc: 'Challenge my decisions, suggest advanced alternatives, and focus on benchmarking.',
    icon: Zap,
    color: '#059669'
  }
];

export const ReadinessAssessmentPage = () => {
  const navigate = useNavigate();
  const { readiness, mentorMode, saveReadiness, changeMentorMode } = useProject();

  const [categoryScores, setCategoryScores] = useState(
    readiness?.categoryScores || {
      programming: 'Developing',
      aiml: 'Developing',
      planning: 'Intermediate',
      research: 'Developing',
      documentation: 'Developing',
      presentation: 'Intermediate'
    }
  );

  const [selectedMode, setSelectedMode] = useState(mentorMode || 'Balanced');

  // Real-time calculation of overall readiness
  const liveResults = calculateReadinessScore(categoryScores);

  const handleScoreChange = (catId, level) => {
    setCategoryScores((prev) => ({
      ...prev,
      [catId]: level
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveReadiness({ categoryScores });
    changeMentorMode(selectedMode);
    navigate('/dashboard');
  };

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'programming':
        return <FileCode size={18} style={{ color: '#2563eb' }} />;
      case 'aiml':
        return <Brain size={18} style={{ color: '#7c3aed' }} />;
      case 'planning':
        return <Sliders size={18} style={{ color: '#0284c7' }} />;
      case 'research':
        return <Search size={18} style={{ color: '#d97706' }} />;
      case 'documentation':
        return <BookOpen size={18} style={{ color: '#16a34a' }} />;
      case 'presentation':
        return <Presentation size={18} style={{ color: '#dc2626' }} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  const getLevelBadgeColor = (lvl) => {
    switch (lvl) {
      case 'Advanced':
        return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
      case 'Intermediate':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
      case 'Developing':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  const badgeStyle = getLevelBadgeColor(liveResults.readinessLevel);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <GraduationCap size={24} style={{ color: '#2563eb' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>
            Let's understand your project readiness
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
          This helps your AI Mentor provide guidance at the right level. Your baseline score adapts as you complete project sprints.
        </p>
      </div>

      {/* Real-time Calculated Score Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderColor: '#334155',
          padding: '1.5rem 2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd', fontWeight: 700, marginBottom: '0.3rem' }}>
              Calculated Overall Readiness
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                {liveResults.overallScore}
                <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 400 }}>/100</span>
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: badgeStyle.bg,
                  color: badgeStyle.text,
                  border: `1px solid ${badgeStyle.border}`
                }}
              >
                {liveResults.readinessLevel} Level
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '220px' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Recommended Adaptive Mode:
            </div>
            <span
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#93c5fd',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 600,
                border: '1px solid rgba(59, 130, 246, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Bot size={14} />
              <span>{liveResults.recommendedMode} Mode</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '1.25rem' }}>
          <div className="progress-track" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div
              style={{
                width: `${liveResults.overallScore}%`,
                height: '100%',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Assessment Grid */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">Technical & Research Competency Assessment</h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Select your current skill level in each area</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {READINESS_CATEGORIES.map((cat) => {
              const currentLevel = categoryScores[cat.id] || 'Developing';
              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '240px', flex: 1 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {getCategoryIcon(cat.id)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#0f172a' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>

                  {/* Level Option Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {LEVEL_OPTIONS.map((lvl) => {
                      const isSelected = currentLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleScoreChange(cat.id, lvl)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500,
                            border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            color: isSelected ? '#1d4ed8' : '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Adaptive Mentor Mode Selection */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Adaptive AI Mentor Mode</h3>
              <p className="card-subtitle">Choose the interaction style that best aligns with your working habits</p>
            </div>
          </div>
          <div className="card-body">
            <div className="grid-3">
              {MENTOR_MODES.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMode === m.mode;
                const isRecommended = liveResults.recommendedMode === m.mode;

                return (
                  <div
                    key={m.mode}
                    onClick={() => setSelectedMode(m.mode)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none'
                    }}
                  >
                    {isRecommended && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '12px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase'
                        }}
                      >
                        Recommended
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: m.color
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      {isSelected && <CheckCircle2 size={18} style={{ color: '#2563eb' }} />}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                        {m.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Skip for now
          </button>
          <button type="submit" className="btn btn-primary btn-lg">
            <span>Save Readiness & Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
