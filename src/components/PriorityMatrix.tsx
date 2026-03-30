import React from 'react';
import { AlertCircle, CheckCircle2, Circle, Clock, Trash2, GraduationCap } from 'lucide-react';
import { Task, Course } from '../types';

interface Props {
  tasks: Task[];
  courses: Course[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function PriorityMatrix({ tasks, courses, onToggleTask, onDeleteTask }: Props) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const getPriorityColor = (task: Task) => {
    if (task.urgent && task.important) return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30';
    if (task.important) return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30';
    if (task.urgent) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30';
    return 'text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800';
  };

  const getPriorityLabel = (task: Task) => {
    if (task.urgent && task.important) return 'Critical';
    if (task.important) return 'High Priority';
    if (task.urgent) return 'Urgent';
    return 'Normal';
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border-color)] overflow-hidden shadow-2xl transition-colors duration-300">
      {/* Header */}
      <div className="p-8 border-b border-[var(--border-color)] bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold tracking-tighter text-[var(--text-primary)] uppercase">7-Day Priority Matrix</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">High</span>
            </div>
          </div>
        </div>
        <p className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">
          System Status: {tasks.filter(t => !t.completed).length} Pending Operations
        </p>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-[48px_1.5fr_1fr_1fr_1fr_48px] p-4 bg-[#141414] dark:bg-black text-[#E4E3E0] text-[10px] font-bold uppercase tracking-[0.2em]">
        <div className="text-center">#</div>
        <div>Task Description</div>
        <div>Course</div>
        <div>Deadline</div>
        <div>Priority Level</div>
        <div className="text-center">Act</div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-[var(--border-color)]">
        {sortedTasks.map((task, idx) => {
          const course = courses.find(c => c.id === task.courseId);
          const isOverdue = !task.completed && new Date(task.deadline) < new Date();

          return (
            <div 
              key={task.id} 
              className={`grid grid-cols-[48px_1.5fr_1fr_1fr_1fr_48px] items-center p-4 transition-all duration-200 hover:bg-[#141414] dark:hover:bg-white/5 hover:text-[#E4E3E0] group cursor-pointer ${
                task.completed ? 'opacity-40 grayscale' : ''
              }`}
              onClick={() => onToggleTask(task.id)}
            >
              <div className="text-center font-mono text-xs text-[var(--text-secondary)] opacity-50">
                {(idx + 1).toString().padStart(2, '0')}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  className={`transition-transform group-hover:scale-110 ${task.completed ? 'text-emerald-500' : 'text-[var(--text-secondary)] group-hover:text-white'}`}
                >
                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate text-[var(--text-primary)] group-hover:text-white ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] group-hover:text-white/50 opacity-50 truncate">
                    {task.description || 'No additional parameters'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: course?.color || '#eee' }} />
                <span className="text-xs font-bold truncate text-[var(--text-primary)] group-hover:text-white">{course?.name || 'Unassigned'}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-primary)] group-hover:text-white">
                <Clock size={14} className={isOverdue ? 'text-red-500' : 'text-[var(--text-secondary)] group-hover:text-white/50 opacity-50'} />
                <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
                  {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getPriorityColor(task)}`}>
                  {getPriorityLabel(task)}
                </span>
              </div>

              <div className="text-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto border border-[var(--border-color)]">
              <GraduationCap size={40} className="text-[var(--text-primary)] opacity-20" />
            </div>
            <p className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">
              No tasks detected in current cycle
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
