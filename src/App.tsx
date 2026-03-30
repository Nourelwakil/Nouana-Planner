import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  LogOut,
  GraduationCap,
  Timer,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useFirebase } from './useFirebase';
import { logout } from './firebase';
import { CourseManager } from './components/CourseManager';
import { TaskManager } from './components/TaskManager';
import { ProfileSettings } from './components/ProfileSettings';
import { PriorityMatrix } from './components/PriorityMatrix';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AuthForm } from './components/AuthForm';

type Tab = 'planner' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('planner');
  const { 
    user,
    loading,
    state, 
    addCourse, 
    deleteCourse, 
    addTask, 
    toggleTask, 
    deleteTask,
    toggleCourse,
    updatePomodoroSettings
  } = useFirebase();

  useEffect(() => {
    if (state.pomodoroSettings?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.pomodoroSettings?.theme]);

  const toggleTheme = () => {
    if (state.pomodoroSettings) {
      updatePomodoroSettings({
        ...state.pomodoroSettings,
        theme: state.pomodoroSettings.theme === 'dark' ? 'light' : 'dark'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-indigo-200 dark:shadow-none">
              <GraduationCap size={40} />
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">Nouana Planner</h1>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Master your time. Stay focused. Achieve more.
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const totalCredits = state.courses.reduce((acc, c) => acc + c.credits, 0);
    const completedCredits = state.courses.filter(c => c.completed).reduce((acc, c) => acc + c.credits, 0);
    const progressPercent = totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;

    const getMotivation = (percent: number) => {
      if (percent === 0) return "Every journey begins with a single step. Let's get started!";
      if (percent < 30) return "Great start! You're building momentum.";
      if (percent < 60) return "You're halfway there! Keep pushing, you're doing amazing.";
      if (percent < 90) return "Almost at the finish line! Your hard work is paying off.";
      if (percent === 100) return "Incredible! You've mastered your goals for this cycle. Take a well-deserved rest!";
      return "Keep going, you've got this!";
    };

    switch (activeTab) {
      case 'planner':
        return (
          <div className="space-y-12">
            {/* Dashboard Section */}
            <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] p-10 rounded-[40px] shadow-2xl border border-[var(--border-color)] relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tighter uppercase">Academic Progress</h2>
                  <p className="text-lg text-[var(--text-secondary)] font-serif italic">
                    "{getMotivation(progressPercent)}"
                  </p>
                </div>
                <div className="flex items-center gap-8 justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-60 mb-1">Credits Earned</p>
                    <p className="text-5xl font-light tracking-tighter font-mono">
                      {completedCredits}<span className="text-xl opacity-20 mx-2">/</span>{totalCredits}
                    </p>
                  </div>
                  <div className="w-24 h-24 relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-[var(--border-color)] stroke-[4]" />
                      <circle 
                        cx="50%" cy="50%" r="40%" 
                        className="fill-none stroke-indigo-500 stroke-[6] transition-all duration-1000"
                        style={{ 
                          strokeDasharray: '251%',
                          strokeDashoffset: `${251 - (251 * progressPercent) / 100}%`
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono">
                      {progressPercent}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Matrix & Management */}
              <div className="lg:col-span-8 space-y-12">
                <PriorityMatrix 
                  tasks={state.tasks} 
                  courses={state.courses} 
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                />
                
                <div className="grid grid-cols-1 gap-12">
                  <section className="space-y-6">
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-2">Course Inventory</h3>
                    <CourseManager 
                      courses={state.courses} 
                      onAdd={addCourse} 
                      onDelete={deleteCourse} 
                      onToggleCompletion={toggleCourse}
                    />
                  </section>
                  
                  <section className="space-y-6">
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-2">Task Registry</h3>
                    <TaskManager 
                      tasks={state.tasks} 
                      courses={state.courses} 
                      onAdd={addTask} 
                      onToggle={toggleTask} 
                      onDelete={deleteTask} 
                    />
                  </section>
                </div>
              </div>

              {/* Right Column: Pomodoro */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 space-y-8">
                  <PomodoroTimer 
                    settings={state.pomodoroSettings!} 
                    onUpdateSettings={updatePomodoroSettings} 
                  />
                  
                  <div className="bg-[var(--bg-secondary)] p-8 rounded-[32px] border border-[var(--border-color)] shadow-sm transition-colors duration-300">
                    <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Timer size={16} className="text-indigo-600" /> Session Analytics
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Tasks</p>
                          <p className="text-2xl font-bold text-[var(--text-primary)]">{state.tasks.filter(t => t.completed).length}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Courses</p>
                          <p className="text-2xl font-bold text-[var(--text-primary)]">{state.courses.filter(c => c.completed).length}</p>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return <ProfileSettings user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      {/* Top Profile Bar */}
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('planner')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-[var(--text-primary)]">Nouana Planner</h1>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">Focus Engine</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'planner' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Planner
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--text-secondary)] hover:text-indigo-600 transition-colors"
              title={state.pomodoroSettings?.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {state.pomodoroSettings?.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 p-1 pr-4 rounded-full transition-all border ${
                activeTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white dark:border-gray-800 shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest leading-none mb-0.5">
                  {user.displayName || 'Scholar'}
                </p>
                <p className="text-[8px] text-[var(--text-secondary)] font-mono leading-none">Settings</p>
              </div>
            </button>
            <button 
              onClick={logout}
              className="p-2 text-[var(--text-secondary)] hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {renderContent()}
      </main>
    </div>
  );
}
