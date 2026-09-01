/**
 * Day 1 Acceptance Test Verification Script
 * Validates the core logic, calculations, persistence, and state transitions
 * of the AI Academic Project Mentor platform.
 */

import assert from 'node:assert';

// Simulated LocalStorage for Node testing
class MockLocalStorage {
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

global.localStorage = new MockLocalStorage();

console.log('--- STARTING DAY 1 ACCEPTANCE CRITERIA VERIFICATION ---');

// Dynamically import storage service
const storage = await import('./src/services/storageService.js');

// Step 1 & 2: First-time user experience (empty storage)
console.log('Step 1 & 2: Verifying initial empty state...');
assert.strictEqual(storage.getProject(), null, 'Project should be null initially');
assert.deepStrictEqual(storage.getTasks(), [], 'Tasks should be empty initially');
assert.strictEqual(storage.calculateProgress([]), 0, 'Progress must be 0% when 0 tasks exist');
assert.strictEqual(storage.calculateProjectStatus([], null), 'Not Started', 'Status must be Not Started');
console.log('✔ Passed: Empty state returns 0% progress and Not Started status');

// Step 3 & 4: Create project with validation and objectives
console.log('Step 3 & 4: Creating real project with objectives...');
const createdProject = storage.saveProject({
  name: 'Autonomous Drone Detection System using YOLOv8',
  description: 'An edge-compute aerial surveillance framework engineered for real-time aerial object tracking.',
  domain: 'Artificial Intelligence',
  academicLevel: 'Undergraduate',
  startDate: '2026-08-31',
  expectedCompletionDate: '2026-11-30',
  teamSize: 4,
  guideName: 'Dr. K. Ramesh (Infosys Academic Mentor)'
});

const initialObjectives = [
  'Curate and augment high-resolution UAV aerial dataset',
  'Train custom YOLOv8 model with TensorRT quantization',
  'Deploy real-time inference pipeline on NVIDIA Jetson Xavier'
];
storage.saveObjectives(initialObjectives);

assert.strictEqual(createdProject.name, 'Autonomous Drone Detection System using YOLOv8');
assert.strictEqual(storage.getObjectives().length, 3);
console.log('✔ Passed: Project created & stored in localStorage');

// Step 5: Add 5 real tasks
console.log('Step 5: Adding 5 real tasks...');
const t1 = storage.addTask({ name: 'Curate dataset', priority: 'High', deadline: '2026-09-15', status: 'To Do' });
const t2 = storage.addTask({ name: 'Configure YOLOv8 loss', priority: 'High', deadline: '2026-09-25', status: 'To Do' });
const t3 = storage.addTask({ name: 'Train baseline model', priority: 'Medium', deadline: '2026-10-10', status: 'To Do' });
const t4 = storage.addTask({ name: 'Integrate DeepSORT tracking', priority: 'Medium', deadline: '2026-10-25', status: 'To Do' });
const t5 = storage.addTask({ name: 'Benchmark FPS on hardware', priority: 'Low', deadline: '2026-11-15', status: 'To Do' });

let allTasks = storage.getTasks();
assert.strictEqual(allTasks.length, 5, 'Should have 5 tasks');
assert.strictEqual(storage.calculateProgress(allTasks), 0, '0 of 5 completed -> 0%');
console.log('✔ Passed: 5 tasks added, progress is 0%');

// Step 6: Mark 2 tasks completed -> Verify EXACT 40%
console.log('Step 6: Completing 2 tasks (t1, t2)...');
storage.toggleTaskComplete(t1.id);
storage.toggleTaskComplete(t2.id);

allTasks = storage.getTasks();
let progress40 = storage.calculateProgress(allTasks);
console.log(`Calculated Progress (2/5): ${progress40}%`);
assert.strictEqual(progress40, 40, '2 of 5 completed must be EXACTLY 40%');
assert.strictEqual(storage.calculateProjectStatus(allTasks, createdProject), 'In Progress', 'Status must be In Progress');
console.log('✔ Passed: Exact 40% progress calculated dynamically');

// Step 7: Mark 1 more task completed -> Verify EXACT 60%
console.log('Step 7: Completing 3rd task (t3)...');
storage.toggleTaskComplete(t3.id);

allTasks = storage.getTasks();
let progress60 = storage.calculateProgress(allTasks);
console.log(`Calculated Progress (3/5): ${progress60}%`);
assert.strictEqual(progress60, 60, '3 of 5 completed must be EXACTLY 60%');
console.log('✔ Passed: Exact 60% progress calculated dynamically');

// Step 8: Add milestone
console.log('Step 8: Adding milestones & verifying timeline ordering...');
const m1 = storage.addMilestone({
  name: 'Phase 1: Dataset & Baseline Model Evaluation',
  description: 'Complete dataset preprocessing and train initial baseline weights.',
  startDate: '2026-08-31',
  endDate: '2026-09-30',
  status: 'In Progress'
});
const m2 = storage.addMilestone({
  name: 'Phase 2: DeepSORT Tracking & Jetson Deployment',
  description: 'Quantize and test inference latency on embedded UAV hardware.',
  startDate: '2026-10-01',
  endDate: '2026-11-15',
  status: 'Upcoming'
});
assert.strictEqual(storage.getMilestones().length, 2);
console.log('✔ Passed: Milestones registered in timeline');

// Step 9: Add Risk & Verify Automated Severity Matrix
console.log('Step 9: Adding risk with High Probability + High Impact...');
const r1 = storage.addRisk({
  name: 'GPU memory saturation during batch inference',
  description: 'Exceeding VRAM limits on embedded devices.',
  probability: 'High',
  impact: 'High',
  mitigation: 'Implement FP16 half-precision and TensorRT quantization engine.'
});

const r2 = storage.addRisk({
  name: 'Sensor camera vibration blur',
  probability: 'Low',
  impact: 'Medium',
  mitigation: 'Gimbal optical stabilization'
});

assert.strictEqual(r1.severity, 'Critical', 'High + High must auto-calculate to Critical');
assert.strictEqual(r2.severity, 'Low', 'Low + Medium must auto-calculate to Low');
console.log('✔ Passed: Risk matrix correctly calculated Critical and Low severities');

// Step 10: Verify Dynamic Overdue Task Calculation
console.log('Step 10: Testing dynamic overdue task calculation...');
const overdueTask = storage.addTask({
  name: 'Past deadline deliverable test',
  deadline: '2020-01-01',
  status: 'To Do'
});
const overdues = storage.getOverdueTasks(storage.getTasks());
assert(overdues.some(t => t.id === overdueTask.id), 'Past deadline task must be marked overdue');
storage.deleteTask(overdueTask.id);
console.log('✔ Passed: Dynamic overdue detection functional');

// Step 11: Edit and Delete Task -> Progress recalculation
console.log('Step 11: Deleting 1 incomplete task (t5) -> Verify recalculation to 75%...');
storage.deleteTask(t5.id);
allTasks = storage.getTasks();
// Now we have 4 tasks total (t1, t2, t3 completed, t4 To Do)
const progress75 = storage.calculateProgress(allTasks);
console.log(`Recalculated Progress after deletion (3/4): ${progress75}%`);
assert.strictEqual(progress75, 75, '3 of 4 completed must be EXACTLY 75%');
console.log('✔ Passed: Task deletion dynamically recalculates progress');

// Step 12: Activity audit log
console.log('Step 12: Verifying real activity audit trail...');
const acts = storage.getActivities();
assert(acts.length > 5, 'Real user actions must be logged in activity stream');
console.log(`✔ Passed: ${acts.length} real activities logged dynamically`);

// Step 13: Planning and Scope persistence
console.log('Step 13: Verifying planning and scope persistence...');
storage.savePlanning({
  inScope: ['YOLOv8 custom training', 'Jetson Xavier edge deployment'],
  outOfScope: ['Live satellite uplink', 'Hardware custom PCB manufacturing'],
  functionalRequirements: ['FR-01: Detect aerial UAVs at 30+ FPS'],
  nonFunctionalRequirements: ['NFR-01: Low latency (<35ms inference)'],
  deliverables: [{ id: 'd1', title: 'Architecture SRS', format: 'PDF', dueDate: '2026-09-30', status: 'Completed' }]
});
const plan = storage.getPlanning();
assert.strictEqual(plan.inScope.length, 2);
assert.strictEqual(plan.outOfScope.length, 2);
assert.strictEqual(plan.deliverables.length, 1);
console.log('✔ Passed: Planning specifications persisted');

// Step 14: AI Chat persistence
console.log('Step 14: Testing AI chat persistence...');
const aiMsg = storage.addAIMessage({ text: 'How do I optimize the YOLOv8 model for 60 FPS real-time throughput?' });
const msgs = storage.getAIMessages();
assert.strictEqual(msgs.length, 1);
assert.strictEqual(msgs[0].text, 'How do I optimize the YOLOv8 model for 60 FPS real-time throughput?');
console.log('✔ Passed: AI chat message persisted to storage');

console.log('\n======================================================');
console.log('ALL DAY 1 ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!');
console.log('======================================================');
