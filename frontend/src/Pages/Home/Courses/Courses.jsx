import React, { useState } from 'react'
import Header from '../Header/Header'
import Footer from '../../Footer/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../../api/api';
function Courses() {
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const subjects = [
    { id: "physics", label: "Physics", icon: "🌌", color: "bg-sky-300" },
    { id: "chemistry", label: "Chemistry", icon: "⚗️", color: "bg-yellow-300" },
    { id: "biology", label: "Biology", icon: "🧬", color: "bg-green-300" },
    { id: "math", label: "Math", icon: "📐", color: "bg-red-300" },
    { id: "computer", label: "Computer", icon: "💻", color: "bg-purple-300" },
  ];

  const teachersList = async (sub) => {
    setLoading(true);
    setSelectedTopic(sub);

    const response = await fetch(`${api}/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    setFacList(data.data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-sans selection:bg-purple-400 selection:text-white pt-24 pb-20 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 w-full mt-10">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-16 space-y-4">
          <span className="bg-lime-400 text-slate-900 font-bold py-2 px-6 rounded-full border-2 border-slate-900 uppercase tracking-widest text-sm inline-block shadow-[4px_4px_0px_0px_#0f172a] transform -rotate-1 group">
            Discover
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Explore <span className="text-sky-500 underline decoration-8 decoration-yellow-400">Courses</span></h2>
        </motion.div>

        {/* Subjects Grid */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-20"
        >
          {subjects.map((sub) => (
            <motion.div
              key={sub.id}
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              whileHover={{ y: -8, boxShadow: "8px 8px 0px 0px #0f172a", rotate: sub.id.length % 2 === 0 ? 2 : -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => teachersList(sub.id)}
              className={`cursor-pointer ${sub.color} border-4 border-slate-900 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_#0f172a] transition-all aspect-square relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-white opacity-0 ${selectedTopic === sub.id ? 'opacity-20' : ''} transition-opacity`}></div>
              <span className="text-6xl mb-4 group-hover:scale-110 transition-transform origin-bottom">{sub.icon}</span>
              <p className="font-black text-slate-900 text-xl tracking-tight uppercase">{sub.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Faculty Grid */}
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-20">
              <div className="w-16 h-16 border-8 border-slate-900 border-t-yellow-400 rounded-full animate-spin"></div>
            </motion.div>
          ) : (
            facList && facList.length > 0 ? (
              <motion.div
                key="grid"
                initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {facList.map((fac, idx) => {
                  const isOdd = idx % 2 !== 0;
                  const bgCard = isOdd ? 'bg-purple-200' : 'bg-sky-200';
                  const teacherEmail = fac.enrolledteacher?.Email;
                  const isSpecificTeacher = teacherEmail === "urttsg@gmail.com";
                  return (
                    <motion.div
                      key={fac._id}
                      variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                      whileHover={{ y: -8, boxShadow: "12px 12px 0px 0px #0f172a" }}
                      className={`${bgCard} border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_#0f172a] transition-all relative overflow-hidden`}
                    >
                      {/* Decorative badge */}
                      <div className="absolute top-6 right-6 bg-yellow-400 border-2 border-slate-900 p-2 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] transform rotate-12">
                        ⭐
                      </div>

                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] overflow-hidden shrink-0 transform -rotate-3">
                          <img className="w-full h-full object-cover" src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="Profile" />
                        </div>
                        <div>
                          <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-2">
                            {fac.enrolledteacher?.Firstname || 'Unknown'} {fac.enrolledteacher?.Lastname || ''}
                          </h3>
                          <p className="text-sm font-bold text-slate-600 bg-white/50 inline-block px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                            {teacherEmail || 'No Email'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
                        <div>
                          <span className="block text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Education</span>
                          <p className="font-bold text-slate-900">
                            {isSpecificTeacher ? "Post Graduate from Calcutta University" : "Post Graduate from Sister Nivedita University"}
                          </p>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Experience</span>
                          <p className="font-bold text-slate-900">
                            {isSpecificTeacher ? "1 Years of Teaching" : "2 Years of Teaching"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              selectedTopic && (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-12 bg-white border-4 border-slate-900 border-dashed rounded-[3rem] opacity-70">
                  <span className="text-6xl mb-4 grayscale">📭</span>
                  <h3 className="text-2xl font-black text-slate-400 text-center">No faculty found for {selectedTopic} yet.</h3>
                </motion.div>
              )
            )
          )}
        </AnimatePresence>

      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

export default Courses