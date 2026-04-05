import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hey! 🤖 I'm your Meducation study buddy. How can I assist your learning today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          role: 'ai', 
          text: getRandomResponse() 
        }
      ]);
    }, 1500 + Math.random() * 1000);
  };

  const getRandomResponse = () => {
    const responses = [
      "That's a great question! Here's a tip: break down complex concepts into small, manageable chunks. 🍰",
      "I highly recommend checking out the 'Store' tab for premium physics study notes! 📚",
      "Remember to take short breaks every 45 minutes using the Pomodoro technique! ⏱️",
      "You've got this! Consistency is key when learning new topics. Keep practicing! 🚀",
      "If you're stuck, you can always attend a live class and ask your teacher directly! 👨‍🏫",
      "Let me pull up some resources for you... Oh wait, I'm just a simulated frontend AI. But you can search the courses! 🔍",
      "Excellent point! Make sure to review your previous chapters before moving on. 💡"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-sky-300 border-b-4 border-slate-900 p-4 flex justify-between items-center relative shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-4 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] flex justify-center items-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Study Buddy</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-slate-900"></span>
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-red-400 border-4 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all flex justify-center items-center text-white font-black"
              >
                ✕
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4">
               {/* Date Badge */}
               <div className="flex justify-center my-2">
                 <span className="bg-white border-2 border-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">Today</span>
               </div>

               {messages.map((msg) => (
                 <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className="flex flex-col gap-1 max-w-[80%]">
                      <div 
                        className={`p-3 rounded-2xl border-4 border-slate-900 text-sm font-bold shadow-[2px_2px_0px_0px_#0f172a] leading-relaxed relative ${
                          msg.role === 'user' 
                           ? 'bg-yellow-300 rounded-tr-sm text-slate-900' 
                           : 'bg-white rounded-tl-sm text-slate-700'
                        }`}
                      >
                         {msg.text}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                         {msg.role === 'user' ? 'You' : 'Buddy'}
                      </span>
                   </div>
                 </div>
               ))}

               {isTyping && (
                 <div className="flex w-full justify-start">
                   <div className="bg-white p-3 rounded-2xl rounded-tl-sm border-4 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex gap-1 items-center">
                     <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-sky-400 rounded-full border border-slate-900"></motion.div>
                     <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-emerald-400 rounded-full border border-slate-900"></motion.div>
                     <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-amber-400 rounded-full border border-slate-900"></motion.div>
                   </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-4 border-slate-900">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-100 border-4 border-slate-900 rounded-xl px-4 py-2 font-bold text-sm text-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_#0f172a] transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-emerald-400 border-4 border-slate-900 rounded-xl px-4 py-2 font-black text-sm text-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-0.5 hover:translate-x-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-yellow-400 border-4 border-slate-900 rounded-full flex justify-center items-center shadow-[6px_6px_0px_0px_#0f172a] text-3xl z-50 hover:bg-yellow-300 transition-colors"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>
    </div>
  );
}
