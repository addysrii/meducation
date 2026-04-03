import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/api';

const toastStyle = { border: '4px solid #0f172a', borderRadius: '1rem', fontWeight: '900' };

const ResetPassword = () => {
  const [data, setData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = data;

    if (!password || !confirmPassword) {
      toast.error('Both fields are required', { style: { ...toastStyle, background: '#fca5a5', color: '#0f172a' } });
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match 🔑', { style: { ...toastStyle, background: '#fca5a5', color: '#0f172a' } });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password needs 8+ chars, uppercase, lowercase, number & symbol.', { style: { ...toastStyle, background: '#fef08a', color: '#0f172a' } });
      return;
    }

    const response = axios.post(`${api}/api/student/forgetpassword/${token}`, { password, confirmPassword });
    toast.promise(response, {
      loading: 'Processing your request...',
      success: (res) => res?.data?.message || 'Password updated! 🎉',
      error: 'Link expired. Please try again.',
    }, { style: { ...toastStyle, background: '#a3e635', color: '#0f172a' } });

    if ((await response).data.success) {
      navigate('/login');
    }
  };

  return (
    <section className='min-h-screen flex items-center justify-center p-4 bg-[#F4F4F5] font-sans selection:bg-yellow-300 selection:text-slate-900'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] relative overflow-hidden"
      >
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-lime-200 rounded-full blur-3xl -mr-16 -mt-16 opacity-60 pointer-events-none" />

        {/* Header */}
        <div className="mb-8">
          <span className="inline-block bg-purple-300 text-slate-900 font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] mb-4">
            Password Reset
          </span>
          <h1 className='text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3'>
            New<br/>Password 🔒
          </h1>
          <div className="bg-yellow-100 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#0f172a]">
            <p className='text-xs font-bold text-slate-700'>
              ⏳ This link is valid for <span className="font-black text-slate-900">15 minutes</span>. Please act quickly before it expires.
            </p>
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">

          {/* Password Field */}
          <div>
            <label htmlFor="password" className='block text-xs font-black uppercase tracking-widest text-slate-500 mb-2'>
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Min. 8 chars, A-Z, 0-9, @#$..."
                value={data.password}
                onChange={handleChange}
                className='w-full text-lg font-bold text-slate-900 bg-white pr-14 p-4 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300 placeholder:text-base'
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className='block text-xs font-black uppercase tracking-widest text-slate-500 mb-2'>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Repeat your new password"
                value={data.confirmPassword}
                onChange={handleChange}
                className='w-full text-lg font-bold text-slate-900 bg-white pr-14 p-4 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300 placeholder:text-base'
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Password strength hint */}
          <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password must include:</p>
            <div className="grid grid-cols-2 gap-1">
              {['8+ characters', 'Uppercase (A-Z)', 'Lowercase (a-z)', 'Symbol (@$!&...)'].map((req) => (
                <span key={req} className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <span className="text-lime-500 font-black">✓</span> {req}
                </span>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #0f172a" }}
            whileTap={{ scale: 0.95 }}
            className='w-full mt-2 bg-lime-400 text-slate-900 py-4 rounded-xl font-black text-xl uppercase tracking-widest border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] cursor-pointer transition-colors hover:bg-lime-500'
          >
            Reset Password ✅
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ResetPassword;
