import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Withdrawal from "./Withdrawal";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 border-4 border-slate-900 ${className}`} />;
}

function DashboardTeacher() {
  const { ID } = useParams();
  const [data, setdata] = useState({});
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(false);
  const [amount, setAmount] = useState(0);
  const [Tdec, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formPopup, setFormPopup] = useState(false);

  const price = {
    math: 700,
    physics: 800,
    computer: 1000,
    chemistry: 600,
    biology: 500,
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${api}/api/Teacher/TeacherDocument/${ID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, [ID]);

  useEffect(()=>{
    const getData = async()=>{
      if(!data?.Teacherdetails) return;
      try {
        const Data = await fetch(`${api}/api/teacher/teacherdocuments`,{
          method: 'POST',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({teacherID : data.Teacherdetails}),
        });
        const res = await Data.json();
        setTeacherDetails(res.data);
      } catch(e) {
        console.log("Error fetching details", e);
      }
    }

    if(data?.Teacherdetails) {
       getData();
    }
  },[data]);

  useEffect(() => {
    const getAmount = async () => {
      try {
        const response = await fetch(`${api}/api/payment/teacher/${ID}/balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setAmount(user.data.newTeacher.Balance);
      } catch (error) {
        console.log(error);
      }
    };
    getAmount();
  }, [ID, popup]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/api/course/Teacher/${ID}/enrolled`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const res = await response.json();
        setCourses(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, [ID]);

  return (
    <div className="w-full flex-1 flex flex-col items-center font-sans tracking-tight">
        
       {/* Actions Bar */}
       <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-sky-200 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_#0f172a]">
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
             <motion.button 
                whileHover={{ y: -4, boxShadow: "4px 4px 0px 0px #0f172a" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-slate-900 font-black uppercase tracking-widest px-6 py-3 rounded-xl border-4 border-slate-900 shadow-sm whitespace-nowrap"
             >
                My Details 📋
             </motion.button>
             <motion.button 
                whileHover={{ y: -4, boxShadow: "4px 4px 0px 0px #0f172a" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPopup(true)}
                className="bg-yellow-400 text-slate-900 font-black uppercase tracking-widest px-6 py-3 rounded-xl border-4 border-slate-900 shadow-sm whitespace-nowrap"
             >
                Remuneration 💸
             </motion.button>
             <motion.button 
                whileHover={{ y: -4, boxShadow: "4px 4px 0px 0px #0f172a" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormPopup(true)}
                className="bg-purple-300 text-slate-900 font-black uppercase tracking-widest px-6 py-3 rounded-xl border-4 border-slate-900 shadow-sm whitespace-nowrap"
             >
                Feedback Form 💬
             </motion.button>
          </div>
       </div>

       {/* Grid Layout for Profile & Courses */}
       <div className="w-full flex flex-col lg:flex-row gap-8">
          
          {/* Profile Card */}
          <motion.div 
             initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
             className="w-full lg:w-1/3 bg-white border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_#0f172a] h-fit"
          >
             <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-6 border-b-4 border-slate-900 pb-2">Profile Details</h3>
             {loading && !data.Firstname ? (
                <div className="space-y-4">
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-6 w-full" />
                   <Skeleton className="h-6 w-1/2" />
                   <Skeleton className="h-6 w-full" />
                   <Skeleton className="h-6 w-1/3" />
                </div>
             ) : (
                <div className="space-y-6">
                   <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900">
                     <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Full Name</p>
                     <p className="text-xl font-bold text-slate-900">{data.Firstname} {data.Lastname}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900">
                     <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Email</p>
                     <p className="text-lg font-bold text-slate-900 truncate">{data.Email}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900">
                     <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Phone</p>
                     <p className="text-lg font-bold text-slate-900">{Tdec?.Phone || "—"}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900">
                     <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Address</p>
                     <p className="text-lg font-bold text-slate-900">{Tdec?.Address || "—"}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 flex justify-between items-center">
                     <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Experience</p>
                     <span className="bg-lime-300 font-black text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">{Tdec?.Experience || 0} Years</span>
                   </div>
                </div>
             )}
          </motion.div>

          {/* Courses Card */}
          <motion.div 
             initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
             className="w-full lg:w-2/3 bg-lime-300 border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_#0f172a] flex flex-col"
          >
             <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-6 border-b-4 border-slate-900 pb-2">Active Courses</h3>
             
             <div className="flex-1 flex flex-col gap-4">
                {loading ? (
                   <div className="space-y-4">
                     <Skeleton className="h-24 w-full rounded-2xl" />
                     <Skeleton className="h-24 w-full rounded-2xl" />
                   </div>
                ) : courses && courses.filter(c => c.isapproved).length > 0 ? (
                   courses.filter(course => course.isapproved).map((course) => (
                     <motion.div 
                        key={course._id}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4"
                     >
                       <div className="flex-1">
                          <span className="bg-yellow-400 font-black text-slate-900 px-3 py-1 text-sm rounded-lg border-2 border-slate-900 uppercase tracking-widest inline-block mb-3 shadow-sm">
                            {course.coursename}
                          </span>
                          <div className="flex flex-wrap gap-2 mb-2">
                             {course.schedule.map((days, idx) => (
                                <span key={idx} className="bg-sky-200 text-xs font-bold text-slate-900 border-2 border-slate-900 px-2 py-1 rounded-lg">
                                  {daysOfWeek[days.day]} {Math.floor(days.starttime/60)}:{(days.starttime%60 === 0 ? "00":days.starttime%60).toString().padStart(2,'0')}
                                </span>
                             ))}
                          </div>
                       </div>
                       <div className="bg-slate-100 p-3 rounded-xl border-2 border-slate-900 shadow-inner flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Rate</span>
                          <span className="text-lg font-black text-slate-900 text-center">₹{price[course.coursename.toLowerCase()] || 500}</span>
                          <span className="text-[10px] font-bold text-slate-400">/ std / mo</span>
                       </div>
                     </motion.div>
                   ))
                ) : (
                   <div className="flex flex-col items-center justify-center p-12 bg-white/50 border-4 border-slate-900 border-dashed rounded-3xl h-full">
                      <span className="text-6xl grayscale mb-4">📭</span>
                      <p className="font-black text-xl text-slate-600">No active courses yet.</p>
                   </div>
                )}
             </div>
          </motion.div>
       </div>

       {/* Modals */}
       {popup && <Withdrawal onClose={() => setPopup(false)} TA={amount} />}

       <AnimatePresence>
       {formPopup && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4'
          >
            <motion.div 
               initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className='bg-purple-300 text-slate-900 w-full max-w-2xl rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] overflow-hidden max-h-[95vh] overflow-y-auto'
            >
              <div className="bg-slate-900 p-8 relative">
                 <button onClick={() => setFormPopup(false)} className='absolute top-6 right-6 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-red-400 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]'>
                    ✕
                 </button>
                 <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-900 font-black uppercase text-xs tracking-widest shadow-sm inline-block mb-3">Feedback</span>
                 <h2 className='text-4xl font-black text-white tracking-tighter'>Teacher Feedback Form</h2>
              </div>
              
              <div className='bg-white/50 p-8 md:p-10 space-y-6'>
                 <p className='font-bold bg-white p-4 rounded-xl border-2 border-slate-900 shadow-sm'>We highly appreciate your involvement. Please help us improve by filling out this teacher feedback form. Thank you!</p>

                 <div className="bg-white p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                      <input type="text" className='w-full bg-slate-100 p-3 rounded-xl border-2 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_#0f172a] font-bold text-slate-900' placeholder='Teacher Name'/>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Course Name</label>
                      <input type="text" className='w-full bg-slate-100 p-3 rounded-xl border-2 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_#0f172a] font-bold text-slate-900' placeholder='Course Name'/>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Number of Years Teaching</label>
                    <input type="number" className='w-full md:w-1/2 bg-slate-100 p-3 rounded-xl border-2 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_#0f172a] font-bold text-slate-900' placeholder='In years'/>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
                    <p className='font-black uppercase tracking-widest mb-3 text-sm'>Any thoughts to improve the service?</p>
                    <textarea className="w-full bg-slate-100 p-4 rounded-xl border-2 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_#0f172a] font-bold text-slate-900 resize-none h-32" placeholder="Tell us how we can do better..."></textarea>
                 </div>

                 <div className='flex justify-end pt-2 pb-2'>
                    <motion.button 
                       whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #0f172a" }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => { alert('Feedback submitted!'); setFormPopup(false); }}
                       className='w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-10 border-4 border-slate-900 py-4 shadow-[4px_4px_0px_0px_#0f172a] rounded-xl uppercase tracking-widest transition-colors cursor-pointer'
                    >
                       Submit Input
                    </motion.button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
       )}
       </AnimatePresence>
    </div>
  );
}

export default DashboardTeacher;
