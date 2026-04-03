import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { motion } from "framer-motion";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse border-4 border-slate-200 bg-slate-100 ${className}`} />;
}

/** Convert minutes-since-midnight → "H:MM" */
function fmtTime(mins) {
  if (typeof mins !== "number") return "";
  return `${Math.floor(mins / 60)}:${mins % 60 === 0 ? "00" : String(mins % 60).padStart(2, "0")}`;
}

/** Status badge styling */
function statusStyle(status = "") {
  const s = status.toLowerCase();
  if (s === "live" || s === "ongoing") return "bg-red-400 text-slate-900 border-slate-900";
  if (s === "upcoming")                return "bg-sky-300 text-slate-900 border-slate-900";
  if (s === "completed" || s === "done") return "bg-lime-400 text-slate-900 border-slate-900";
  return "bg-slate-300 text-slate-900 border-slate-900";
}

export default function StudentClasses() {
  const { ID } = useParams();
  const [data, setdata]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/classes/student/${ID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const user = await response.json();
        setdata(user.data.classes[0]?.liveClasses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [ID]);

  // ── filter: next 7 days ───────────────────────────────────────────────────
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
    <div className="p-8 w-full max-w-7xl mx-auto text-slate-900 h-full">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex gap-4 items-center mb-8">
        <span className="text-5xl drop-shadow-[4px_4px_0px_#0f172a]">📅</span>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase" style={{ textShadow: '4px 4px 0px #0f172a, -1px -1px 0 #0f172a, 1px -1px 0 #0f172a, -1px 1px 0 #0f172a, 1px 1px 0 #0f172a' }}>
          Weekly Schedule
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: schedule list ── */}
        <motion.div 
           initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
           className="lg:col-span-2 flex flex-col h-full"
        >
          <div className="bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden flex flex-col flex-1 h-full min-h-[400px]">
            {/* Header */}
            <div className="bg-sky-200 px-6 py-4 border-b-4 border-slate-900 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-widest">🗓 Upcoming this week</h2>
              <span className="bg-white text-slate-900 text-sm font-black px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                {weeklyClasses.length} {weeklyClasses.length === 1 ? 'Class' : 'Classes'}
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    <p className="text-lg font-black text-slate-900 truncate">
                      {clas.coursename}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-white border-2 border-slate-900 px-2 py-0.5 rounded font-bold text-xs">
                         {clas.date?.slice(0, 10)}
                      </span>
                      <span className="bg-sky-200 border-2 border-slate-900 px-2 py-0.5 rounded font-bold text-xs uppercase tracking-widest">
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

        {/* ── Right: next class card & stats ── */}
        <motion.div 
           initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
           className="flex flex-col gap-8 h-full"
        >
          {loading ? (
             <Skeleton className="h-64 rounded-[2rem] border-4 border-slate-200" />
          ) : nextClass ? (
            <NavLink to={nextClass.link} target="_blank" className="block focus:outline-none">
              <motion.div
                whileHover={{ y: -6, boxShadow: "12px 12px 0px 0px #0f172a" }}
                className="bg-lime-300 rounded-[2.5rem] border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_#0f172a] flex flex-col gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-6 right-6 text-4xl transform group-hover:rotate-12 transition-transform drop-shadow-[2px_2px_0px_#0f172a]">
                   🚀
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest bg-white border-2 border-slate-900 px-3 py-1 rounded inline-block shadow-[2px_2px_0px_0px_#0f172a] mb-4">
                      Next Up
                   </p>
                   <h3 className="text-4xl font-black text-slate-900 leading-tight">
                      {nextClass.coursename}
                   </h3>
                   <p className="font-bold text-slate-700 mt-2 line-clamp-2 pr-10">
                      {nextClass.title}
                   </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mt-auto">
                   <div className="flex items-center justify-between">
                     <span className="font-black text-xl text-purple-600">{fmtTime(nextClass.timing)}</span>
                     <span className="font-bold text-sm bg-slate-100 px-2 rounded-md border-2 border-slate-900">{typeof nextClass.date === "string" ? nextClass.date.slice(0, 10) : ""}</span>
                   </div>
                </div>

                <div className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-center py-4 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] group-hover:bg-slate-800">
                   Join Class
                </div>
              </motion.div>
            </NavLink>
          ) : (
            <div className="bg-slate-100 border-4 border-slate-900 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] p-8 text-center flex flex-col items-center justify-center">
               <span className="text-6xl mb-4 grayscale drop-shadow-[4px_4px_0px_#0f172a]">🎉</span>
               <p className="text-2xl font-black text-slate-900">No upcoming classes</p>
               <p className="font-bold text-slate-500 mt-2">Time to relax!</p>
            </div>
          )}

          {/* Quick stats */}
          <div className="bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] p-6 pb-2 h-full flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-widest border-b-4 border-slate-900 pb-3 mb-4">Stats</h3>
            <div className="space-y-4 flex-1">
               {[
                 { label: "Total classes", value: weeklyClasses.length, bg: "bg-sky-200" },
                 {
                   label: "Completed",
                   value: weeklyClasses.filter(c => ["completed","done"].includes((c.status??"").toLowerCase())).length,
                   bg: "bg-lime-200",
                 },
                 {
                   label: "Upcoming",
                   value: weeklyClasses.filter(c => (c.status??"").toLowerCase() === "upcoming").length,
                   bg: "bg-yellow-200",
                 },
               ].map((s) => (
                 <div key={s.label} className="flex justify-between items-center p-3 rounded-xl border-2 border-slate-900 bg-slate-50">
                    <span className="font-bold text-slate-600 uppercase text-xs tracking-wider">{s.label}</span>
                    <span className={`font-black text-lg px-3 py-1 rounded shadow-sm border-2 border-slate-900 ${s.bg}`}>
                      {s.value}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}