import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Assignment, Course, Status } from '../types';

interface PomodoroTimerProps {
  assignments: Assignment[];
  courses: Course[];
  onSessionComplete: (session: { assignmentId: string | null; minutes: number }) => void;
}

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const DEFAULT_TIMES_IN_MINUTES = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

const MODE_LABELS: Record<Mode, string> = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

// --- Timer Style Definitions ---
const timerStyles = [
  { name: 'Classic', ringBg: 'text-gray-200 dark:text-gray-700', text: 'text-gray-800 dark:text-gray-200', modes: { pomodoro: { ringFg: 'text-red-500', button: 'bg-red-500' }, shortBreak: { ringFg: 'text-blue-500', button: 'bg-blue-500' }, longBreak: { ringFg: 'text-green-500', button: 'bg-green-500' }}},
  { name: 'Ocean', ringBg: 'text-cyan-100 dark:text-cyan-900', text: 'text-cyan-800 dark:text-cyan-200', modes: { pomodoro: { ringFg: 'text-cyan-500', button: 'bg-cyan-500' }, shortBreak: { ringFg: 'text-teal-400', button: 'bg-teal-400' }, longBreak: { ringFg: 'text-sky-500', button: 'bg-sky-500' }}},
  { name: 'Forest', ringBg: 'text-green-200 dark:text-green-800', text: 'text-green-900 dark:text-green-100', modes: { pomodoro: { ringFg: 'text-green-600', button: 'bg-green-600' }, shortBreak: { ringFg: 'text-lime-500', button: 'bg-lime-500' }, longBreak: { ringFg: 'text-emerald-500', button: 'bg-emerald-500' }}},
  { name: 'Sunset', ringBg: 'text-orange-100 dark:text-orange-900', text: 'text-orange-900 dark:text-orange-100', modes: { pomodoro: { ringFg: 'text-orange-500', button: 'bg-orange-500' }, shortBreak: { ringFg: 'text-amber-500', button: 'bg-amber-500' }, longBreak: { ringFg: 'text-yellow-400', button: 'bg-yellow-400' }}},
  { name: 'Royal', ringBg: 'text-purple-200 dark:text-purple-900', text: 'text-purple-900 dark:text-purple-100', modes: { pomodoro: { ringFg: 'text-purple-600', button: 'bg-purple-600' }, shortBreak: { ringFg: 'text-violet-500', button: 'bg-violet-500' }, longBreak: { ringFg: 'text-fuchsia-500', button: 'bg-fuchsia-500' }}},
  { name: 'Mono', ringBg: 'text-gray-200 dark:text-gray-700', text: 'text-gray-800 dark:text-gray-200', modes: { pomodoro: { ringFg: 'text-gray-800 dark:text-gray-200', button: 'bg-gray-800 dark:bg-gray-200 dark:text-black' }, shortBreak: { ringFg: 'text-gray-600 dark:text-gray-400', button: 'bg-gray-600 dark:bg-gray-400 dark:text-black' }, longBreak: { ringFg: 'text-gray-500 dark:text-gray-500', button: 'bg-gray-500 dark:bg-gray-500' }}},
  { name: 'Strawberry', ringBg: 'text-red-100 dark:text-red-900', text: 'text-red-900 dark:text-red-100', modes: { pomodoro: { ringFg: 'text-red-500', button: 'bg-red-500' }, shortBreak: { ringFg: 'text-pink-400', button: 'bg-pink-400' }, longBreak: { ringFg: 'text-rose-400', button: 'bg-rose-400' }}},
  { name: 'Mint', ringBg: 'text-emerald-100 dark:text-emerald-900', text: 'text-emerald-900 dark:text-emerald-100', modes: { pomodoro: { ringFg: 'text-emerald-500', button: 'bg-emerald-500' }, shortBreak: { ringFg: 'text-teal-500', button: 'bg-teal-500' }, longBreak: { ringFg: 'text-cyan-500', button: 'bg-cyan-500' }}},
  { name: 'Lavender', ringBg: 'text-violet-100 dark:text-violet-900', text: 'text-violet-900 dark:text-violet-100', modes: { pomodoro: { ringFg: 'text-violet-500', button: 'bg-violet-500' }, shortBreak: { ringFg: 'text-purple-500', button: 'bg-purple-500' }, longBreak: { ringFg: 'text-fuchsia-500', button: 'bg-fuchsia-500' }}},
  { name: 'Peach', ringBg: 'text-amber-100 dark:text-amber-900', text: 'text-amber-900 dark:text-amber-100', modes: { pomodoro: { ringFg: 'text-amber-500', button: 'bg-amber-500' }, shortBreak: { ringFg: 'text-orange-400', button: 'bg-orange-400' }, longBreak: { ringFg: 'text-yellow-500', button: 'bg-yellow-500' }}},
  { name: 'Steel', ringBg: 'text-slate-200 dark:text-slate-700', text: 'text-slate-800 dark:text-slate-200', modes: { pomodoro: { ringFg: 'text-slate-500', button: 'bg-slate-500' }, shortBreak: { ringFg: 'text-gray-500', button: 'bg-gray-500' }, longBreak: { ringFg: 'text-zinc-500', button: 'bg-zinc-500' }}},
  { name: 'Coffee', ringBg: 'text-stone-200 dark:text-stone-800', text: 'text-stone-900 dark:text-stone-100', modes: { pomodoro: { ringFg: 'text-stone-600', button: 'bg-stone-600' }, shortBreak: { ringFg: 'text-amber-700', button: 'bg-amber-700' }, longBreak: { ringFg: 'text-yellow-800', button: 'bg-yellow-800' }}},
  { name: 'Retro', ringBg: 'text-teal-200', text: 'text-pink-800', modes: { pomodoro: { ringFg: 'text-pink-500', button: 'bg-pink-500' }, shortBreak: { ringFg: 'text-cyan-400', button: 'bg-cyan-400' }, longBreak: { ringFg: 'text-yellow-500', button: 'bg-yellow-500' }}},
  { name: 'Neon', ringBg: 'text-gray-700', text: 'text-lime-300', modes: { pomodoro: { ringFg: 'text-lime-400', button: 'bg-lime-400 text-gray-900' }, shortBreak: { ringFg: 'text-cyan-400', button: 'bg-cyan-400 text-gray-900' }, longBreak: { ringFg: 'text-fuchsia-500', button: 'bg-fuchsia-500 text-gray-900' }}},
  { name: 'Gold', ringBg: 'text-yellow-200 dark:text-yellow-800', text: 'text-yellow-900 dark:text-yellow-100', modes: { pomodoro: { ringFg: 'text-yellow-500', button: 'bg-yellow-500' }, shortBreak: { ringFg: 'text-amber-500', button: 'bg-amber-500' }, longBreak: { ringFg: 'text-orange-500', button: 'bg-orange-500' }}},
];


