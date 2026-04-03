import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/api";
const Signup = () => {
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('student');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!Firstname.trim()) newErrors.firstname = 'First name is required';
    if (!Lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!Email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(Email)) newErrors.email = 'Invalid email format';
    if (!passwordRegex.test(Password)) newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number & symbol.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErr('');
    setErrors({});

    try {
      const response = await fetch(`${api}/api/${userType}/signup`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Firstname, Lastname, Email, Password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        navigate('/varifyEmail');
      } else if (response.status === 400) {
        setErrors(responseData.errors || {});
        setErr(responseData.message || '');
      } else {
        setErr(responseData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-sans flex flex-col md:flex-row selection:bg-lime-300 selection:text-slate-900">

      {/* Left Panel — Brand Side */}
      <div className="md:w-1/2 bg-slate-900 flex flex-col items-center justify-center p-12 relative overflow-hidden min-h-[260px]">
        <div className="absolute top-10 left-10 w-48 h-48 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 flex flex-col items-center md:items-start gap-8 w-full max-w-sm"
        >
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 bg-lime-400 rounded-2xl border-4 border-lime-300 shadow-[4px_4px_0px_0px_#a3e635] flex items-center justify-center text-3xl">
              🚀
            </div>
            <span className="text-4xl font-black text-white uppercase tracking-tighter">meducation</span>
          </NavLink>

          <div className="flex flex-col gap-4">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Join The<br />Movement! ✊
            </h1>
            <p className="text-slate-400 font-bold text-lg max-w-xs">
              Build skills, connect with teachers, and unlock your future — all in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {['🆓 Free to Sign Up', '⚡ Instant Access on Approval', '🔒 Secure & Private'].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3 rounded-xl"
              >
                <span className="font-bold text-white text-sm">{feat}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form  */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_#0f172a] p-8 md:p-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Create Account</h2>
            <p className="text-sm font-bold text-slate-500 mb-8">Fill in your details to get started on Meducation.</p>

            {/* Role Toggle */}
            <div className="flex bg-slate-100 border-4 border-slate-900 p-1.5 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] mb-6">
              {['student', 'teacher'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors ${userType === type
                    ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {type === 'student' ? '🎒 Student' : '🏫 Teacher'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className={`w-full text-lg font-bold text-slate-900 bg-white p-4 rounded-xl border-4 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300 ${errors.firstname ? 'border-red-400' : 'border-slate-900'}`}
                    value={Firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {errors.firstname && <p className="text-red-500 font-bold text-xs mt-1">{errors.firstname}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`w-full text-lg font-bold text-slate-900 bg-white p-4 rounded-xl border-4 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300 ${errors.lastname ? 'border-red-400' : 'border-slate-900'}`}
                    value={Lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {errors.lastname && <p className="text-red-500 font-bold text-xs mt-1">{errors.lastname}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                <input
                  type="text"
                  placeholder="hello@meducation.com"
                  className={`w-full text-lg font-bold text-slate-900 bg-white p-4 rounded-xl border-4 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300 ${errors.email ? 'border-red-400' : 'border-slate-900'}`}
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 font-bold text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 chars, A-Z, 0-9, @#$..."
                    className={`w-full text-lg font-bold text-slate-900 bg-white p-4 pr-14 rounded-xl border-4 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all placeholder:text-slate-300 placeholder:text-base ${errors.password ? 'border-red-400' : 'border-slate-900'}`}
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 font-bold text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Global Error */}
              {err && (
                <div className="bg-red-100 border-4 border-red-400 rounded-xl p-3 shadow-[2px_2px_0px_0px_#f87171]">
                  <p className="font-black text-red-700 text-sm">⚠ {err}</p>
                </div>
              )}

              {/* Sign in link */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">
                  Have an account?{" "}
                  <NavLink to="/login" className="font-black text-slate-900 underline underline-offset-4 hover:text-purple-600 transition-colors">
                    Log In
                  </NavLink>
                </span>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -4, boxShadow: "6px 6px 0px 0px #0f172a" } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`w-full mt-2 py-4 rounded-xl font-black text-xl uppercase tracking-widest border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-colors cursor-pointer ${loading ? 'bg-slate-300 text-slate-500' : 'bg-lime-400 text-slate-900 hover:bg-lime-500'}`}
              >
                {loading ? 'Creating Account...' : 'Create Account 🚀'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
