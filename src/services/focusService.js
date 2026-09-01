/**
 * Focus Service & Consistency Intelligence Engine
 * Tracks real focus timer sessions, calculates daily/weekly focus time, active days,
 * consistency streak, and academic project effort.
 * Also manages Project Readiness Assessment and Adaptive Mentor Mode.
 */

export const FOCUS_KEYS = {
  SESSIONS: 'ai_mentor_focus_sessions',
  READINESS: 'ai_mentor_readiness',
  MENTOR_MODE: 'ai_mentor_mentor_mode'
};

// Minimum focus minutes in a day to qualify as an "Active Day"
// Configurable threshold per requirements (meaningful work, not just opening the app)
export const MIN_ACTIVE_MINUTES = 10;

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

// --- FOCUS SESSIONS MANAGEMENT ---

export const getFocusSessions = () => {
  return getStoredJson(FOCUS_KEYS.SESSIONS, []) || [];
};

/**
 * Saves a completed or ended focus session.
 * Stores exact elapsed duration (not scheduled target duration).
 */
export const saveFocusSession = ({
  userId = 'usr_current',
  taskId = null,
  taskName = 'General Project Work',
  startTime = new Date().toISOString(),
  endTime = new Date().toISOString(),
  durationMinutes = 0,
  durationSeconds = 0,
  status = 'completed', // 'completed' | 'paused' | 'cancelled'
  date = new Date().toISOString().split('T')[0]
}) => {
  const sessions = getFocusSessions();
  const session = {
    id: 'fs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    userId,
    taskId,
    taskName,
    startTime,
    endTime,
    durationMinutes: Number(durationMinutes) || 0,
    durationSeconds: Number(durationSeconds) || 0,
    status,
    date: date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  const updated = [session, ...sessions];
  setStoredJson(FOCUS_KEYS.SESSIONS, updated);
  return session;
};

// --- TIME FORMATTING HELPER ---
export const formatDuration = (totalMinutes) => {
  const mins = Math.round(totalMinutes || 0);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
};

/**
 * Calculates total focus time for a given date (defaults to today).
 * Only counts completed or ended sessions (ignores paused/cancelled time).
 */
export const getDailyFocusTime = (targetDateStr = new Date().toISOString().split('T')[0]) => {
  const sessions = getFocusSessions();
  const todaySessions = sessions.filter(
    (s) => s.date === targetDateStr && s.status !== 'cancelled'
  );

  const totalSeconds = todaySessions.reduce((acc, s) => acc + (s.durationSeconds || s.durationMinutes * 60 || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  return {
    totalMinutes,
    totalSeconds,
    sessionsCount: todaySessions.length,
    formatted: formatDuration(totalMinutes)
  };
};

/**
 * Calculates focus time for each day of the current week (Monday through Sunday).
 */
export const getWeeklyFocusActivity = () => {
  const sessions = getFocusSessions();
  const now = new Date();

  // Calculate start of current week (Monday)
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekData = [];
  let totalWeeklyMinutes = 0;

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    const dateStr = currentDay.toISOString().split('T')[0];

    const daySessions = sessions.filter(
      (s) => s.date === dateStr && s.status !== 'cancelled'
    );
    const seconds = daySessions.reduce((acc, s) => acc + (s.durationSeconds || s.durationMinutes * 60 || 0), 0);
    const minutes = Math.round(seconds / 60);
    totalWeeklyMinutes += minutes;

    weekData.push({
      day: daysOfWeek[i],
      date: dateStr,
      minutes,
      formatted: formatDuration(minutes),
      sessionsCount: daySessions.length,
      isActiveDay: minutes >= MIN_ACTIVE_MINUTES
    });
  }

  const activeDaysThisWeek = weekData.filter((d) => d.isActiveDay).length;

  return {
    weekData,
    totalMinutes: totalWeeklyMinutes,
    formattedTotal: formatDuration(totalWeeklyMinutes),
    activeDaysCount: activeDaysThisWeek
  };
};

/**
 * Calculates the current and longest active streaks.
 * An Active Day requires >= MIN_ACTIVE_MINUTES (10 mins) of focus work.
 */
export const calculateStreaks = () => {
  const sessions = getFocusSessions();
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  }

  // Aggregate minutes by date
  const minutesByDate = {};
  sessions.forEach((s) => {
    if (s.status !== 'cancelled' && s.date) {
      minutesByDate[s.date] = (minutesByDate[s.date] || 0) + (s.durationMinutes || Math.round(s.durationSeconds / 60) || 0);
    }
  });

  // Filter to days that met the active threshold
  const activeDates = Object.keys(minutesByDate)
    .filter((date) => minutesByDate[date] >= MIN_ACTIVE_MINUTES)
    .sort();

  const totalActiveDays = activeDates.length;
  if (totalActiveDays === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  }

  // Calculate current streak
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let checkDate = new Date();

  // If today is not active yet, start checking from yesterday
  if (!activeDates.includes(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (activeDates.includes(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across all history
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  activeDates.forEach((dateStr) => {
    const d = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((d - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = d;
  });

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays
  };
};

/**
 * Calculates a Consistency Score (0-100).
 * Values regular, sustainable daily work over irregular spikes.
 * Example: 1h/day for 5 days scores higher than 5h in 1 day.
 */
export const calculateConsistencyScore = () => {
  const weekly = getWeeklyFocusActivity();
  const streaks = calculateStreaks();

  if (weekly.totalMinutes === 0 && streaks.totalActiveDays === 0) {
    return {
      score: 0,
      label: 'No Activity Yet',
      description: 'Start a 10-minute focus session to build your project consistency score.'
    };
  }

  // Formula:
  // 1. Active days this week (max 50 pts: 10 pts per active day up to 5 days)
  const activeDaysPoints = Math.min(5, weekly.activeDaysCount) * 10;

  // 2. Regularity / Variance factor (max 25 pts: rewarding balanced distribution across active days)
  const activeMinutesList = weekly.weekData.map((d) => d.minutes).filter((m) => m > 0);
  let regularityPoints = 0;
  if (activeMinutesList.length > 0) {
    const avg = weekly.totalMinutes / activeMinutesList.length;
    // Lower standard deviation relative to avg gives higher points
    const variance = activeMinutesList.reduce((acc, m) => acc + Math.pow(m - avg, 2), 0) / activeMinutesList.length;
    const stdDev = Math.sqrt(variance);
    const ratio = avg > 0 ? stdDev / avg : 1;
    regularityPoints = Math.max(5, Math.round(25 * (1 / (1 + ratio))));
  }

  // 3. Streak momentum (max 25 pts: 5 pts per streak day up to 5)
  const streakPoints = Math.min(5, streaks.currentStreak) * 5;

  const score = Math.min(100, Math.max(10, activeDaysPoints + regularityPoints + streakPoints));

  let label = 'Developing';
  if (score >= 85) label = 'Exceptional';
  else if (score >= 70) label = 'Consistent';
  else if (score >= 50) label = 'Moderate';

  return {
    score,
    label,
    activeDaysThisWeek: weekly.activeDaysCount,
    description: `Consistency rating based on ${weekly.activeDaysCount} active day(s) this week and a ${streaks.currentStreak}-day active streak.`
  };
};

/**
 * Returns a comprehensive project effort summary.
 */
export const getProjectEffortSummary = (tasks = []) => {
  const sessions = getFocusSessions().filter((s) => s.status !== 'cancelled');
  const streaks = calculateStreaks();
  const dailyToday = getDailyFocusTime();
  const weekly = getWeeklyFocusActivity();

  const totalMinutesAllTime = sessions.reduce(
    (acc, s) => acc + (s.durationMinutes || Math.round(s.durationSeconds / 60) || 0),
    0
  );

  const avgDailyMinutes = streaks.totalActiveDays > 0 ? Math.round(totalMinutesAllTime / streaks.totalActiveDays) : 0;

  // Tasks completed that have focus sessions linked
  const completedTaskIds = new Set(tasks.filter((t) => t.status === 'Completed').map((t) => t.id));
  const tasksCompletedWithFocus = new Set(
    sessions.filter((s) => s.taskId && completedTaskIds.has(s.taskId)).map((s) => s.taskId)
  ).size;

  return {
    totalFocusTimeFormatted: formatDuration(totalMinutesAllTime),
    totalMinutesAllTime,
    todayFocusTimeFormatted: dailyToday.formatted,
    weeklyFocusTimeFormatted: weekly.formattedTotal,
    activeDaysCount: streaks.totalActiveDays,
    activeDaysThisWeek: weekly.activeDaysCount,
    currentStreak: streaks.currentStreak,
    longestStreak: streaks.longestStreak,
    averageDailyFocusFormatted: formatDuration(avgDailyMinutes),
    totalSessionsCount: sessions.length,
    tasksCompletedDuringFocus: tasksCompletedWithFocus
  };
};

// --- READINESS ASSESSMENT & MENTOR MODE ---

export const READINESS_CATEGORIES = [
  { id: 'programming', name: 'Programming & Implementation', desc: 'Core language, algorithms, libraries & syntax confidence' },
  { id: 'aiml', name: 'AI / Machine Learning', desc: 'Dataset curation, model architectures, loss & fine-tuning' },
  { id: 'planning', name: 'Project Planning & Scoping', desc: 'Sprint task breakdown, milestones & dependency tracking' },
  { id: 'research', name: 'Research & Literature Review', desc: 'Paper analysis, baseline benchmarking & novelty formulation' },
  { id: 'documentation', name: 'Documentation & SRS', desc: 'Academic formatting, UML system diagrams & thesis writing' },
  { id: 'presentation', name: 'Viva & Presentation', desc: 'Technical communication, live defense & visual demo preparation' }
];

export const READINESS_SCORES = {
  Beginner: 25,
  Developing: 50,
  Intermediate: 75,
  Advanced: 100
};

export const calculateReadinessScore = (categoryScores = {}) => {
  const keys = Object.keys(categoryScores);
  if (keys.length === 0) {
    return {
      overallScore: 50,
      readinessLevel: 'Developing',
      recommendedMode: 'Balanced'
    };
  }

  const sum = keys.reduce((acc, k) => acc + (READINESS_SCORES[categoryScores[k]] || 50), 0);
  const overallScore = Math.round(sum / keys.length);

  let readinessLevel = 'Developing';
  if (overallScore <= 39) readinessLevel = 'Beginner';
  else if (overallScore <= 59) readinessLevel = 'Developing';
  else if (overallScore <= 79) readinessLevel = 'Intermediate';
  else readinessLevel = 'Advanced';

  let recommendedMode = 'Balanced';
  if (readinessLevel === 'Beginner') recommendedMode = 'Guided';
  else if (readinessLevel === 'Developing') recommendedMode = 'Guided';
  else if (readinessLevel === 'Intermediate') recommendedMode = 'Balanced';
  else if (readinessLevel === 'Advanced') recommendedMode = 'Expert';

  return {
    overallScore,
    readinessLevel,
    recommendedMode
  };
};

export const getReadinessAssessment = () => {
  return getStoredJson(FOCUS_KEYS.READINESS, null);
};

export const saveReadinessAssessment = (assessmentData) => {
  const result = calculateReadinessScore(assessmentData.categoryScores);
  const data = {
    categoryScores: assessmentData.categoryScores,
    readinessScore: result.overallScore,
    readinessLevel: result.readinessLevel,
    recommendedMode: result.recommendedMode,
    updatedAt: new Date().toISOString()
  };
  setStoredJson(FOCUS_KEYS.READINESS, data);
  return data;
};

export const getMentorMode = () => {
  return localStorage.getItem(FOCUS_KEYS.MENTOR_MODE) || 'Balanced';
};

export const saveMentorMode = (mode) => {
  localStorage.setItem(FOCUS_KEYS.MENTOR_MODE, mode);
  return mode;
};