const convertToSeconds = (minutes: Record<string, number>): Record<Mode, number> => ({
    pomodoro: minutes.pomodoro * 60,
    shortBreak: minutes.shortBreak * 60,
    longBreak: minutes.longBreak * 60,
});


export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ assignments, courses, onSessionComplete }) => {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [customTimes, setCustomTimes] = useState<Record<Mode, number>>(convertToSeconds(DEFAULT_TIMES_IN_MINUTES));
  const [timeLefts, setTimeLefts] = useState<Record<Mode, number>>(customTimes);
  const [isActive, setIsActive] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempTimesInMinutes, setTempTimesInMinutes] = useState(DEFAULT_TIMES_IN_MINUTES);
  const [notificationPermission, setNotificationPermission] = useState('default');
  
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const timeLeft = timeLefts[mode];

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  const showNotification = useCallback((modeThatEnded: Mode) => {
    if (notificationPermission !== 'granted') return;

    let title = '';
    let body = '';
    if (modeThatEnded === 'pomodoro') {
        title = "Pomodoro Finished!";
        body = "Time for a break. Great work!";
    } else {
        title = "Break Over!";
        body = "Time to get back to it!";
    }
    
    new Notification(title, { body, icon: '/icon.svg' });
  }, [notificationPermission]);

  const switchMode = useCallback((newMode: Mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setMode(newMode);
  }, []);


  const handleModeSwitch = (newMode: Mode) => {
    if (isActive) return; // Don't switch while active
    switchMode(newMode);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLefts(prev => ({ ...prev, [mode]: prev[mode] - 1 }));
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if(audioRef.current) audioRef.current.play();
      showNotification(mode);
      if (timerRef.current) clearInterval(timerRef.current);
      
      let nextMode: Mode;
      if (mode === 'pomodoro') {
        onSessionComplete({ assignmentId: selectedAssignment, minutes: customTimes.pomodoro / 60 });
        const newCompletedCount = pomodorosCompleted + 1;
        setPomodorosCompleted(newCompletedCount);
        setTimeLefts(prev => ({...prev, pomodoro: customTimes.pomodoro}));
        nextMode = newCompletedCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      } else {
        setTimeLefts(prev => ({...prev, [mode]: customTimes[mode]}));
        nextMode = 'pomodoro';
      }
      switchMode(nextMode);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, onSessionComplete, selectedAssignment, pomodorosCompleted, switchMode, customTimes, showNotification]);
  
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  }, []);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLefts(prev => ({...prev, [mode]: customTimes[mode] }));
  };
  
  const handleSaveSettings = () => {
    const newTimesInSeconds = convertToSeconds(tempTimesInMinutes);
    setCustomTimes(newTimesInSeconds);
    setTimeLefts(newTimesInSeconds); // Reset all timers to new values
    if (isActive) {
      setIsActive(false); // Stop any active timer
    }
    setIsSettingsOpen(false);
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((customTimes[mode] - timeLeft) / customTimes[mode]) * 100;
  
  const currentStyle = timerStyles[selectedStyleIndex];
  const currentModeStyle = currentStyle.modes[mode];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pomodoro Timer</h3>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsStylePanelOpen(!isStylePanelOpen)} disabled={isActive} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-300" title="Change Style">
             <i className={`fa-solid ${isStylePanelOpen ? 'fa-times' : 'fa-palette'}`}></i>
          </button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <i className={`fa-solid ${isSettingsOpen ? 'fa-times' : 'fa-cog'} transition-transform duration-300 ${isSettingsOpen ? 'rotate-90' : ''}`}></i>
          </button>
        </div>
      </div>
      
      <div className={`w-full grid transition-all duration-500 ease-in-out ${isStylePanelOpen ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 text-left mb-2">Timer Styles</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {timerStyles.map((style, index) => (
                       <button
                            key={index}
                            onClick={() => {
                                setSelectedStyleIndex(index);
                                setIsStylePanelOpen(false);
                            }}
                            className={`w-full p-2 rounded-lg flex flex-col items-center space-y-2 transition-all duration-200 transform hover:scale-105 ${selectedStyleIndex === index ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                            <div className="flex -space-x-2">
                                <div className={`w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${style.modes.pomodoro.button}`}></div>
                                <div className={`w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${style.modes.shortBreak.button}`}></div>
                                <div className={`w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${style.modes.longBreak.button}`}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{style.name}</span>
                        </button>
                    ))}
                </div>
             </div>
         </div>
      </div>

      <div className={`w-full grid transition-all duration-500 ease-in-out ${isSettingsOpen ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 text-left">Timer Settings (minutes)</h4>
                <div className="grid grid-cols-3 gap-2">
                    {(['pomodoro', 'shortBreak', 'longBreak'] as Mode[]).map(m => (
                        <div key={m}>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{MODE_LABELS[m]}</label>
                            <input
                                type="number"
                                value={tempTimesInMinutes[m]}
                                onChange={e => setTempTimesInMinutes(p => ({ ...p, [m]: Number(e.target.value)}))}
                                className="w-full p-2 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                        </div>
                    ))}
                </div>
                <button onClick={handleSaveSettings} className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Save Settings
                </button>
            </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {(['pomodoro', 'shortBreak', 'longBreak'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            disabled={isActive}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
              mode === m
                ? `${currentStyle.modes[m].button} text-white`
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className={currentStyle.ringBg} strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={283 - (progress / 100) * 283}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            className={`${currentModeStyle.ringFg} transition-all duration-500`}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className={`text-4xl sm:text-5xl font-bold ${currentStyle.text}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`px-6 sm:px-8 py-3 w-32 sm:w-36 text-base sm:text-lg font-bold rounded-lg text-white transition-all duration-200 transform hover:scale-105 active:scale-100 ${
            isActive ? 'bg-yellow-500 hover:bg-yellow-600' : `${currentModeStyle.button} hover:opacity-90`
          }`}
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>
        <button
            onClick={resetTimer}
            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Reset Timer"
        >
            <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>

       {notificationPermission === 'default' && (
          <div className="w-full mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
              <p className="mb-2">Get an alert when your timer finishes!</p>
              <button onClick={requestNotificationPermission} className="w-full font-semibold bg-white dark:bg-blue-500/50 px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-blue-500/80 transition-colors">
                  Enable Notifications
              </button>
          </div>
        )}
        
      <select
        value={selectedAssignment || ''}
        onChange={(e) => setSelectedAssignment(e.target.value || null)}
        className="w-full mt-4 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Log session (general)</option>
        {courses.map(course => (
          <optgroup key={course.id} label={course.name}>
            {assignments
              .filter(a => a.courseId === course.id && a.status !== Status.Done)
              .map(a => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};