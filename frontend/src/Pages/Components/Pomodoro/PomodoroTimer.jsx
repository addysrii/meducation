import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play a sound when timer ends
      try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play();
      } catch(e) {}

      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
        setIsActive(false);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
        setIsActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed bottom-6 left-6 z-[200] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-20 left-0 w-80 bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`${mode === 'focus' ? 'bg-rose-400' : 'bg-emerald-400'} border-b-4 border-slate-900 p-4 flex justify-between items-center transition-colors duration-500`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-4 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] flex justify-center items-center text-xl">
                  {mode === 'focus' ? '🍅' : '☕'}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Pomodoro</h3>
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest opacity-80">
                    {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white border-4 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all flex justify-center items-center text-slate-900 font-black"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-4 gap-2 bg-slate-50 border-b-4 border-slate-900">
                <button 
                  onClick={() => switchMode('focus')}
                  className={`flex-1 py-2 rounded-xl border-2 border-slate-900 font-black uppercase text-xs tracking-widest transition-all ${mode === 'focus' ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#0f172a]' : 'bg-white text-slate-500 hover:bg-slate-200'}`}
                >
                  Focus
                </button>
                <button 
                  onClick={() => switchMode('break')}
                  className={`flex-1 py-2 rounded-xl border-2 border-slate-900 font-black uppercase text-xs tracking-widest transition-all ${mode === 'break' ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#0f172a]' : 'bg-white text-slate-500 hover:bg-slate-200'}`}
                >
                  Break
                </button>
            </div>

            {/* Timer Display */}
            <div className="p-8 flex flex-col items-center relative overflow-hidden bg-white">
                {/* Background Progress */}
                <div 
                    className={`absolute bottom-0 left-0 w-full opacity-20 transition-all duration-1000 ${mode === 'focus' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                    style={{ height: `${progressPercent}%` }}
                ></div>

                <div className="relative z-10 font-black text-7xl text-slate-900 tracking-tighter drop-shadow-sm mb-6">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex gap-4 relative z-10 w-full">
                    <motion.button 
                      whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px #0f172a" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleTimer}
                      className={`flex-1 py-4 border-4 border-slate-900 rounded-xl font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#0f172a] transition-all text-slate-900 ${isActive ? 'bg-amber-300' : (mode === 'focus' ? 'bg-yellow-400' : 'bg-sky-300')}`}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </motion.button>

                    <motion.button 
                      whileHover={{ y: -2, boxShadow: "4px 4px 0px 0px #0f172a" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetTimer}
                      className="w-16 flex-none bg-white border-4 border-slate-900 rounded-xl flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-100"
                    >
                        ↻
                    </motion.button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-rose-400 border-4 border-slate-900 rounded-full flex justify-center items-center shadow-[6px_6px_0px_0px_#0f172a] text-3xl z-50 hover:bg-rose-300 transition-colors"
      >
        {isOpen ? '✕' : '🍅'}
      </motion.button>
    </div>
  );
}
