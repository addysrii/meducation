import React, { useState } from "react";
import "./Landing.css";
import Hero3D from "../../Images/Hero3D.png";
import Creativity3D from "../../Images/Creativity3D.png";
import Growth3D from "../../Images/Growth3D.png"
import Contact from "../Contact/Contact.jsx";
import Footer from "../../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";
import { CgProfile } from "react-icons/cg";
import { IoSchoolSharp } from "react-icons/io5";
import { FaSchool } from "react-icons/fa";
import { NavLink , useNavigate} from "react-router-dom";
import { motion } from "framer-motion";

function Landing() {
  const [LClass, setLClass] = useState(false);
  const [EMentor, setEMentor] = useState(false);
  const [subject, setSubject] = useState('');
  
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const handleSearch = ()=>{
    navigate(`/Search/${subject}`)
  }

  const AA = ()=>{
    setEMentor(true);
    setLClass(false);
  }

  const BB = ()=>{
    setEMentor(false);
    setLClass(true);
  }

  const teachersList = async(sub)=>{
    setLoading(true);

    const response = await fetch(`/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    setFacList(data.data);
    setLoading(false);
  }

  // Framer Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.5, duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-slate-900 font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white pb-20">
      <Header/>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-28 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp} 
          className="flex-[1.2] space-y-8 text-center lg:text-left z-10"
        >
          <motion.div 
            whileHover={{ rotate: 2, scale: 1.05 }}
            className="inline-block bg-sky-300 border-2 border-slate-900 rounded-full px-5 py-2 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_#0f172a] transform -rotate-2 origin-left cursor-default"
          >
            🚀 The New Era of Learning
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05]">
            Empower Minds. <br/>
            <span className="text-purple-600 underline decoration-8 decoration-yellow-400">
              Inspire Futures.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-2xl mx-auto lg:mx-0">
            Your ultimate gateway to modern education. Connect with elite mentors and crush your goals starting today.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_#0f172a] p-3 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto lg:mx-0">
            <div className="flex-1 flex items-center gap-3 px-4 w-full border-2 border-slate-200 rounded-[1.5rem] bg-slate-50 focus-within:border-slate-900 transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder='What do you want to learn? (e.g. Math)' 
                value={subject} 
                onChange={(e)=>setSubject(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-900 w-full placeholder-slate-500 py-3 font-bold text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4, boxShadow: "10px 10px 0px 0px #0f172a" }}
              className='bg-lime-400 text-slate-900 font-black text-lg py-4 px-8 rounded-[1.5rem] border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-all w-full sm:w-auto uppercase tracking-wider origin-center' 
              onClick={handleSearch}
            >
              Explore
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={popIn} 
          className="flex-1 relative w-full flex justify-center mt-12 lg:mt-0 xl:-mr-10"
        >
           <motion.div 
             animate={{ rotate: [3, -2, 3], scale: [1, 1.02, 1] }} 
             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
             className="absolute inset-0 bg-yellow-400 rounded-[3rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_#0f172a] -z-10 w-full max-w-md mx-auto h-[400px] lg:h-auto"
           />
           <motion.img 
             animate={{ y: [0, -15, 0] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             src={Hero3D} 
             className="relative w-full max-w-[500px] object-cover scale-[1.15] drop-shadow-2xl translate-y-[-2rem] lg:translate-y-[-3rem]" 
             alt="Hero 3D Illustration" 
           />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-28 bg-white border-y-4 border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <span className="bg-purple-300 text-slate-900 font-bold py-2 px-6 rounded-full border-2 border-slate-900 uppercase tracking-widest text-sm inline-block shadow-[4px_4px_0px_0px_#0f172a] transform rotate-2">
               Why Choose Us
            </span>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Experience Excellence</h3>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 relative z-10"
          >
            {[
              { click: AA, icon: "👨‍🏫", title: "Expert Mentors", desc: "Our expert mentors are the cornerstone of our educational approach. Elite support.", bg: "bg-sky-200" },
              { click: BB, icon: "💻", title: "Live Classes", desc: "We deliver ultra high-quality live classes. Interactive learning anywhere, anytime.", bg: "bg-lime-300" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -10, boxShadow: "16px 16px 0px 0px #0f172a" }} onClick={feature.click} className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 flex flex-col items-center text-center cursor-pointer transition-shadow duration-300 shadow-[8px_8px_0px_0px_#0f172a]">
                <div className={`w-24 h-24 ${feature.bg} border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-[1.5rem] flex items-center justify-center mb-8 transform ${idx % 2 === 0 ? '-rotate-3' : 'rotate-3'} transition-transform duration-300`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed font-bold text-lg">{feature.desc}</p>
              </motion.div>
            ))}

            <NavLink to='/contact'>
              <motion.div variants={fadeInUp} whileHover={{ y: -10, boxShadow: "16px 16px 0px 0px #0f172a" }} className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 flex flex-col items-center text-center cursor-pointer transition-shadow duration-300 shadow-[8px_8px_0px_0px_#0f172a] h-full block">
                <div className="w-24 h-24 bg-orange-300 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-[1.5rem] flex items-center justify-center mb-8 transform -rotate-6 transition-transform duration-300">
                  <span className="text-4xl">🤝</span>
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-4">24/7 Support</h4>
                <p className="text-slate-600 leading-relaxed font-bold text-lg">Challenge at midnight? Our dedicated team is here to provide absolute guidance.</p>
              </motion.div>
            </NavLink>
          </motion.div>

          {/* Conditional Features Details */}
          <div className="min-h-[400px] flex items-center justify-center w-full mt-10">
            {LClass && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring" }} className="flex flex-col md:flex-row items-center justify-center gap-16 bg-sky-200 border-4 border-slate-900 p-10 md:p-14 rounded-[3rem] w-full shadow-[12px_12px_0px_0px_#0f172a]">
                <div className="relative w-full max-w-md bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] p-4 transform -rotate-2">
                  <img src="https://lh3.googleusercontent.com/kq1PrZ8Kh1Pomlbfq4JM1Gx4z-oVr3HG9TEKzwZfqPLP3TdVYrx0QrIbpR-NmMwgDzhNTgi3FzuzseMpjzkfNrdHK5AzWGZl_RtKB80S-GZmWOQciR9s=w1296-v1-e30" alt="Live Class" className="rounded-[2rem] border-2 border-slate-200" />
                </div>
                <div className="text-center md:text-left space-y-6 max-w-lg">
                  <span className="inline-block py-2 px-5 rounded-full bg-white text-slate-900 font-bold text-sm tracking-wider border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] uppercase">Live Sessions</span>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">The Ultimate <br/>Classroom.</h3>
                  <p className="text-slate-700 text-xl leading-relaxed font-bold">
                    Immerse yourself in real-time learning. High-definition streams and brutal collaboration tools make learning aggressive and effective.
                  </p>
                </div>
              </motion.div>
            )}

            {EMentor && (
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {[
                  { img: "https://media.istockphoto.com/id/1310210662/photo/portrait-of-indian-woman-as-a-teacher-in-sari-standing-isolated-over-white-background-stock.jpg?s=612x612&w=0&k=20&c=EMI42nCFpak1c4JSFvwfN0Qllyxt19dlihYEXAdnCXY=", name: "Prof. Dina Sharma", uni: "Galaxy Uni", deg: "Ph.D. Astrophysics", bg: "bg-pink-300" },
                  { img: "https://media.istockphoto.com/id/1324558913/photo/confident-young-man-in-casual-green-shirt-looking-away-standing-with-crossed-arms-isolated-on.jpg?s=612x612&w=0&k=20&c=NOrKRrUuxvePKijL9sFBHlDwHESv7Van68-hoS-_4hQ=", name: "Dr. Anand Mishra", uni: "Maharishi Uni", deg: "Ph.D. Physics", bg: "bg-lime-300" },
                  { img: "https://media.istockphoto.com/id/1663458254/photo/portrait-of-beautiful-indian-woman-in-sari.jpg?s=612x612&w=0&k=20&c=raeTJOEyA4sFX_GwrgboXt9ZxtAZ8RkFuljPJnL9sCU=", name: "Prof. Sunita Patel", uni: "Ramanujan Inst", deg: "D.Phil. Numbers", bg: "bg-orange-300" }
                ].map((mentor, i) => (
                  <motion.div variants={popIn} key={i} className={`bg-white border-4 border-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-[8px_8px_0px_0px_#0f172a] transform transition-transform hover:-translate-y-2`}>
                    <div className={`w-32 h-32 rounded-[2rem] border-4 border-slate-900 mb-6 shadow-[4px_4px_0px_0px_#0f172a] overflow-hidden ${mentor.bg} transform rotate-3`}>
                      <img className="w-full h-full object-cover scale-110" src={mentor.img} alt={mentor.name}/>
                    </div>
                    <div className="space-y-4 w-full">
                      <h4 className="text-slate-900 font-black text-2xl">{mentor.name}</h4>
                      <div className="flex items-center justify-center gap-2 text-slate-700 font-bold border-2 border-slate-200 py-1.5 px-3 rounded-xl bg-slate-50"><FaSchool className="text-slate-900" /> {mentor.uni}</div>
                      <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-sm bg-yellow-400 py-2 px-4 rounded-xl border-2 border-slate-900">{mentor.deg}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Courses/Faculty Selection */}
      <section className="py-28 max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 space-y-4">
          <span className="bg-lime-400 text-slate-900 font-bold py-2 px-6 rounded-full border-2 border-slate-900 uppercase tracking-widest text-sm inline-block shadow-[4px_4px_0px_0px_#0f172a] transform -rotate-2">
            Explore Subjects
          </span>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Find Your Faculty</h3>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { tag: "physics", label: "Physics", emoji: "⚛️", color: "bg-purple-300" },
            { tag: "chemistry", label: "Chemistry", emoji: "🧪", color: "bg-sky-300" },
            { tag: "biology", label: "Biology", emoji: "🧬", color: "bg-lime-300" },
            { tag: "math", label: "Math", emoji: "🧮", color: "bg-orange-300" },
            { tag: "computer", label: "Computer", emoji: "💻", color: "bg-yellow-400" },
          ].map((sub) => (
            <motion.div 
              variants={popIn}
              whileHover={{ y: -8, boxShadow: "10px 10px 0px 0px #0f172a" }}
              key={sub.tag} 
              onClick={() => teachersList(sub.tag)} 
              className={`bg-white border-4 border-slate-900 w-36 h-36 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer shadow-[6px_6px_0px_0px_#0f172a] transition-shadow group`}
            >
              <div className={`w-16 h-16 ${sub.color} rounded-2xl border-4 border-slate-900 flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_#0f172a] transform group-hover:rotate-12 transition-transform duration-300`}>
                {sub.emoji}
              </div>
              <p className="text-slate-900 font-black uppercase tracking-wider text-sm">{sub.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Faculty Results */}
        {loading === false && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facList && facList.length > 0 ? facList.map(fac => (
              <motion.div variants={fadeInUp} whileHover={{ y: -5 }} key={fac._id} className="bg-white border-4 border-slate-900 p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] transition-all relative">
                <div className="flex gap-5 items-center mb-6 pb-6 border-b-4 border-slate-900">
                  <div className="w-16 h-16 rounded-2xl bg-sky-200 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="Profile" className="w-[120%] h-[120%] object-cover mt-2" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xl font-black text-slate-900 truncate">{fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}</p>
                    <p className="text-sm font-bold text-slate-500 truncate">{fac.enrolledteacher.Email}</p>
                  </div>
                </div>
                <div className="space-y-4 text-slate-800 font-bold">
                  <div className="bg-yellow-100 p-4 rounded-2xl border-4 border-slate-900 flex items-start gap-3 shadow-[4px_4px_0px_0px_#0f172a]">
                    <IoSchoolSharp className="text-slate-900 mt-1 shrink-0 text-xl" />
                    <p className="text-sm">
                      <span className="block text-slate-900 font-black mb-1 uppercase tracking-widest text-xs">Education</span>
                      {fac.enrolledteacher.Email === "urttsg@gmail.com" ? "PG Calcutta Univ." : "PG Sister Nivedita"}
                    </p>
                  </div>
                  <div className="bg-lime-100 p-4 rounded-2xl border-4 border-slate-900 flex items-start gap-3 shadow-[4px_4px_0px_0px_#0f172a]">
                    <FaSchool className="text-slate-900 mt-0.5 shrink-0 text-lg" />
                    <p className="text-sm">
                      <span className="block text-slate-900 font-black mb-1 uppercase tracking-widest text-xs">Experience</span>
                      {fac.enrolledteacher.Email === "urttsg@gmail.com" ? "1 year pro" : "2 years pro"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="col-span-full text-center py-20 bg-white rounded-[3rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a]">
                <div className="w-24 h-24 bg-red-200 border-4 border-slate-900 rounded-[2rem] shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-center mx-auto mb-6 transform rotate-3">
                  <span className="text-4xl">❌</span>
                </div>
                <p className="text-3xl text-slate-900 font-black mb-2 tracking-tight">No mentors found</p>
                <p className="text-slate-600 font-bold text-lg">Please select a different learning path.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* Styled About Section */}
      <section className="relative py-28 bg-white border-y-4 border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6 max-w-2xl">
            <span className="bg-yellow-400 text-slate-900 font-bold py-2 px-6 rounded-full border-2 border-slate-900 uppercase tracking-widest text-sm inline-block shadow-[4px_4px_0px_0px_#0f172a]">
              Our Foundation
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              Mission <br /> <span className="text-sky-500">Unstoppable.</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -15 }} whileInView={{ opacity: 1, scale: 1, rotate: 3 }} transition={{ type: "spring", bounce: 0.5 }} viewport={{ once: true }} className="flex-1 w-full flex justify-center md:justify-end">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-pink-300 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] p-4 flex items-center justify-center overflow-hidden">
              <img src={Growth3D} className="w-full h-full object-cover scale-125" alt="Mission 3D" />
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div variants={fadeInUp} whileHover={{ y: -5, boxShadow: "12px 12px 0px 0px #0f172a" }} className="bg-sky-200 border-4 border-slate-900 p-10 md:p-12 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] transition-shadow">
              <span className="inline-block py-2 px-5 rounded-full bg-white text-slate-900 font-bold border-2 border-slate-900 uppercase mb-4 shadow-[4px_4px_0px_0px_#0f172a]">
                Our Story
              </span>
              <p className="text-slate-900 font-bold text-xl leading-relaxed mt-4">
                Born out of a huge passion for learning and a desire to make absolutely prime education truly accessible to everyone. We understand the challenges. We build solutions.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -5, boxShadow: "12px 12px 0px 0px #0f172a" }} className="bg-lime-300 border-4 border-slate-900 p-10 md:p-12 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] transition-shadow">
              <span className="inline-block py-2 px-5 rounded-full bg-white text-slate-900 font-bold border-2 border-slate-900 uppercase mb-4 shadow-[4px_4px_0px_0px_#0f172a]">
                Our Mission
              </span>
              <p className="text-slate-900 font-bold text-xl leading-relaxed mt-4">
                To radically empower individuals through supreme education. We aim to aggressively create a global learning community where limits do not exist.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section Wrapper */}
      <section className="relative py-28 z-20 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.2 }} className="bg-purple-200 p-10 md:p-14 rounded-[3rem] shadow-[12px_12px_0px_0px_#0f172a] border-4 border-slate-900 relative overflow-hidden">
          <div className="relative z-10 w-full bg-white p-8 rounded-[2rem] border-4 border-slate-900 shadow-inner">
            <Contact />
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
