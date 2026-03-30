import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings2, Coffee, Brain } from 'lucide-react';
import { PomodoroSettings } from '../types';

interface Props {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: PomodoroSettings) => void;
}

type Mode = 'work' | 'short' | 'long';

export function PomodoroTimer({ settings, onUpdateSettings }: Props) {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Optional: Add sound notification here
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    resetTimer(mode);
  }, [settings, mode]);

  const resetTimer = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'work') setTimeLeft(settings.workDuration * 60);
    else if (newMode === 'short') setTimeLeft(settings.shortBreakDuration * 60);
    else if (newMode === 'long') setTimeLeft(settings.longBreakDuration * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = () => {
    const total = mode === 'work' ? settings.workDuration * 60 : 
                  mode === 'short' ? settings.shortBreakDuration * 60 : 
                  settings.longBreakDuration * 60;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#151619] rounded-[32px] shadow-2xl border border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: settings.color }}
      />

      <div className="relative z-10 w-full max-w-xs space-y-8">
        {/* Mode Selector */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
          {(['work', 'short', 'long'] as const).map((m) => (
            <button
              key={m}
              onClick={() => resetTimer(m)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                mode === m ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {m === 'work' ? 'Focus' : m === 'short' ? 'Short' : 'Long'}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative flex items-center justify-center aspect-square">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="fill-none stroke-white/5 stroke-[4]"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="fill-none stroke-[6] transition-all duration-1000 ease-linear"
              style={{ 
                stroke: settings.color,
                strokeDasharray: '283%',
                strokeDashoffset: `${283 - (283 * progress()) / 100}%`,
                strokeLinecap: 'round'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-light tracking-tighter text-white font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-2">
              {mode === 'work' ? 'Stay Focused' : 'Take a Break'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <Settings2 size={20} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg"
            style={{ 
              backgroundColor: settings.color,
              boxShadow: `0 0 30px ${settings.color}40`
            }}
          >
            {isActive ? <Pause size={32} className="text-white" fill="white" /> : <Play size={32} className="text-white ml-1" fill="white" />}
          </button>

          <button 
            onClick={() => resetTimer(mode)}
            className="p-4 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Focus</label>
                <input 
                  type="number" 
                  value={settings.workDuration}
                  onChange={(e) => onUpdateSettings({ ...settings, workDuration: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Short</label>
                <input 
                  type="number" 
                  value={settings.shortBreakDuration}
                  onChange={(e) => onUpdateSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Long</label>
                <input 
                  type="number" 
                  value={settings.longBreakDuration}
                  onChange={(e) => onUpdateSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Theme Color</label>
              <div className="flex gap-3 justify-between">
                {['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'].map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateSettings({ ...settings, color: c })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      settings.color === c ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
