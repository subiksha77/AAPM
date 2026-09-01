/**
 * Storage Service for AI Academic Project Mentor
 * Manages localStorage data persistence for Day 1.
 * Ready for future transition to FastAPI and PostgreSQL.
 */

const STORAGE_KEYS = {
  PROJECT: 'ai_mentor_project',
  OBJECTIVES: 'ai_mentor_objectives',
  TASKS: 'ai_mentor_tasks',
  MILESTONES: 'ai_mentor_milestones',
  PLANNING: 'ai_mentor_planning',
  RISKS: 'ai_mentor_risks',
  ACTIVITIES: 'ai_mentor_activities',
  AI_MESSAGES: 'ai_mentor_ai_messages'
};

// Safe JSON parser helper
const getStoredJson = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
};

const setStoredJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

// --- LOGGING ACTIVITIES ---
export const logActivity = (action, details = '', type = 'project') => {
  const activities = getActivities();
  const newActivity = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    action,
    details,
    type,
    timestamp: new Date().toISOString()
  };
  const updated = [newActivity, ...activities].slice(0, 50); // retain last 50
  setStoredJson(STORAGE_KEYS.ACTIVITIES, updated);
  return newActivity;
};

export const getActivities = () => {
  return getStoredJson(STORAGE_KEYS.ACTIVITIES, []) || [];
};

// --- PROJECT MANAGEMENT ---
export const getProject = () => {
  return getStoredJson(STORAGE_KEYS.PROJECT, null);
};

export const saveProject = (projectData) => {
  const project = {
    id: projectData.id || 'proj_' + Date.now(),
    name: projectData.name.trim(),
    description: projectData.description.trim(),
    domain: projectData.domain,
    academicLevel: projectData.academicLevel,
    startDate: projectData.startDate,
    expectedCompletionDate: projectData.expectedCompletionDate,
    teamSize: Number(projectData.teamSize) || 1,
    guideName: projectData.guideName?.trim() || '',
    createdAt: projectData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  setStoredJson(STORAGE_KEYS.PROJECT, project);
  logActivity(`Project Created: "${project.name}"`, `Domain: ${project.domain} | Level: ${project.academicLevel}`, 'project');
  return project;
};

export const updateProject = (partialData) => {
  const current = getProject();
  if (!current) return null;
  const updated = {
    ...current,
    ...partialData,
    updatedAt: new Date().toISOString()
  };
  setStoredJson(STORAGE_KEYS.PROJECT, updated);
  logActivity(`Project updated: "${updated.name}"`, 'Project metadata updated', 'project');
  return updated;
};

export const deleteProject = () => {
  localStorage.removeItem(STORAGE_KEYS.PROJECT);
  localStorage.removeItem(STORAGE_KEYS.OBJECTIVES);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.MILESTONES);
  localStorage.removeItem(STORAGE_KEYS.PLANNING);
  localStorage.removeItem(STORAGE_KEYS.RISKS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.AI_MESSAGES);
};

// --- OBJECTIVES MANAGEMENT ---
export const getObjectives = () => {
  return getStoredJson(STORAGE_KEYS.OBJECTIVES, []) || [];
};

export const saveObjectives = (objectives) => {
  setStoredJson(STORAGE_KEYS.OBJECTIVES, objectives);
  return objectives;
};

// --- TASKS MANAGEMENT ---
export const getTasks = () => {
  return getStoredJson(STORAGE_KEYS.TASKS, []) || [];
};

export const saveTasks = (tasksList) => {
  setStoredJson(STORAGE_KEYS.TASKS, tasksList);
  return tasksList;
};

export const addTask = (taskData) => {
  const tasks = getTasks();
  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: taskData.name.trim(),
    description: taskData.description?.trim() || '',
    priority: taskData.priority || 'Medium', // 'Low' | 'Medium' | 'High'
    deadline: taskData.deadline || '',
    status: taskData.status || 'To Do', // 'To Do' | 'In Progress' | 'Completed'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedTasks = [newTask, ...tasks];
  setStoredJson(STORAGE_KEYS.TASKS, updatedTasks);
  logActivity(`Added task: "${newTask.name}"`, `Priority: ${newTask.priority} | Due: ${newTask.deadline || 'None'}`, 'task');
  return newTask;
};

