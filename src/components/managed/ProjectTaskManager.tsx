import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectTask } from '../../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  User,
  Calendar,
  Layers,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

export const ProjectTaskManager: React.FC = () => {
  const {
    projectTasks,
    updateTaskStatus,
    createProjectTask,
    users,
    activeBranch,
    setInspectedRecord
  } = useApp();

  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(users[0]?.id || '');
  const [newPriority, setNewPriority] = useState<ProjectTask['priority']>('High');
  const [newDueDate, setNewDueDate] = useState('2026-10-25');
  const [newModuleTag, setNewModuleTag] = useState('Operations');
  const [newDependencyId, setNewDependencyId] = useState('');

  const filteredTasks = projectTasks.filter(task => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const columns: { status: ProjectTask['status']; title: string; color: string; border: string }[] = [
    { status: 'Backlog', title: 'Backlog & Staged', color: 'bg-slate-100 text-slate-800', border: 'border-slate-300' },
    { status: 'In Progress', title: 'In Progress', color: 'bg-blue-50 text-blue-800', border: 'border-blue-300' },
    { status: 'Under Review', title: 'Under Dual Review', color: 'bg-amber-50 text-amber-800', border: 'border-amber-300' },
    { status: 'Completed', title: 'Completed & Audited', color: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-300' }
  ];

  const getPriorityBadge = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Urgent</span>;
      case 'High':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">High</span>;
      case 'Medium':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">Medium</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Low</span>;
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignee = users.find(u => u.id === newAssigneeId) || users[0];

    createProjectTask({
      title: newTitle,
      description: newDescription,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeRole: assignee.role,
      status: 'Backlog',
      priority: newPriority,
      dueDate: newDueDate,
      dependencies: newDependencyId ? [newDependencyId] : [],
      branchId: activeBranch.id,
      moduleTag: newModuleTag
    });

    setNewTitle('');
    setNewDescription('');
    setNewDependencyId('');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Operational Projects & Assignments
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {projectTasks.length} Active Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate cross-functional tasks across Finance, Workshop, Silos, Retail, and Logistics with clear dependencies and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'kanban' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'list' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
          </select>

          {/* New Task Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Main Board View: Kanban or List */}
      {activeView === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="bg-slate-50/70 rounded-xl border border-slate-200 p-3.5 flex flex-col min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{col.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs hover:shadow-xs transition-shadow space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-400">#{task.id}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                              {task.moduleTag}
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>

                        <h4 className="font-semibold text-slate-900 leading-snug">{task.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>

                        {/* Dependencies Check */}
                        {task.dependencies && task.dependencies.length > 0 && (
                          <div className="p-1.5 bg-amber-50 rounded border border-amber-200/60 text-[10px] text-amber-900 flex items-center gap-1 font-mono">
                            <GitBranch className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>Depends on: {task.dependencies.join(', ')}</span>
                          </div>
                        )}

                        {/* Metadata Footer */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1 text-slate-700 font-medium">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[100px]">{task.assigneeName}</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-[10px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                        {/* Status Advancement Button */}
                        <div className="pt-1 flex items-center justify-end gap-1">
                          {col.status === 'Backlog' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'In Progress')}
                              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Start Work</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.status === 'In Progress' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'Under Review')}
                              className="text-[10px] font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Submit Review</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.status === 'Under Review' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'Completed')}
                              className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Approve & Close</span>
                              <CheckCircle2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Task Details</th>
                <th className="px-3 py-3">Module</th>
                <th className="px-3 py-3">Assignee</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-[11px] text-slate-500">{task.description}</p>
                    {task.dependencies.length > 0 && (
                      <span className="text-[10px] text-amber-700 font-mono mt-0.5 inline-block">
                        Depends on: {task.dependencies.join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700">{task.moduleTag}</td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-800">{task.assigneeName}</p>
                    <p className="text-[10px] text-slate-400">{task.assigneeRole}</p>
                  </td>
                  <td className="px-3 py-3">{getPriorityBadge(task.priority)}</td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {task.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-600">{task.dueDate}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={task.status}
                      onChange={e => updateTaskStatus(task.id, e.target.value as any)}
                      className="px-2 py-1 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none"
                    >
                      <option value="Backlog">Backlog</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Operational Task</h3>
            <p className="text-xs text-slate-500 mb-4">
              Assign daily operations, schedule audits, or trigger cross-department work orders.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Calibrate Fuel Pump Island 01 Dispenser"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide explicit operational guidelines..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assignee</label>
                  <select
                    value={newAssigneeId}
                    onChange={e => setNewAssigneeId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Module Area</label>
                  <select
                    value={newModuleTag}
                    onChange={e => setNewModuleTag(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance & Ledger</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Retail & POS">Retail & POS</option>
                    <option value="Peripherals">Hardware Peripherals</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Preceding Dependency (Optional)</label>
                <select
                  value={newDependencyId}
                  onChange={e => setNewDependencyId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-mono text-[11px]"
                >
                  <option value="">No preceding dependency</option>
                  {projectTasks.map(t => (
                    <option key={t.id} value={t.id}>
                      #{t.id} - {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
