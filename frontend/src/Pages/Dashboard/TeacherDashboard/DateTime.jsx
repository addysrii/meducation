import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes, format } from 'date-fns';

const css = `
  .brutalist-datepicker .react-datepicker {
    font-family: inherit;
    background-color: #fff;
    border: 4px solid #0f172a;
    border-radius: 1.5rem;
    box-shadow: 8px 8px 0px 0px #0f172a;
    padding: 0.5rem;
  }
  .brutalist-datepicker .react-datepicker__header {
    background-color: #fef08a; /* yellow-200 */
    border-bottom: 4px solid #0f172a;
    border-radius: 1rem 1rem 0 0;
    padding-top: 1rem;
  }
  .brutalist-datepicker .react-datepicker__current-month,
  .brutalist-datepicker .react-datepicker-time__header {
    font-weight: 900;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .brutalist-datepicker .react-datepicker__day-name {
    font-weight: 900;
    color: #0f172a;
  }
  .brutalist-datepicker .react-datepicker__day {
    font-weight: 700;
    color: #0f172a;
    border: 2px solid transparent;
    border-radius: 0.5rem;
  }
  .brutalist-datepicker .react-datepicker__day:hover {
    background-color: #bae6fd; /* sky-200 */
    border-color: #0f172a;
    border-radius: 0.5rem;
  }
  .brutalist-datepicker .react-datepicker__day--selected {
    background-color: #a3e635 !important; /* lime-400 */
    color: #0f172a;
    border: 2px solid #0f172a;
    border-radius: 0.5rem;
    font-weight: 900;
  }
  .brutalist-datepicker .react-datepicker__day--keyboard-selected {
    background-color: #e2e8f0;
  }
  .brutalist-datepicker .react-datepicker__time-container {
    border-left: 4px solid #0f172a;
  }
  .brutalist-datepicker .react-datepicker__time-list-item {
    font-weight: 700;
    color: #0f172a;
  }
  .brutalist-datepicker .react-datepicker__time-list-item:hover {
    background-color: #bae6fd !important;
  }
  .brutalist-datepicker .react-datepicker__time-list-item--selected {
    background-color: #a3e635 !important;
    color: #0f172a !important;
    font-weight: 900;
  }
`;

const DateTime = ({setDate, allowedDays}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  
  const isAllowedDate = (date) => {
    if (!allowedDays || allowedDays.length === 0) return false;
    return allowedDays.some((allowedDay) => allowedDay.day === date.getDay());
  };

  const isAllowedTime = (date) => {
    if (!allowedDays || allowedDays.length === 0) return false;
    const allowedDay = allowedDays.find((day) => day.day === date.getDay());
    if (!allowedDay) return false;

    const minutes = date.getHours() * 60 + date.getMinutes();
    return minutes >= allowedDay.starttime && minutes <= allowedDay.endtime - 60;
  };

  const filterTime = (time) => {
    return isAllowedTime(time);
  };

  useEffect(() => {
    if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
        setDate(formattedDate.slice(0,19)+'Z');
    }
  }, [selectedDate, setDate]);

  return (
    <>
      <style>{css}</style>
      <div className="brutalist-datepicker w-full relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          filterDate={isAllowedDate}
          showTimeSelect
          timeIntervals={15}
          timeFormat="HH:mm"
          minTime={setHours(setMinutes(new Date(), 0), 0)}
          maxTime={setHours(setMinutes(new Date(), 0), 23)}
          filterTime={filterTime}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select a date and time..."
          className="w-full text-base md:text-lg font-bold text-slate-900 bg-slate-100 py-3 pl-3 pr-10 rounded-xl border-4 border-slate-900 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all cursor-pointer"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-xl z-10 w-6 h-6 flex items-center justify-center">🗓️</span>
      </div>
    </>
  );
};

export default DateTime;
