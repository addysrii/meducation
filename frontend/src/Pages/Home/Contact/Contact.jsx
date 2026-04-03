import React, { useState } from 'react'
import Header from '../Header/Header';
import { motion } from 'framer-motion';

function Contact({ hideHeader }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  const handlemsg = async (e) => {
    e.preventDefault();
    if (name === '' || email === '' || msg === '') {
      setStatus("error-empty")
      setTimeout(() => setStatus(''), 3000);
    } else if ((!/\S+@\S+\.\S+/.test(email))) {
      setStatus("error-email")
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus('loading')
      try {
        const data = await fetch('/api/admin/contact-us', {
          method: 'POST',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message: msg }),
        })

        const response = await data.json();
        alert(response.message);
        setStatus('success');
        setName('');
        setEmail('');
        setMsg('');
        setTimeout(() => setStatus(''), 3000);
      } catch (err) {
        setStatus('error');
      }
    }
  }

  // Determine wrapper classes depending on if it's rendered stand-alone or embedded
  const isStandalone = !hideHeader;

  return (
    <>
      {!hideHeader && <Header />}

      <div className={isStandalone ? "min-h-screen bg-[#F4F4F5] pt-32 pb-20 font-sans selection:bg-lime-400" : "w-full font-sans selection:bg-lime-400"}>
        <div className={isStandalone ? "max-w-7xl mx-auto px-6 flex flex-col items-center" : "w-full flex"}>

          {isStandalone && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12 space-y-4">
              <span className="bg-lime-400 text-slate-900 font-bold py-2 px-6 rounded-full border-2 border-slate-900 uppercase tracking-widest text-sm inline-block shadow-[4px_4px_0px_0px_#0f172a] transform -rotate-2">
                Get In Touch
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Talk to <span className="text-purple-600 underline decoration-8 decoration-yellow-400">Us</span></h2>
            </motion.div>
          )}

          <div className={`w-full flex flex-col md:flex-row items-center justify-between gap-12 bg-white ${isStandalone ? "border-4 border-slate-900 rounded-[3rem] p-8 md:p-14 shadow-[12px_12px_0px_0px_#0f172a]" : "rounded-[1rem]"}`}>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} viewport={{ once: true }}
              className="flex-1 flex justify-center w-full"
            >
              <div className="w-full max-w-[300px] h-[300px] bg-sky-200 border-4 border-slate-900 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] transform rotate-3 flex items-center justify-center p-6 hover:-rotate-3 transition-transform duration-500">
                <span className="text-[8rem]">👋</span>
              </div>
            </motion.div>

            <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="flex-1 w-full bg-purple-200 border-4 border-slate-900 rounded-[2rem] p-8 md:p-10 shadow-[8px_8px_0px_0px_#0f172a]">
              {/* The Form */}
              <form onSubmit={handlemsg} className="flex flex-col gap-6">
                <h4 className="text-3xl text-slate-900 font-black mb-2 px-2">Send Message</h4>

                <div className="space-y-4 w-full">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full box-border bg-white border-4 border-slate-900 rounded-xl px-5 py-4 font-bold text-slate-900 placeholder-slate-500 shadow-[4px_4px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full box-border bg-white border-4 border-slate-900 rounded-xl px-5 py-4 font-bold text-slate-900 placeholder-slate-500 shadow-[4px_4px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <textarea
                    placeholder="Your Message..."
                    className="w-full box-border bg-white border-4 border-slate-900 rounded-xl px-5 py-4 font-bold text-slate-900 placeholder-slate-500 shadow-[4px_4px_0px_0px_#0f172a] focus:outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all min-h-[150px] resize-none"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                </div>

                {status === 'error-empty' && <p className="text-red-600 font-bold px-2">⚠ All fields are required!</p>}
                {status === 'error-email' && <p className="text-red-600 font-bold px-2">⚠ Enter a valid email!</p>}

                <motion.button
                  whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px #0f172a" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-xl px-6 py-4 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-all uppercase tracking-wider mt-2 group box-border max-w-full"
                >
                  {status === 'loading' ? "Sending..." : "Send A Message ✨"}
                </motion.button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Contact