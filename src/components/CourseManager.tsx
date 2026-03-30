import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Course } from '../types';

interface Props {
  courses: Course[];
  onAdd: (course: Omit<Course, 'id'>) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}

export function CourseManager({ courses, onAdd, onDelete, onToggleCompletion }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(3);
  const [color, setColor] = useState('#4f46e5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, code, credits, color, completed: false });
    setName('');
    setCode('');
    setCredits(3);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Course Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Calculus I"
                className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MATH101"
                className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 flex gap-2">
              {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              type="submit"
              className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm group relative overflow-hidden transition-all ${course.completed ? 'opacity-60 grayscale bg-gray-50 dark:bg-gray-900/50' : ''}`}
          >
            <div 
              className="absolute top-0 left-0 w-1 h-full" 
              style={{ backgroundColor: course.color }}
            />
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{course.code || 'NO CODE'}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded uppercase tracking-widest">{course.credits} Credits</span>
                </div>
                <h3 className={`font-bold text-[var(--text-primary)] ${course.completed ? 'line-through' : ''}`}>{course.name}</h3>
                {course.completed && (
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onToggleCompletion(course.id)}
                  className={`p-2 rounded-lg transition-all ${course.completed ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-[var(--text-secondary)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                  title={course.completed ? "Mark as Incomplete" : "Mark as Completed"}
                >
                  {course.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Course"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
