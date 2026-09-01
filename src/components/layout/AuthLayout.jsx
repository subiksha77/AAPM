import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap, Sparkles, CheckCircle2, ShieldCheck, TrendingUp, Layers } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="auth-page-container">
      {/* Left Brand Showcase Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-header">
          <div className="auth-brand-logo">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="auth-brand-title">AI Academic Mentor</div>
            <div className="auth-brand-subtitle">Project Progress & Guidance Platform</div>
          </div>
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-badge">
            <Sparkles size={14} />
            <span>Academic Excellence Suite</span>
          </div>

          <h1 className="auth-hero-heading">
            Plan, Track, and Master Your Academic Capstone with AI Precision.
          </h1>

          <p className="auth-hero-desc">
            A structured, enterprise-grade project companion engineered for undergraduate and postgraduate engineering research, sprint planning, and faculty mentorship.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <strong>Real Dynamic Progress Engine</strong>
                <span>Mathematical velocity calculation strictly derived from actual task deliverables.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <ShieldCheck size={16} />
              </div>
              <div>
                <strong>Automated Threat & Risk Modeling</strong>
                <span>Systematic Probability × Impact matrix calculation and mitigation registry.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <TrendingUp size={16} />
              </div>
              <div>
                <strong>Actionable Student Encouragement</strong>
                <span>Context-aware motivation and focus identification to keep projects on schedule.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>Enterprise Academic Productivity Platform</span>
          <span>© 2026 Academic AI Suite</span>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
