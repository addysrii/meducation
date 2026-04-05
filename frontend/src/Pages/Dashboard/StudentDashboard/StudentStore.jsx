import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ─── Shared helpers ────────────────────────────────────────────────────────
const SUBJECTS = ['All', 'Physics', 'Chemistry', 'Biology', 'Math', 'Computer'];
const SUBJECT_META = {
  Physics:   { icon: '🌌', bg: 'bg-sky-300' },
  Chemistry: { icon: '⚗️', bg: 'bg-emerald-300' },
  Biology:   { icon: '🧬', bg: 'bg-rose-300' },
  Math:      { icon: '📐', bg: 'bg-violet-300' },
  Computer:  { icon: '💻', bg: 'bg-amber-300' },
};

function Badge({ children, color = 'bg-yellow-300' }) {
  return (
    <span className={`${color} border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#0f172a]`}>
      {children}
    </span>
  );
}

function SubjectFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SUBJECTS.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-4 py-2 rounded-xl border-3 font-black text-xs uppercase tracking-widest transition-all
            ${value === s
              ? 'bg-slate-900 text-yellow-400 border-slate-900 shadow-[3px_3px_0px_0px_#fbbf24]'
              : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900 hover:shadow-[3px_3px_0px_0px_#0f172a]'
            }`}
        >
          {s === 'All' ? '🔭 All' : `${SUBJECT_META[s]?.icon} ${s}`}
        </button>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="h-72 rounded-[2rem] border-4 border-slate-200 bg-slate-100 animate-pulse" />
  );
}

// ─── Chapter Card ───────────────────────────────────────────────────────────
function ChapterCard({ item, studentId, onPurchased }) {
  const meta = SUBJECT_META[item.subject] || { icon: '📦', bg: 'bg-slate-200' };
  const [buying, setBuying] = useState(false);
  const owned = item.purchasedBy?.includes(studentId);

  const handleBuy = async () => {
    if (owned) {
      window.open(item.videoUrl, '_blank');
      return;
    }
    if (item.price === 0) {
      // free - direct access
      try {
        setBuying(true);
        const res = await fetch(`${api}/api/store/pay/chapter/${item._id}`, {
          method: 'POST', credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          toast.success('Access granted! Opening video…');
          onPurchased();
          window.open(item.videoUrl, '_blank');
        } else toast.error(data.message || 'Failed');
      } catch { toast.error('Network error'); }
      finally { setBuying(false); }
      return;
    }
    // Paid - Razorpay
    try {
      setBuying(true);
      const keyRes = await fetch(`${api}/api/payment/razorkey`, { credentials: 'include' });
      const keyData = await keyRes.json();

      const orderRes = await fetch(`${api}/api/store/pay/chapter/${item._id}`, {
        method: 'POST', credentials: 'include',
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { toast.error(orderData.message || 'Failed to create order'); return; }

      const options = {
        key: keyData.data.key,
        amount: orderData.data.order.amount,
        currency: 'INR',
        name: 'Meducation',
        description: item.title,
        order_id: orderData.data.order.id,
        handler: async (response) => {
          const confirmRes = await fetch(`${api}/api/store/pay/chapter/${item._id}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(response),
          });
          if (confirmRes.ok) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            toast.success('Purchase successful! 🎉');
            onPurchased();
            window.open(item.videoUrl, '_blank');
          } else toast.error('Payment confirmation failed');
        },
        theme: { color: '#fbbf24' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch { toast.error('Network error'); }
    finally { setBuying(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '8px 8px 0px 0px #0f172a' }}
      className={`bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col gap-4 relative ${owned ? 'ring-4 ring-emerald-400' : ''}`}
    >
      {owned && (
        <div className="absolute -top-3 -right-3 bg-emerald-400 border-3 border-slate-900 rounded-xl px-3 py-1 font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#0f172a]">
          ✓ Owned
        </div>
      )}

      <div className={`${meta.bg} border-3 border-slate-900 rounded-2xl px-4 py-2 flex items-center gap-3 w-fit shadow-[3px_3px_0px_0px_#0f172a]`}>
        <span className="text-xl">{meta.icon}</span>
        <span className="font-black text-xs uppercase tracking-widest">{item.subject}</span>
      </div>

      <h3 className="font-black text-lg text-slate-900 leading-snug">{item.title}</h3>
      <p className="text-sm font-bold text-slate-500 line-clamp-2 flex-1">{item.description}</p>

      <div className="flex gap-2 flex-wrap">
        {item.duration && <Badge color="bg-sky-200">⏱ {item.duration}</Badge>}
        <Badge color="bg-slate-100">👩‍🏫 {item.teacher?.Firstname} {item.teacher?.Lastname}</Badge>
        {item.notesUrl && <Badge color="bg-violet-200">📄 Notes inc.</Badge>}
        {item.practiceSheetUrl && <Badge color="bg-amber-200">📝 Practice incl.</Badge>}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-slate-100">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-black text-yellow-500">₹</span>
          <span className="text-3xl font-black text-slate-900">{item.price === 0 ? 'FREE' : item.price}</span>
        </div>
        
        <div className="flex gap-2 flex-wrap justify-end">
          {!owned && item.sampleVideoUrl && (
             <button
               onClick={() => window.open(item.sampleVideoUrl, '_blank')}
               className="flex items-center gap-1 px-3 py-2 rounded-xl border-3 border-slate-900 font-black text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] hover:-translate-y-px active:translate-y-0 bg-white text-slate-900"
             >
               👀 Free Preview
             </button>
          )}
          <button
            onClick={handleBuy}
            disabled={buying}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-3 border-slate-900 font-black text-sm uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] hover:-translate-y-px active:translate-y-0 disabled:opacity-60
              ${owned ? 'bg-emerald-400 text-slate-900' : 'bg-yellow-400 text-slate-900'}`}
          >
            {buying ? '⏳' : owned ? '▶ Watch Full' : item.price === 0 ? '🎁 Get Free' : '🛒 Buy'}
          </button>
        </div>
      </div>
      {owned && (item.notesUrl || item.practiceSheetUrl) && (
        <div className="flex flex-col gap-2 pt-3 border-t-2 border-slate-100 pb-1">
            {item.notesUrl && (
              <button onClick={() => window.open(item.notesUrl, '_blank')} className="w-full text-left text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-2 group">
                 <span className="group-hover:translate-x-1 transition-transform">📄 Download Notes</span>
              </button>
            )}
            {item.practiceSheetUrl && (
               <button onClick={() => window.open(item.practiceSheetUrl, '_blank')} className="w-full text-left text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">📝 Download Practice Sheet</span>
               </button>
            )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Notes Card ─────────────────────────────────────────────────────────────
function NotesCard({ item, studentId, onPurchased }) {
  const meta = SUBJECT_META[item.subject] || { icon: '📦', bg: 'bg-slate-200' };
  const [buying, setBuying] = useState(false);
  const owned = item.purchasedBy?.includes(studentId);

  const handleBuy = async () => {
    if (owned) { window.open(item.fileUrl, '_blank'); return; }
    if (item.price === 0) {
      try {
        setBuying(true);
        const res = await fetch(`${api}/api/store/pay/notes/${item._id}`, {
          method: 'POST', credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#a78bfa', '#34d399', '#fbbf24'] });
          toast.success('Access granted!');
          onPurchased();
          window.open(item.fileUrl, '_blank');
        } else toast.error(data.message || 'Failed');
      } catch { toast.error('Network error'); }
      finally { setBuying(false); }
      return;
    }
    try {
      setBuying(true);
      const keyRes = await fetch(`${api}/api/payment/razorkey`, { credentials: 'include' });
      const keyData = await keyRes.json();

      const orderRes = await fetch(`${api}/api/store/pay/notes/${item._id}`, {
        method: 'POST', credentials: 'include',
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { toast.error(orderData.message || 'Failed'); return; }

      const options = {
        key: keyData.data.key,
        amount: orderData.data.order.amount,
        currency: 'INR',
        name: 'Meducation',
        description: item.title,
        order_id: orderData.data.order.id,
        handler: async (response) => {
          const confirmRes = await fetch(`${api}/api/store/pay/notes/${item._id}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(response),
          });
          if (confirmRes.ok) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#a78bfa', '#34d399', '#fbbf24'] });
            toast.success('Purchase successful! 🎉');
            onPurchased();
            window.open(item.fileUrl, '_blank');
          } else toast.error('Payment confirmation failed');
        },
        theme: { color: '#fbbf24' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch { toast.error('Network error'); }
    finally { setBuying(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '8px 8px 0px 0px #0f172a' }}
      className={`bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col gap-4 relative ${owned ? 'ring-4 ring-emerald-400' : ''}`}
    >
      {owned && (
        <div className="absolute -top-3 -right-3 bg-emerald-400 border-3 border-slate-900 rounded-xl px-3 py-1 font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#0f172a]">
          ✓ Owned
        </div>
      )}

      <div className={`${meta.bg} border-3 border-slate-900 rounded-2xl px-4 py-2 flex items-center gap-3 w-fit shadow-[3px_3px_0px_0px_#0f172a]`}>
        <span className="text-xl">{meta.icon}</span>
        <span className="font-black text-xs uppercase tracking-widest">{item.subject}</span>
      </div>

      <h3 className="font-black text-lg text-slate-900 leading-snug">{item.title}</h3>
      <p className="text-sm font-bold text-slate-500 line-clamp-2 flex-1">{item.description}</p>

      <div className="flex gap-2 flex-wrap">
        {item.pageCount > 0 && <Badge color="bg-violet-200">📄 {item.pageCount} pages</Badge>}
        <Badge color="bg-slate-100">👩‍🏫 {item.teacher?.Firstname} {item.teacher?.Lastname}</Badge>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-slate-100">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-black text-yellow-500">₹</span>
          <span className="text-3xl font-black text-slate-900">{item.price === 0 ? 'FREE' : item.price}</span>
        </div>
        <button
          onClick={handleBuy}
          disabled={buying}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-3 border-slate-900 font-black text-sm uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] hover:-translate-y-px active:translate-y-0 disabled:opacity-60
            ${owned ? 'bg-emerald-400 text-slate-900' : 'bg-yellow-400 text-slate-900'}`}
        >
          {buying ? '⏳' : owned ? '📥 Download' : item.price === 0 ? '🎁 Get Free' : '🛒 Buy'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── My Library Tab ─────────────────────────────────────────────────────────
function MyLibrary({ studentId }) {
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [cRes, nRes] = await Promise.all([
          fetch(`${api}/api/store/student/${studentId}/chapters`, { credentials: 'include' }),
          fetch(`${api}/api/store/student/${studentId}/notes`, { credentials: 'include' }),
        ]);
        const [cData, nData] = await Promise.all([cRes.json(), nRes.json()]);
        if (cRes.ok) setChapters(cData.data);
        if (nRes.ok) setNotes(nData.data);
      } catch { toast.error('Could not fetch library'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [studentId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const total = chapters.length + notes.length;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">📦 My Library</h2>
        <Badge color="bg-emerald-300">{total} item{total !== 1 ? 's' : ''}</Badge>
      </div>

      {total === 0 ? (
        <div className="text-center py-24 border-4 border-dashed border-slate-300 rounded-[2.5rem] bg-white">
          <p className="text-7xl mb-4">🛒</p>
          <p className="font-black text-2xl text-slate-400 uppercase tracking-widest">Your library is empty</p>
          <p className="font-bold text-slate-400 mt-2">Browse Chapters and Notes tabs to purchase content</p>
        </div>
      ) : (
        <>
          {chapters.length > 0 && (
            <>
              <h3 className="font-black text-lg uppercase tracking-widest text-slate-700 flex items-center gap-3">
                <span className="w-8 h-8 bg-sky-300 border-3 border-slate-900 rounded-lg flex items-center justify-center text-sm">🎬</span>
                Purchased Chapters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {chapters.map((c) => (
                  <motion.div
                    key={c._id}
                    whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #0f172a' }}
                    className="bg-white border-4 border-emerald-400 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col gap-3"
                  >
                    <h4 className="font-black text-slate-900">{c.title}</h4>
                    <p className="text-xs font-bold text-slate-500">{c.subject} {c.duration && `· ${c.duration}`}</p>
                    <button
                      onClick={() => window.open(c.videoUrl, '_blank')}
                      className="mt-auto bg-sky-300 border-3 border-slate-900 rounded-xl px-4 py-2 font-black text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] hover:-translate-y-px transition-all"
                    >
                      ▶ Watch Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {notes.length > 0 && (
            <>
              <h3 className="font-black text-lg uppercase tracking-widest text-slate-700 flex items-center gap-3 mt-6">
                <span className="w-8 h-8 bg-violet-300 border-3 border-slate-900 rounded-lg flex items-center justify-center text-sm">📄</span>
                Purchased Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {notes.map((n) => (
                  <motion.div
                    key={n._id}
                    whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #0f172a' }}
                    className="bg-white border-4 border-emerald-400 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col gap-3"
                  >
                    <h4 className="font-black text-slate-900">{n.title}</h4>
                    <p className="text-xs font-bold text-slate-500">{n.subject} {n.pageCount > 0 && `· ${n.pageCount} pages`}</p>
                    <button
                      onClick={() => window.open(n.fileUrl, '_blank')}
                      className="mt-auto bg-violet-300 border-3 border-slate-900 rounded-xl px-4 py-2 font-black text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] hover:-translate-y-px transition-all"
                    >
                      📥 Download
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main StudentStore ───────────────────────────────────────────────────────
const TABS = [
  { id: 'chapters', label: 'Chapters', icon: '🎬' },
  { id: 'notes',    label: 'Notes',    icon: '📄' },
  { id: 'library',  label: 'My Library', icon: '📦' },
];

export default function StudentStore() {
  const { ID: studentId } = useParams();
  const [activeTab, setActiveTab] = useState('chapters');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchChapters = useCallback(async () => {
    setLoadingChapters(true);
    try {
      const query = subjectFilter !== 'All' ? `?subject=${subjectFilter}` : '';
      const res = await fetch(`${api}/api/store/chapters${query}`);
      const data = await res.json();
      if (res.ok) setChapters(data.data);
    } catch { toast.error('Failed to load chapters'); }
    finally { setLoadingChapters(false); }
  }, [subjectFilter, refreshKey]);

  const fetchNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      const query = subjectFilter !== 'All' ? `?subject=${subjectFilter}` : '';
      const res = await fetch(`${api}/api/store/notes${query}`);
      const data = await res.json();
      if (res.ok) setNotes(data.data);
    } catch { toast.error('Failed to load notes'); }
    finally { setLoadingNotes(false); }
  }, [subjectFilter, refreshKey]);

  useEffect(() => {
    if (activeTab === 'chapters') fetchChapters();
    if (activeTab === 'notes') fetchNotes();
  }, [activeTab, subjectFilter, refreshKey]);

  const handlePurchased = () => setRefreshKey((k) => k + 1);

  return (
    <div className="w-full flex-1 flex flex-col font-sans gap-8">

      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-5xl drop-shadow-[4px_4px_0px_#0f172a]">🛍️</span>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase" style={{ textShadow: '2px 2px 0px #fff' }}>
              Content Store
            </h1>
            <p className="font-bold text-slate-500 text-sm mt-1">Buy recorded chapters & notes from expert teachers</p>
          </div>
        </div>
      </motion.div>

      {/* Promo banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex items-center gap-6 flex-wrap"
      >
        <div className="text-5xl">🎓</div>
        <div className="flex-1">
          <p className="font-black text-xl text-slate-900 uppercase tracking-tight">Learn at your own pace</p>
          <p className="font-bold text-slate-800 text-sm mt-1">Access expert-curated video chapters & PDF notes anytime, anywhere</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/80 border-3 border-slate-900 rounded-2xl px-5 py-3 text-center shadow-[3px_3px_0px_0px_#0f172a]">
            <p className="font-black text-2xl text-slate-900">∞</p>
            <p className="font-black text-xs uppercase tracking-widest text-slate-600">Lifetime Access</p>
          </div>
          <div className="bg-white/80 border-3 border-slate-900 rounded-2xl px-5 py-3 text-center shadow-[3px_3px_0px_0px_#0f172a]">
            <p className="font-black text-2xl text-slate-900">🔒</p>
            <p className="font-black text-xs uppercase tracking-widest text-slate-600">Secure Payments</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-4 font-black uppercase tracking-widest text-sm transition-all
              ${activeTab === tab.id
                ? 'bg-slate-900 text-yellow-400 border-slate-900 shadow-[4px_4px_0px_0px_#fbbf24]'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900 hover:text-slate-900 hover:shadow-[4px_4px_0px_0px_#0f172a]'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Subject filter (only for browse tabs) */}
      <AnimatePresence>
        {(activeTab === 'chapters' || activeTab === 'notes') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SubjectFilter value={subjectFilter} onChange={setSubjectFilter} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + subjectFilter}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Chapters */}
          {activeTab === 'chapters' && (
            loadingChapters ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-24 border-4 border-dashed border-slate-300 rounded-[2.5rem] bg-white">
                <p className="text-7xl mb-4">🎬</p>
                <p className="font-black text-xl text-slate-400 uppercase tracking-widest">No chapters found</p>
                <p className="font-bold text-slate-400 mt-2">Try a different subject filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {chapters.map((c) => (
                  <ChapterCard key={c._id} item={c} studentId={studentId} onPurchased={handlePurchased} />
                ))}
              </div>
            )
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            loadingNotes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-24 border-4 border-dashed border-slate-300 rounded-[2.5rem] bg-white">
                <p className="text-7xl mb-4">📄</p>
                <p className="font-black text-xl text-slate-400 uppercase tracking-widest">No notes found</p>
                <p className="font-bold text-slate-400 mt-2">Try a different subject filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {notes.map((n) => (
                  <NotesCard key={n._id} item={n} studentId={studentId} onPurchased={handlePurchased} />
                ))}
              </div>
            )
          )}

          {/* My Library */}
          {activeTab === 'library' && <MyLibrary studentId={studentId} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
