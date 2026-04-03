import React from 'react'
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function ErrorPage() {
  return (
    <div className='bg-[#F4F4F5] min-h-screen flex items-center justify-center p-4 font-sans selection:bg-purple-400'>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl w-full bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[16px_16px_0px_0px_#0f172a] p-12 text-center flex flex-col items-center relative overflow-hidden"
      >
        <div className="text-9xl mb-6 transform -rotate-12 drop-shadow-[6px_6px_0px_#0f172a]">
           💥
        </div>
        
        <span className="bg-yellow-400 font-black text-slate-900 px-4 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] uppercase tracking-widest text-sm inline-block mb-6">
           Error 404
        </span>

        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">
           Lost In <br/> Space
        </h1>
        
        <p className="text-xl font-bold text-slate-600 mb-10 max-w-md border-b-4 border-slate-900 pb-8">
           The page you are looking for has evaporated into the digital void. Let's get you back to safety.
        </p>

        <NavLink to="/">
          <motion.button 
             whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px #0f172a" }}
             whileTap={{ scale: 0.95 }}
             className="bg-purple-400 text-slate-900 font-black px-10 py-5 rounded-[1.5rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] uppercase tracking-widest text-xl transition-all cursor-pointer"
          >
             Take Me Home 🚀
          </motion.button>
        </NavLink>
      </motion.div>
    </div>
  )
}

export default ErrorPage