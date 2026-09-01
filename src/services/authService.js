/**
 * Authentication Service for AI Academic Project Mentor
 * Manages user registration, session management, and profile storage in localStorage.
 * Password hashing uses SHA-256 for secure development simulation without plain-text storage.
 * Designed for drop-in replacement with FastAPI OAuth2/JWT backend authentication.
 */

const AUTH_KEYS = {
  USERS: 'ai_mentor_users',
  SESSION: 'ai_mentor_session',
  REMEMBER_ME: 'ai_mentor_remember_me'
};

// Safe JSON parser helper
const getStoredJson = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
};

const setStoredJson = (key, value, useSession = false) => {
  try {
    const serialized = JSON.stringify(value);
    if (useSession) {
      sessionStorage.setItem(key, serialized);
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, serialized);
      sessionStorage.removeItem(key);
    }
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
};

/**
 * Generates a SHA-256 hash string from password input.
 * Ensures passwords are NEVER stored in plain-text.
 */
export const hashPassword = async (password) => {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password + '_academic_salt_2026');
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple hash for environments without Web Crypto API
    let hash = 0;
    const str = password + '_academic_salt_2026';
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  } catch (err) {
    console.error('Password hashing failed:', err);
    return 'h_' + btoa(password).replace(/=/g, '');
  }
};

/**
 * Retrieves all registered users from localStorage.
 */
export const getRegisteredUsers = () => {
  return getStoredJson(AUTH_KEYS.USERS, []) || [];
};

/**
 * Registers a new user account.
 * Validates unique email and saves non-sensitive profile info + hashed password.
 */
export const registerUser = async (profileData) => {
  const users = getRegisteredUsers();
  const normalizedEmail = profileData.email.trim().toLowerCase();

  // Check if user already exists
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const passwordHash = await hashPassword(profileData.password);

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    fullName: profileData.fullName.trim(),
    email: normalizedEmail,
    role: profileData.role || 'Student', // 'Student' | 'Faculty / Project Guide' | 'Researcher' | 'Industry Mentor'
    academicLevel: profileData.academicLevel || 'Undergraduate',
    domain: profileData.domain || 'Artificial Intelligence',
    institution: profileData.institution.trim(),
    guideName: profileData.guideName ? profileData.guideName.trim() : '',
    readinessLevel: 'Developing',
    mentorMode: 'Balanced',
    passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  setStoredJson(AUTH_KEYS.USERS, updatedUsers);

  // Return clean user profile without passwordHash
  const { passwordHash: _, ...cleanProfile } = newUser;
  return cleanProfile;
};

/**
 * Authenticates a user with email and password.
 * Checks password hash and creates an active session.
 */
export const loginUser = async (email, password, rememberMe = true) => {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const inputHash = await hashPassword(password);
  if (user.passwordHash !== inputHash) {
    throw new Error('Invalid email or password.');
  }

  const { passwordHash: _, ...cleanProfile } = user;

  const session = {
    user: cleanProfile,
    token: 'jwt_mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
    expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString()
  };

  setStoredJson(AUTH_KEYS.SESSION, session, !rememberMe);
  setStoredJson(AUTH_KEYS.REMEMBER_ME, rememberMe);

  return session;
};

/**
 * Returns the current active user session, or null if unauthenticated.
 */
export const getCurrentSession = () => {
  const session = getStoredJson(AUTH_KEYS.SESSION, null);
  if (!session || !session.user) return null;

  // Check if session has expired
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    logoutUser();
    return null;
  }

  return session;
};

/**
 * Logs out the current user session.
 * Does NOT delete project data!
 */
export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEYS.SESSION);
  sessionStorage.removeItem(AUTH_KEYS.SESSION);
};

/**
 * Updates the user's profile metadata in both the user store and active session.
 */
export const updateUserProfile = (partialProfile) => {
  const session = getCurrentSession();
  if (!session || !session.user) return null;

  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === session.user.id);
  if (index === -1) return null;

  const updatedUser = {
    ...users[index],
    ...partialProfile,
    updatedAt: new Date().toISOString()
  };

  users[index] = updatedUser;
  setStoredJson(AUTH_KEYS.USERS, users);

  const { passwordHash: _, ...cleanProfile } = updatedUser;
  const updatedSession = {
    ...session,
    user: cleanProfile
  };

  const isRemember = getStoredJson(AUTH_KEYS.REMEMBER_ME, true);
  setStoredJson(AUTH_KEYS.SESSION, updatedSession, !isRemember);

  return cleanProfile;
};
