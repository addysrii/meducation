import React, { useState } from 'react'
import Search from '../../Components/Searchbtn/Search'
import { motion, AnimatePresence } from 'framer-motion'

function SearchTeacher() {
  const [popup, SetPopup] = useState(false);
  
  return (
    <div className='w-full relative h-full flex flex-col'>
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-black text-white px-2">Find a Course</h2>
           <button 
             onClick={() => SetPopup(true)}
             className="bg-sky-400 hover:bg-sky-500 text-slate-900 font-bold px-4 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:-translate-y-0.5 transition-all outline-none"
           >
             Give Feedback 💬
           </button>
        </div>

        <Search/>

        <AnimatePresence>
        {popup && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4'
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className='bg-yellow-300 w-full max-w-2xl px-10 py-10 rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] relative overflow-y-auto max-h-[90vh]'
            >
              <button onClick={() => SetPopup(false)} className='absolute top-6 right-6 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-slate-900 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]'>
                  ✕
              </button>

              <h3 className='text-4xl font-black text-slate-900 tracking-tight'>Student <span className="text-purple-600 underline decoration-4 decoration-white">Feedback</span> </h3>
              <p className='mt-2 font-bold text-slate-700 bg-white/40 p-3 rounded-lg border-2 border-slate-900 mb-8'>
                  Help us improve our courses by filling out this feedback form. We highly appreciate your involvement!
              </p>

              <div className='flex flex-col gap-5 mb-8'>
                <div>
                    <label className="block font-black uppercase text-xs tracking-widest text-slate-800 mb-1 pl-1">Instructor</label>
                    <input type="text" className='w-full bg-white border-4 border-slate-900 rounded-xl px-4 py-3 font-bold text-slate-900 placeholder-slate-400 shadow-[4px_4px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all' placeholder='Teacher Name'/>
                </div>
                <div>
                    <label className="block font-black uppercase text-xs tracking-widest text-slate-800 mb-1 pl-1">Course Name</label>
                    <input type="text" className='w-full bg-white border-4 border-slate-900 rounded-xl px-4 py-3 font-bold text-slate-900 placeholder-slate-400 shadow-[4px_4px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all' placeholder='Course Name'/>
                </div>
                <div>
                    <label className="block font-black uppercase text-xs tracking-widest text-slate-800 mb-1 pl-1">What you like about this course?</label>
                    <textarea className='w-full bg-white border-4 border-slate-900 rounded-xl px-4 py-3 font-bold text-slate-900 placeholder-slate-400 shadow-[4px_4px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all min-h-[100px] resize-none' placeholder='Write here...'/>
                </div>
              </div>

              <div className="bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_#0f172a] mb-8">
                  <p className='font-black text-lg mb-4'>Please rate the following:</p>
                  
                  <div className='space-y-4'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 border-b-2 border-slate-200 pb-3'>
                      <p className='font-bold text-slate-700'>Effort invested</p>
                      <div className='flex gap-4 font-bold text-sm'>
                        {['Very Good', 'Good', 'Fair', 'Poor'].map((val, i) => (
                           <label key={i} className="flex items-center gap-1 cursor-pointer"><input name="g1" type="radio" value={val}/> {val}</label>
                        ))}
                      </div>
                    </div>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 border-b-2 border-slate-200 pb-3'>
                      <p className='font-bold text-slate-700'>Subject Knowledge</p>
                      <div className='flex gap-4 font-bold text-sm'>
                        {['Very Good', 'Good', 'Fair', 'Poor'].map((val, i) => (
                           <label key={i} className="flex items-center gap-1 cursor-pointer"><input name="g2" type="radio" value={val}/> {val}</label>
                        ))}
                      </div>
                    </div>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-2'>
                      <p className='font-bold text-slate-700'>Communication</p>
                      <div className='flex gap-4 font-bold text-sm'>
                        {['Very Good', 'Good', 'Fair', 'Poor'].map((val, i) => (
                           <label key={i} className="flex items-center gap-1 cursor-pointer"><input name="g3" type="radio" value={val}/> {val}</label>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>

              <div className='bg-sky-200 p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mb-8'>
                <p className='font-black mb-3'>Would you recommend this course?</p>
                <div className="flex gap-6 font-bold">
                    <label className="flex items-center gap-2 cursor-pointer"><input name="recommend" type="radio" /> Yes, definitely</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input name="recommend" type="radio" /> No way</label>
                </div>
              </div>

              <div className='flex justify-end'>
                <motion.button 
                   whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #0f172a" }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => { alert('Feedback submitted!'); SetPopup(false); }}
                   className='bg-purple-500 hover:bg-purple-600 text-white font-black px-10 py-4 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] uppercase tracking-widest'
                >
                  Submit Form
                </motion.button>
              </div>
              
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
    </div> 
  )
}

export default SearchTeacher