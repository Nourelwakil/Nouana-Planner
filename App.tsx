import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Logo } from './components/Logo';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
               <Logo className="h-8 w-auto" />
                <div className="ml-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        Nouana Planner
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic -mt-1">Plan smart. Study strong.</p>
                </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Dashboard />
      </main>
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Nouana Planner. Plan smart. Study strong.</p>
      </footer>
    </div>
  );
}

export default App;