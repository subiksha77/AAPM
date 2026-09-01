import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import * as storage from '../services/storageService';
import * as focusService from '../services/focusService';
import {
  evaluateProjectIdea,
  defineProjectScope,
  recommendTechnologyStack,
  generateProjectRoadmap,
  generateProjectTasks,
  generateDailyPlan,
  getNextRecommendedTask,
  evaluateProjectRisks,
  generateProjectBlueprint
} from '../services/aiAgentService';
import { useToast } from './ToastContext';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [planning, setPlanning] = useState({
    inScope: [],
    outOfScope: [],
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    deliverables: []
  });
  const [risks, setRisks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [mentorMode, setMentorMode] = useState('Balanced');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load all data on mount
  const refreshAllData = useCallback(() => {
    const p = storage.getProject();
    const obj = storage.getObjectives();
    const t = storage.getTasks();
    const m = storage.getMilestones();
    const pl = storage.getPlanning();
    const r = storage.getRisks();
    const a = storage.getActivities();
    const ai = storage.getAIMessages();
    const fs = focusService.getFocusSessions();
    const rd = focusService.getReadinessAssessment();
    const mm = focusService.getMentorMode();

    setProject(p);
    setObjectives(obj);
    setTasks(t);
    setMilestones(m);
    setPlanning(pl);
    setRisks(r);
    setActivities(a);
    setAiMessages(ai);
    setFocusSessions(fs);
    setReadiness(rd);
    setMentorMode(mm);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Derived / Calculated Values (NEVER hard-coded)
  const progress = useMemo(() => {
    return storage.calculateProgress(tasks);
  }, [tasks]);

  const projectStatus = useMemo(() => {
    return storage.calculateProjectStatus(tasks, project);
  }, [tasks, project]);

  const overdueTasks = useMemo(() => {
    return storage.getOverdueTasks(tasks);
  }, [tasks]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const todo = tasks.filter((t) => t.status === 'To Do' || t.status === 'Not Started').length;
    return { total, completed, inProgress, todo };
  }, [tasks]);

  const milestoneStats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter((m) => m.status === 'Completed').length;
    const inProgress = milestones.filter((m) => m.status === 'In Progress').length;
    const upcoming = milestones.filter((m) => m.status === 'Upcoming').length;
    return { total, completed, inProgress, upcoming };
  }, [milestones]);

  // Focus & Consistency Stats (Calculated live from real sessions)
  const dailyFocusTime = useMemo(() => {
    return focusService.getDailyFocusTime();
  }, [focusSessions]);

  const weeklyFocusActivity = useMemo(() => {
    return focusService.getWeeklyFocusActivity();
  }, [focusSessions]);

  const streakStats = useMemo(() => {
    return focusService.calculateStreaks();
  }, [focusSessions]);

  const consistencyScore = useMemo(() => {
    return focusService.calculateConsistencyScore();
  }, [focusSessions]);

  const projectEffortSummary = useMemo(() => {
    return focusService.getProjectEffortSummary(tasks);
  }, [focusSessions, tasks]);

  // AI-Derived Intelligence Properties
  const todayPlan = useMemo(() => {
    return generateDailyPlan(project, tasks, streakStats, milestones, progress);
  }, [project, tasks, streakStats, milestones, progress]);

  const recommendedNextTask = useMemo(() => {
    return getNextRecommendedTask(tasks, milestones);
  }, [tasks, milestones]);

  const ideaEvaluation = useMemo(() => {
    if (!project) return null;
    return evaluateProjectIdea(project.name, project.description, project.domain);
  }, [project]);

  const techStack = useMemo(() => {
    if (!project) return null;
    return recommendTechnologyStack(project.name, project.description, project.domain);
  }, [project]);

  const roadmap = useMemo(() => {
    if (!project) return [];
    return generateProjectRoadmap(
      project.name,
      project.description,
      project.domain,
      project.startDate,
      project.expectedCompletionDate,
      progress
    );
  }, [project, progress]);

  const blueprint = useMemo(() => {
    if (!project || !techStack) return null;
    return generateProjectBlueprint(project, planning, techStack);
  }, [project, planning, techStack]);

  const aiDetectedRisks = useMemo(() => {
    if (!project) return [];
    return evaluateProjectRisks(
      project,
      tasks,
      milestones,
      overdueTasks,
      weeklyFocusActivity?.totalMinutes || 0
    );
  }, [project, tasks, milestones, overdueTasks, weeklyFocusActivity]);

  // --- ACTIONS ---

  /**
   * Primary AI Project Generation Action
   * Transforms minimal user inputs (Name, Description, Domain) into full project plan.
   */
  const handleGenerateAIProjectPlan = (userInput) => {
    const {
      name,
      description,
      domain = 'Artificial Intelligence',
      targetDate = '',
      academicLevel = 'Undergraduate',
      preferredTech = '',
      teamSize = 1,
      guideName = ''
    } = userInput;

    const startDate = new Date().toISOString().split('T')[0];
    const defaultTarget = targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];

    // 1. Run Idea Evaluation Agent
    const ideaEval = evaluateProjectIdea(name, description, domain);

    // 2. Run Scope Definition Agent
    const scopeDef = defineProjectScope(name, description, domain);

    // 3. Run Technology Recommendation Agent
    const tech = recommendTechnologyStack(name, description, domain, { preferredTech });

    // 4. Run Task Generation Agent
    const generatedTasks = generateProjectTasks(name, description, domain, startDate, defaultTarget);

    // 5. Run Risk Assessment Agent
    const generatedRisks = evaluateProjectRisks(
      { name, description, domain },
      generatedTasks,
      [],
      [],
      0
    );

    // Save entities to storage
    const newProject = storage.saveProject({
      name,
      description,
      domain,
      academicLevel,
      startDate,
      expectedCompletionDate: defaultTarget,
      teamSize,
      guideName
    });

    const initialObjectives = scopeDef.coreFeatures.map((f, i) => `Objective ${i + 1}: ${f}`);
    storage.saveObjectives(initialObjectives);
    storage.saveTasks(generatedTasks);
    storage.savePlanning({
      inScope: scopeDef.inScope,
      outOfScope: scopeDef.outOfScope,
      functionalRequirements: scopeDef.functionalRequirements,
      nonFunctionalRequirements: scopeDef.nonFunctionalRequirements,
      deliverables: scopeDef.deliverables
    });
    storage.saveRisks(generatedRisks);

    storage.logActivity(
      `AI Project Plan Generated: "${name}"`,
      `Created ${generatedTasks.length} tasks and ${scopeDef.functionalRequirements.length} specifications`,
      'planning'
    );

    refreshAllData();
    showToast(`AI Project Plan successfully generated for "${name}"!`, 'success');
    return { newProject, generatedTasks, scopeDef, tech, ideaEval };
  };

  // Project Manual Creation Fallback
  const handleCreateProject = (projectData, initialObjectives = []) => {
    const newProj = storage.saveProject(projectData);
    storage.saveObjectives(initialObjectives);
    setProject(newProj);
    setObjectives(initialObjectives);
    setActivities(storage.getActivities());
    showToast(`Project "${newProj.name}" created successfully!`, 'success');
    return newProj;
  };

  const handleUpdateProject = (partialData) => {
    const updated = storage.updateProject(partialData);
    setProject(updated);
    setActivities(storage.getActivities());
    showToast('Project details updated successfully.', 'success');
    return updated;
  };

  const handleDeleteProject = () => {
    storage.deleteProject();
    setProject(null);
    setObjectives([]);
    setTasks([]);
    setMilestones([]);
    setPlanning({
      inScope: [],
      outOfScope: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      deliverables: []
    });
    setRisks([]);
    setActivities([]);
    setAiMessages([]);
    showToast('Project and all associated data cleared.', 'info');
  };

  // Objectives
  const handleSaveObjectives = (newObjectives) => {
    storage.saveObjectives(newObjectives);
    setObjectives(newObjectives);
    storage.logActivity('Project objectives updated', `${newObjectives.length} objectives saved`, 'planning');
    setActivities(storage.getActivities());
    showToast('Objectives saved successfully.', 'success');
  };

  // Tasks
  const handleAddTask = (taskData) => {
    const newTask = storage.addTask(taskData);
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
    showToast(`Task "${newTask.name}" added successfully.`, 'success');
    return newTask;
  };

  const handleUpdateTask = (taskData) => {
    const updated = storage.updateTask(taskData);
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
    showToast(`Task "${updated.name}" updated.`, 'success');
    return updated;
  };

  const handleDeleteTask = (taskId) => {
    storage.deleteTask(taskId);
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
    showToast('Task removed from project.', 'info');
  };

  const handleToggleTask = (taskId) => {
    const updated = storage.toggleTaskComplete(taskId);
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
    if (updated.status === 'Completed') {
      showToast(`Task "${updated.name}" marked as Completed!`, 'success');
    } else {
      showToast(`Task "${updated.name}" moved to In Progress / To Do.`, 'info');
    }
    return updated;
  };

  // Milestones (Faculty Defined)
  const handleAddMilestone = (milestoneData) => {
    const newM = storage.addMilestone(milestoneData);
    setMilestones(storage.getMilestones());
    setActivities(storage.getActivities());
    showToast(`Faculty Milestone "${newM.name}" created.`, 'success');
    return newM;
  };

  const handleUpdateMilestone = (milestoneData) => {
    const updated = storage.updateMilestone(milestoneData);
    setMilestones(storage.getMilestones());
    setActivities(storage.getActivities());
    showToast(`Milestone "${updated.name}" updated.`, 'success');
    return updated;
  };

  const handleDeleteMilestone = (milestoneId) => {
    storage.deleteMilestone(milestoneId);
    setMilestones(storage.getMilestones());
    setActivities(storage.getActivities());
    showToast('Milestone deleted.', 'info');
  };

  // Planning
  const handleSavePlanning = (newPlanning) => {
    storage.savePlanning(newPlanning);
    setPlanning(newPlanning);
    setActivities(storage.getActivities());
    showToast('Project planning specifications saved.', 'success');
  };

  // Risks
  const handleAddRisk = (riskData) => {
    const newRisk = storage.addRisk(riskData);
    setRisks(storage.getRisks());
    setActivities(storage.getActivities());
    showToast(`Risk "${newRisk.name}" registered (Severity: ${newRisk.severity}).`, 'success');
    return newRisk;
  };

  const handleUpdateRisk = (riskData) => {
    const updated = storage.updateRisk(riskData);
    setRisks(storage.getRisks());
    setActivities(storage.getActivities());
    showToast(`Risk "${updated.name}" updated.`, 'success');
    return updated;
  };

  const handleDeleteRisk = (riskId) => {
    storage.deleteRisk(riskId);
    setRisks(storage.getRisks());
    setActivities(storage.getActivities());
    showToast('Risk item deleted.', 'info');
  };

  // AI Chat
  const handleSendAIMessage = (text) => {
    const userMsg = storage.addAIMessage({ sender: 'user', text });
    setAiMessages(storage.getAIMessages());
    return userMsg;
  };

  // Focus Sessions
  const handleSaveFocusSession = (sessionData) => {
    const newSession = focusService.saveFocusSession(sessionData);
    setFocusSessions(focusService.getFocusSessions());
    storage.logActivity(
      `Focus session completed: ${newSession.durationMinutes} min`,
      `Task: ${newSession.taskName}`,
      'task'
    );
    setActivities(storage.getActivities());
    showToast(`Focus session logged (${newSession.durationMinutes}m elapsed work).`, 'success');
    return newSession;
  };

  // Readiness Assessment
  const handleSaveReadiness = (assessmentData) => {
    const saved = focusService.saveReadinessAssessment(assessmentData);
    setReadiness(saved);
    setMentorMode(saved.recommendedMode);
    focusService.saveMentorMode(saved.recommendedMode);
    storage.logActivity(
      `Readiness Assessment Completed: ${saved.readinessLevel} (${saved.readinessScore}/100)`,
      `Recommended Mentor Mode: ${saved.recommendedMode}`,
      'planning'
    );
    setActivities(storage.getActivities());
    showToast(`Readiness assessed as ${saved.readinessLevel}. Mentor mode set to ${saved.recommendedMode}.`, 'success');
    return saved;
  };

  // Mentor Mode
  const handleChangeMentorMode = (mode) => {
    focusService.saveMentorMode(mode);
    setMentorMode(mode);
    showToast(`AI Mentor Mode changed to ${mode}.`, 'info');
  };

  const value = {
    isLoaded,
    project,
    objectives,
    tasks,
    milestones,
    planning,
    risks,
    activities,
    aiMessages,
    progress,
    projectStatus,
    overdueTasks,
    taskStats,
    milestoneStats,
    // Focus & Consistency
    focusSessions,
    dailyFocusTime,
    weeklyFocusActivity,
    streakStats,
    consistencyScore,
    projectEffortSummary,
    readiness,
    mentorMode,
    // AI Agents Output
    todayPlan,
    recommendedNextTask,
    ideaEvaluation,
    techStack,
    roadmap,
    blueprint,
    aiDetectedRisks,
    // Actions
    generateAIProjectPlan: handleGenerateAIProjectPlan,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    saveObjectives: handleSaveObjectives,
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    toggleTask: handleToggleTask,
    addMilestone: handleAddMilestone,
    updateMilestone: handleUpdateMilestone,
    deleteMilestone: handleDeleteMilestone,
    savePlanning: handleSavePlanning,
    addRisk: handleAddRisk,
    updateRisk: handleUpdateRisk,
    deleteRisk: handleDeleteRisk,
    sendAIMessage: handleSendAIMessage,
    saveFocusSession: handleSaveFocusSession,
    saveReadiness: handleSaveReadiness,
    changeMentorMode: handleChangeMentorMode,
    refreshAllData
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
