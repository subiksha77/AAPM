/**
 * Test Suite: Auth Flow & Motivational/Guidance System Verification
 */

import assert from 'node:assert';

// Simulated storage
class MockStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MockStorage();
global.sessionStorage = new MockStorage();

console.log('--- STARTING AUTH & MOTIVATION SYSTEM VERIFICATION ---');

const authService = await import('./src/services/authService.js');
const storageService = await import('./src/services/storageService.js');
const motivationService = await import('./src/services/motivationService.js');

// Test 1: User Registration
console.log('Test 1: User Registration & Non-Plaintext Password Storage...');
const registeredUser = await authService.registerUser({
  fullName: 'Subiksha S',
  email: 'subiksha@academic.edu',
  password: 'SecurePassword123!',
  academicLevel: 'Undergraduate',
  domain: 'Artificial Intelligence',
  institution: 'National Institute of Technology',
  guideName: 'Dr. K. Ramesh'
});

assert.strictEqual(registeredUser.fullName, 'Subiksha S');
assert.strictEqual(registeredUser.email, 'subiksha@academic.edu');
assert(!registeredUser.password, 'Password must not be in returned profile');
assert(!registeredUser.passwordHash, 'Password hash must not be in returned profile');

// Inspect localStorage directly to ensure password is NOT in plain text
const rawUsers = JSON.parse(localStorage.getItem('ai_mentor_users'));
assert.strictEqual(rawUsers.length, 1);
assert.notStrictEqual(rawUsers[0].passwordHash, 'SecurePassword123!');
assert(!rawUsers[0].password, 'Plain text password must NEVER be in storage');
console.log('✔ Passed: User registered with hashed password storage');

// Test 2: Login Failure (wrong password)
console.log('Test 2: Login Failure on incorrect credentials...');
let loginFailed = false;
try {
  await authService.loginUser('subiksha@academic.edu', 'WrongPassword!');
} catch (err) {
  loginFailed = true;
  assert.strictEqual(err.message, 'Invalid email or password.');
}
assert(loginFailed, 'Login should fail with wrong password');
console.log('✔ Passed: Login rejected invalid credentials');

// Test 3: Login Success & Session Creation
console.log('Test 3: Login Success & Session Creation...');
const session = await authService.loginUser('subiksha@academic.edu', 'SecurePassword123!', true);
assert(session.token, 'Session token should exist');
assert.strictEqual(session.user.email, 'subiksha@academic.edu');

const currentSession = authService.getCurrentSession();
assert.strictEqual(currentSession.user.fullName, 'Subiksha S');
console.log('✔ Passed: Authenticated session established');

// Test 4: Logout preserves Project Data
console.log('Test 4: Logout preserves Project Data...');
// Save mock project
storageService.saveProject({
  name: 'Autonomous Drone Detection System',
  description: 'UAV edge computing',
  domain: 'Artificial Intelligence',
  academicLevel: 'Undergraduate',
  startDate: '2026-08-31',
  expectedCompletionDate: '2026-11-30',
  teamSize: 4
});
const task1 = storageService.addTask({ name: 'Curate dataset', priority: 'High', deadline: '2026-09-15', status: 'Completed' });
const task2 = storageService.addTask({ name: 'Train model', priority: 'High', deadline: '2026-09-30', status: 'To Do' });

// Perform logout
authService.logoutUser();
assert.strictEqual(authService.getCurrentSession(), null, 'Session must be cleared after logout');

// Verify project data still exists
assert.strictEqual(storageService.getProject().name, 'Autonomous Drone Detection System');
assert.strictEqual(storageService.getTasks().length, 2);
console.log('✔ Passed: Logout cleared auth session without touching project data');

// Test 5: Motivational States
console.log('Test 5: Motivational States derived from real data...');
const project = storageService.getProject();
let tasks = storageService.getTasks();

// State with 1/2 completed = 50%
let progress = storageService.calculateProgress(tasks);
let motivation = motivationService.getMotivationState(project, tasks, [], progress, []);
assert.strictEqual(motivation.state, 'PROGRESSING');
console.log(`✔ Passed: Normal progress returned state '${motivation.state}'`);

// State with overdue task
const overdueTasks = [{ id: 'ov1', name: 'Late task', deadline: '2020-01-01', status: 'To Do' }];
motivation = motivationService.getMotivationState(project, tasks, [], progress, overdueTasks);
assert.strictEqual(motivation.state, 'BEHIND_SCHEDULE');
console.log(`✔ Passed: Overdue tasks triggered '${motivation.state}'`);

// State with 100% completed
motivation = motivationService.getMotivationState(project, tasks, [], 100, []);
assert.strictEqual(motivation.state, 'PROJECT_COMPLETED');
console.log(`✔ Passed: 100% progress triggered '${motivation.state}'`);

// Test 6: Today's Focus Task Logic
console.log("Test 6: Today's Focus Task prioritization...");
const focus = motivationService.getTodayFocus(tasks);
assert.strictEqual(focus.task.name, 'Train model', 'Should prioritize incomplete high priority task');
assert.strictEqual(focus.priorityRank, 4);
console.log(`✔ Passed: Today's focus identified '${focus.task.name}' (${focus.reason})`);

// Test 7: Next Step Recommendations
console.log('Test 7: Next Step Recommendation logic...');
const nextStep = motivationService.getNextRecommendedAction(project, tasks, [], [], null, progress);
assert(nextStep.title, 'Next step title must exist');
console.log(`✔ Passed: Recommended '${nextStep.title}' -> ${nextStep.action}`);

// Test 8: Project Health Calculation
console.log('Test 8: Project Health calculation...');
const healthHealthy = motivationService.calculateProjectHealth(tasks, [], [], [], 50);
assert.strictEqual(healthHealthy.status, 'Healthy');
assert(healthHealthy.score >= 80);

const healthAtRisk = motivationService.calculateProjectHealth(tasks, [{ id: '1' }, { id: '2' }], [], [{ severity: 'Critical' }, { severity: 'High' }], 20);
assert.strictEqual(healthAtRisk.status, 'At Risk');
console.log(`✔ Passed: Health correctly computed '${healthHealthy.status}' and '${healthAtRisk.status}'`);

// Test 9: 6-Stage Project Roadmap
console.log('Test 9: 6-Stage Academic Project Roadmap...');
const roadmap = motivationService.getProjectRoadmap(project, tasks, [], null, 50);
assert.strictEqual(roadmap.length, 6, 'Roadmap must contain 6 academic stages');
assert.strictEqual(roadmap[0].name, 'Idea & Proposal');
assert.strictEqual(roadmap[0].status, 'Completed');
assert.strictEqual(roadmap[2].name, 'Development');
assert.strictEqual(roadmap[2].status, 'Current');
console.log('✔ Passed: 6-stage roadmap generated with correct status progression');

// Test 10: Earned Achievements
console.log('Test 10: Earned Achievements...');
const achievements = motivationService.getEarnedAchievements(project, tasks, [], 50);
assert(achievements.some(a => a.id === 'proj_init'), 'Should earn Project Initiator');
assert(achievements.some(a => a.id === 'first_task'), 'Should earn First Sprint Complete');
assert(achievements.some(a => a.id === 'halfway_mark'), 'Should earn Midpoint Milestone');
console.log(`✔ Passed: Correctly unlocked ${achievements.length} verified achievements`);

console.log('\n======================================================');
console.log('ALL AUTH & MOTIVATIONAL SYSTEM TESTS PASSED (100%)!');
console.log('======================================================');
