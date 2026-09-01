import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  FolderPlus,
  Terminal,
  HelpCircle,
  MessageSquare,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Trash2,
  User,
  ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { getTodayFocus, getNextRecommendedAction } from '../services/motivationService';

export const AIMentorPage = () => {
  const navigate = useNavigate();
  const {
    project,
    objectives,
    tasks,
    milestones,
    risks,
    progress,
    overdueTasks,
    readiness,
    mentorMode,
    aiMessages,
    sendAIMessage,
    addTask
  } = useProject();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isTyping]);

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for AI Mentorship"
        description="Please create your academic project first so the AI Mentor can contextualize advice based on your domain and milestones."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  // Dynamic context generator for intelligent AI responses
  const generateAIResponse = (userPrompt) => {
    const pLower = userPrompt.toLowerCase();
    const incompleteTasks = tasks.filter((t) => t.status !== 'Completed');
    const highRisks = risks.filter((r) => r.severity === 'High' || r.severity === 'Critical');
    const todayFocus = getTodayFocus(tasks);
    const nextAction = getNextRecommendedAction(project, tasks, milestones, risks, readiness, progress);

    // 1. Next task / What to work on
    if (pLower.includes('next') || pLower.includes('work on') || pLower.includes('focus')) {
      if (todayFocus.task) {
        return {
          title: `Recommended Focus: ${todayFocus.task.name}`,
          content: `Based on your **${mentorMode} Mode** profile and current progress (${progress}%), your highest leverage action right now is:

- **Target Task:** **${todayFocus.task.name}** (${todayFocus.task.priority} Priority)
- **Rationale:** ${todayFocus.reason}
- **Target Deadline:** ${todayFocus.task.deadline ? todayFocus.task.deadline : 'Immediate sprint'}

💡 **Academic Recommendation:** Start a 25-minute Pomodoro block in **Focus Mode** to maintain high retention and avoid context switching.`,
          actionType: 'focus',
          actionText: 'Launch Focus Session'
        };
      }
      return {
        title: 'Project In Equilibrium',
        content: `All registered tasks are marked completed! To push your research further, consider adding experimental benchmark tasks or drafting your **Project Report (SRS/SDS)** in the Documentation Hub.`,
        actionType: 'docs',
        actionText: 'Open Documentation Hub'
      };
    }

    // 2. Schedule / Timeline / Overdue
    if (pLower.includes('schedule') || pLower.includes('timeline') || pLower.includes('deadline') || pLower.includes('overdue')) {
      if (overdueTasks.length > 0) {
        return {
          title: `Schedule Alert: ${overdueTasks.length} Task(s) Past Target Date`,
          content: `You currently have **${overdueTasks.length} task(s)** requiring timeline adjustment:

${overdueTasks.map((t) => `- **${t.name}** (Deadline was: ${t.deadline})`).join('\n')}

**Recovery Strategy:**
1. Break overdue deliverables into sub-tasks with 48-hour sprints.
2. In your upcoming supervisor meeting with **${project.guideName || 'your guide'}**, present an updated milestone delivery date.
3. Quantize non-critical deliverable scope to protect core deadlines.`,
          actionType: 'tasks',
          actionText: 'Review Task Board'
        };
      }
      return {
        title: 'Schedule Health: On Track',
        content: `Great job! All ${tasks.length} deliverables are currently on or ahead of schedule. Your current progress stands at **${progress}%**. Next milestone phase: **${milestones.find((m) => m.status === 'In Progress')?.name || 'Final Thesis Preparation'}**.`,
        actionType: 'milestones',
        actionText: 'View Milestones'
      };
    }

    // 3. Risks / Technical hurdles
    if (pLower.includes('risk') || pLower.includes('threat') || pLower.includes('blocker') || pLower.includes('challenge')) {
      if (highRisks.length > 0) {
        return {
          title: `Risk Analysis (${highRisks.length} High Severity)`,
          content: `Here are the primary threats detected in your Risk Register:

${highRisks.map((r) => `⚠️ **${r.name}** (${r.severity} Severity)\n*Mitigation Strategy:* ${r.mitigation || 'Under investigation'}`).join('\n\n')}

**Faculty Examination Advice:** Internal viva committees look for proactive risk mitigation. Ensure these fallbacks are highlighted in your **Presentation Slide 7**.`,
          actionType: 'risks',
          actionText: 'Manage Risk Register'
        };
      }
      return {
        title: 'Low Risk Exposure',
        content: `No critical risks are currently flagged. Continue monitoring computational resource usage, memory saturation, and model inference latency as you approach final deployment.`,
        actionType: 'risks',
        actionText: 'View Risks'
      };
    }

    // 4. Prioritize / Task organization
    if (pLower.includes('prioritize') || pLower.includes('priority') || pLower.includes('plan')) {
      return {
        title: 'Task Prioritization Matrix',
        content: `Here is your prioritized hierarchy for **${project.name}**:

1. **Immediate Execution (High Priority):** ${tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').map((t) => t.name).join(', ') || 'All High-priority items completed.'}
2. **Upcoming Sprint (Medium Priority):** ${tasks.filter((t) => t.priority === 'Medium' && t.status !== 'Completed').map((t) => t.name).join(', ') || 'None pending.'}
3. **Refinement & Polish (Low Priority):** ${tasks.filter((t) => t.priority === 'Low' && t.status !== 'Completed').map((t) => t.name).join(', ') || 'None pending.'}

*Adjusted according to your **${readiness?.readinessLevel || 'Developing'}** readiness profile.*`,
        actionType: 'tasks',
        actionText: 'Go to Task Board'
      };
    }

    // 5. Domain / Pipeline optimization (e.g. AI, YOLOv8, Computer Vision, etc.)
    if (pLower.includes('optimize') || pLower.includes('domain') || pLower.includes('pipeline') || pLower.includes('accuracy') || pLower.includes('benchmark')) {
      return {
        title: `Domain Guidance: ${project.domain}`,
        content: `Key technical best practices for **${project.domain}** research in **${project.name}**:

1. **Quantization & Edge Acceleration:** Consider INT8 or FP16 half-precision optimization (e.g., TensorRT / ONNX Runtime) to boost real-time FPS without degrading mAP.
2. **Data Augmentation:** Apply Mosaic, MixUp, and Albumentations transformations to simulate challenging environmental conditions (glare, vibration, low light).
3. **Rigorous Validation:** Partition dataset with strict stratified k-fold splits to eliminate data leakage before supervisor review.`,
        actionType: 'docs',
        actionText: 'Explore System Architecture'
      };
    }

    // Default intelligent response
    return {
      title: `Guidance from AI Mentor (${mentorMode} Mode)`,
      content: `I have analyzed your current project state for **${project.name}**:
- **Progress:** ${progress}% (${tasks.filter((t) => t.status === 'Completed').length} of ${tasks.length} tasks completed)
- **Domain:** ${project.domain} (${project.academicLevel})
- **Readiness:** ${readiness?.readinessLevel || 'Developing'} Level (${readiness?.readinessScore || 50}/100)

**Recommended Next Action:** ${nextAction.title} — ${nextAction.description}`,
      actionType: 'focus',
      actionText: 'Start Working'
    };
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const query = inputMessage.trim();
    setInputMessage('');

    // Send user message
    sendAIMessage(query);
    setIsTyping(true);

    // Simulate realistic AI thought process & response
    setTimeout(() => {
      const responseData = generateAIResponse(query);
      setIsTyping(false);
      // Add mentor response to context
      sendAIMessage(`[AI_RESPONSE]:${JSON.stringify(responseData)}`);
    }, 850);
  };

  const handlePromptClick = (text) => {
    if (isTyping) return;
    setInputMessage(text);
    // Auto submit
    sendAIMessage(text);
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateAIResponse(text);
      setIsTyping(false);
      sendAIMessage(`[AI_RESPONSE]:${JSON.stringify(responseData)}`);
    }, 850);
  };

  const handleActionNavigate = (type) => {
    switch (type) {
      case 'focus':
        navigate('/focus');
        break;
      case 'docs':
        navigate('/documentation');
        break;
      case 'tasks':
        navigate('/tasks');
        break;
      case 'milestones':
        navigate('/milestones');
        break;
      case 'risks':
        navigate('/risks');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const suggestedQuestions = [
    'What should I work on next?',
    'Am I on schedule?',
    'What are my current risks?',
    'Help me prioritize my tasks.',
    `How can I optimize our ${project.domain} pipeline?`,
    'How should I prepare for my viva defense?'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1050px', margin: '0 auto', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bot size={24} style={{ color: '#2563eb' }} />
            <span>AI Academic Project Mentor</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.15rem' }}>
            Contextual guidance engine calibrated for <strong>{project.name}</strong> ({progress}% Complete · {mentorMode} Mode).
          </p>
        </div>

        {/* Status Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/readiness')}
            style={{ fontSize: '0.78rem' }}
          >
            <GraduationCap size={14} />
            <span>Mode: {mentorMode}</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Messages Feed */}
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Welcome Message from System */}
          <div className="chat-bubble-system" style={{ maxWidth: '85%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} />
                </div>
                <span>AI Project Mentor</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', backgroundColor: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {mentorMode} Mode
              </span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#334155', fontSize: '0.9rem' }}>
              Hello! I am your AI Academic Project Mentor for <strong>{project.name}</strong>. I continuously analyze your <strong>{tasks.length} tasks</strong>, <strong>{milestones.length} milestones</strong>, and <strong>{risks.length} registered risks</strong> to provide personalized feedback, sprint priorities, and thesis drafting advice.
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
              Ask any question below or click a suggested prompt to receive real-time guidance.
            </p>
          </div>

          {/* User & AI Messages */}
          {aiMessages.map((msg) => {
            // Check if it's a structured AI response
            if (msg.text.startsWith('[AI_RESPONSE]:')) {
              try {
                const parsed = JSON.parse(msg.text.replace('[AI_RESPONSE]:', ''));
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: 'flex-start',
                      maxWidth: '85%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={16} />
                      </div>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e40af' }}>
                        {parsed.title}
                      </h4>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                      {parsed.content}
                    </div>

                    {parsed.actionText && (
                      <div style={{ marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleActionNavigate(parsed.actionType)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          <span>{parsed.actionText}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              } catch (e) {
                return null;
              }
            }

            // Regular User Message
            return (
              <div key={msg.id} style={{ alignSelf: 'flex-end', maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.75rem 1.15rem',
                    borderRadius: '14px 14px 2px 14px',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem', marginRight: '0.25rem' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {/* Typing Animation */}
          {isTyping && (
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#f1f5f9',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#64748b',
                fontSize: '0.82rem'
              }}
            >
              <Sparkles size={14} style={{ color: '#2563eb' }} />
              <span>AI Mentor is analyzing project state...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePromptClick(q)}
              disabled={isTyping}
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="chat-input-container" style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', backgroundColor: '#ffffff' }}>
          <input
            type="text"
            className="form-input"
            placeholder={`Ask AI Mentor anything about ${project.name}...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputMessage.trim() || isTyping}
            style={{ minWidth: '90px' }}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
