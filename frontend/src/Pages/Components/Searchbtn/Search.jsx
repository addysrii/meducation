import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../Images/logo.svg";
import Success from "./Success";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";
function Search() {
  const [data, setData] = useState("");
  const [course, setCourse] = useState([]);
  const [courseID, setCourseID] = useState([]);
  const [popup, setPopup] = useState(false);
  const [idArray, setIdArray] = useState([]);
  const { ID } = useParams();
  const [openTM, setOpenTM] = useState(false);
  const [Tdec, setTeacherDetails] = useState(null);
  const [tname, setTname] = useState({});
  const [loading, setLoading] = useState(false);

  const price = { math: 700, physics: 800, computer: 1000, chemistry: 600, biology: 500 };
  const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const closePopup = () => {
    setPopup(false);
    window.location.reload();
  };

  const openTeacherDec = async (id, fname, lname, sub) => {
    setTname({ fname, lname, sub });
    const resData = await fetch(`${api}/api/teacher/teacherdocuments`, {
      method: 'POST',
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherID: id }),
    });
    const res = await resData.json();
    setTeacherDetails(res.data);
    setOpenTM(true);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${api}/api/course/student/${ID}/enrolled`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const user = await response.json();
        setCourseID(user.data);
        setIdArray(prev => [...prev, ...user.data.map(res => res._id)]);
      } catch (error) {
        console.log(error.message)
      }
    };
    getData();
  }, [ID]);

  const SearchTeacher = async (sub) => {
    setLoading(true);
    const subject = sub.toLowerCase();
    if (!subject) {
      setCourse([]); setLoading(false); return;
    }
    const Data = await fetch(`${api}/api/course/${subject}`);
    const response = await Data.json();
    if (response.statusCode === 200) {
      setCourse(response.data);
    } else {
      setCourse([]);
    }
    setData("");
    setLoading(false);
  };

  const handleEnroll = async (courseName, id) => {
    let check = await fetch(`${api}/api/course/${courseName}/${id}/verify/student/${ID}`, {
      method: "POST", headers: { "Content-Type": "application/json" }
    });
    const res = await check.json();
    if (res.statusCode === 200) {
      const dataReq = await fetch(`${api}/api/payment/course/${id}/${courseName}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fees: price[courseName] * 100 }),
      });
      const DATA = await dataReq.json();
      const Key = await fetch(`${api}/api/payment/razorkey`, {
        method: "GET", headers: { "Content-Type": "application/json" },
      });
      const responseKey = await Key.json();
      const options = {
        key: responseKey.data.key,
        amount: price[courseName] * 100,
        currency: "INR",
        name: "meducation",
        description: "Enroll in a course",
        image: logo,
        order_id: DATA.data.id,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          const verificationData = { razorpay_payment_id, razorpay_order_id, razorpay_signature };
          const verificationResponse = await fetch(`${api}/api/payment/confirmation/course/${id}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verificationData),
          });
          const verifyRes = await verificationResponse.json();
          if (verifyRes.statusCode === 200) {
            try {
              let enrolRes = await fetch(`${api}/api/course/${courseName}/${id}/add/student/${ID}`, {
                method: "POST", headers: { "Content-Type": "application/json" }
              });
              let finalRes = await enrolRes.json();
              setPopup(true);
            } catch (error) { console.log(error); }
          }
        },
        prefill: { name: "Gaurav Kumar", email: "gaurav.kumar@example.com" },
        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#3399cc" },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="w-full text-slate-900 font-sans">

      {/* Search Input */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex w-full items-center bg-white border-4 border-slate-900 rounded-[1.5rem] p-2 shadow-[6px_6px_0px_0px_#0f172a] mb-10 transition-all focus-within:shadow-[8px_8px_0px_0px_#0f172a]">
        <span className="text-3xl pl-4">🎯</span>
        <input
          type="text"
          placeholder="Search logic, physics, biology..."
          className="flex-1 bg-transparent px-5 py-3 text-xl font-bold placeholder-slate-400 focus:outline-none"
          value={data}
          onKeyDown={(e) => e.key === 'Enter' && SearchTeacher(data)}
          onChange={(e) => setData(e.target.value)}
        />
        <motion.button
          whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
          className="bg-purple-400 hover:bg-purple-500 text-slate-900 font-black px-8 py-4 rounded-xl border-4 border-slate-900 uppercase tracking-widest shadow-[4px_4px_0px_0px_#0f172a]"
          onClick={() => SearchTeacher(data)}
        >
          Find
        </motion.button>
      </motion.div>

      {/* Results grid */}
      <div className="w-full pb-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center p-12">
              <div className="w-12 h-12 border-8 border-slate-700 border-t-yellow-400 rounded-full animate-spin"></div>
            </motion.div>
          ) : course && course.length > 0 ? (
            <motion.div
              key="grid" initial="hidden" animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {course.map((Data) => (
                <motion.div
                  key={Data._id}
                  variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  whileHover={{ y: -6, boxShadow: "8px 8px 0px 0px #0f172a" }}
                  className="bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_#0f172a] relative transition-transform flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-lime-300 text-slate-900 text-xs font-black px-3 py-1 rounded-lg border-2 border-slate-900 uppercase tracking-widest inline-block mb-2">
                        {Data.coursename}
                      </span>
                      <h3
                        onClick={() => openTeacherDec(Data.enrolledteacher.Teacherdetails, Data.enrolledteacher.Firstname, Data.enrolledteacher.Lastname, Data.coursename)}
                        className="text-3xl font-black text-slate-900 hover:underline decoration-4 decoration-sky-400 cursor-pointer w-fit leading-none mb-1"
                      >
                        {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
                      </h3>
                      <p className="text-slate-500 font-bold mb-4">{Data.enrolledStudent.length}/20 Seats Filled</p>
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-[1rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center font-black text-2xl transform rotate-3">
                      👨‍🏫
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 mb-6 flex-1">
                    <p className="text-slate-700 font-semibold text-sm line-clamp-3">
                      <span className="font-black text-slate-900 mr-2 uppercase text-xs">Desc:</span>
                      {Data.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {Data.schedule.map((daytime, idx) => (
                        <div key={idx} className="bg-purple-200 border-2 border-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-sm flex gap-2">
                          <span className="uppercase">{daysName[daytime.day]}</span>
                          <span>{Math.floor(daytime.starttime / 60)}:{daytime.starttime % 60 === 0 ? "00" : String(daytime.starttime % 60).padStart(2, '0')} - {Math.floor(daytime.endtime / 60)}:{daytime.endtime % 60 === 0 ? "00" : String(daytime.endtime % 60).padStart(2, '0')}</span>
                        </div>
                      ))}
                    </div>

                    {idArray.includes(Data._id) ? (
                      <div className="w-full bg-slate-300 text-slate-600 font-black py-4 rounded-xl border-2 border-slate-400 text-center uppercase tracking-widest cursor-not-allowed">
                        Already Enrolled ✓
                      </div>
                    ) : Data.enrolledStudent.length < 20 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleEnroll(Data.coursename, Data._id)}
                        className="w-full bg-sky-400 text-slate-900 font-black py-4 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-center uppercase tracking-widest hover:bg-sky-500"
                      >
                        Enroll Now – ₹{price[Data.coursename]}
                      </motion.button>
                    ) : (
                      <div className="w-full bg-red-400 text-slate-900 font-black py-4 rounded-xl border-4 border-slate-900 text-center uppercase tracking-widest cursor-not-allowed opacity-80">
                        Class Full ❌
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : data !== "" && !loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 bg-white/5 border-4 border-slate-700 border-dashed rounded-[3rem]">
              <span className="text-5xl mb-4 grayscale">📭</span>
              <h3 className="text-xl font-bold text-slate-400">No subjects found for "{data}"</h3>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Teacher Modal Overlay */}
      <AnimatePresence>
        {openTM && Tdec && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className='bg-purple-300 w-full max-w-md rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] overflow-hidden'
            >
              <div className="bg-slate-900 p-8 pb-10 relative">
                <button onClick={() => setOpenTM(false)} className='absolute top-5 right-5 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-red-400 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]'>
                  ✕
                </button>
                <span className="bg-yellow-400 text-slate-900 font-black uppercase text-xs tracking-widest px-3 py-1 rounded-lg border-2 border-slate-900">
                  {tname.sub}
                </span>
                <h2 className="text-white text-3xl font-black mt-3">{tname.fname} {tname.lname}</h2>
              </div>

              <div className='p-8 space-y-4 -mt-4 bg-white rounded-t-[2rem] border-t-4 border-slate-900'>
                <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-900">
                  <p className="text-xs font-black uppercase text-slate-500 mb-1">Education</p>
                  <p className="font-bold text-slate-900">Postgraduate from <span className="text-purple-600">{Tdec.PGcollege}</span></p>
                  <p className="text-sm font-bold text-slate-600">with {Tdec.PGmarks} CGPA</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-900 flex justify-between items-center">
                  <p className="text-xs font-black uppercase text-slate-500">Experience</p>
                  <p className="font-black text-slate-900 bg-lime-300 px-3 py-1 rounded-lg border border-slate-900">{Tdec.Experience} Years</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Razorpay Success component trigger */}
      {popup && <Success onClose={closePopup} />}
    </div>
  );
}

export default Search;
