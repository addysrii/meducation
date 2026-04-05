import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../../Images/logo.svg'
import api from '../../../api/api';

const StoreAdmin = () => {
  const [chaptersReq, setChaptersReq] = useState([]);
  const [notesReq, setNotesReq] = useState([]);

  const { data } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchStoreRequests = async () => {
      try {
        const response = await axios.get(`${api}/api/admin/${data}/approve/store`, {
            withCredentials: true
        });
        setChaptersReq(response.data.data.chapters);
        setNotesReq(response.data.data.notes);
      } catch (error) {
        console.error('Error fetching store requests:', error);
      }
    };
    fetchStoreRequests();
  }, [data]);

  const handleAction = async (id, type, isapproved) => {
    try {
      const response = await axios.post(`${api}/api/admin/${data}/approve/store/${type}/${id}`, {
        isapproved
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      
      if (response.status === 200) {
        if (type === 'chapter') {
            setChaptersReq(chaptersReq.filter(req => req._id !== id));
        } else {
            setNotesReq(notesReq.filter(req => req._id !== id));
        }
        alert(response.data.message);
      }
    } catch (error) {
      console.error(`Error ${isapproved} store request:`, error);
    }
  };

  return (
    <div className='min-h-[100vh] bg-[#F4F4F5]'>
      {/* Navbar */}
      <nav className="h-16 sm:h-20 md:h-24 lg:h-24  w-full bg-[#042439] flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center cursor-pointer" onClick={()=> navigator(`/admin/${data}`)}>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-700 font-bold font-mono ml-2">
            ◀ Back
            </h1>
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <IoIosNotificationsOutline className="h-8 w-8 text-white" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </div>
          <button onClick={() => navigator('/')} className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black uppercase text-slate-900 mb-8 border-b-4 border-slate-900 pb-2 inline-block">Store Items Approval</h2>

        <h3 className="text-2xl font-black uppercase text-slate-700 mt-4 mb-4">📚 Recorded Chapters</h3>
        {chaptersReq.length === 0 && <p className="font-bold text-slate-500">No chapter requests pending.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {chaptersReq.map((req) => (
              <div key={req._id} className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] rounded-[2rem] p-6 flex flex-col">
                <h2 className="text-xl font-black text-slate-900 uppercase">{req.title}</h2>
                <p className="font-bold text-slate-600 mt-2 text-sm">{req.description.slice(0,100)}...</p>
                <div className="mt-4 bg-yellow-200 border-2 border-slate-900 p-3 rounded-xl shadow-inner font-bold text-sm">
                    <p>🧑‍🏫 Teacher: {req.teacher?.Firstname} {req.teacher?.Lastname}</p>
                    <p>💸 Price: ₹{req.price}</p>
                    <p>📌 Subject: {req.subject}</p>
                </div>
                <div className='flex gap-4 mt-6'>
                  <button className='flex-1 py-3 bg-emerald-400 font-black text-slate-900 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-emerald-500 transition-colors uppercase text-sm' onClick={()=>handleAction(req._id, 'chapter', 'approved')}>Approve</button>
                  <button className='flex-1 py-3 bg-rose-400 font-black text-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-rose-500 transition-colors uppercase text-sm' onClick={()=>handleAction(req._id, 'chapter', 'rejected')}>Reject</button>
                </div>
              </div>
            ))}
        </div>

        <h3 className="text-2xl font-black uppercase text-slate-700 mt-12 mb-4">📝 Notes & PDFs</h3>
        {notesReq.length === 0 && <p className="font-bold text-slate-500">No notes requests pending.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notesReq.map((req) => (
              <div key={req._id} className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] rounded-[2rem] p-6 flex flex-col">
                <h2 className="text-xl font-black text-slate-900 uppercase">{req.title}</h2>
                <p className="font-bold text-slate-600 mt-2 text-sm">{req.description.slice(0,100)}...</p>
                <div className="mt-4 bg-purple-200 border-2 border-slate-900 p-3 rounded-xl shadow-inner font-bold text-sm">
                    <p>🧑‍🏫 Teacher: {req.teacher?.Firstname} {req.teacher?.Lastname}</p>
                    <p>💸 Price: ₹{req.price}</p>
                    <p>📌 Subject: {req.subject}</p>
                </div>
                <div className='flex gap-4 mt-6'>
                  <button className='flex-1 py-3 bg-emerald-400 font-black text-slate-900 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-emerald-500 transition-colors uppercase text-sm' onClick={()=>handleAction(req._id, 'notes', 'approved')}>Approve</button>
                  <button className='flex-1 py-3 bg-rose-400 font-black text-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-rose-500 transition-colors uppercase text-sm' onClick={()=>handleAction(req._id, 'notes', 'rejected')}>Reject</button>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default StoreAdmin;
