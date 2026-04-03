import React, { useEffect, useState } from 'react';
import Camera from '../Images/Camera.png';
import Clock from '../Images/Clock.png';
import AddClass from './AddClass';
import { NavLink, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse border-4 border-slate-200 bg-slate-100 ${className}`} />;
}

function fmtTime(mins) {
  if (typeof mins !== "number") return "";
  return `${Math.floor(mins / 60)}:${mins % 60 === 0 ? "00" : String(mins % 60).padStart(2, "0")}`;
}

function statusStyle(status = "") {
  const s = status.toLowerCase();
  if (s === "live" || s === "ongoing") return "bg-red-400 text-slate-900 border-slate-900";
  if (s === "upcoming")                return "bg-sky-300 text-slate-900 border-slate-900";
  if (s === "completed" || s === "done") return "bg-lime-400 text-slate-900 border-slate-900";
  return "bg-slate-300 text-slate-900 border-slate-900";
}

function TeacherClasses() {
    const [showPopup, setShowPopup] = useState(false);
    const { ID } = useParams();
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`/api/course/classes/teacher/${ID}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error('Failed to fetch data');
                const user = await response.json();
                setData(user.data.classes[0]?.liveClasses || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [showPopup, ID]);

    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    const weeklyClasses = data.filter((clas) => {
      if(!clas.date) return false;
      const classDate = new Date(clas.date.slice(0, 10));
      return classDate >= today && classDate <= oneWeekFromNow;
    });

    const nextClass = data[0]; // first item = soonest class

    return (
        <div className="w-full flex-1 flex flex-col font-sans">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
               <div className="flex items-center gap-4">
                  <span className="text-5xl drop-shadow-[4px_4px_0px_#0f172a]">📅</span>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase" style={{ textShadow: '2px 2px 0px #fff' }}>
                     Teaching Schedule
                  </h1>
               </div>
               <motion.button 
                  whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #0f172a" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPopup(true)} 
                  className="bg-yellow-400 text-slate-900 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] px-6 py-3 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 w-fit cursor-pointer"
               >
                  <span className="text-xl">+</span> Add Class
               </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Weekly List */}
              <motion.div 
                 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                 className="lg:col-span-2 flex flex-col h-full"
              >
                <div className="bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden flex flex-col flex-1 min-h-[400px]">
                  <div className="bg-sky-200 px-6 py-4 border-b-4 border-slate-900 flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">🗓 This Week's Roster</h2>
                    <span className="bg-white text-slate-900 text-sm font-black px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                      {weeklyClasses.length} {weeklyClasses.length === 1 ? 'Class' : 'Classes'}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
                    {loading && (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-4 items-center p-4">
                             <Skeleton className="w-14 h-14 rounded-xl" />
                             <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/3" />
                             </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {error && (
                      <div className="m-4 bg-red-200 border-4 border-red-500 rounded-xl p-4 font-bold text-red-700">
                         ⚠ {error}
                      </div>
                    )}

                    {!loading && !error && weeklyClasses.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-12 opacity-70">
                        <span className="text-6xl mb-4 grayscale">📭</span>
                        <p className="font-black text-slate-500 text-xl text-center">No classes scheduled this week.</p>
                      </div>
                    )}

                    {!loading && weeklyClasses.map((clas, idx) => (
                      <motion.div
                        key={clas.timing + idx}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="bg-slate-50 flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] hover:bg-yellow-50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl bg-purple-300 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black text-2xl flex-shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
                          {(clas.coursename ?? "?")[0].toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-black text-slate-900 truncate uppercase mt-1">
                            {clas.coursename}
                          </p>
                          <p className="text-sm font-bold text-slate-600 truncate mb-1">
                            {clas.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="bg-white border-2 border-slate-900 px-2 py-0.5 rounded font-bold text-xs text-slate-700">
                               {clas.date?.slice(0, 10)}
                            </span>
                            <span className="bg-sky-200 border-2 border-slate-900 px-2 py-0.5 rounded font-black text-xs uppercase tracking-widest text-slate-900">
                               {fmtTime(clas.timing)}
                            </span>
                          </div>
                        </div>

                        <span className={`text-xs font-black uppercase tracking-widest border-2 px-3 py-1.5 rounded-lg shadow-sm w-fit md:w-auto ${statusStyle(clas.status)}`}>
                          {clas.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Next Class Card */}
              <motion.div 
                 initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                 className="flex flex-col gap-8 h-full"
              >
                {loading ? (
                   <Skeleton className="h-64 rounded-[2rem] border-4 border-slate-900" />
                ) : nextClass ? (
                  <NavLink to={nextClass.link} target="_blank" className="block focus:outline-none">
                    <motion.div
                      whileHover={{ y: -6, boxShadow: "12px 12px 0px 0px #0f172a" }}
                      className="bg-lime-300 rounded-[2.5rem] border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_#0f172a] flex flex-col gap-6 relative overflow-hidden group h-full"
                    >
                      <div className="absolute top-6 right-6 text-4xl transform group-hover:rotate-12 transition-transform drop-shadow-[2px_2px_0px_#0f172a]">
                         🚀
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest bg-white border-2 border-slate-900 px-3 py-1 rounded-lg inline-block shadow-[2px_2px_0px_0px_#0f172a] mb-4 text-slate-900">
                            Upcoming Live
                         </p>
                         <h3 className="text-4xl font-black text-slate-900 leading-tight uppercase">
                            {nextClass.coursename}
                         </h3>
                         <p className="font-bold text-slate-700 mt-2 line-clamp-2 pr-10">
                            {nextClass.title}
                         </p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mt-auto">
                         <div className="flex items-center justify-between">
                           <span className="font-black text-xl text-purple-600">{fmtTime(nextClass.timing)}</span>
                           <span className="font-bold text-sm bg-slate-100 text-slate-900 px-2 py-1 rounded-md border-2 border-slate-900 shadow-sm">{typeof nextClass.date === "string" ? nextClass.date.slice(0, 10) : ""}</span>
                         </div>
                      </div>

                      <div className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-center py-4 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] group-hover:bg-slate-800 transition-colors">
                         Start Class
                      </div>
                    </motion.div>
                  </NavLink>
                ) : (
                  <div className="bg-slate-100 border-4 border-slate-900 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                     <span className="text-6xl mb-4 grayscale drop-shadow-[4px_4px_0px_#0f172a]">🎉</span>
                     <p className="text-2xl font-black text-slate-900">No scheduled classes!</p>
                     <p className="font-bold text-slate-500 mt-2">Enjoy your free time.</p>
                  </div>
                )}
              </motion.div>

            </div>

            {showPopup && <AddClass onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default TeacherClasses;
