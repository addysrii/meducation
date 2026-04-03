import React from 'react'
import Creativity3D from "../../Images/Creativity3D.png";
import Growth3D from "../../Images/Growth3D.png";
import Footer from "../../Footer/Footer.jsx"
import Header from '../Header/Header.jsx';
import { motion } from 'framer-motion';

function About() {
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.5, duration: 0.8 } }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F4F5] overflow-x-hidden selection:bg-black selection:text-white pb-20">
      <Header/>
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-20 relative z-10 space-y-12">
        {/* Heading Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10"
        >
           <motion.div variants={staggerContainer} className="space-y-6 max-w-2xl">
              <motion.span variants={fadeInUp} className="bg-lime-400 text-slate-900 font-bold py-2 px-6 rounded-full border-2 border-slate-900 uppercase tracking-widest text-sm inline-block shadow-[4px_4px_0px_0px_#0f172a] transform -rotate-2">
                 About Meducation
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                Revolutionizing <br/> How We <motion.span animate={{ color: ["#9333ea", "#3b82f6", "#9333ea"] }} transition={{ duration: 4, repeat: Infinity }} className="text-purple-600 underline decoration-8 decoration-yellow-400">Learn.</motion.span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
                Discover our journey. We're dedicated to transforming global education through bold innovation and technology.
              </motion.p>
           </motion.div>
           <motion.div variants={scaleIn} className="hidden md:block">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 bg-yellow-400 rounded-full border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] flex items-center justify-center -rotate-12"
              >
                 <motion.img 
                   animate={{ rotate: -360 }} 
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   src={Growth3D} className="w-full h-full object-cover scale-[1.3]" alt="Growth" 
                 />
              </motion.div>
           </motion.div>
        </motion.div>

        {/* Content Bento Grid */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          
          {/* Our Story Card */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -10, boxShadow: "12px 12px 0px 0px #0f172a" }}
            className="bg-sky-200 border-4 border-slate-900 p-10 md:p-14 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] transition-shadow duration-300"
          >
            <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-8">
              <div className="w-full">
                <span className="inline-block py-2 px-5 rounded-full bg-white text-slate-900 font-bold border-2 border-slate-900 uppercase mb-4 shadow-[4px_4px_0px_0px_#0f172a]">
                  Our Story
                </span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">How It Started</h3>
              </div>
            </div>
            <div className="text-slate-900 font-medium space-y-6 leading-relaxed text-xl">
              <p>
                At <span className="font-bold underline decoration-4 decoration-purple-600 bg-white px-1">meducation</span>, we believe in the absolute power of education to transform lives. Our platform is naturally designed to be a gateway to knowledge, offering a massive, diverse range of courses for modern students.
              </p>
              <p>
                Meducation was born out of a relentless passion for learning and a deeply rooted desire to make excellent quality education accessible to everyone, everywhere. We strictly understand the challenges faced by modern learners.
              </p>
            </div>
          </motion.div>

          {/* Our Mission Card */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -10, boxShadow: "12px 12px 0px 0px #0f172a" }}
            className="bg-purple-300 border-4 border-slate-900 p-10 md:p-14 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#0f172a] transition-shadow duration-300"
          >
            <div className="flex flex-col items-start gap-6 mb-8">
               <motion.div 
                 whileHover={{ rotate: 12, scale: 1.1 }}
                 className="w-32 h-32 bg-white rounded-[1.5rem] border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden ml-auto -mt-6 transform rotate-6"
               >
                 <img src={Creativity3D} className="w-full h-full object-cover scale-[1.2]" alt="Creativity Idea" />
               </motion.div>
               <div className="-mt-16">
                  <span className="inline-block py-2 px-5 rounded-full bg-white text-slate-900 font-bold border-2 border-slate-900 uppercase mb-4 shadow-[4px_4px_0px_0px_#0f172a]">
                    Our Mission
                  </span>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">What We Aim For</h3>
               </div>
            </div>
            <div className="text-slate-900 font-medium space-y-6 leading-relaxed text-xl">
              <p>
                Our mission is exceedingly simple yet incredibly profound: to <span className="bg-yellow-400 font-bold px-2 py-1 rounded inline-block transform -skew-x-6 border-2 border-slate-900">empower individuals</span> through accessible education. We proactively aim to create a global learning community.
              </p>
              <p>
                By aggressively leveraging cutting edge technology and boldly innovative teaching methods, we firmly strive to make learning highly engaging, highly interactive, and outrageously enjoyable. We break down the barriers!
              </p>
            </div>
          </motion.div>

        </motion.div>
      </main>

      <Footer/>
    </div>
  )
}

export default About