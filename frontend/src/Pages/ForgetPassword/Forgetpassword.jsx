import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Forgetpassword = () => {
  const [userType, setUserType] = useState('student');
  const [data, setData] = useState({ email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!data.email) {
      toast.error('Email is required', { style: { border: '4px solid #0f172a', borderRadius: '1rem', background: '#fef08a', color: '#0f172a', fontWeight: '900' }});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Please provide a valid email', { style: { border: '4px solid #0f172a', borderRadius: '1rem', background: '#fef08a', color: '#0f172a', fontWeight: '900' }});
      return;
    }

    try {
      const response = await axios.post(`/api/${userType}/forgetpassword`, { Email: data.email});
      console.log(response.data);
      toast.success('Recovery email dispatched! 📨', { style: { border: '4px solid #0f172a', borderRadius: '1rem', background: '#a3e635', color: '#0f172a', fontWeight: '900' }});
    } catch (error) {
      toast.error('An error occurred while sending the email', { style: { border: '4px solid #0f172a', borderRadius: '1rem', background: '#fca5a5', color: '#0f172a', fontWeight: '900' }});
    }
  };

  return (
    <section className='min-h-screen flex items-center justify-center p-4 bg-[#F4F4F5] font-sans selection:bg-yellow-300 selection:text-slate-900'>
      <motion.div 
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

        <button 
           onClick={() => navigate(-1)}
           className="w-10 h-10 mb-8 bg-sky-200 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center font-black text-slate-900 hover:bg-sky-300 hover:translate-y-1 hover:shadow-none transition-all"
        >
           ←
        </button>

        <h1 className='text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none'>
          Lost Your <br /> Access? 🔐
        </h1>
        <p className='text-sm font-bold text-slate-500 mb-8 max-w-sm'>
          Don't sweat it. Enter the email address associated with your account and we'll bounce a recovery link over to you.
        </p>

        <form noValidate onSubmit={onFormSubmit} className="flex flex-col gap-6 relative z-10">
          
          <div className="flex bg-slate-100 border-4 border-slate-900 p-1.5 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a]">
             <button
                type="button"
                onClick={() => setUserType('student')}
                className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors ${userType === 'student' ? 'bg-white border-2 border-slate-900 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
             >
                Student
             </button>
             <button
                type="button"
                onClick={() => setUserType('teacher')}
                className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors ${userType === 'teacher' ? 'bg-white border-2 border-slate-900 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
             >
                Teacher
             </button>
          </div>

          <div>
             <label htmlFor='email' className='block text-xs font-black uppercase tracking-widest text-slate-500 mb-2'>Email Address</label>
             <input  
               type="email"
               name="email" 
               id="email" 
               placeholder="hq@meducation.com"
               value={data.email}
               onChange={handleChange}
               className='w-full text-lg font-bold text-slate-900 bg-white p-4 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300'
             />
          </div>

          <motion.button 
             type="submit" 
             whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #0f172a" }}
             whileTap={{ scale: 0.95 }}
             className='w-full bg-yellow-400 text-slate-900 py-4 rounded-xl font-black text-xl uppercase tracking-widest border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mt-2 cursor-pointer transition-colors'
          >
            Dispatch Link 🚀
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default Forgetpassword;
