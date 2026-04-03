import React, { useState } from 'react'
import Popup from './Popup';
import { motion } from 'framer-motion';

const COURSE_SUBJECTS = [
  { name: "Physics", icon: "🌌", bg: "bg-sky-300" },
  { name: "Chemistry", icon: "⚗️", bg: "bg-emerald-300" },
  { name: "Biology", icon: "🧬", bg: "bg-rose-300" },
  { name: "Math", icon: "📐", bg: "bg-violet-300" },
  { name: "Computer", icon: "💻", bg: "bg-amber-300" }
];

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [subject, setSubject] = useState('');

  const crreateCourse = (sub) => {
    setSubject(sub);
    setShowPopup(true);
  }

  return (
    <div className='w-full flex-1 flex flex-col font-sans'>
       
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
         <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-[4px_4px_0px_#0f172a]">📚</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase" style={{ textShadow: '2px 2px 0px #fff' }}>
               Course Catalogs
            </h1>
         </div>
      </motion.div>

      <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-[8px_8px_0px_0px_#0f172a] mb-8">
         <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-2">Create New Course</h2>
         <p className="font-bold text-slate-500 mb-8 max-w-2xl">Select a base subject area from the list below to build your next course. Your course will then appear on your dashboard schedule once students begin enrolling.</p>

         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4'>
            {COURSE_SUBJECTS.map((sub, index) => (
              <motion.div 
                 key={sub.name}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 whileHover={{ y: -6, x: 2, scale: 1.02, boxShadow: "8px 8px 0px 0px #0f172a" }}
                 whileTap={{ scale: 0.95 }}
                 className={`cursor-pointer group flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] ${sub.bg}`}
                 onClick={() => crreateCourse(sub.name)}
              >
                 <div className="w-24 h-24 bg-white border-4 border-slate-900 rounded-[1.5rem] flex items-center justify-center text-6xl mb-6 shadow-[4px_4px_0px_0px_#0f172a] group-hover:-rotate-6 transition-transform origin-bottom duration-300">
                   {sub.icon}
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter bg-white px-4 py-1 rounded-xl border-2 border-slate-900 shadow-sm text-center w-full truncate">
                   {sub.name}
                 </h3>
                 <p className="mt-4 font-bold text-slate-800 uppercase tracking-widest text-xs border-b-2 border-slate-900 group-hover:text-slate-900">Configure Program →</p>
              </motion.div>
            ))}
         </div>
      </div>

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} subject={subject}/>
      )}
    </div>
  );
}

export default TeacherCourses;