export const updateTask = (taskData) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === taskData.id);
  if (index === -1) return null;

  const oldStatus = tasks[index].status;
  const updatedTask = {
    ...tasks[index],
    ...taskData,
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updatedTask;
  setStoredJson(STORAGE_KEYS.TASKS, tasks);

  if (oldStatus !== updatedTask.status) {
    logActivity(
      `Task status updated: "${updatedTask.name}"`,
      `Changed from "${oldStatus}" to "${updatedTask.status}"`,
      'task'
    );
  } else {
    logActivity(`Task updated: "${updatedTask.name}"`, 'Task details modified', 'task');
  }

  return updatedTask;
};

export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const target = tasks.find(t => t.id === taskId);
  const updatedTasks = tasks.filter(t => t.id !== taskId);
  setStoredJson(STORAGE_KEYS.TASKS, updatedTasks);
  if (target) {
    logActivity(`Deleted task: "${target.name}"`, `Task removed from project`, 'task');
  }
  return updatedTasks;
};

export const toggleTaskComplete = (taskId) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;

  const current = tasks[index];
  const newStatus = current.status === 'Completed' ? 'To Do' : 'Completed';
  const updated = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updated;
  setStoredJson(STORAGE_KEYS.TASKS, tasks);

  if (newStatus === 'Completed') {
    logActivity(`Completed task: "${updated.name}"`, `Task marked as finished`, 'task');
  } else {
    logActivity(`Reopened task: "${updated.name}"`, `Task marked as To Do`, 'task');
  }

  return updated;
};

// --- MILESTONES MANAGEMENT ---
export const getMilestones = () => {
  return getStoredJson(STORAGE_KEYS.MILESTONES, []) || [];
};

export const addMilestone = (milestoneData) => {
  const milestones = getMilestones();
  const newMilestone = {
    id: 'ms_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: milestoneData.name.trim(),
    description: milestoneData.description?.trim() || '',
    startDate: milestoneData.startDate || '',
    endDate: milestoneData.endDate || '',
    status: milestoneData.status || 'Upcoming', // 'Upcoming' | 'In Progress' | 'Completed'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [...milestones, newMilestone].sort((a, b) => {
    if (!a.endDate) return 1;
    if (!b.endDate) return -1;
    return new Date(a.endDate) - new Date(b.endDate);
  });

  setStoredJson(STORAGE_KEYS.MILESTONES, updated);
  logActivity(`Added milestone: "${newMilestone.name}"`, `Status: ${newMilestone.status} | Target: ${newMilestone.endDate || 'N/A'}`, 'milestone');
  return newMilestone;
};

export const updateMilestone = (milestoneData) => {
  const milestones = getMilestones();
  const index = milestones.findIndex(m => m.id === milestoneData.id);
  if (index === -1) return null;

  const oldStatus = milestones[index].status;
  const updated = {
    ...milestones[index],
    ...milestoneData,
    updatedAt: new Date().toISOString()
  };

  milestones[index] = updated;
  setStoredJson(STORAGE_KEYS.MILESTONES, milestones);

  if (oldStatus !== updated.status) {
    logActivity(`Milestone status updated: "${updated.name}"`, `Now "${updated.status}"`, 'milestone');
  } else {
    logActivity(`Milestone updated: "${updated.name}"`, 'Milestone parameters adjusted', 'milestone');
  }

  return updated;
};

export const deleteMilestone = (milestoneId) => {
  const milestones = getMilestones();
  const target = milestones.find(m => m.id === milestoneId);
  const updated = milestones.filter(m => m.id !== milestoneId);
  setStoredJson(STORAGE_KEYS.MILESTONES, updated);
  if (target) {
    logActivity(`Deleted milestone: "${target.name}"`, 'Milestone removed', 'milestone');
  }
  return updated;
};

// --- PLANNING (SCOPE, REQUIREMENTS, DELIVERABLES) ---
export const getPlanning = () => {
  const defaultPlanning = {
    inScope: [],
    outOfScope: [],
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    deliverables: []
  };
  return getStoredJson(STORAGE_KEYS.PLANNING, defaultPlanning) || defaultPlanning;
};

export const savePlanning = (planningData) => {
  setStoredJson(STORAGE_KEYS.PLANNING, planningData);
  logActivity('Planning specifications updated', 'Scope, Requirements, or Deliverables modified', 'planning');
  return planningData;
};

