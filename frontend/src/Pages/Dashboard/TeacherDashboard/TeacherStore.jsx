import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/api';
import toast from 'react-hot-toast';

// ─── Shared helpers ──────────────────────────────────────────────────────────
const SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Math', 'Computer'];
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

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-black uppercase tracking-widest text-slate-700">{label}</label>}
      <input
        className="border-3 border-slate-900 rounded-xl px-4 py-3 font-bold text-slate-900 bg-white shadow-[3px_3px_0px_0px_#0f172a] focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-slate-400 transition"
        {...props}
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-black uppercase tracking-widest text-slate-700">{label}</label>}
      <textarea
        rows={3}
        className="border-3 border-slate-900 rounded-xl px-4 py-3 font-bold text-slate-900 bg-white shadow-[3px_3px_0px_0px_#0f172a] focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-slate-400 resize-none transition"
        {...props}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-black uppercase tracking-widest text-slate-700">{label}</label>}
      <select
        className="border-3 border-slate-900 rounded-xl px-4 py-3 font-bold text-slate-900 bg-white shadow-[3px_3px_0px_0px_#0f172a] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition appearance-none"
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest border-3 border-slate-900 transition-all shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] hover:-translate-y-px active:translate-y-0 active:shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer';
  const variants = {
    primary: 'bg-yellow-400 text-slate-900',
    danger:  'bg-red-400 text-white',
    ghost:   'bg-white text-slate-900',
    green:   'bg-emerald-400 text-slate-900',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
}

