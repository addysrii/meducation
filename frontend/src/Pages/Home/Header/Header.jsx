import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../Images/logo.svg';

function Header() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userSession");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch (e) {
        // invalid JSON
      }
    }
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#F4F4F5] border-b-4 border-slate-900 px-6 py-4 flex items-center justify-between shadow-[0px_4px_0px_0px_#0f172a]">
        <NavLink to='/'>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] transform group-hover:-rotate-12 transition-transform">
              <img src={Logo} alt="logo" className="w-6 h-6" />
            </div>
            <h1 className='text-3xl text-slate-900 font-black tracking-tighter'>meducation</h1>
          </div>
        </NavLink>

        <nav className="hidden md:block bg-white border-4 border-slate-900 rounded-[1.5rem] shadow-[4px_4px_0px_0px_#0f172a] px-6 py-2">
          <ul className="flex items-center gap-8 font-black uppercase tracking-widest text-sm text-slate-900">
            <li className="hover:-translate-y-1 transition-transform"><NavLink to='/' className={({ isActive }) => isActive ? "text-purple-600 underline decoration-4 underline-offset-4" : "hover:text-purple-600"}>Home</NavLink></li>
            <li className="hover:-translate-y-1 transition-transform"><NavLink to='/courses' className={({ isActive }) => isActive ? "text-purple-600 underline decoration-4 underline-offset-4" : "hover:text-purple-600"}>Courses</NavLink></li>
            <li className="hover:-translate-y-1 transition-transform"><NavLink to='/about' className={({ isActive }) => isActive ? "text-purple-600 underline decoration-4 underline-offset-4" : "hover:text-purple-600"}>About</NavLink></li>
            <li className="hover:-translate-y-1 transition-transform"><NavLink to='/contact' className={({ isActive }) => isActive ? "text-purple-600 underline decoration-4 underline-offset-4" : "hover:text-purple-600"}>Contact</NavLink></li>
          </ul>
        </nav>

        <div className='flex gap-4'>
          {session ? (
            <NavLink to={session.type === 'student' ? `/Student/Dashboard/${session.id}/Search` : `/Teacher/Dashboard/${session.id}/Home`}>
              <button className="bg-sky-300 hover:bg-sky-400 text-slate-900 font-black px-6 py-2 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 transition-all uppercase tracking-wider">
                Dashboard
              </button>
            </NavLink>
          ) : (
            <>
              <NavLink to='/login'>
                <button className="bg-white hover:bg-slate-50 text-slate-900 font-black px-6 py-2 rounded-[1rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 transition-all uppercase tracking-wider hidden sm:block">
                  Login
                </button>
              </NavLink>
              <NavLink to='/signup'>
                <button className="bg-purple-400 hover:bg-purple-500 text-slate-900 font-black px-6 py-2 rounded-[1rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 transition-all uppercase tracking-wider">
                  Signup
                </button>
              </NavLink>
            </>
          )}
        </div>
      </header>
    </>
  )
}

export default Header;
