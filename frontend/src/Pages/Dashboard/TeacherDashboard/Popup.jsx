import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/api';
function Popup({ onClose, subject }) {
  const [desc, setDesc] = useState('');
  const { ID } = useParams();
  const dateGap = 3; // 3 hours

  const [day, setDay] = useState({
    sun: false, mon: false, tue: false,
    wed: false, thu: false, fri: false, sat: false,
  });

  const [dayValue, setDayValue] = useState({
    sun: '', mon: '', tue: '',
    wed: '', thu: '', fri: '', sat: '',
  });

  const dayIndex = {
    sun: 0, mon: 1, tue: 2,
    wed: 3, thu: 4, fri: 5, sat: 6,
  };

  const handleCheckboxChange = (dayName) => {
    setDay((prevDay) => ({ ...prevDay, [dayName]: !prevDay[dayName] }));
  };

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const addCourse = async () => {
    const selectedDays = Object.keys(day)
      .filter((d) => day[d])
      .map((d) => ({
        day: dayIndex[d],
        starttime: dayValue[d] ? convertTimeToMinutes(dayValue[d]) : null,
        endtime: dayValue[d] ? convertTimeToMinutes(dayValue[d]) + dateGap * 60 : null,
      }));

    const hasMissingTime = selectedDays.some((d) => d.starttime === null);

    if (hasMissingTime) {
      alert('Please fill in the time for all selected days.');
      return;
    }

    const invalidTimeRange = selectedDays.some((d) => {
      const startTime = d.starttime;
      const endTime = d.endtime;
      if (startTime >= endTime) {
        alert('Start time must be earlier than end time.');
        return true;
      }
      if ((endTime - startTime) > 3 * 60) {
        alert('End time should not be more than 3 hours after start time.');
        return true;
      }
      return false;
    });

    if (invalidTimeRange) return;
    if (desc === '') { alert('Fill the description.'); return; }
    if (selectedDays.length === 0){ alert('Please select at least one day and time.'); return; }

    onClose();

    const data = {
      coursename: subject.toLowerCase(),
      description: desc,
      schedule: selectedDays,
    };

    try {
       const response = await fetch(`${api}/api/course/${subject}/create/${ID}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
       const responseData = await response.json();
       alert(responseData.message);
    } catch(err) {
       console.log(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 overflow-y-auto'
      >
        <motion.div 
           initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 25 }}
           className='w-full max-w-2xl bg-amber-300 text-slate-900 rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] my-8 h-auto flex flex-col'
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 relative rounded-t-[2rem]">
             <button onClick={onClose} className='absolute top-6 right-6 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-red-400 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]'>✕</button>
             <span className="bg-lime-400 text-slate-900 font-black tracking-widest uppercase px-3 py-1 text-xs rounded-lg border-2 border-slate-900 shadow-sm inline-block mb-3">Course Builder</span>
             <h2 className="text-4xl font-black text-white tracking-tighter capitalize flex items-center gap-3">
                {subject} <span className="text-3xl">📚</span>
             </h2>
          </div>

          {/* Form Content */}
          <div className='p-6 md:p-8 space-y-6 flex-1 bg-white/50 rounded-b-[2rem]'>

            <div className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Subject Name</label>
              <input 
                type="text" 
                className='w-full text-lg font-bold text-slate-500 bg-slate-100 p-3 rounded-xl border-4 border-slate-900 cursor-not-allowed uppercase tracking-widest'
                value={subject} 
                readOnly 
              />
            </div>

            <div className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-4">Class Schedule (3 hr blocks)</label>
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(day).map((d) => {
                  const isActive = day[d];
                  return (
                    <div key={d} className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border-2 transition-all ${isActive ? 'bg-sky-100 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : 'bg-slate-50 border-slate-300'}`}>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <input
                          type='checkbox'
                          className="w-6 h-6 border-2 border-slate-900 rounded accent-slate-900 cursor-pointer"
                          checked={isActive}
                          onChange={() => handleCheckboxChange(d)}
                        />
                        <label className={`font-black uppercase tracking-widest text-lg cursor-pointer ${isActive ? 'text-slate-900' : 'text-slate-400'}`} onClick={() => handleCheckboxChange(d)}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </label>
                      </div>

                      <div className={`flex flex-row items-center gap-2 ${isActive ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <input
                          className='w-[100px] text-center font-bold text-slate-900 bg-white p-2 rounded-lg border-2 border-slate-900 focus:outline-none focus:bg-yellow-50'
                          type='time'
                          value={dayValue[d]}
                          onChange={(e) => setDayValue({ ...dayValue, [d]: e.target.value })}
                        />
                        <span className="font-black text-slate-400">-</span>
                        <input
                          className='w-[100px] text-center font-bold text-slate-500 bg-slate-100 p-2 rounded-lg border-2 border-slate-300 outline-none cursor-not-allowed'
                          type='time'
                          readOnly
                          value={dayValue[d] ? convertMinutesToTime(convertTimeToMinutes(dayValue[d]) + dateGap * 60) : ''}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Subject Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What will students learn?"
                className='w-full text-lg font-bold text-slate-900 bg-slate-100 p-4 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all resize-none h-24'
              ></textarea>
            </div>

            <div className='flex justify-end pt-2 pb-2'>
              <motion.button 
                 whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px #0f172a" }}
                 whileTap={{ scale: 0.95 }}
                 onClick={addCourse} 
                 className='w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-white px-10 border-4 border-slate-900 py-4 shadow-[4px_4px_0px_0px_#0f172a] rounded-xl font-black text-xl uppercase tracking-widest transition-colors cursor-pointer'
              >
                 Create Course ✨
              </motion.button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Popup;
