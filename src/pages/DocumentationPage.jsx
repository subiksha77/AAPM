import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Layers,
  Presentation,
  BookMarked,
  Info,
  Calendar,
  UserCheck,
  Users,
  Sparkles,
  Download,
  Copy,
  Printer,
  Check,
  FolderPlus,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Code,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Terminal,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/common/EmptyState';

export const DocumentationPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    project,
    objectives,
    tasks,
    milestones,
    planning,
    risks,
    progress,
    projectStatus,
    readiness,
    mentorMode
  } = useProject();

  const [activeDoc, setActiveDoc] = useState('synopsis'); // 'synopsis' | 'report' | 'uml' | 'presentation' | 'manual'
  const [copied, setCopied] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeUmlTab, setActiveUmlTab] = useState('architecture'); // 'architecture' | 'class' | 'sequence'

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for Academic Documentation"
        description="Please create your academic project before generating synopsis, SRS reports, and presentation materials."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  const docTypes = [
    {
      id: 'synopsis',
      title: 'Project Synopsis',
      icon: FileText,
      badge: 'Academic Standard',
      desc: 'Formal academic proposal, problem statement, research methodology, and timeline.'
    },
    {
      id: 'report',
      title: 'SRS & SDS Report',
      icon: BookOpen,
      badge: 'IEEE Style',
      desc: 'Comprehensive Software Requirements & System Design Specification with scope boundaries.'
    },
    {
      id: 'uml',
      title: 'UML & System Diagrams',
      icon: Layers,
      badge: 'Mermaid Ready',
      desc: 'Architectural flowcharts, Class diagrams, and Sequence models ready for thesis insertion.'
    },
    {
      id: 'presentation',
      title: 'Viva Defense Presentation',
      icon: Presentation,
      badge: '10-Slide Deck',
      desc: 'Slide deck outlines structured for internal & external viva evaluation with speaker notes.'
    },
    {
      id: 'manual',
      title: 'User & Developer Manual',
      icon: BookMarked,
      badge: 'Technical Specs',
      desc: 'Setup guide, installation commands, API specs, hardware dependencies, and usage instructions.'
    }
  ];

  // Helper to compile clean Markdown for current active document
  const generateMarkdownForDoc = (docId) => {
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (docId === 'synopsis') {
      return `# ACADEMIC PROJECT SYNOPSIS
**Project Title:** ${project.name}
**Domain:** ${project.domain}
**Academic Level:** ${project.academicLevel}
**Guide / Mentor:** ${project.guideName || 'Faculty Supervisor'}
**Team Size:** ${project.teamSize} Member(s)
**Generated Date:** ${timestamp}

---

## 1. ABSTRACT & PROBLEM STATEMENT
${project.description}

## 2. MOTIVATION & RELEVANCE
The objective of this work in the domain of **${project.domain}** is to bridge the gap between academic theoretical formulation and practical implementation. This project addresses latency, computational efficiency, and robust automated workflows.

## 3. KEY RESEARCH OBJECTIVES
${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') || '1. Complete architecture design\n2. Baseline model development\n3. Empirical verification'}

## 4. SCOPE BOUNDARIES
### In-Scope Deliverables:
${planning.inScope?.map((item) => `- [x] ${item}`).join('\n') || '- Core algorithm implementation\n- Validation suite\n- Experimental benchmarks'}

### Out-of-Scope:
${planning.outOfScope?.map((item) => `- [ ] ${item}`).join('\n') || '- Live satellite telemetry\n- Custom silicon tape-out'}

## 5. PROJECT PHASES & MILESTONES
| Phase / Milestone | Target Date | Current Status |
| :--- | :--- | :--- |
${milestones.map((m) => `| ${m.name} | ${m.endDate || 'TBD'} | ${m.status} |`).join('\n') || '| Phase 1: Planning | Initial | Completed |\n| Phase 2: Implementation | Midterm | In Progress |'}

## 6. EXPECTED OUTCOMES
1. Verified modular codebase meeting all functional requirements.
2. Comprehensive empirical performance benchmark report.
3. Complete IEEE standard project thesis report and defense slide deck.
`;
    }

    if (docId === 'report') {
      return `# SOFTWARE REQUIREMENTS & DESIGN SPECIFICATION (SRS / SDS)
**Project Name:** ${project.name}
**Standard:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148
**Status:** ${projectStatus} (${progress}% Complete)
**Author:** Student Researcher
**Guide:** ${project.guideName || 'Faculty Advisor'}

---

## 1. INTRODUCTION
### 1.1 Purpose
This document provides a complete specification of the functional and non-functional requirements and high-level architectural design for **${project.name}**.

### 1.2 Scope
${project.description}

## 2. FUNCTIONAL REQUIREMENTS
${planning.functionalRequirements?.map((req, i) => `### FR-0${i + 1}: ${req}\n- **Priority:** High\n- **Verification:** Unit testing & automated test bench\n`).join('\n') || '### FR-01: Core Inference Pipeline\nSystem must execute high-throughput processing within target runtime constraints.'}

## 3. NON-FUNCTIONAL REQUIREMENTS
${planning.nonFunctionalRequirements?.map((req, i) => `### NFR-0${i + 1}: ${req}\n- **Constraint Type:** Performance / Security / Reliability\n`).join('\n') || '### NFR-01: Latency Guarantee\nSystem execution latency shall not exceed designated real-time thresholds.'}

## 4. VERIFIED DELIVERABLES & TASKS
| Deliverable / Task | Deadline | Priority | Status |
| :--- | :--- | :--- | :--- |
${tasks.map((t) => `| ${t.name} | ${t.deadline || 'Ongoing'} | ${t.priority} | ${t.status} |`).join('\n') || '| Prototype Engine | 2026-10-15 | High | In Progress |'}

## 5. RISK ASSESSMENT & MITIGATION
| Identified Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
${risks.map((r) => `| ${r.name} | ${r.severity} | ${r.mitigation || 'Contingency plan'} |`).join('\n') || '| Computational bottleneck | Moderate | Vectorized processing & quantization |'}
`;
    }

    if (docId === 'uml') {
      return `# UML & SYSTEM ARCHITECTURE MODELS
**Project:** ${project.name}

## 1. SYSTEM ARCHITECTURE DIAGRAM (Mermaid)
\`\`\`mermaid
graph TD
    A[Client UI / Input Stream] --> B[API Gateway & Request Router]
    B --> C[Core ${project.domain} Processing Engine]
    C --> D[Data Persistence & Cache Layer]
    C --> E[Inference & Analytics Pipeline]
    E --> F[Performance Metrics & Dashboard]
\`\`\`

## 2. CLASS DIAGRAM (Mermaid)
\`\`\`mermaid
classDiagram
    class Project {
      +String id
      +String name
      +String domain
      +calculateProgress()
      +validateSchedule()
    }
    class TaskDeliverable {
      +String id
      +String title
      +String priority
      +Boolean isCompleted
      +toggleStatus()
    }
    class RiskMatrix {
      +String riskName
      +String probability
      +String impact
      +calculateSeverity()
    }
    Project "1" *-- "*" TaskDeliverable : contains
    Project "1" *-- "*" RiskMatrix : assesses
\`\`\`

## 3. SEQUENCE DIAGRAM (Mermaid)
\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Dashboard UI
    participant Service as Mentor Engine
    participant DB as LocalStorage State
    Student->>UI: Submit Task Deliverable
    UI->>Service: Trigger Progress Recalculation
    Service->>DB: Persist Updated Entity State
    DB-->>Service: Acknowledge Transaction
    Service-->>UI: Return New Calculated Progress %
    UI-->>Student: Update Dynamic Visual Feedback
\`\`\`
`;
    }

    if (docId === 'presentation') {
      return `# ACADEMIC VIVA DEFENSE PRESENTATION (SLIDE DECK OUTLINE)
**Project Title:** ${project.name}
**Candidate:** Student Researcher
**Guide:** ${project.guideName || 'Faculty Supervisor'}
**Target Time:** 15 Minutes Defense + 5 Minutes Q&A

---

## Slide 1: Title & Academic Context
- **Title:** ${project.name}
- **Domain:** ${project.domain} | **Level:** ${project.academicLevel}
- **Speaker Note:** "Good morning honorable panel members. Today I present our research on ${project.name}."

## Slide 2: Problem Statement & Motivation
- Challenges with traditional approaches in ${project.domain}.
- Real-world demand for optimized, reliable execution.
- **Speaker Note:** "Existing solutions suffer from computational latency and lack of integrated workflows."

## Slide 3: Research Objectives
${objectives.map((obj, i) => `- Objective ${i + 1}: ${obj}`).join('\n') || '- Develop baseline model\n- Quantize for real-time throughput\n- Validate on standard benchmarks'}

## Slide 4: System Architecture & Data Flow
- Modular pipeline design.
- Separation of concerns between ingestion, processing, and evaluation.

## Slide 5: Methodology & Implementation
- Technology Stack: Modern web frameworks, AI quantization, and deterministic state engines.
- Progress Status: Current verified progress stands at **${progress}%**.

## Slide 6: Experimental Setup & Datasets
- Curation, preprocessing, and benchmark metrics used for evaluation.

## Slide 7: Results & Performance Analysis
- Accuracy, throughput, and error analysis comparison against baseline models.

## Slide 8: Risk Management & Engineering Constraints
- Key architectural challenges identified and mitigated through fallback strategies.

## Slide 9: Conclusion & Future Enhancements
- Summary of verified contributions and scalable production extensions.

## Slide 10: Acknowledgments & Q&A
- Open floor for examiner questions and live demonstration.
`;
    }

    // Manual
    return `# USER & DEVELOPER MANUAL
**Project:** ${project.name}
**Version:** 1.0.0-Academic

---

## 1. SYSTEM PREREQUISITES
- Node.js (v18.0.0 or higher)
- Modern Evergreen Web Browser (Chrome 110+, Edge, Firefox, Safari)
- Memory: Minimum 4GB RAM (8GB recommended)

## 2. INSTALLATION & SETUP
\`\`\`bash
# 1. Clone repository
git clone <repository-url>
cd "AI Academic Project Mentor"

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
\`\`\`

## 3. ENVIRONMENT CONFIGURATION
Configuration settings are stored in local browser state with zero external cloud dependencies for Day 1 offline reliability.

## 4. API SPECIFICATION & DATA SCHEMAS
All project entities follow strict validation schemas stored under key \`ai_mentor_project\`.

## 5. TROUBLESHOOTING FAQ
**Q: How do I export my project data?**
A: Navigate to Documentation Hub and click 'Export Markdown' or use the 'Print Document' action.
`;
  };

  const currentMarkdown = generateMarkdownForDoc(activeDoc);

  // Copy to clipboard
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopied(true);
    showToast('Markdown document copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  // Download Markdown file
  const handleDownloadMarkdown = () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${activeDoc}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${activeDoc}.md successfully!`, 'success');
  };

  // Print document
  const handlePrint = () => {
    window.print();
  };

  // Presentation slides data
  const presentationSlides = [
    {
      number: 1,
      title: 'Project Title & Academic Context',
      duration: '1 min',
      bullets: [
        `Project Title: ${project.name}`,
        `Academic Domain: ${project.domain}`,
        `Academic Level: ${project.academicLevel}`,
        `Supervisor: ${project.guideName || 'Faculty Guide'}`
      ],
      speakerNotes: `Introduce yourself, the project name, and state the academic context and supervisor under whom this research was conducted.`
    },
    {
      number: 2,
      title: 'Problem Formulation & Motivation',
      duration: '2 min',
      bullets: [
        'Real-world bottlenecks in existing approaches',
        'Computational overhead & scalability challenges',
        'Necessity of automated, verifiable pipeline execution',
        'Target application domain impact'
      ],
      speakerNotes: `Clearly articulate the core problem. Explain why previous solutions fall short and why this project is technically necessary.`
    },
    {
      number: 3,
      title: 'Research Objectives',
      duration: '1.5 min',
      bullets: objectives.length > 0 ? objectives : [
        'Curate and augment high-quality benchmark datasets',
        'Train and fine-tune specialized algorithmic models',
        'Validate performance under constrained hardware conditions'
      ],
      speakerNotes: `Walk the examiners through the measurable, concrete goals defined in the project scope.`
    },
    {
      number: 4,
      title: 'Scope Boundaries & Specifications',
      duration: '1.5 min',
      bullets: [
        `In-Scope (${planning.inScope?.length || 3} items): Algorithm implementation, evaluation benchmarks, and documentation.`,
        `Out-of-Scope (${planning.outOfScope?.length || 2} items): Proprietary hardware manufacturing and external satellite links.`,
        `Functional Requirements: ${planning.functionalRequirements?.length || 4} verified requirements.`,
        `Non-Functional Constraints: Latency, safety, and reliability guarantees.`
      ],
      speakerNotes: `Clarify what was intentionally included and excluded to manage research boundaries.`
    },
    {
      number: 5,
      title: 'System Architecture & Data Pipeline',
      duration: '2 min',
      bullets: [
        'Modular multi-tier architecture design',
        'Decoupled ingestion, transformation, and inference layers',
        'Deterministic local state management and audit logging',
        'Integration with edge-accelerated runtime engines'
      ],
      speakerNotes: `Highlight architectural design choices, data flow pipelines, and separation of concerns.`
    },
    {
      number: 6,
      title: 'Implementation & Sprint Velocity',
      duration: '2 min',
      bullets: [
        `Total Deliverables: ${tasks.length} tasks registered`,
        `Verified Progress: ${progress}% completion rate`,
        `Milestone Execution: ${milestones.filter(m => m.status === 'Completed').length} of ${milestones.length} phases delivered`,
        `Current Readiness Profile: ${readiness?.readinessLevel || 'Developing'} Level (${mentorMode} Mode)`
      ],
      speakerNotes: `Demonstrate that the implementation is grounded in empirical verification and consistent delivery milestones.`
    },
    {
      number: 7,
      title: 'Risk Analysis & Contingency',
      duration: '1.5 min',
      bullets: risks.length > 0 ? risks.map(r => `${r.name} (${r.severity} Severity) → Mitigation: ${r.mitigation || 'Resolved'}`) : [
        'Memory limits → FP16 quantization & batch sizing',
        'Sensor noise → Optical filtering & kalman smoothing'
      ],
      speakerNotes: `Show the examination committee that potential failures were anticipated and resolved proactively.`
    },
    {
      number: 8,
      title: 'Empirical Results & Benchmarks',
      duration: '2 min',
      bullets: [
        'Throughput and latency benchmarks across standard datasets',
        'Quantitative accuracy and error margin comparison',
        'Verification against defined non-functional criteria',
        'Reproducibility and automated test suite validation'
      ],
      speakerNotes: `Present the primary findings, accuracy tables, and performance graphs.`
    },
    {
      number: 9,
      title: 'Conclusions & Academic Contribution',
      duration: '1 min',
      bullets: [
        'Successfully achieved primary research objectives',
        'Validated real-time performance within acceptable tolerances',
        'Modular, maintainable architecture open for future enhancements'
      ],
      speakerNotes: `Summarize the primary takeaways and academic value delivered by the thesis.`
    },
    {
      number: 10,
      title: 'Acknowledgments & Examiner Q&A',
      duration: '5 min',
      bullets: [
        'Gratitude to Faculty Guide, Department, and Academic Mentors',
        'Open floor for committee questions and live demonstration'
      ],
      speakerNotes: `Thank the panel and invite technical questions or request permission for a live prototype demonstration.`
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1150px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={24} style={{ color: '#2563eb' }} />
            <span>Academic Documentation Hub</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Compiled live from active project metadata for <strong>{project.name}</strong> ({progress}% Complete).
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyMarkdown}
            title="Copy formatted markdown to clipboard"
          >
            {copied ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDownloadMarkdown}
            title="Download as .md file"
          >
            <Download size={14} />
            <span>Export .MD</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Document Selector Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}
      >
        {docTypes.map((doc) => {
          const Icon = doc.icon;
          const isSelected = activeDoc === doc.id;

          return (
            <div
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className="card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                boxShadow: isSelected ? '0 8px 20px rgba(37, 99, 235, 0.12)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#dbeafe' : '#f1f5f9',
                    color: isSelected ? '#1d4ed8' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} />
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? '#dbeafe' : '#f8fafc',
                    color: isSelected ? '#1e40af' : '#64748b',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {doc.badge}
                </span>
              </div>

              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: isSelected ? '#1e40af' : '#0f172a', marginBottom: '0.3rem' }}>
                {doc.title}
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.45 }}>
                {doc.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Document Preview Pane */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Document Header Toolbar */}
        <div
          className="card-header"
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#2563eb', fontWeight: 700, letterSpacing: '0.08em' }}>
              Academic Document Viewer
            </div>
            <h3 className="card-title" style={{ fontSize: '1.15rem', color: '#0f172a', marginTop: '0.1rem' }}>
              {docTypes.find((d) => d.id === activeDoc)?.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Format:</span>
            <span className="badge badge-priority-high" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
              Markdown / Print PDF
            </span>
          </div>
        </div>

        {/* Document Content Body */}
        <div className="card-body" style={{ padding: '2rem' }}>
          {/* ============================================================
              1. PROJECT SYNOPSIS PREVIEW
             ============================================================ */}
          {activeDoc === 'synopsis' && (
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Synopsis Academic Title Block */}
              <div
                style={{
                  borderBottom: '2px solid #0f172a',
                  paddingBottom: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                  Formal Academic Proposal & Synopsis
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                  {project.name}
                </h2>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    marginTop: '1rem',
                    fontSize: '0.84rem',
                    color: '#475569'
                  }}
                >
                  <span><strong>Domain:</strong> {project.domain}</span>
                  <span><strong>Level:</strong> {project.academicLevel}</span>
                  <span><strong>Guide:</strong> {project.guideName || 'Faculty Supervisor'}</span>
                  <span><strong>Team:</strong> {project.teamSize} Member(s)</span>
                </div>
              </div>

              {/* 1. Abstract */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  1. Abstract & Problem Formulation
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.7, textAlign: 'justify' }}>
                  {project.description}
                </p>
              </div>

              {/* 2. Research Objectives */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  2. Key Research Objectives ({objectives.length})
                </h3>
                {objectives.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No objectives defined yet in Planning.</p>
                ) : (
                  <ol style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
                    {objectives.map((obj, i) => (
                      <li key={i} style={{ marginBottom: '0.35rem' }}>{obj}</li>
                    ))}
                  </ol>
                )}
              </div>

              {/* 3. Scope Boundaries */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  3. Scope Boundaries
                </h3>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                      In-Scope Deliverables ({planning.inScope?.length || 0})
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#166534', lineHeight: 1.6 }}>
                      {planning.inScope?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                      Out-of-Scope Items ({planning.outOfScope?.length || 0})
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#991b1b', lineHeight: 1.6 }}>
                      {planning.outOfScope?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Milestones & Timeline */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  4. Milestone Trajectory & Timeline
                </h3>
                <div className="table-responsive">
                  <table className="data-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Phase / Milestone Name</th>
                        <th>Target Deadline</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {milestones.map((m) => (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{m.name}</td>
                          <td>{m.endDate || 'TBD'}</td>
                          <td>
                            <span className={`badge badge-status-${m.status.toLowerCase().replace(' ', '-')}`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              2. SRS & SDS REPORT PREVIEW
             ============================================================ */}
          {activeDoc === 'report' && (
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                  IEEE Standard Software Requirements & Design Specification (SRS / SDS)
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                  {project.name}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Specification Version 1.0 · Verified Execution: <strong>{progress}% Complete</strong>
                </p>
              </div>

              {/* Functional Requirements */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  1. Functional Requirements ({planning.functionalRequirements?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {planning.functionalRequirements?.map((fr, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          FR-0{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 500 }}>{fr}</span>
                      </div>
                      <span className="badge badge-priority-high">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Functional Requirements */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  2. Non-Functional Constraints & Quality Attributes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {planning.nonFunctionalRequirements?.map((nfr, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          NFR-0{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 500 }}>{nfr}</span>
                      </div>
                      <span className="badge badge-status-in-progress">Constraint</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Matrix */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  3. Work Breakdown Structure & Deliverables ({tasks.length} tasks)
                </h3>
                <div className="table-responsive">
                  <table className="data-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Deliverable Name</th>
                        <th>Target Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((t) => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{t.name}</td>
                          <td>{t.deadline || 'Ongoing'}</td>
                          <td>
                            <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                              {t.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-status-${t.status.toLowerCase().replace(' ', '-')}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              3. UML & ARCHITECTURE MODELS PREVIEW
             ============================================================ */}
          {activeDoc === 'uml' && (
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* UML Sub-Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveUmlTab('architecture')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: activeUmlTab === 'architecture' ? 700 : 500,
                    border: 'none',
                    backgroundColor: activeUmlTab === 'architecture' ? '#2563eb' : '#f1f5f9',
                    color: activeUmlTab === 'architecture' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  System Architecture Flow
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUmlTab('class')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: activeUmlTab === 'class' ? 700 : 500,
                    border: 'none',
                    backgroundColor: activeUmlTab === 'class' ? '#2563eb' : '#f1f5f9',
                    color: activeUmlTab === 'class' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  UML Class Diagram
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUmlTab('sequence')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: activeUmlTab === 'sequence' ? 700 : 500,
                    border: 'none',
                    backgroundColor: activeUmlTab === 'sequence' ? '#2563eb' : '#f1f5f9',
                    color: activeUmlTab === 'sequence' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Sequence & Interaction
                </button>
              </div>

              {/* Visual Model Renderings */}
              {activeUmlTab === 'architecture' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      padding: '2rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    {/* Layer 1 */}
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '650px', justifyContent: 'center' }}>
                      <div style={{ flex: 1, padding: '1rem', backgroundColor: '#eff6ff', border: '2px solid #93c5fd', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: 700 }}>PRESENTATION LAYER</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          React + Vite Dashboard UI
                        </div>
                      </div>
                    </div>

                    <div style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: 1 }}>↓ (Data Flow & Events)</div>

                    {/* Layer 2 */}
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '650px' }}>
                      <div style={{ flex: 1, padding: '1rem', backgroundColor: '#f0fdf4', border: '2px solid #86efac', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 700 }}>STATE & INTELLIGENCE</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          Context + Motivational Service
                        </div>
                      </div>
                      <div style={{ flex: 1, padding: '1rem', backgroundColor: '#fdf4ff', border: '2px solid #f0abfc', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.76rem', color: '#a21caf', fontWeight: 700 }}>FOCUS & CONSISTENCY</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          Timer & Streak Engine
                        </div>
                      </div>
                    </div>

                    <div style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: 1 }}>↓ (Persistence Protocol)</div>

                    {/* Layer 3 */}
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '650px', justifyContent: 'center' }}>
                      <div style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: '2px solid #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 700 }}>PERSISTENCE LAYER</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          Deterministic Browser Storage / LocalStorage
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mermaid Code Snippet */}
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', padding: '1rem 1.25rem', color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.4rem' }}>// Mermaid.js System Architecture Definition</div>
                    <code>
                      graph TD<br />
                      &nbsp;&nbsp;A[Client UI / Input Stream] --&gt; B[API Gateway & Request Router]<br />
                      &nbsp;&nbsp;B --&gt; C[Core {project.domain} Processing Engine]<br />
                      &nbsp;&nbsp;C --&gt; D[Data Persistence & Cache Layer]<br />
                      &nbsp;&nbsp;C --&gt; E[Inference & Analytics Pipeline]<br />
                      &nbsp;&nbsp;E --&gt; F[Performance Metrics & Dashboard]
                    </code>
                  </div>
                </div>
              )}

              {activeUmlTab === 'class' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-3" style={{ gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#ffffff', border: '2px solid #3b82f6', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 700, color: '#1d4ed8', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                        Project
                      </div>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#334155', lineHeight: 1.6 }}>
                        + String id<br />
                        + String name<br />
                        + String domain<br />
                        + String academicLevel<br />
                        + calculateProgress()<br />
                        + validateSchedule()
                      </div>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: '#ffffff', border: '2px solid #8b5cf6', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 700, color: '#6d28d9', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                        TaskDeliverable
                      </div>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#334155', lineHeight: 1.6 }}>
                        + String id<br />
                        + String name<br />
                        + String priority<br />
                        + Date deadline<br />
                        + String status<br />
                        + toggleComplete()
                      </div>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: '#ffffff', border: '2px solid #ef4444', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 700, color: '#b91c1c', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                        RiskEntity
                      </div>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#334155', lineHeight: 1.6 }}>
                        + String id<br />
                        + String name<br />
                        + String probability<br />
                        + String impact<br />
                        + String severity<br />
                        + computeSeverity()
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeUmlTab === 'sequence' && (
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                      <strong>Step 1:</strong> Student completes work item in Focus Mode or Task Board.
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
                      <strong>Step 2:</strong> <code>ProjectContext</code> triggers deterministic progress calculation (Completed / Total).
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                      <strong>Step 3:</strong> <code>motivationService</code> updates project health status, today's focus task, and milestone roadmap.
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
                      <strong>Step 4:</strong> LocalStorage transaction commits updated audit activity stream.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              4. PRESENTATION SLIDES PREVIEW
             ============================================================ */}
          {activeDoc === 'presentation' && (
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Slide Carousel Navigator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px'
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  style={{ color: currentSlideIndex === 0 ? '#64748b' : '#ffffff' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous Slide</span>
                </button>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>
                    Slide {presentationSlides[currentSlideIndex].number} of {presentationSlides.length}
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 600 }}>
                    {presentationSlides[currentSlideIndex].title} ({presentationSlides[currentSlideIndex].duration})
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={currentSlideIndex === presentationSlides.length - 1}
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(presentationSlides.length - 1, prev + 1))}
                  style={{ color: currentSlideIndex === presentationSlides.length - 1 ? '#64748b' : '#ffffff' }}
                >
                  <span>Next Slide</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Active Slide Canvas Visual Box */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  padding: '2.5rem',
                  minHeight: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2563eb', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      {presentationSlides[currentSlideIndex].title}
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                      Viva Defense Slide #{presentationSlides[currentSlideIndex].number}
                    </span>
                  </div>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingLeft: '1.5rem', fontSize: '0.96rem', color: '#334155' }}>
                    {presentationSlides[currentSlideIndex].bullets.map((b, i) => (
                      <li key={i} style={{ lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Footer on slide */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <span>{project.name}</span>
                  <span>{project.domain} · Academic Year 2026</span>
                </div>
              </div>

              {/* Speaker Notes Box */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px'
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  🎙️ Candidate Speaker Notes & Viva Defense Guidance:
                </div>
                <p style={{ fontSize: '0.86rem', color: '#1e3a8a', lineHeight: 1.6 }}>
                  "{presentationSlides[currentSlideIndex].speakerNotes}"
                </p>
              </div>
            </div>
          )}

          {/* ============================================================
              5. USER & DEVELOPER MANUAL PREVIEW
             ============================================================ */}
          {activeDoc === 'manual' && (
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                  Developer & Environment Manual
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                  {project.name} Setup & Execution Guide
                </h2>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  1. Installation Instructions
                </h3>
                <div style={{ backgroundColor: '#0f172a', color: '#e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  <code>
                    # Clone repository<br />
                    git clone https://github.com/academic-repo/{project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.git<br /><br />
                    # Install dependencies<br />
                    npm install<br /><br />
                    # Start development server<br />
                    npm run dev
                  </code>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  2. System Requirements & Hardware Specifications
                </h3>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>Minimum Hardware</strong>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.5 }}>
                      <li>CPU: Dual Core 2.0 GHz or higher</li>
                      <li>RAM: 4 GB System Memory</li>
                      <li>Storage: 2 GB available space</li>
                    </ul>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>Recommended Acceleration</strong>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.5 }}>
                      <li>GPU: NVIDIA CUDA compatible (FP16 support)</li>
                      <li>RAM: 16 GB for model quantization</li>
                      <li>OS: Windows 11 / Ubuntu 22.04 LTS</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
