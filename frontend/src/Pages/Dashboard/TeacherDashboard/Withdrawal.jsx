import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/api';
function Withdrawal({ onClose, TA }) {
  const { ID } = useParams();
  const [amount, setAmount] = useState('');
  const [accName, setAccName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifc, setIfc] = useState('');

  const handleWithdrawl = async () => {
    if (accName === '' || accNumber === '' || ifc === '' || amount === '') {
      alert('All fields are required 📝');
    } else if (parseFloat(TA) < parseFloat(amount)) {
      alert('Insufficient Amount 💸');
    } else if (parseFloat(amount) <= 0 || isNaN(amount)) {
      alert('Enter a valid Remuneration Amount 📈');
    } else {
      try {
        const response = await fetch(`${api}/api/payment/teacher/${ID}/withdraw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: parseFloat(amount) })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        console.log(user);
        alert('Withdrawal request submitted successfully! 🎉');
        onClose();
      } catch (error) {
        console.log(error);
        alert('Failed to process withdrawal. Please try again.');
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 font-sans"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 30, opacity: 0 }} 
          animate={{ scale: 1, y: 0, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-yellow-400 text-slate-900 w-full max-w-md rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f172a] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 relative">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xl hover:bg-red-400 hover:text-white transition-colors z-10 shadow-[4px_4px_0px_0px_#0f172a]"
            >
              ✕
            </button>
            <span className="bg-green-400 text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-900 font-black uppercase text-xs tracking-widest shadow-sm inline-block mb-3">
              Payouts
            </span>
            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              Remuneration 💸
            </h2>
          </div>

          {/* Form */}
          <div className="bg-white/50 p-6 md:p-8 space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 flex justify-between items-center shadow-sm">
              <span className="font-black uppercase tracking-widest text-xs text-slate-500">Available Balance</span>
              <span className="font-black text-xl text-green-600">₹ {TA || "0"}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-900">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full text-lg font-bold text-slate-900 bg-white p-3 pl-8 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-2">A/C Holder Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full text-lg font-bold text-slate-900 bg-white p-3 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all" 
                  value={accName} 
                  onChange={(e) => setAccName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-2">Account Number</label>
                <input 
                  type="text" 
                  placeholder="XXXXXXXXXXXX" 
                  className="w-full text-lg font-bold text-slate-900 bg-white p-3 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all" 
                  value={accNumber} 
                  onChange={(e) => setAccNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-2">IFSC Code</label>
                <input 
                  type="text" 
                  placeholder="SBIN000XXXX" 
                  className="w-full text-lg font-bold text-slate-900 bg-white p-3 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all uppercase" 
                  value={ifc} 
                  onChange={(e) => setIfc(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="pt-4">
              <motion.button 
                whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #0f172a" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWithdrawl} 
                className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-black px-6 py-4 rounded-xl border-4 border-slate-900 uppercase tracking-widest shadow-[4px_4px_0px_0px_#0f172a] transition-colors"
              >
                Submit Request 🏦
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Withdrawal;