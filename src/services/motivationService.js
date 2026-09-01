/**
 * Motivation, Encouragement, Focus & Project Health Service
 * Dynamically computes guidance, recommendations, today's focus task, project health,
 * project roadmap, earned achievements, and analytical AI insights from real project & focus data.
 */

/**
 * Determines the motivation state and personalized guidance message from real data.
 * Considers project progress, tasks, overdue deliverables, milestones, focus time, active days, and streak.
 */
export const getMotivationMessage = (project, tasks = [], milestones = [], progress = 0, overdueTasks = [], focusStats = null) => {
  if (!project) {
    return {
      state: 'STARTING',
      title: 'Begin Your Academic Journey',
      message: "Every project starts with one step. Create your project to get started.",
      badgeText: 'Project Initiation',
      badgeColor: 'blue'
    };
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const completedMilestones = milestones.filter((m) => m.status === 'Completed').length;
  const currentStreak = focusStats?.currentStreak || 0;
  const totalFocusMins = focusStats?.totalMinutesAllTime || 0;
  const activeDaysThisWeek = focusStats?.activeDaysThisWeek || 0;

  // 1. PROJECT_COMPLETED (100% progress)
  if (totalTasks > 0 && progress === 100) {
    return {
      state: 'PROJECT_COMPLETED',
      title: 'Capstone Journey Completed! 🎉',
      message: 'Congratulations! You have completed all scheduled project deliverables. Your academic thesis and artifacts are ready for final review.',
      badgeText: '100% Completed',
      badgeColor: 'emerald'
    };
  }

  // 2. MILESTONE_COMPLETED
  const recentlyCompletedMilestone = milestones.find((m) => m.status === 'Completed');
  if (completedMilestones > 0 && completedTasks > 0 && progress >= 75) {
    return {
      state: 'MILESTONE_COMPLETED',
      title: 'Milestone Cleared! 🚀',
      message: `🎉 Milestone completed! Your consistent effort is moving the project forward across all major phases.`,
      badgeText: 'Milestone Achieved',
      badgeColor: 'purple'
    };
  }

  // 3. BEHIND_SCHEDULE (Overdue deliverables)
  if (overdueTasks.length > 0) {
    return {
      state: 'BEHIND_SCHEDULE',
      title: 'Schedule Attention Needed',
      message: "Don't worry about falling behind. Let's focus on the most important task first and break remaining work into smaller steps.",
      badgeText: `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}`,
      badgeColor: 'rose'
    };
  }

  // 4. STREAK (3+ consecutive active days)
  if (currentStreak >= 3) {
    return {
      state: 'STREAK',
      title: `${currentStreak}-Day Project Streak 🔥`,
      message: `🔥 You're on a ${currentStreak}-day project streak. Your consistency is paying off with steady deliverable velocity.`,
      badgeText: `🔥 ${currentStreak} Days Streak`,
      badgeColor: 'amber'
    };
  }

  // 5. HIGH_EFFORT_LOW_OUTPUT (High focus time but 0 or few completed tasks)
  if (totalFocusMins >= 120 && completedTasks === 0 && totalTasks > 0) {
    return {
      state: 'HIGH_EFFORT_LOW_OUTPUT',
      title: 'Refining Task Breakdown',
      message: "You've invested significant focus time. Let's break your current task into smaller, clearer steps to accelerate completions.",
      badgeText: 'Task Refinement',
      badgeColor: 'purple'
    };
  }

  // 6. CONSISTENT (Active days this week >= 3)
  if (activeDaysThisWeek >= 3) {
    return {
      state: 'CONSISTENT',
      title: 'Strong Academic Consistency',
      message: 'Your consistency is strong this week. Keep the momentum going without burning out.',
      badgeText: 'Consistent Effort',
      badgeColor: 'emerald'
    };
  }

  // 7. PROGRESSING (Tasks completed > 0)
  if (completedTasks > 0) {
    return {
      state: 'PROGRESSING',
      title: 'Steady Project Velocity',
      message: 'Great progress. Keep moving one task at a time towards your next milestone review.',
      badgeText: 'On Track',
      badgeColor: 'blue'
    };
  }

  // 8. LOW_ACTIVITY (Has tasks but 0 completed and 0 focus time this week)
  if (totalTasks > 0 && completedTasks === 0 && activeDaysThisWeek === 0 && totalFocusMins === 0) {
    return {
      state: 'LOW_ACTIVITY',
      title: 'Kickstart Today’s Focus',
      message: 'Try a short 25-minute focus session today. Small, consistent progress adds up significantly over time.',
      badgeText: 'Action Encouraged',
      badgeColor: 'blue'
    };
  }

  // 9. STARTING
  return {
    state: 'STARTING',
    title: 'Ready for Sprint 1',
    message: "Every project starts with one step. Let's complete your first task.",
    badgeText: 'Sprint Initiation',
    badgeColor: 'blue'
  };
};

// Backwards compatibility alias
export const getMotivationState = (project, tasks, milestones, progress, overdueTasks, focusStats) => {
  return getMotivationMessage(project, tasks, milestones, progress, overdueTasks, focusStats);
};

/**
 * Identifies the single most important task for the student to focus on today.
 * Prioritizes: Overdue high-priority -> Overdue -> Approaching deadline (7 days) -> High-priority -> In Progress -> Next pending.
 */
export const getTodayFocus = (tasks = []) => {
  if (!tasks || tasks.length === 0) return null;

  const incompleteTasks = tasks.filter((t) => t.status !== 'Completed');
  if (incompleteTasks.length === 0) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Overdue high-priority tasks
  const overdueHigh = incompleteTasks.find((t) => t.priority === 'High' && t.deadline && t.deadline < todayStr);
  if (overdueHigh) {
    return {
      task: overdueHigh,
      reason: 'Recommended because this task is high priority and past its target deadline.',
      shortReason: 'Overdue High-Priority Blocker',
      priorityRank: 1
    };
  }

  // 2. Any overdue tasks
  const overdueAny = incompleteTasks.find((t) => t.deadline && t.deadline < todayStr);
  if (overdueAny) {
    return {
      task: overdueAny,
      reason: 'Recommended because this task is past its target deadline.',
      shortReason: 'Past Target Deadline',
      priorityRank: 2
    };
  }

  // 3. Tasks due in next 7 days
  const next7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const upcomingSoon = incompleteTasks
    .filter((t) => t.deadline && t.deadline >= todayStr && t.deadline <= next7Days)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  if (upcomingSoon) {
    return {
      task: upcomingSoon,
      reason: `Recommended because this task is approaching its deadline (${new Date(upcomingSoon.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}).`,
      shortReason: 'Approaching Deadline',
      priorityRank: 3
    };
  }

  // 4. High-priority incomplete tasks
  const highPriority = incompleteTasks.find((t) => t.priority === 'High');
  if (highPriority) {
    return {
      task: highPriority,
      reason: 'Recommended because this task represents a critical architectural priority for the project.',
      shortReason: 'High Technical Priority',
      priorityRank: 4
    };
  }

  // 5. In-progress tasks
  const inProgress = incompleteTasks.find((t) => t.status === 'In Progress');
  if (inProgress) {
    return {
      task: inProgress,
      reason: 'Recommended to continue active implementation on your in-progress deliverable.',
      shortReason: 'Work In Progress',
      priorityRank: 5
    };
  }

  // 6. Next pending task
  return {
    task: incompleteTasks[0],
    reason: 'Recommended as the next scheduled sprint deliverable in your task list.',
    shortReason: 'Next Scheduled Task',
    priorityRank: 6
  };
};

/**
 * Determines the next recommended strategic action based on real project state.
 */
export const getNextRecommendedAction = (project, tasks = [], milestones = [], risks = [], planning = null, progress = 0) => {
  if (!project) {
    return {
      title: 'Initialize Your Academic Project',
      action: 'Create your project to get started.',
      route: '/create-project',
      buttonText: 'Create Project'
    };
  }

  if (tasks.length === 0) {
    return {
      title: 'Break Down Project into Tasks',
      action: 'Break your project into smaller tasks.',
      route: '/tasks',
      buttonText: 'Add First Task'
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueHighTask = tasks.find((t) => t.status !== 'Completed' && t.priority === 'High' && t.deadline && t.deadline < todayStr);

  if (overdueHighTask) {
    return {
      title: 'Resolve Critical Blocker',
      action: 'Complete your highest-priority overdue task.',
      route: '/tasks',
      buttonText: 'View High-Priority Task'
    };
  }

  const overdueCount = tasks.filter((t) => t.status !== 'Completed' && t.deadline && t.deadline < todayStr).length;
  if (overdueCount > 0) {
    return {
      title: 'Review Overdue Work Items',
      action: 'Update target dates or complete pending deliverables past deadline.',
      route: '/progress',
      buttonText: 'Review Overdue Tasks'
    };
  }

  const inProgressMilestone = milestones.find((m) => m.status === 'In Progress' || m.status === 'Upcoming');
  if (inProgressMilestone) {
    return {
      title: `Advance ${inProgressMilestone.name}`,
      action: 'Focus on the remaining tasks for your upcoming milestone.',
      route: '/milestones',
      buttonText: 'View Milestone Timeline'
    };
  }

  if (progress === 100) {
    return {
      title: 'Academic Submission Ready',
      action: 'Great work! Your project is ready for the next stage.',
      route: '/documentation',
      buttonText: 'Open Documentation'
    };
  }

  const highPriority = tasks.find((t) => t.status !== 'Completed' && t.priority === 'High');
  if (highPriority) {
    return {
      title: 'Focus on High Priority Deliverable',
      action: 'Focus on your highest-priority task.',
      route: '/tasks',
      buttonText: 'Go to Tasks'
    };
  }

  return {
    title: 'Maintain Project Sprint',
    action: 'Execute your next prioritized sprint task to increase project completion.',
    route: '/focus',
    buttonText: 'Start Focus Session'
  };
};

/**
 * Calculates overall Project Health rating based on overdue tasks, risk severity, milestone progression, and consistency.
 */
export const calculateProjectHealth = (tasks = [], overdueTasks = [], milestones = [], risks = [], progress = 0) => {
  if (tasks.length === 0) {
    return {
      status: 'Needs Attention',
      score: 65,
      color: 'amber',
      summary: 'Project initialized without active task deliverables.',
      recommendation: 'Break your research objectives into tasks to start measuring schedule velocity.'
    };
  }

  const highRisks = risks.filter((r) => r.severity === 'Critical' || r.severity === 'High').length;
  const overdueCount = overdueTasks.length;

  let score = 100;
  score -= overdueCount * 15;
  score -= highRisks * 10;

  if (tasks.length > 0 && progress === 0) {
    score -= 10;
  }

  score = Math.max(10, Math.min(100, score));

  if (score >= 80 && overdueCount === 0) {
    return {
      status: 'Healthy',
      score,
      color: 'emerald',
      summary: 'Project is progressing on schedule with controlled risk exposure.',
      recommendation: 'Maintain steady focus sessions towards upcoming milestone target.'
    };
  }

  if (score >= 55) {
    return {
      status: 'Needs Attention',
      score,
      color: 'amber',
      summary: overdueCount > 0 ? `${overdueCount} task(s) past deadline.` : 'Moderate risk exposure detected.',
      recommendation: 'Review task priorities and assign focused effort to critical deliverables.'
    };
  }

  return {
    status: 'At Risk',
    score,
    color: 'rose',
    summary: 'Multiple overdue deliverables or high-severity technical risks.',
    recommendation: 'Conduct an urgent review of blockers and re-estimate timelines.'
  };
};

/**
 * Generates the 6-stage Academic Project Roadmap with dynamic completion states.
 */
export const getProjectRoadmap = (project, tasks = [], milestones = [], planning = null, progress = 0) => {
  const hasProject = Boolean(project);
  const hasPlanning = planning && (planning.inScope?.length > 0 || planning.functionalRequirements?.length > 0);
  const hasTasks = tasks.length > 0;
  const isDevStarted = progress > 0 || hasTasks;
  const isTestingStage = progress >= 60;
  const isDocStage = progress >= 80;
  const isCompleted = progress === 100 && tasks.length > 0;

  const stages = [
    {
      id: 1,
      name: 'Idea & Proposal',
      description: 'Topic formulation, guide approval, and scope definition',
      status: hasProject ? 'Completed' : 'Current'
    },
    {
      id: 2,
      name: 'Planning & SRS',
      description: 'Requirements analysis, technical feasibility, and task decomposition',
      status: hasProject && (hasPlanning || hasTasks) ? 'Completed' : hasProject ? 'Current' : 'Upcoming'
    },
    {
      id: 3,
      name: 'Development',
      description: 'Core implementation, model training, and integration sprints',
      status: progress >= 60 ? 'Completed' : isDevStarted ? 'Current' : 'Upcoming'
    },
    {
      id: 4,
      name: 'Testing & Evaluation',
      description: 'System benchmarking, metrics validation, and ablation studies',
      status: isCompleted ? 'Completed' : isTestingStage ? 'Current' : 'Upcoming'
    },
    {
      id: 5,
      name: 'Documentation',
      description: 'Synopsis, IEEE thesis report, UML diagrams, and presentation deck',
      status: isCompleted ? 'Completed' : isDocStage ? 'Current' : 'Upcoming'
    },
    {
      id: 6,
      name: 'Deployment & Viva',
      description: 'Final deployment, faculty demonstration, and academic defense',
      status: isCompleted ? 'Current' : 'Upcoming'
    }
  ];

  return stages;
};

/**
 * Calculates earned professional achievements based strictly on real application data.
 */
export const getEarnedAchievements = (project, tasks = [], milestones = [], progress = 0, focusStats = null) => {
  const achievements = [];
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const completedMilestonesCount = milestones.filter((m) => m.status === 'Completed').length;
  const currentStreak = focusStats?.currentStreak || 0;
  const totalFocusMins = focusStats?.totalMinutesAllTime || 0;

  if (project) {
    achievements.push({
      id: 'proj_init',
      title: 'Project Initiator',
      description: 'Successfully created academic project structure & objectives',
      icon: 'FolderPlus',
      tier: 'bronze'
    });
  }

  if (totalFocusMins >= 10) {
    achievements.push({
      id: 'first_focus',
      title: 'First Focus Session',
      description: 'Completed your first dedicated 10+ minute focus session',
      icon: 'Clock',
      tier: 'bronze'
    });
  }

  if (completedTasksCount >= 1) {
    achievements.push({
      id: 'first_task',
      title: 'First Sprint Complete',
      description: 'Finished your first validated project deliverable',
      icon: 'CheckSquare',
      tier: 'bronze'
    });
  }

  if (currentStreak >= 3) {
    achievements.push({
      id: 'streak_3',
      title: '3-Day Active Streak',
      description: 'Maintained 3 consecutive days of meaningful project work',
      icon: 'Flame',
      tier: 'silver'
    });
  }

  if (currentStreak >= 7) {
    achievements.push({
      id: 'streak_7',
      title: '7-Day Consistency Master',
      description: 'Maintained 7 consecutive days of verified academic focus',
      icon: 'Flame',
      tier: 'gold'
    });
  }

  if (completedMilestonesCount >= 1) {
    achievements.push({
      id: 'milestone_pioneer',
      title: 'Phase Pioneer',
      description: 'Completed your first major project milestone phase',
      icon: 'Milestone',
      tier: 'silver'
    });
  }

  if (progress >= 50) {
    achievements.push({
      id: 'halfway_mark',
      title: 'Midpoint Milestone',
      description: 'Achieved 50%+ overall mathematical project completion',
      icon: 'TrendingUp',
      tier: 'gold'
    });
  }

  if (progress === 100 && tasks.length >= 3) {
    achievements.push({
      id: 'project_master',
      title: 'Capstone Master',
      description: 'Completed 100% of all assigned academic tasks & milestones',
      icon: 'Award',
      tier: 'platinum'
    });
  }

  return achievements;
};

/**
 * Generates analytical project insights derived from real activity and metrics.
 * Note: These are structured data-driven calculations prepared for future LLM integration.
 */
export const getProjectInsights = (project, tasks = [], milestones = [], overdueTasks = [], focusStats = null, readiness = null) => {
  const insights = [];
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const weeklyFocusFormatted = focusStats?.weeklyFocusTimeFormatted || '0m';
  const weeklyMins = focusStats?.weeklyFocusTimeFormatted ? focusStats?.totalMinutesAllTime : 0;
  const activeDaysThisWeek = focusStats?.activeDaysThisWeek || 0;

  if (project) {
    insights.push({
      type: 'velocity',
      title: 'Weekly Focus & Task Output',
      message: `You spent ${weeklyFocusFormatted} on your project this week and have ${completedTasks} completed task deliverable${completedTasks !== 1 ? 's' : ''}.`
    });
  }

  if (activeDaysThisWeek > 0) {
    insights.push({
      type: 'consistency',
      title: 'Active Consistency Metric',
      message: `Your active project days stand at ${activeDaysThisWeek} of 7 this week. Regular daily focus produces higher retention than clustered work.`
    });
  }

  if (overdueTasks.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Schedule Velocity Gap',
      message: `Your target deadlines require attention (${overdueTasks.length} deliverable${overdueTasks.length > 1 ? 's' : ''} past due). Consider prioritizing the critical path tasks in Focus Mode.`
    });
  }

  if (readiness) {
    insights.push({
      type: 'readiness',
      title: `Readiness Assessment: ${readiness.readinessLevel}`,
      message: `Your technical readiness score is ${readiness.readinessScore}/100 (${readiness.recommendedMode} Mentor Mode). AI guidance prompts are tailored to this baseline.`
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Awaiting Initial Project Activity',
      message: 'Start a focus session or create project tasks to generate analytical velocity insights.'
    });
  }

  return insights;
};
