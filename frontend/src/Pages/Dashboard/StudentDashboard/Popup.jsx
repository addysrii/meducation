import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";
const PRICE = { math: 700, physics: 800, computer: 1000, chemistry: 600, biology: 500 };

const SUBJECT_COLORS = {
  math: { bg: "bg-violet-300", badge: "bg-violet-400 text-slate-900 border-slate-900" },
  physics: { bg: "bg-sky-300", badge: "bg-sky-400 text-slate-900 border-slate-900" },
  chemistry: { bg: "bg-emerald-300", badge: "bg-emerald-400 text-slate-900 border-slate-900" },
  biology: { bg: "bg-rose-300", badge: "bg-rose-400 text-slate-900 border-slate-900" },
  computer: { bg: "bg-amber-300", badge: "bg-amber-400 text-slate-900 border-slate-900" },
};

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/20 ${className}`} />;
}

export default function Popup({ onClose, subject, allSubject }) {
  const [details, setDetails] = useState(null);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const style = SUBJECT_COLORS[subject?.coursename?.toLowerCase()] ?? SUBJECT_COLORS.computer;
  const price = PRICE[subject?.coursename?.toLowerCase()];

  // ── resolve enrolled teacher from allSubject list ─────────────────────────
  useEffect(() => {
    if (!allSubject || !subject) return;
    const match = allSubject.find((res) => res._id === subject._id);
    setDetails(match?.enrolledteacher ?? null);
  }, [allSubject, subject]);

  // ── fetch teacher profile once details are known ──────────────────────────
  useEffect(() => {
    if (!details?.Teacherdetails) return;
    const getData = async () => {
      setLoadingTeacher(true);
      try {
        const res = await fetch(`${api}/api/teacher/teacherdocuments`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ teacherID: details.Teacherdetails }),
        });
        const json = await res.json();
        setTeacherInfo(json.data);
      } catch {
        // silently fail
      } finally {
        setLoadingTeacher(false);
      }
    };
    getData();
  }, [details]);

  // ── close on backdrop click ───────────────────────────────────────────────
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={handleBackdrop}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className={`relative w-full max-w-lg rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] overflow-hidden flex flex-col ${style.bg} max-h-[90vh] overflow-y-auto`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-slate-900 hover:text-white transition-colors shadow-[4px_4px_0px_0px_#0f172a] z-10"
          >
            ✕
          </button>

          {/* Header */}
          <div className="bg-white border-b-4 border-slate-900 p-8 pt-10 rounded-b-[2rem] shadow-sm relative overflow-hidden">
            <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 shadow-[2px_2px_0px_0px_#0f172a] ${style.badge}`}>
              {subject?.coursename?.toUpperCase()}
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tighter">
              {subject?.coursename?.charAt(0).toUpperCase() + subject?.coursename?.slice(1)}
            </h2>
            <p className="text-sm text-slate-600 mt-3 font-bold leading-relaxed">{subject?.description}</p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">

            {/* Teacher info */}
            <div className="bg-white rounded-2xl p-6 border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]">
              <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-4">Instructor</p>

              {loadingTeacher ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="w-14 h-14 rounded-xl border-2 border-slate-900" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                </div>
              ) : (details || teacherInfo) ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[1rem] bg-yellow-400 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 font-black text-xl transform -rotate-3 hover:rotate-3 transition-transform">
                    {(details?.Firstname ?? teacherInfo?.Firstname ?? "T")[0]}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">
                      {details?.Firstname ?? teacherInfo?.Firstname ?? "—"}{" "}
                      {details?.Lastname ?? teacherInfo?.Lastname ?? ""}
                    </p>
                    <p className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block mt-1 border-2 border-slate-900">
                      {details?.Email ?? teacherInfo?.Email ?? "—"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-bold italic bg-slate-100 p-3 rounded-lg border-2 border-slate-900 inline-block">Teacher info unavailable</p>
              )}
            </div>

            {/* Fee + enroll row */}
            <div className="flex gap-4">
              <div className="flex-1 bg-white rounded-2xl p-5 border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]">
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-2">Monthly Fee</p>
                <p className="text-3xl font-black text-slate-900">
                  {price ? `₹${price}` : "—"}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1">per student</p>
              </div>

              <div className="flex-1 bg-white rounded-2xl p-5 border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col items-start">
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">Status</p>
                <span className="text-sm font-black uppercase px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] bg-lime-400 text-slate-900 transform -rotate-2">
                  Enrolled ✓
                </span>
              </div>
            </div>

            {/* Schedule (if available) */}
            {subject?.schedule && subject.schedule.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]">
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-4">Schedule</p>
                <div className="flex flex-col gap-3">
                  {subject.schedule.map((slot, i) => {
                    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    const fmt = (m) => `${Math.floor(m / 60)}:${m % 60 === 0 ? "00" : String(m % 60).padStart(2, "0")}`;
                    return (
                      <div key={i} className="flex justify-between items-center bg-slate-100 p-3 rounded-xl border-2 border-slate-900">
                        <span className="text-slate-900 font-black uppercase tracking-wider">{days[slot.day]}</span>
                        <span className="text-slate-900 font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-900">
                          {fmt(slot.starttime)} – {fmt(slot.endtime)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 pt-0 mt-auto">
            <motion.button
              whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px #0f172a" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-4 rounded-xl text-lg font-black text-white bg-slate-900 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Close
            </motion.button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}