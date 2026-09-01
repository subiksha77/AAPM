import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  AlertTriangle,
  FolderPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const TasksPage = () => {
  const navigate = useNavigate();
  const {
    project,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    progress
  } = useProject();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    status: 'To Do'
  });
  const [formError, setFormError] = useState('');

  // Edit Task Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Delete Confirm Dialog State
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filtered tasks calculation
  const filteredTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return tasks.filter((task) => {
      // Search
      const matchSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status
      let matchStatus = true;
      if (statusFilter === 'Overdue') {
        matchStatus = task.status !== 'Completed' && task.deadline && task.deadline < todayStr;
      } else if (statusFilter !== 'All') {
        matchStatus = task.status === statusFilter;
      }

      // Priority
      const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Handle Add Task Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!taskFormData.name.trim()) {
      setFormError('Task Name is required.');
      return;
    }

    addTask(taskFormData);
    setTaskFormData({
      name: '',
      description: '',
      priority: 'Medium',
      deadline: '',
      status: 'To Do'
    });
    setFormError('');
    setIsAddModalOpen(false);
  };

  // Handle Edit Task Open
  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTask.name.trim()) return;

    updateTask(editingTask);
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  if (!project) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Project Required for Task Management"
        description="Please create your academic project before setting up tasks and tracking progress."
        actionText="+ Create Project"
        onAction={() => navigate('/create-project')}
      />
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckSquare size={24} style={{ color: '#2563eb' }} />
            <span>Task Management</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Track academic sprint tasks, deliverables, and measure real progress ({completedCount}/{tasks.length} done · {progress}%).
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Status:
          </span>
          {['All', 'To Do', 'In Progress', 'Completed', 'Overdue'].map((st) => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Priority:
          </span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List / Table */}
      <div className="card">
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <CheckSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.4rem' }}>
              {tasks.length === 0 ? 'No Tasks Created Yet' : 'No Tasks Matching Current Filters'}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              {tasks.length === 0
                ? 'No tasks yet. Add your first task to start measuring project progress.'
                : 'Try adjusting your search keyword or clearing the filters above.'}
            </p>
            {tasks.length === 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                + Add First Task
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '44px' }}></th>
                  <th>Task Name & Description</th>
                  <th style={{ width: '130px' }}>Priority</th>
                  <th style={{ width: '150px' }}>Deadline</th>
                  <th style={{ width: '130px' }}>Status</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  const todayStr = new Date().toISOString().split('T')[0];
                  const isOverdue = !isCompleted && task.deadline && task.deadline < todayStr;

                  return (
                    <tr key={task.id} style={{ backgroundColor: isCompleted ? '#fafafa' : '#ffffff' }}>
                      {/* Checkbox Toggle */}
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isCompleted ? '#16a34a' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.2rem'
                          }}
                          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                        >
                          {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                      </td>

                      {/* Title & Desc */}
                      <td>
                        <div
                          style={{
                            fontWeight: 600,
                            color: isCompleted ? '#64748b' : '#0f172a',
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          {task.name}
                        </div>
                        {task.description && (
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: '#64748b',
                              marginTop: '0.15rem',
                              lineHeight: 1.4
                            }}
                          >
                            {task.description}
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td>
                        <PriorityBadge priority={task.priority} />
                      </td>

                      {/* Deadline */}
                      <td>
                        {task.deadline ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.8rem',
                              color: isOverdue ? '#dc2626' : '#475569',
                              fontWeight: isOverdue ? 600 : 400
                            }}
                          >
                            <Calendar size={13} />
                            <span>
                              {new Date(task.deadline).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            {isOverdue && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: '4px',
                                  marginLeft: '0.2rem'
                                }}
                              >
                                OVERDUE
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>No deadline</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={task.status} />
                      </td>

                      {/* Action buttons */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleEditClick(task)}
                            title="Edit Task"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            style={{ color: '#dc2626' }}
                            onClick={() => setDeleteTargetId(task.id)}
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Task">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">
              Task Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Implement data preprocessing pipeline"
              value={taskFormData.name}
              onChange={(e) => {
                setTaskFormData({ ...taskFormData, name: e.target.value });
                if (formError) setFormError('');
              }}
              autoFocus
            />
            {formError && (
              <div className="form-error">
                <AlertTriangle size={12} />
                <span>{formError}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Detailed technical deliverable, acceptance criteria, or dependencies..."
              value={taskFormData.description}
              onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={taskFormData.priority}
                onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                className="form-input"
                value={taskFormData.deadline}
                onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select
                className="form-select"
                value={taskFormData.status}
                onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              + Add Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      {editingTask && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Task Name</label>
              <input
                type="text"
                className="form-input"
                value={editingTask.name}
                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={editingTask.description || ''}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingTask.deadline || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteTask(deleteTargetId);
        }}
        title="Delete Task?"
        message="Are you sure you want to delete this task? Your project progress calculation will immediately update."
      />
    </div>
  );
};