// ─── Card component for listing items ────────────────────────────────────────
function StoreCard({ item, type, onDelete }) {
  const meta = SUBJECT_META[item.subject] || { icon: '📦', bg: 'bg-slate-200' };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #0f172a' }}
      className="bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col gap-4 relative"
    >
      <div className={`${meta.bg} border-3 border-slate-900 rounded-2xl px-4 py-2 flex items-center gap-3 w-fit shadow-[3px_3px_0px_0px_#0f172a]`}>
        <span className="text-2xl">{meta.icon}</span>
        <span className="font-black text-sm uppercase tracking-widest">{item.subject}</span>
      </div>

      <h3 className="font-black text-xl text-slate-900 leading-tight">{item.title}</h3>
      <p className="text-sm font-bold text-slate-500 line-clamp-2">{item.description}</p>

      <div className="flex items-center gap-3 flex-wrap mt-auto">
        <Badge color="bg-yellow-300">
          {item.price === 0 ? 'FREE' : `₹${item.price}`}
        </Badge>
        {type === 'chapter' && item.duration && <Badge color="bg-sky-300">⏱ {item.duration}</Badge>}
        {type === 'notes' && item.pageCount > 0 && <Badge color="bg-violet-300">📄 {item.pageCount} pages</Badge>}
        <Badge color={item.isPublished ? 'bg-emerald-300' : 'bg-red-300'}>
          {item.isPublished ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-t-2 border-slate-200 pt-3">
        <span>👥 {(item.purchasedBy?.length ?? 0)} student{(item.purchasedBy?.length ?? 0) !== 1 ? 's' : ''} purchased</span>
        <span className="ml-auto">🗓 {new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
      </div>

      <button
        onClick={() => onDelete(item._id)}
        className="absolute top-4 right-4 w-9 h-9 rounded-xl border-3 border-slate-900 bg-red-100 hover:bg-red-400 hover:text-white flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_#0f172a] transition-all"
        title="Delete"
      >✕</button>
    </motion.div>
  );
}

// ─── Tab: Chapters ────────────────────────────────────────────────────────────
function ChaptersTab({ teacherId }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subject: '', price: '', videoUrl: '', sampleVideoUrl: '', thumbnailUrl: '', duration: '', notesUrl: '', practiceSheetUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/api/store/chapters/teacher/${teacherId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) setChapters(data.data);
      else toast.error(data.message || 'Failed to fetch chapters');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchChapters(); }, [teacherId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.subject || !form.videoUrl || form.price === '') {
      toast.error('Please fill all required fields');
      return;
    }
    const toastId = toast.loading('Creating chapter...');
    setSubmitting(true);
    try {
      const res = await fetch(`${api}/api/store/chapter/create/${teacherId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Chapter created!', { id: toastId });
        setShowForm(false);
        setForm({ title: '', description: '', subject: '', price: '', videoUrl: '', sampleVideoUrl: '', thumbnailUrl: '', duration: '', notesUrl: '', practiceSheetUrl: '' });
        fetchChapters();
      } else {
        toast.error(data.message || 'Failed', { id: toastId });
      }
    } catch { toast.error('Network error', { id: toastId }); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this chapter?')) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`${api}/api/store/chapter/${id}/teacher/${teacherId}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) { toast.success('Deleted', { id: toastId }); fetchChapters(); }
      else toast.error('Failed to delete', { id: toastId });
    } catch { toast.error('Network error', { id: toastId }); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">🎬 Recorded Chapters</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Upload and sell your recorded lectures</p>
        </div>
        <Btn variant="green" onClick={() => setShowForm((s) => !s)}>
          {showForm ? '✕ Cancel' : '+ New Chapter'}
        </Btn>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white border-4 border-slate-900 rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_#0f172a] grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Input label="Chapter Title *" placeholder="e.g. Newton's Laws of Motion" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Select label="Subject *" options={SUBJECTS} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <div className="md:col-span-2">
                <Textarea label="Description *" placeholder="What will students learn?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Input label="Price (₹) * — set 0 for free" type="number" min="0" placeholder="e.g. 299" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input label="Duration" placeholder="e.g. 45 mins" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border-4 border-slate-200 bg-slate-50">
                <h3 className="md:col-span-2 font-black uppercase text-sm tracking-widest text-slate-700">Video Content</h3>
                <Input label="Main Full Video URL *" placeholder="https://..." value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
                <Input label="Free Sample Video URL (optional)" placeholder="https://..." value={form.sampleVideoUrl} onChange={(e) => setForm({ ...form, sampleVideoUrl: e.target.value })} />
                <div className="md:col-span-2">
                   <Input label="Thumbnail Image URL (optional)" placeholder="https://..." value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border-4 border-slate-200 bg-slate-50">
                <h3 className="md:col-span-2 font-black uppercase text-sm tracking-widest text-slate-700">Supplementary Materials (unlocked on purchase)</h3>
                <Input label="Lecture Notes PDF URL (optional)" placeholder="https://..." value={form.notesUrl} onChange={(e) => setForm({ ...form, notesUrl: e.target.value })} />
                <Input label="Practice Sheet PDF URL (optional)" placeholder="https://..." value={form.practiceSheetUrl} onChange={(e) => setForm({ ...form, practiceSheetUrl: e.target.value })} />
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <Btn type="submit" variant="primary" disabled={submitting}>{submitting ? 'Creating…' : '🚀 Publish Chapter'}</Btn>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-[2rem] border-4 border-slate-200 bg-slate-100 animate-pulse"/>)}
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-20 border-4 border-dashed border-slate-300 rounded-[2.5rem] bg-white">
          <p className="text-6xl mb-4">🎬</p>
          <p className="font-black text-xl text-slate-400 uppercase tracking-widest">No chapters yet</p>
          <p className="font-bold text-slate-400 mt-2">Click "New Chapter" to publish your first recorded lecture</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {chapters.map((c) => <StoreCard key={c._id} item={c} type="chapter" onDelete={handleDelete} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ─── Tab: Notes ───────────────────────────────────────────────────────────────
function NotesTab({ teacherId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subject: '', price: '', fileUrl: '', coverUrl: '', pageCount: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/api/store/notes/teacher/${teacherId}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setNotes(data.data);
      else toast.error(data.message || 'Failed');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(); }, [teacherId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.subject || !form.fileUrl || form.price === '') {
      toast.error('Please fill all required fields');
      return;
    }
    const toastId = toast.loading('Publishing notes...');
    setSubmitting(true);
    try {
      const res = await fetch(`${api}/api/store/notes/create/${teacherId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, price: Number(form.price), pageCount: Number(form.pageCount) || 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Notes published!', { id: toastId });
        setShowForm(false);
        setForm({ title: '', description: '', subject: '', price: '', fileUrl: '', coverUrl: '', pageCount: '' });
        fetchNotes();
      } else toast.error(data.message || 'Failed', { id: toastId });
    } catch { toast.error('Network error', { id: toastId }); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete these notes?')) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`${api}/api/store/notes/${id}/teacher/${teacherId}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) { toast.success('Deleted', { id: toastId }); fetchNotes(); }
      else toast.error('Failed', { id: toastId });
    } catch { toast.error('Network error', { id: toastId }); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">📄 Study Notes</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Sell your handcrafted study materials</p>
        </div>
        <Btn variant="green" onClick={() => setShowForm((s) => !s)}>
          {showForm ? '✕ Cancel' : '+ New Notes'}
        </Btn>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white border-4 border-slate-900 rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_#0f172a] grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Input label="Notes Title *" placeholder="e.g. Organic Chemistry — Full Notes" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Select label="Subject *" options={SUBJECTS} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <div className="md:col-span-2">
                <Textarea label="Description *" placeholder="What is covered in this notes set?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Input label="Price (₹) * — set 0 for free" type="number" min="0" placeholder="e.g. 149" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input label="Page Count" type="number" min="0" placeholder="e.g. 120" value={form.pageCount} onChange={(e) => setForm({ ...form, pageCount: e.target.value })} />
              <Input label="File / PDF URL *" placeholder="https://your-notes-link.com/..." value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
              <Input label="Cover Image URL (optional)" placeholder="https://your-cover.com/..." value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
              <div className="md:col-span-2 flex justify-end">
                <Btn type="submit" variant="primary" disabled={submitting}>{submitting ? 'Publishing…' : '🚀 Publish Notes'}</Btn>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-[2rem] border-4 border-slate-200 bg-slate-100 animate-pulse"/>)}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20 border-4 border-dashed border-slate-300 rounded-[2.5rem] bg-white">
          <p className="text-6xl mb-4">📄</p>
          <p className="font-black text-xl text-slate-400 uppercase tracking-widest">No notes yet</p>
          <p className="font-bold text-slate-400 mt-2">Click "New Notes" to publish your first study material</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {notes.map((n) => <StoreCard key={n._id} item={n} type="notes" onDelete={handleDelete} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ─── Tab: Courses (set prices) ────────────────────────────────────────────────
function CoursePricingTab({ teacherId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editThumb, setEditThumb] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/api/course/teacher/${teacherId}/enrolled`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setCourses(data.data);
      else toast.error(data.message || 'Failed');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, [teacherId]);

  const savePrice = async (courseId) => {
    if (editPrice === '') return toast.error('Enter a price');
    const toastId = toast.loading('Saving...');
    try {
      const res = await fetch(`${api}/api/store/course/${courseId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ price: Number(editPrice), thumbnail: editThumb }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Price updated!', { id: toastId });
        setEditId(null);
        fetchCourses();
      } else toast.error(data.message || 'Failed', { id: toastId });
    } catch { toast.error('Network error', { id: toastId }); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">📚 Course Pricing</h2>
        <p className="text-sm font-bold text-slate-500 mt-1">Set enrollment prices for your approved courses</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-48 rounded-[2rem] border-4 border-slate-200 bg-slate-100 animate-pulse"/>)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 border-4 border-dashed border-slate-300 rounded-[2.5rem] bg-white">
          <p className="text-6xl mb-4">📚</p>
          <p className="font-black text-xl text-slate-400 uppercase tracking-widest">No courses found</p>
          <p className="font-bold text-slate-400 mt-2">Create courses from the Courses tab first</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <motion.div
              key={c._id}
              whileHover={{ y: -3, boxShadow: '8px 8px 0px 0px #0f172a' }}
              className="bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-xl text-slate-900 uppercase">{c.coursename}</h3>
                  <p className="text-sm font-bold text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                </div>
                <Badge color={c.isapproved ? 'bg-emerald-300' : 'bg-red-300'}>
                  {c.isapproved ? 'Approved' : 'Pending'}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-yellow-50 border-3 border-slate-900 rounded-xl px-5 py-3 flex items-center gap-3 shadow-[3px_3px_0px_0px_#0f172a]">
                  <span className="text-2xl font-black text-yellow-500">₹</span>
                  <span className="font-black text-3xl text-slate-900">{c.price ?? 0}</span>
                  <span className="text-sm font-bold text-slate-400">/ enrollment</span>
                </div>
                <Btn variant="ghost" onClick={() => { setEditId(editId === c._id ? null : c._id); setEditPrice(c.price ?? 0); setEditThumb(c.thumbnail ?? ''); }}>
                  {editId === c._id ? '✕' : '✏️ Edit'}
                </Btn>
              </div>

              <AnimatePresence>
                {editId === c._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-4 pt-2">
                      <Input label="Price (₹) * — set 0 for free" type="number" min="0" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                      <Input label="Thumbnail URL (optional)" placeholder="https://..." value={editThumb} onChange={(e) => setEditThumb(e.target.value)} />
                      <Btn variant="primary" onClick={() => savePrice(c._id)}>💾 Save Price</Btn>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 items-center text-xs font-bold text-slate-400 border-t-2 border-slate-100 pt-3">
                <span>👥 {c.enrolledStudent?.length ?? 0} enrolled</span>
                <span className="ml-auto">🗓 {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main TeacherStore component ──────────────────────────────────────────────
const TABS = [
  { id: 'courses',  label: 'Courses',   icon: '📚' },
  { id: 'chapters', label: 'Chapters',  icon: '🎬' },
  { id: 'notes',    label: 'Notes',     icon: '📄' },
];

export default function TeacherStore() {
  const { ID: teacherId } = useParams();
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="w-full flex-1 flex flex-col font-sans gap-8">

      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-5xl drop-shadow-[4px_4px_0px_#0f172a]">🛒</span>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase" style={{ textShadow: '2px 2px 0px #fff' }}>
              My Store
            </h1>
            <p className="font-bold text-slate-500 text-sm mt-1">Sell your recorded chapters, notes & courses to students</p>
          </div>
        </div>
      </motion.div>

      {/* Stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-amber-300 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#0f172a] flex flex-wrap gap-6"
      >
        {[
          { icon: '🎬', label: 'Sell Chapters', desc: 'Record & upload video lectures' },
          { icon: '📄', label: 'Sell Notes',    desc: 'Share PDF study materials'      },
          { icon: '📚', label: 'Price Courses', desc: 'Set fees for live courses'      },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4 bg-white border-3 border-slate-900 rounded-2xl px-5 py-4 shadow-[3px_3px_0px_0px_#0f172a] flex-1 min-w-[180px]">
            <span className="text-4xl">{item.icon}</span>
            <div>
              <p className="font-black text-slate-900 text-sm uppercase tracking-widest">{item.label}</p>
              <p className="font-bold text-slate-500 text-xs">{item.desc}</p>
            </div>
          </div>
        ))}
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'courses'  && <CoursePricingTab teacherId={teacherId} />}
          {activeTab === 'chapters' && <ChaptersTab teacherId={teacherId} />}
          {activeTab === 'notes'    && <NotesTab teacherId={teacherId} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
