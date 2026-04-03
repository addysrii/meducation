import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate, Outlet } from 'react-router-dom';
import teachingImg from '../../Images/Teaching.svg';
import logo from '../../Images/logo.svg';
import { motion } from 'framer-motion';

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 border-4 border-slate-900 ${className}`} />;
}

export default function TeacherDashboard() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [ID]);

  const Handlelogout = async () => {
    try {
      const response = await fetch("/api/teacher/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
    { label: "Dashboard", icon: "📊", to: `/Teacher/Dashboard/${ID}/Home`, color: "bg-purple-300"  },
    { label: "Classes",  icon: "📅", to: `/Teacher/Dashboard/${ID}/Classes`, color: "bg-sky-300" },
    { label: "Courses",  icon: "📚", to: `/Teacher/Dashboard/${ID}/Courses`, color: "bg-lime-300" },
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
        <div className="p-6 flex flex-col items-center text-center border-b-4 border-slate-900 relative bg-amber-50">
           <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded border-2 border-slate-900 font-black text-xs uppercase shadow-[2px_2px_0px_0px_#0f172a] text-amber-600">
             Staff
           </div>
           <div className="w-20 h-20 mt-4 rounded-[1.5rem] bg-amber-300 border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex items-center justify-center font-black text-4xl mb-4 transform -rotate-3 hover:rotate-3 transition-transform cursor-default select-none">
              {loading ? "..." : initials}
           </div>
           {loading ? (
             <Skeleton className="w-24 h-4 mb-2" />
           ) : (
             <h2 className="font-black text-xl leading-tight uppercase tracking-tight">{fullName || "Instructor"}</h2>
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
                `flex items-center gap-4 px-4 py-3 rounded-2xl border-4 text-base font-black uppercase tracking-widest transition-all ${
                  isActive 
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
        <div className="bg-amber-300 border-b-4 border-slate-900 relative shadow-sm">
          <div className="p-10 lg:p-16 flex items-center justify-between z-10 relative max-w-7xl mx-auto w-full">
             <div className="max-w-2xl">
                <span className="bg-white border-4 border-slate-900 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#0f172a] inline-block mb-6 transform -rotate-2 text-slate-900">
                   Teacher Portal 🎓
                </span>
                {loading ? (
                   <Skeleton className="w-80 h-16 mb-4" />
                ) : (
                   <h1 className="text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6 uppercase" style={{ textShadow: '4px 4px 0px #fff' }}>
                      {fullName || "Instructor"}
                   </h1>
                )}
                <p className="text-lg lg:text-xl font-black tracking-wide border-4 border-slate-900 bg-white px-5 py-3 rounded-[1.5rem] inline-block shadow-[6px_6px_0px_0px_#0f172a]">
                   Inspire and lead the next session ✨
                </p>
             </div>

             <div className="hidden lg:block relative group mr-10 xl:mr-20">
                <div className="absolute inset-0 bg-yellow-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <img
                  src={teachingImg}
                  alt="Teacher"
                  width={280}
                  className="relative z-10 transform group-hover:scale-105 transition-transform duration-500 hover:-rotate-2"
                  style={{ filter: "drop-shadow(6px 6px 0px rgba(15,23,42,1))" }}
                />
             </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-8 lg:p-12 flex-1 flex flex-col w-full">
           
           {/* Dynamic Outlet Render Area */}
           <div className="w-full flex-1 max-w-7xl mx-auto flex flex-col h-full">
             <Outlet />
           </div>
           
        </div>
      </main>

    </div>
  );
}