import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DateTime from './DateTime';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/api';
function AddClass({ onClose }) {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState([]);
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [CourseId, setCourseId] = useState('');
  const [allowedDays, setCurrData] = useState([]);

  const DAY = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  function setToMidnight(dateTimeString) {
    let date = new Date(dateTimeString);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let totalMinutes = (hours * 60) + minutes;
    date.setUTCHours(0, 0, 0, 0);
    let modifiedDateTimeString = date.toISOString();
    return [totalMinutes, modifiedDateTimeString];
  }

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`${api}/api/course/Teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const res = await response.json();
        setCourses(res.data);
        if (res.data && res.data.length > 0) {
          setCourseId(res.data[0]._id);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getCourses();
  }, [ID]);

  useEffect(() => {
    if (CourseId) {
      const filteredData = courses.filter(course => course._id === CourseId);
      setCurrData(filteredData[0]?.schedule || []);
    }
  }, [CourseId, courses]);

  const addCourses = async () => {
    const currentDate = new Date();
    const givenDate = new Date(date);

    if (currentDate > givenDate) {
      alert('Choose a valid upcoming date!');
      return;
    } else if (note === '' || date === '' || link === '') {
      alert('All fields are required!');
      return;
    }

    const modifyDate = setToMidnight(date);

    const data = {
      title: note,
      timing: modifyDate[0],
      date: modifyDate[1],
      link: link,
      status: 'upcoming',
    };

    try {
      const response = await fetch(`${api}/api/course/${CourseId}/teacher/${ID}/add-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      alert(res.message);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      if (res.statusCode === 200) {
        onClose();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4'
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className='w-full max-w-2xl bg-sky-200 text-slate-900 rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] overflow-visible'
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 md:p-8 relative">
            <button onClick={onClose} className='absolute top-6 right-6 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-red-400 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]'>
              ✕
            </button>
            <span className="bg-yellow-400 text-slate-900 font-black tracking-widest uppercase px-3 py-1 text-xs rounded-lg border-2 border-slate-900 shadow-sm inline-block mb-3">
              Action Required
            </span>
            <h2 className="text-4xl font-black text-white tracking-tighter">
              Create Next Class 🚀
            </h2>
          </div>

          <div className='p-6 md:p-10 space-y-6 md:space-y-8 bg-white/50 overflow-visible'>

            {/* Select Course */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] relative">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Select Course</label>
              {/* 
                  Drop down arrow custom placement: The generic select arrow might look bad, 
                  adding appearance-none removes it, so we place a custom one.
                 */}
              <div className="relative">
                <select
                  value={CourseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className='w-full text-base md:text-lg font-bold text-slate-900 bg-slate-100 p-3 pr-10 rounded-xl border-4 border-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] appearance-none cursor-pointer'
                >
                  <option value="" disabled>Choose a course</option>
                  {courses && (
                    courses.filter((course) => course.isapproved)
                      .map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.coursename.toUpperCase()}
                          {' ['} {course.schedule.map(day => DAY[day.day]).join(', ')} {']'}
                        </option>
                      ))
                  )}
                </select>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-xl">▼</span>
              </div>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="bg-white p-5 md:p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col justify-center">
                <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Class Title</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  type="text"
                  placeholder="e.g. Chapter 4 Intro"
                  className='w-full text-base md:text-lg font-bold text-slate-900 bg-slate-100 p-3 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all'
                />
              </div>

              {/* overflow-visible is crucial here for absolute positioned date pickers inside DateTime component */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col justify-center overflow-visible z-50">
                <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Date & Time</label>
                <DateTime setDate={setDate} allowedDays={allowedDays} />
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Meeting Link</label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                type="url"
                placeholder="https://meet.google.com/..."
                className='w-full text-base md:text-lg font-bold text-blue-600 bg-slate-100 p-3 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all'
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-end pt-2 pb-2'>
              <motion.button
                whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px #0f172a" }}
                whileTap={{ scale: 0.95 }}
                onClick={addCourses}
                className='w-full md:w-auto bg-lime-400 hover:bg-lime-500 text-slate-900 px-10 border-4 border-slate-900 py-4 shadow-[4px_4px_0px_0px_#0f172a] rounded-xl font-black text-xl uppercase tracking-widest transition-colors cursor-pointer'
              >
                Schedule Class 🎯
              </motion.button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddClass;