// --- RISKS MANAGEMENT ---
export const calculateRiskSeverity = (probability, impact) => {
  const p = (probability || '').toLowerCase();
  const i = (impact || '').toLowerCase();

  if (p === 'high' && i === 'high') return 'Critical';
  if ((p === 'high' && i === 'medium') || (p === 'medium' && i === 'high')) return 'High';
  if ((p === 'medium' && i === 'medium') || (p === 'high' && i === 'low') || (p === 'low' && i === 'high')) return 'Medium';
  return 'Low';
};

export const getRisks = () => {
  return getStoredJson(STORAGE_KEYS.RISKS, []) || [];
};

export const saveRisks = (risksList) => {
  setStoredJson(STORAGE_KEYS.RISKS, risksList);
  return risksList;
};

export const addRisk = (riskData) => {
  const risks = getRisks();
  const severity = calculateRiskSeverity(riskData.probability, riskData.impact);
  const newRisk = {
    id: 'risk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: riskData.name.trim(),
    description: riskData.description?.trim() || '',
    probability: riskData.probability || 'Medium', // 'Low' | 'Medium' | 'High'
    impact: riskData.impact || 'Medium', // 'Low' | 'Medium' | 'High'
    severity, // 'Low' | 'Medium' | 'High' | 'Critical'
    mitigation: riskData.mitigation?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newRisk, ...risks];
  setStoredJson(STORAGE_KEYS.RISKS, updated);
  logActivity(`Added Risk: "${newRisk.name}"`, `Severity: ${newRisk.severity} (Prob: ${newRisk.probability}, Impact: ${newRisk.impact})`, 'risk');
  return newRisk;
};

export const updateRisk = (riskData) => {
  const risks = getRisks();
  const index = risks.findIndex(r => r.id === riskData.id);
  if (index === -1) return null;

  const severity = calculateRiskSeverity(riskData.probability, riskData.impact);
  const updated = {
    ...risks[index],
    ...riskData,
    severity,
    updatedAt: new Date().toISOString()
  };

  risks[index] = updated;
  setStoredJson(STORAGE_KEYS.RISKS, risks);
  logActivity(`Risk updated: "${updated.name}"`, `Severity: ${updated.severity}`, 'risk');
  return updated;
};

export const deleteRisk = (riskId) => {
  const risks = getRisks();
  const target = risks.find(r => r.id === riskId);
  const updated = risks.filter(r => r.id !== riskId);
  setStoredJson(STORAGE_KEYS.RISKS, updated);
  if (target) {
    logActivity(`Deleted risk: "${target.name}"`, 'Risk item removed', 'risk');
  }
  return updated;
};

// --- AI MESSAGES ---
export const getAIMessages = () => {
  return getStoredJson(STORAGE_KEYS.AI_MESSAGES, []) || [];
};

export const addAIMessage = (message) => {
  const messages = getAIMessages();
  const newMsg = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    sender: message.sender || 'user',
    text: message.text.trim(),
    timestamp: new Date().toISOString()
  };
  const updated = [...messages, newMsg];
  setStoredJson(STORAGE_KEYS.AI_MESSAGES, updated);
  return newMsg;
};

// --- CALCULATION UTILITIES ---

/**
 * Calculates progress dynamically based on tasks.
 * Formula: (completedTasks / totalTasks) * 100
 * Returns 0 if no tasks exist.
 */
export const calculateProgress = (tasks = []) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

/**
 * Determines project status automatically:
 * - 'Not Started'
 * - 'In Progress'
 * - 'Completed'
 */
export const calculateProjectStatus = (tasks = [], project = null) => {
  if (!project) return 'Not Started';
  if (!tasks || tasks.length === 0) return 'Not Started';

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  if (completedCount === tasks.length) return 'Completed';

  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  if (completedCount > 0 || inProgressCount > 0) return 'In Progress';

  return 'Not Started';
};

/**
 * Returns tasks that are past their deadline and not yet completed.
 */
export const getOverdueTasks = (tasks = []) => {
  if (!tasks || tasks.length === 0) return [];
  const now = new Date();
  // set to beginning of today
  const todayDateStr = now.toISOString().split('T')[0];

  return tasks.filter(task => {
    if (task.status === 'Completed') return false;
    if (!task.deadline) return false;
    return task.deadline < todayDateStr;
  });
};
