import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const COURSE_STYLES = {
  math:      { bg: "bg-violet-300", badge: "bg-violet-400 text-slate-900", icon: "📐" },
  physics:   { bg: "bg-sky-300",    badge: "bg-sky-400 text-slate-900",    icon: "🌌" },
  chemistry: { bg: "bg-emerald-300",badge: "bg-emerald-400 text-slate-900",icon: "⚗️" },
  biology:   { bg: "bg-rose-300",   badge: "bg-rose-400 text-slate-900",   icon: "🧬" },
  computer:  { bg: "bg-amber-300",  badge: "bg-amber-400 text-slate-900",  icon: "💻" },
};

const defaultStyle = { bg: "bg-slate-300", badge: "bg-slate-400 text-slate-900", icon: "📚" };

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl border-4 border-slate-200 bg-slate-100 ${className}`} />;
}

function fmt(m) {
  return `${Math.floor(m / 60)}:${m % 60 === 0 ? "00" : String(m % 60).padStart(2, "0")}`;
}

export default function StudentCourses() {
  const { ID } = useParams();

  const [data, setdata]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [popup, setPopup]         = useState(false);
  const [subDetails, setSubDetails] = useState({});
  const [subD, setSubD]           = useState(null);
  const [searchVal, setSearchVal] = useState("");

  // ── fetch enrolled courses ──────────────────────────────────────────────────
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${api}/api/course/student/${ID}/enrolled`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const user = await response.json();
        setdata(user.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [ID]);

  // ── open popup: fetch full course details ───────────────────────────────────
  const openpopup = async (sub) => {
    setSubDetails(sub);
    try {
      const res = await axios.get(`${api}/api/course/${sub.coursename}`);
      setSubD(res.data.data);
      setPopup(true);
    } catch {
      setPopup(true); // open anyway, popup handles missing data gracefully
    }
  };

  const filtered = data.filter((sub) =>
    (sub.coursename ?? "").toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-full flex flex-col">
      {/* Header row */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-4" style={{ textShadow: '4px 4px 0px #0f172a, -1px -1px 0 #0f172a, 1px -1px 0 #0f172a, -1px 1px 0 #0f172a, 1px 1px 0 #0f172a' }}>
          <span className="text-5xl drop-shadow-[4px_4px_0px_#0f172a]">📚</span> My Courses
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="bg-lime-400 text-slate-900 font-black px-4 py-2 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transform rotate-2">
            {data.length} Enrolled
          </span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl z-10">🔍</span>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search courses..."
              className="pl-12 pr-4 py-3 rounded-[1.5rem] text-lg font-bold text-slate-900 placeholder-slate-400 bg-white border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all w-64"
            />
          </div>
        </div>
      </motion.div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="rounded-[2.5rem] border-4 border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col h-72 p-6">
               <div className="flex justify-between items-start mb-6">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="w-14 h-14" />
               </div>
               <Skeleton className="h-4 w-full mb-3" />
               <Skeleton className="h-4 w-3/4 mb-auto" />
               <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-red-300 border-4 border-slate-900 rounded-[3rem] shadow-[8px_8px_0px_0px_#0f172a] text-center">
          <p className="text-7xl mb-6">⚠️</p>
          <p className="text-slate-900 font-black text-3xl uppercase tracking-widest">{error}</p>
        </motion.div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center p-20 bg-slate-100 border-4 border-slate-900 rounded-[3rem] shadow-[8px_8px_0px_0px_#0f172a] text-center opacity-90 my-auto">
          <p className="text-8xl mb-6 grayscale drop-shadow-[4px_4px_0px_#0f172a]">📭</p>
          <p className="text-slate-900 font-black text-4xl mb-4">No courses found</p>
          <p className="text-slate-600 font-bold text-xl bg-white px-4 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            {data.length === 0 ? "You haven't enrolled in any courses yet." : "Try a different search."}
          </p>
        </motion.div>
      )}

      {/* Course grid */}
      <AnimatePresence>
      {!loading && !error && filtered.length > 0 && (
        <motion.div 
           initial="hidden" animate="visible"
           variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10"
        >
          {filtered.map((sub) => {
            const key = sub.coursename?.toLowerCase();
            const style = COURSE_STYLES[key] ?? defaultStyle;

            return (
              <motion.div
                key={sub._id}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                whileHover={{ y: -8, boxShadow: "12px 12px 0px 0px #0f172a" }}
                onClick={() => openpopup(sub)}
                className={`rounded-[2.5rem] cursor-pointer transition-transform flex flex-col group border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden ${style.bg}`}
              >
                <div className="p-8 flex flex-col h-full bg-white/40">
                  {/* Icon + badge row */}
                  <div className="flex items-start justify-between mb-6">
                    <span className={`text-sm font-black tracking-widest uppercase px-4 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] bg-white text-slate-900`}>
                      {sub.coursename?.toUpperCase()}
                    </span>
                    <div className="w-16 h-16 rounded-[1.2rem] bg-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform origin-bottom duration-300">
                      {style.icon}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mb-6 flex-1">
                      <p className="text-slate-600 font-bold leading-relaxed line-clamp-3">
                        <span className="text-slate-900 font-black uppercase text-xs tracking-widest mr-2">Desc</span>
                        {sub.description || "No description available."}
                      </p>
                  </div>

                  {/* Schedule */}
                  {sub.schedule && sub.schedule.length > 0 && (
                    <div className="bg-slate-100 rounded-2xl p-4 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mb-6">
                      <p className="text-xs text-slate-500 font-black tracking-widest uppercase mb-3">Schedule</p>
                      <div className="flex flex-col gap-2">
                        {sub.schedule.map((slot, i) => (
                          <div key={i} className="flex justify-between items-center text-sm bg-white px-3 py-2 rounded-xl border-2 border-slate-900 font-bold">
                            <span className="text-slate-900 uppercase tracking-wide">{DAYS[slot.day]}</span>
                            <span className="text-slate-900 bg-lime-300 px-2 rounded-md border border-slate-900 border-b-2 shadow-sm">{fmt(slot.starttime)} – {fmt(slot.endtime)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View details CTA */}
                  <div className="w-full py-4 mt-auto rounded-xl text-center text-lg uppercase tracking-widest font-black text-white bg-slate-900 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:bg-slate-800 transition-colors">
                    View Details →
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Popup Overlay */}
      {popup && (
        <Popup
          onClose={() => setPopup(false)}
          subject={subDetails}
          allSubject={subD}
        />
      )}
    </div>
  );
}