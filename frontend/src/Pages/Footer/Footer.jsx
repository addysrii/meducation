import React from 'react'
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 border-t-8 border-slate-900 text-white font-sans overflow-hidden">
      
      {/* Heavy brutalist top banner to break sections */}
      <div className="w-full bg-lime-400 border-b-4 border-slate-900 py-4 flex overflow-hidden whitespace-nowrap">
         <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-12 text-slate-900 font-black uppercase tracking-widest text-lg">
            <span>🚀 Future of Web3 Learning</span>
            <span>⚡️ Powering 1M+ Students</span>
            <span>🧠 Open Source Mindset</span>
            <span>🚀 Future of Web3 Learning</span>
            <span>⚡️ Powering 1M+ Students</span>
            <span>🧠 Open Source Mindset</span>
            <span>🚀 Future of Web3 Learning</span>
            <span>⚡️ Powering 1M+ Students</span>
            <span>🧠 Open Source Mindset</span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12 relative z-10">
        
        {/* Left Side: Brand & Mission */}
        <div className="flex flex-col gap-6 md:w-1/3">
          <div className="flex items-center gap-3">
             <div className="w-14 h-14 bg-yellow-400 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#fff] flex items-center justify-center text-3xl transform -rotate-6">
                💡
             </div>
             <h2 className="text-4xl font-black uppercase tracking-tighter text-white">meducation</h2>
          </div>
          
          <div className="bg-white text-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#a3e635] transform inline-block -rotate-1 w-fit mt-4">
             <p className="font-black uppercase tracking-widest text-xs mb-1 text-slate-500">Mission Statement</p>
             <p className="font-bold text-slate-800">Small Change. Big Change. Building the tools for tomorrow's creators.</p>
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div className="grid grid-cols-2 gap-8 md:w-1/3 mt-4 md:mt-0">
           <div className="flex flex-col gap-4">
              <h3 className="font-black text-lime-400 uppercase tracking-widest border-b-2 border-slate-700 pb-2">Platform</h3>
              <NavLink to="/" className="font-bold text-slate-300 hover:text-white hover:translate-x-1 transition-transform">Home</NavLink>
              <NavLink to="/about" className="font-bold text-slate-300 hover:text-white hover:translate-x-1 transition-transform">About</NavLink>
              <NavLink to="/courses" className="font-bold text-slate-300 hover:text-white hover:translate-x-1 transition-transform">Courses</NavLink>
           </div>
           <div className="flex flex-col gap-4">
              <h3 className="font-black text-sky-400 uppercase tracking-widest border-b-2 border-slate-700 pb-2">Support</h3>
              <NavLink to="/contact" className="font-bold text-slate-300 hover:text-white hover:translate-x-1 transition-transform">Contact Us</NavLink>
              <span className="font-bold text-slate-300 hover:text-white cursor-pointer hover:translate-x-1 transition-transform">How it works</span>
              <span className="font-bold text-slate-300 hover:text-white cursor-pointer hover:translate-x-1 transition-transform">Privacy Policy</span>
           </div>
        </div>

        {/* Right Side: Social Media */}
        <div className="flex flex-col gap-6 md:w-1/4 mt-4 md:mt-0">
           <h3 className="font-black text-purple-400 uppercase tracking-widest border-b-2 border-slate-700 pb-2">Connect</h3>
           <div className="flex gap-4">
              <motion.a whileHover={{ y: -4, rotate: -5 }} className="w-12 h-12 bg-sky-400 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#fff] flex items-center justify-center text-2xl text-slate-900 cursor-pointer">
                 🔗
              </motion.a>
              <motion.a whileHover={{ y: -4, rotate: 5 }} className="w-12 h-12 bg-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#fff] flex items-center justify-center text-2xl text-slate-900 cursor-pointer">
                 🐦
              </motion.a>
              <motion.a whileHover={{ y: -4, rotate: -5 }} className="w-12 h-12 bg-blue-500 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#fff] flex items-center justify-center text-2xl text-slate-900 cursor-pointer">
                 📘
              </motion.a>
              <motion.a whileHover={{ y: -4, rotate: 5 }} className="w-12 h-12 bg-slate-400 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#fff] flex items-center justify-center text-2xl text-slate-900 cursor-pointer">
                 🐙
              </motion.a>
           </div>
        </div>

      </div>

      <div className="w-full bg-slate-950 py-6 text-center border-t-4 border-slate-900">
         <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
           Copyright © {currentYear} Meducation. All Rights Reserved.
         </p>
      </div>

      {/* Tailwind config for marquee animation if not globally available */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-\\[marquee_20s_linear_infinite\\] {
          animation: marquee 20s linear infinite;
          width: 200%;
        }
      `}} />
    </footer>
  )
}

export default Footer