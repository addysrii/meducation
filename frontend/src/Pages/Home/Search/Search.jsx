import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import Header from '../Header/Header'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../../api/api';
function Search() {
    const { subject } = useParams();
    const [data, setData] = useState(subject || '');
    const [course, setCourse] = useState([]);
    const [openTM, setOpenTM] = useState(false);
    const [Tdec, setTeacherDetails] = useState(null);
    const [tname, setTname] = useState({});
    const [starCount, setStarCount] = useState(5);
    const [loading, setLoading] = useState(false);

    const price = {
        math: 700,
        physics: 800,
        computer: 1000,
        chemistry: 600,
        biology: 500,
    };

    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let SearchTeacher = async () => {
        setLoading(true);
        let Subject = data.toLowerCase();
        if (!Subject) {
            setCourse([]);
            setLoading(false);
            return;
        }
        try {
            let Data = await fetch(`${api}/api/course/${Subject}`)
            let response = await Data.json();
            if (response.statusCode == 200) {
                setCourse(response.data)
            } else {
                setCourse([])
            }
        } catch {
            setCourse([])
        }
        setData('')
        setLoading(false);
    }

    useEffect(() => {
        if (subject) {
            SearchTeacher();
        }
    }, [])

    const openTeacherDec = async (id, fname, lname, sub) => {
        setTname({ fname, lname, sub });

        const resData = await fetch(`${api}/api/teacher/teacherdocuments`, {
            method: 'POST',

            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ teacherID: id }),
        })

        const res = await resData.json();
        setTeacherDetails(res.data);
        setOpenTM(true);
    }

    return (
        <div className="min-h-screen bg-[#F4F4F5] font-sans selection:bg-sky-400 pt-28 pb-20">
            <Header />

            <div className='max-w-5xl mx-auto px-6 flex flex-col items-center mt-10'>

                {/* Search Bar */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="w-full relative flex items-center mb-16"
                >
                    <div className="flex w-full items-center bg-white border-4 border-slate-900 rounded-[2rem] p-3 shadow-[8px_8px_0px_0px_#0f172a] transform hover:shadow-[12px_12px_0px_0px_#0f172a] transition-all">
                        <span className="text-4xl pl-4">🔍</span>
                        <input
                            type="text"
                            placeholder="Search subjects... e.g. Math, Physics"
                            className="flex-1 bg-transparent px-6 py-4 text-2xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                            value={data}
                            onKeyDown={(e) => e.key === 'Enter' && SearchTeacher()}
                            onChange={(e) => setData(e.target.value)}
                        />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ y: -2 }}
                            className='bg-lime-400 hover:bg-lime-500 text-slate-900 font-black text-xl px-10 py-5 rounded-[1.2rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] uppercase tracking-wider'
                            onClick={SearchTeacher}
                        >
                            Find
                        </motion.button>
                    </div>
                </motion.div>

                {/* Results Grid */}
                <div className='w-full'>
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-20">
                                <div className="w-16 h-16 border-8 border-slate-900 border-t-purple-500 rounded-full animate-spin"></div>
                            </motion.div>
                        ) : course && course.length > 0 ? (
                            <motion.div
                                key="results"
                                initial="hidden" animate="visible"
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                                className="flex flex-col gap-8 w-full"
                            >
                                {course.map((Data) => (
                                    <motion.div
                                        key={Data._id}
                                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                                        whileHover={{ y: -6, boxShadow: "12px 12px 0px 0px #0f172a" }}
                                        className='bg-sky-200 border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_#0f172a] transition-all relative overflow-hidden flex flex-col md:flex-row gap-8 items-stretch'
                                    >
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="bg-yellow-400 px-4 py-2 rounded-xl text-slate-900 font-black uppercase tracking-widest border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                                                    {Data.coursename}
                                                </span>
                                                <span className="bg-white px-3 py-1 rounded-lg text-slate-500 font-bold border-2 border-slate-900">
                                                    Seats: {Data.enrolledStudent.length}/20
                                                </span>
                                            </div>

                                            <h3
                                                onClick={() => openTeacherDec(Data.enrolledteacher.Teacherdetails, Data.enrolledteacher.Firstname, Data.enrolledteacher.Lastname, Data.coursename)}
                                                className='text-4xl text-slate-900 font-black cursor-pointer hover:underline decoration-4 decoration-purple-600 w-max'
                                            >
                                                {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
                                            </h3>

                                            <div className='bg-white/60 p-4 rounded-xl border-2 border-slate-900'>
                                                <span className='uppercase text-xs font-black tracking-widest text-slate-500 block mb-1'>Description</span>
                                                <p className="text-slate-900 font-semibold">{Data.description || "No description provided."}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end gap-6 bg-white p-6 rounded-[2rem] border-4 border-slate-900 min-w-[250px] shadow-inner">
                                            <div className="w-full">
                                                <span className='uppercase text-xs font-black tracking-widest text-slate-500 block mb-2'>Schedule</span>
                                                <div className="space-y-2">
                                                    {Data.schedule.map((daytime, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-900 bg-slate-100 px-3 py-2 rounded-lg border-2 border-slate-200">
                                                            <span>{daysName[daytime.day]}</span>
                                                            <span className="text-purple-600">
                                                                {Math.floor(daytime.starttime / 60)}:{daytime.starttime % 60 === 0 ? "00" : daytime.starttime % 60} - {Math.floor(daytime.endtime / 60)}:{daytime.endtime % 60 === 0 ? "00" : daytime.endtime % 60}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                onClick={() => alert('Please login to enroll in this course.')}
                                                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-[4px_4px_0px_0px_#9333ea] border-2 border-slate-900 uppercase tracking-widest"
                                            >
                                                Enroll Now
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center p-20 bg-white border-4 border-slate-900 border-dashed rounded-[3rem] opacity-70'>
                                <span className="text-7xl mb-6">🛸</span>
                                <h3 className="text-3xl font-black text-slate-400">Search for a subject!</h3>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Teacher Details Modal */}
                <AnimatePresence>
                    {openTM && Tdec && (
                        <motion.div
                            key="modal-backdrop"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6'
                        >
                            <motion.div
                                key="modal-content"
                                initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className='bg-purple-200 w-full max-w-lg rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] relative overflow-hidden'
                            >
                                <button
                                    onClick={() => setOpenTM(false)}
                                    className='absolute top-6 right-6 w-12 h-12 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-red-400 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]'
                                >
                                    ✕
                                </button>

                                <div className="bg-slate-900 p-8 pt-12 rounded-b-[3rem] shadow-xl text-center relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-yellow-400 border-4 border-slate-900 rounded-full flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#0f172a]">
                                        👨‍🏫
                                    </div>
                                    <p className='text-yellow-400 font-black tracking-widest uppercase mb-2 mt-4 text-sm'>
                                        {tname.sub}
                                    </p>
                                    <h2 className='text-white text-4xl font-black'>
                                        {tname.fname} {tname.lname}
                                    </h2>
                                </div>

                                <div className='p-8 space-y-6'>
                                    <div className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
                                        <span className="block text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Education</span>
                                        <p className="font-bold text-slate-900 text-lg">
                                            Postgraduate from <span className="bg-lime-300 px-2 rounded-md border border-slate-900 shrink-0">{Tdec.PGcollege}</span>
                                            <br />
                                            with <span className="font-black text-purple-600">{Tdec.PGmarks} CGPA</span>
                                        </p>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
                                        <span className="uppercase tracking-widest font-black text-slate-500">Experience</span>
                                        <span className="bg-sky-300 px-4 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] font-black text-slate-900">
                                            {Tdec.Experience} Years
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

export default Search