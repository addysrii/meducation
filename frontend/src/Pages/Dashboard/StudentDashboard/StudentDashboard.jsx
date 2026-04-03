import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import teachingImg from "../../Images/Teaching.svg";
import logo from "../../Images/logo.svg";
import { motion } from "framer-motion";
import api from "../../../api/api";
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 border-4 border-slate-900 ${className}`} />;
}

export default function StudentDashboard() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${api}/api/student/StudentDocument/${ID}`, {
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

  const Handlelogout = async () => {
    try {
      const response = await fetch(`${api}/api/student/logout`, {
        method: "POST",
        credentials: "include",

      });
      const res = await response.json();
      if (res.statusCode === 200) {
        localStorage.removeItem("userSession");
        navigate("/");
      }
    } catch {
      localStorage.removeItem("userSession");
      navigate("/");
    }
  };

  const fullName = data ? `${data.Firstname ?? ""} ${data.Lastname ?? ""}`.trim() : "";
  const initials = data
    ? `${(data.Firstname ?? "?")[0]}${(data.Lastname ?? "?")[0]}`.toUpperCase()
    : "??";

  const navLinks = [
    { label: "Search", icon: "🔍", to: `/Student/Dashboard/${ID}/Search`, color: "bg-purple-300" },
    { label: "Classes", icon: "📅", to: `/Student/Dashboard/${ID}/Classes`, color: "bg-sky-300" },
    { label: "Courses", icon: "📚", to: `/Student/Dashboard/${ID}/Courses`, color: "bg-lime-300" },
  ];

  return (
    <div className="font-sans min-h-screen bg-[#F4F4F5] flex text-slate-900 selection:bg-purple-400 selection:text-slate-900">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-[16rem] bg-white border-r-4 border-slate-900 flex flex-col z-30 shadow-[4px_0px_0px_0px_#0f172a]">

        {/* Logo */}
        <NavLink to="/">
          <div className="p-6 flex items-center gap-4 border-b-4 border-slate-900 hover:bg-yellow-100 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src={logo} className="w-6 h-6 invert" alt="logo" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase mt-1">
              meducation
            </span>
          </div>
        </NavLink>

        {/* Profile */}
        <div className="p-6 flex flex-col items-center text-center border-b-4 border-slate-900 relative bg-purple-50">
          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded border-2 border-slate-900 font-black text-xs uppercase shadow-[2px_2px_0px_0px_#0f172a] text-purple-600">
            Lvl 6
          </div>
          <div className="w-20 h-20 mt-4 rounded-[1.5rem] bg-purple-300 border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex items-center justify-center font-black text-4xl mb-4 transform -rotate-3 hover:rotate-3 transition-transform">
            {loading ? "..." : initials}
          </div>
          {loading ? (
            <Skeleton className="w-24 h-4 mb-2" />
          ) : (
            <h2 className="font-black text-xl leading-tight uppercase tracking-tight">{fullName || "Student User"}</h2>
          )}
          {data?.Email && <p className="text-sm font-bold text-slate-500 truncate w-full mt-1 border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#0f172a] rounded px-2 py-1">{data.Email}</p>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-6 flex flex-col gap-4">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl border-4 text-base font-black uppercase tracking-widest transition-all ${isActive
                  ? `${item.color} border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] translate-x-1`
                  : `bg-white border-transparent text-slate-500 hover:border-slate-900 hover:text-slate-900 hover:shadow-[4px_4px_0px_0px_#0f172a] hover:bg-slate-50`
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 mt-auto border-t-4 border-slate-900 bg-red-100">
          <motion.button
            whileHover={{ y: -2, boxShadow: "6px 6px 0px 0px #0f172a" }}
            whileTap={{ scale: 0.95 }}
            onClick={Handlelogout}
            className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest border-4 border-slate-900 text-slate-900 bg-white hover:bg-red-400 transition-colors shadow-[4px_4px_0px_0px_#0f172a]"
          >
            Sign Out 🚪
          </motion.button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="ml-[16rem] flex-1 flex flex-col min-h-screen relative overflow-x-hidden">

        {/* Hero Section */}
        <div className="bg-sky-200 border-b-4 border-slate-900 relative shadow-sm">
          <div className="p-10 lg:p-16 flex items-center justify-between z-10 relative">
            <div className="max-w-2xl">
              <span className="bg-yellow-400 border-4 border-slate-900 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#0f172a] inline-block mb-6 transform -rotate-2">
                Welcome Back 🌟
              </span>
              {loading ? (
                <Skeleton className="w-80 h-16 mb-4" />
              ) : (
                <h1 className="text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6" style={{ textShadow: '4px 4px 0px #0f172a, -1px -1px 0 #0f172a, 1px -1px 0 #0f172a, -1px 1px 0 #0f172a, 1px 1px 0 #0f172a', color: 'white' }}>
                  {fullName || "Student"}
                </h1>
              )}
              <p className="text-lg lg:text-xl font-black tracking-wide border-4 border-slate-900 bg-white px-5 py-3 rounded-[1.5rem] inline-block shadow-[6px_6px_0px_0px_#0f172a]">
                Ready to crush today's sessions? 🚀
              </p>

              {error && (
                <div className="mt-6 bg-red-400 border-4 border-slate-900 font-black px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] uppercase text-sm inline-block text-white">
                  ⚠ {error}
                </div>
              )}
            </div>

            <div className="hidden lg:block relative group">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <img
                src={teachingImg}
                alt="Student"
                width={300}
                className="relative z-10 transform group-hover:scale-105 transition-transform duration-500 hover:-rotate-2"
                style={{ filter: "drop-shadow(6px 6px 0px rgba(15,23,42,1))" }}
              />
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-8 lg:p-12 flex-1 flex flex-col w-full">

          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-12 w-full max-w-7xl mx-auto">
            {[
              { label: "ID Tag", value: ID ? `#${ID.slice(-4)}` : "—", bg: "bg-fuchsia-300", icon: "🏷️" },
              { label: "Hours Study", value: "142h", bg: "bg-lime-400", icon: "⏱️" },
              { label: "XP Points", value: "1,380", bg: "bg-yellow-400", icon: "✨" },
              { label: "Avg Score", value: "91%", bg: "bg-rose-400", icon: "🎯" },
            ].map((s) => (
              <motion.div
                whileHover={{ y: -6, boxShadow: "8px 8px 0px 0px #0f172a" }}
                key={s.label}
                className={`rounded-[2.5rem] p-6 lg:p-8 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col relative overflow-hidden ${s.bg}`}
              >
                <span className="text-6xl mb-4 absolute -right-2 top-2 opacity-50 transform rotate-12">{s.icon}</span>
                <p className="font-black text-5xl text-slate-900 mb-4 relative z-10 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">{s.value}</p>
                <p className="font-black text-sm uppercase tracking-widest border-4 border-slate-900 bg-white/60 px-4 py-2 rounded-xl self-start relative z-10 shadow-[2px_2px_0px_0px_#0f172a]">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Outlet Render Area */}
          <div className="w-full flex-1">
            <Outlet />
          </div>

        </div>
      </main>

    </div>
  );
}