import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../Images/logo.svg";
import Success from "./Success";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";

function Search() {
  const [data, setData] = useState("");
  const [course, setCourse] = useState([]);
  const [popup, setPopup] = useState(false);
  const [idArray, setIdArray] = useState([]);
  const { ID } = useParams();
  const [openTM, setOpenTM] = useState(false);
  const [Tdec, setTeacherDetails] = useState(null);
  const [tname, setTname] = useState({});
  const [loading, setLoading] = useState(false);

  const price = {
    math: 700,
    physics: 800,
    computer: 1000,
    chemistry: 600,
    biology: 500,
  };

  const daysName = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  const closePopup = () => {
    setPopup(false);
  };

  // ✅ Fetch enrolled courses
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${api}/api/course/student/${ID}/enrolled`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch enrolled courses");

        const user = await response.json();

        // ✅ prevent duplicates
        setIdArray(prev =>
          [...new Set([...prev, ...user.data.map(res => res._id)])]
        );
      } catch (error) {
        console.error(error.message);
      }
    };

    getData();
  }, [ID]);

  // ✅ Teacher modal
  const openTeacherDec = async (id, fname, lname, sub) => {
    try {
      setTname({ fname, lname, sub });

      const resData = await fetch(`${api}/api/teacher/teacherdocuments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teacherID: id }),
      });

      if (!resData.ok) throw new Error("Failed to fetch teacher details");

      const res = await resData.json();
      setTeacherDetails(res.data);
      setOpenTM(true);

    } catch (error) {
      console.error(error);
      alert("Failed to load teacher details");
    }
  };

  // ✅ Search function
  const SearchTeacher = async (sub) => {
    const subject = sub.toLowerCase();

    if (!subject) {
      alert("Please enter a subject");
      return;
    }

    try {
      setLoading(true);

      const Data = await fetch(`${api}/api/course/${subject}`);
      if (!Data.ok) throw new Error("Search failed");

      const response = await Data.json();

      if (response.statusCode === 200) {
        setCourse(response.data);
      } else {
        setCourse([]);
      }

      setData("");

    } catch (err) {
      console.error(err);
      setCourse([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enroll handler
  const handleEnroll = async (courseName, id) => {
    try {
      let check = await fetch(
        `${api}/api/course/${courseName}/${id}/verify/student/${ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const res = await check.json();

      if (res.statusCode !== 200) {
        alert(res.message);
        return;
      }

      // Create order
      const dataReq = await fetch(
        `${api}/api/payment/course/${id}/${courseName}`,
        {
          method: "POST",
          body: JSON.stringify({
            fees: price[courseName.toLowerCase()] * 100,
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const DATA = await dataReq.json();

      // ✅ FIXED credentials placement
      const Key = await fetch(`${api}/api/payment/razorkey`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const responseKey = await Key.json();

      const options = {
        key: responseKey.data.key,
        amount: price[courseName.toLowerCase()] * 100,
        currency: "INR",
        name: "meducation",
        description: "Enroll in a course",
        image: logo,
        order_id: DATA.data.id,

        handler: async (response) => {
          try {
            const verificationResponse = await fetch(
              `${api}/api/payment/confirmation/course/${id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const verifyRes = await verificationResponse.json();

            if (verifyRes.statusCode === 200) {
              await fetch(
                `${api}/api/course/${courseName}/${id}/add/student/${ID}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                }
              );

              // ✅ update UI instead of reload
              setIdArray(prev => [...prev, id]);
              setPopup(true);
            }

          } catch (err) {
            console.error(err);
          }
        },

        prefill: {
          name: "Student",
          email: "student@example.com",
        },

        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert("Enrollment failed");
    }
  };

  return (
    <div className="w-full text-slate-900 font-sans">

      {/* 🔍 Search */}
      <div className="flex w-full items-center bg-white border-4 border-slate-900 rounded-[1.5rem] p-2 mb-10">
        <input
          type="text"
          placeholder="Search subjects..."
          className="flex-1 px-5 py-3 text-xl font-bold"
          value={data}
          onKeyDown={(e) => e.key === "Enter" && SearchTeacher(data)}
          onChange={(e) => setData(e.target.value)}
        />
        <button onClick={() => SearchTeacher(data)}>
          Find
        </button>
      </div>

      {/* 📦 Results */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        course.map((Data) => (
          <div key={Data._id}>
            <h3
              onClick={() =>
                openTeacherDec(
                  Data.enrolledteacher.Teacherdetails,
                  Data.enrolledteacher.Firstname,
                  Data.enrolledteacher.Lastname,
                  Data.coursename
                )
              }
            >
              {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
            </h3>

            {idArray.includes(Data._id) ? (
              <p>Already Enrolled</p>
            ) : (
              <button
                onClick={() =>
                  handleEnroll(Data.coursename, Data._id)
                }
              >
                Enroll ₹{price[Data.coursename.toLowerCase()]}
              </button>
            )}
          </div>
        ))
      )}

      {/* ✅ Success Popup */}
      {popup && <Success onClose={closePopup} />}
    </div>
  );
}

export default Search;
