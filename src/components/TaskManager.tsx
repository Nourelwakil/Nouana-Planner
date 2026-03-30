import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, AlertCircle } from 'lucide-react';
import { Task, Course } from '../types';

interface Props {
  tasks: Task[];
  courses: Course[];
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskManager({ tasks, courses, onAdd, onToggle, onDelete }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'not-started' | 'in-progress' | 'done'>('not-started');
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  const [scheduledDate, setScheduledDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) return;
    onAdd({ 
      title, 
      description, 
      courseId, 
      deadline, 
      scheduledDate: scheduledDate || deadline,
      priority, 
      status, 
      estimatedHours, 
      urgent, 
      important 
    });
    setTitle('');
    setDescription('');
    setDeadline('');
    setScheduledDate('');
    setEstimatedHours(1);
    setStatus('not-started');
    setUrgent(false);
    setImportant(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-4 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment title..."
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details..."
            rows={2}
            className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Schedule For</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Est. Hours</label>
            <input
              type="number"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  priority === p 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' 
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-[var(--border-color)] bg-[var(--bg-primary)]"
              />
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Urgent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-[var(--border-color)] bg-[var(--bg-primary)]"
              />
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Important</span>
            </label>
          </div>

          <button
            type="submit"
            className="ml-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {tasks.map((task) => {
          const course = courses.find(c => c.id === task.courseId);
          return (
            <div
              key={task.id}
              className={`p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm transition-all relative overflow-hidden group ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full" 
                style={{ backgroundColor: course?.color || '#eee' }}
              />
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggle(task.id)}
                  className="mt-1 text-indigo-600 hover:scale-110 transition-transform"
                >
                  {task.completed || task.status === 'done' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold truncate ${task.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                      task.status === 'done' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      task.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                      'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    {course && (
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        {course.name}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                      <AlertCircle size={12} />
                      {task.estimatedHours}h
                    </div>
                    {task.deadline && (
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        Due: {task.deadline}
                      </span>
                    )}
                    {(task.urgent || task.important) && (
                      <div className="flex gap-1">
                        {task.urgent && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                        {task.important && <span className="w-2 h-2 rounded-full bg-red-500" />}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
