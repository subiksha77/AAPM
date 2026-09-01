import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Calendar,
  GraduationCap,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Code2,
  FolderKanban,
  Target
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const DOMAINS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Data Science',
  'IoT',
  'Cybersecurity',
  'Cloud Computing',
  'Other'
];

const ACADEMIC_LEVELS = [
  'Undergraduate',
  'Postgraduate',
  'Diploma / Certificate',
  'Doctoral Research'
];

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { generateAIProjectPlan, project } = useProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: 'Artificial Intelligence',
    academicLevel: 'Undergraduate',
    targetDate: '',
    preferredTech: '',
    teamSize: 1,
    guideName: ''
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const ANALYSIS_STEPS = [
    'Understanding your project & core research problem...',
    'Analyzing academic requirements & scope boundaries...',
    'Designing adaptive project roadmap...',
    'Identifying optimal technology stack...',
    'Breaking project into dependency-linked tasks...',
    'Preparing your personalized daily AI plan...'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide a project title or research name.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe what you are building and its primary objective.';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide at least 20 characters so the AI can evaluate the scope properly.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    setAnalysisStep(0);

    // Progressive real step transitions
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 280);

    try {
      // Execute the real AI Agent generation pipeline
      const planResult = generateAIProjectPlan(formData);
      clearInterval(stepInterval);
      setAnalysisStep(ANALYSIS_STEPS.length - 1);
      setGeneratedPlan(planResult);
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Plan generation failed:', err);
      setErrors({ form: 'Failed to generate project plan. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Preset Sample for Zero-Effort Trial
  const fillSampleIdea = (type) => {
    if (type === 'drone') {
      setFormData({
        name: 'Autonomous Drone Detection & Aerial Surveillance using YOLOv8',
        description: 'An edge-compute aerial surveillance framework engineered for real-time UAV object tracking, low-latency target classification, and multi-sensor telemetry processing on embedded NVIDIA Jetson hardware.',
        domain: 'Artificial Intelligence',
        academicLevel: 'Undergraduate',
        targetDate: '2026-11-30',
        preferredTech: 'PyTorch + TensorRT + Jetson Xavier',
        teamSize: 4,
        guideName: 'Dr. K. Ramesh'
      });
    } else if (type === 'rag') {
      setFormData({
        name: 'Enterprise Knowledge Retrieval-Augmented Generation (RAG) System',
        description: 'A multi-document semantic question-answering assistant using hybrid BM25 + dense vector search with chunk reranking and LLM hallucination guards for internal university archives.',
        domain: 'Artificial Intelligence',
        academicLevel: 'Postgraduate',
        targetDate: '2026-12-15',
        preferredTech: 'FastAPI + pgvector + HuggingFace',
        teamSize: 2,
        guideName: 'Dr. S. Priya'
      });
    } else {
      setFormData({
        name: 'Zero-Trust Cloud Microservices Security Audit Framework',
        description: 'Automated continuous compliance and anomaly detection platform for Kubernetes clusters that inspects service mesh mTLS traffic and flags policy deviations in real time.',
        domain: 'Cybersecurity',
        academicLevel: 'Undergraduate',
        targetDate: '2026-11-15',
        preferredTech: 'Go + React + Elasticsearch',
        teamSize: 3,
        guideName: 'Prof. M. Ananthan'
      });
    }
    setErrors({});
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.45rem', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Sparkles size={22} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            AI-Driven Project Planning
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
          Provide your project concept. The AI will analyze the problem, define scope boundaries, recommend technologies, generate task backlogs, and build your daily roadmap.
        </p>
      </div>

      {/* If plan is generated, show the rich AI Project Overview */}
      {generatedPlan && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 4px 16px -2px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.05em' }}>
                AI Generation Complete
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {generatedPlan.newProject.name}
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <span>Launch Project Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Project Understanding Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <Target size={16} style={{ color: '#2563eb' }} />
                <span>Project Goal</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {generatedPlan.ideaEval?.overallEvaluation || generatedPlan.newProject.description}
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <ShieldAlert size={16} style={{ color: '#f59e0b' }} />
                <span>Feasibility & Complexity</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span className="badge badge-success">Feasibility: {generatedPlan.ideaEval?.feasibilityLevel}</span>
                <span className="badge badge-warning">Complexity: {generatedPlan.ideaEval?.technicalComplexity}</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.45rem' }}>
                {generatedPlan.ideaEval?.problemClarity}
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <FolderKanban size={16} style={{ color: '#10b981' }} />
                <span>AI-Generated Tasks</span>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {generatedPlan.generatedTasks.length} Deliverable Tasks
              </p>
              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                Organized across 6 roadmap phases with dependency constraints.
              </p>
            </div>
          </div>

          {/* Recommended Tech Stack */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={16} style={{ color: '#2563eb' }} />
              <span>Recommended Technology Stack</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(generatedPlan.tech || {}).map(([key, item]) => (
                <div key={key} style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', margin: '0.2rem 0' }}>
                    {item.tech}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                    {item.purpose}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Creation Form */}
      {!generatedPlan && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 4px 16px -2px rgba(0,0,0,0.05)'
          }}
        >
          {/* Preset Sample Ideas */}
          <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} style={{ color: '#2563eb' }} />
                <span>Quick Test: Load Authentic Sample Topic</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillSampleIdea('drone')}
                style={{ fontSize: '0.78rem', backgroundColor: '#ffffff' }}
              >
                🚁 Autonomous Drone Detection (YOLOv8 & Jetson)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillSampleIdea('rag')}
                style={{ fontSize: '0.78rem', backgroundColor: '#ffffff' }}
              >
                🧠 Enterprise RAG Knowledge Base
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillSampleIdea('sec')}
                style={{ fontSize: '0.78rem', backgroundColor: '#ffffff' }}
              >
                🛡️ Cloud Zero-Trust Microservices
              </button>
            </div>
          </div>

          <form onSubmit={handleGenerate}>
            {errors.form && (
              <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Essential Project Fields */}
            <div className="form-group">
              <label className="form-label" htmlFor="projName">
                Project Title / Topic Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="projName"
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                placeholder="e.g. Autonomous Drone Detection & Aerial Surveillance using YOLOv8"
                value={formData.name}
                onChange={handleChange}
                disabled={isGenerating}
                autoFocus
              />
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={12} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projDesc">
                Project Description & Core Objectives <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="projDesc"
                name="description"
                rows={4}
                className={`form-input ${errors.description ? 'has-error' : ''}`}
                placeholder="Describe what the system does, target deployment hardware, algorithms to explore, and expected performance targets..."
                value={formData.description}
                onChange={handleChange}
                disabled={isGenerating}
                style={{ resize: 'vertical' }}
              />
              {errors.description && (
                <div className="form-error">
                  <AlertCircle size={12} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            {/* Domain & Academic Level */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="projDomain">
                  Domain / Specialization
                </label>
                <div className="input-icon-wrapper">
                  <Layers size={16} className="input-icon" />
                  <select
                    id="projDomain"
                    name="domain"
                    className="form-input has-icon"
                    value={formData.domain}
                    onChange={handleChange}
                    disabled={isGenerating}
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="academicLevel">
                  Academic Level
                </label>
                <div className="input-icon-wrapper">
                  <GraduationCap size={16} className="input-icon" />
                  <select
                    id="academicLevel"
                    name="academicLevel"
                    className="form-input has-icon"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    disabled={isGenerating}
                  >
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Preferences Accordion / Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="targetDate">
                  Target Completion Date <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <div className="input-icon-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input
                    id="targetDate"
                    type="date"
                    name="targetDate"
                    className="form-input has-icon"
                    value={formData.targetDate}
                    onChange={handleChange}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="preferredTech">
                  Preferred Technologies / Constraints <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <div className="input-icon-wrapper">
                  <Cpu size={16} className="input-icon" />
                  <input
                    id="preferredTech"
                    type="text"
                    name="preferredTech"
                    className="form-input has-icon"
                    placeholder="e.g. NVIDIA Jetson, PyTorch, React"
                    value={formData.preferredTech}
                    onChange={handleChange}
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            {/* AI Generation State View */}
            {isGenerating && (
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: '#2563eb' }} />
                  <span style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.9rem' }}>
                    AI Planning Engine Active
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {ANALYSIS_STEPS.map((step, idx) => (
                    <div
                      key={step}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.83rem',
                        color: idx <= analysisStep ? '#1e293b' : '#94a3b8',
                        fontWeight: idx === analysisStep ? 600 : 400
                      }}
                    >
                      {idx <= analysisStep ? (
                        <CheckCircle2 size={14} style={{ color: '#2563eb', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #cbd5e1', flexShrink: 0 }} />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem'
              }}
              disabled={isGenerating}
            >
              <Sparkles size={18} />
              <span>{isGenerating ? 'Generating Plan...' : 'Generate My Project Plan with AI'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
