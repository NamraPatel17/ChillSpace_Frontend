import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";
import clsx from "clsx";

/**
 * @param {Array} unavailableDates - Array of { startDate, endDate, type: 'booked'|'blocked' }
 * @param {Function} onRangeSelect - Callback when user selects a range (startDate, endDate)
 * @param {Boolean} isHost - If true, allows selecting any range. If false (guest), prevents selecting blocked/booked.
 */
export const AvailabilityCalendar = ({ unavailableDates = [], onRangeSelect, isHost = false, initialRange = { start: null, end: null } }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selection, setSelection] = useState(initialRange);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isDateUnavailable = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return unavailableDates.find(range => {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return d >= start && d <= end;
    });
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0,0,0,0);

    if (!isHost && isDateUnavailable(clickedDate)) return;

    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: clickedDate, end: null });
      if (onRangeSelect) onRangeSelect(clickedDate, null);
    } else {
      let start = selection.start;
      let end = clickedDate;

      if (end < start) {
        [start, end] = [end, start];
      }

      // If guest, ensure no unavailable dates are inside the range
      if (!isHost) {
        let temp = new Date(start);
        while (temp <= end) {
          if (isDateUnavailable(temp)) {
            setSelection({ start: clickedDate, end: null });
            if (onRangeSelect) onRangeSelect(clickedDate, null);
            return;
          }
          temp.setDate(temp.getDate() + 1);
        }
      }

      setSelection({ start, end });
      if (onRangeSelect) {
        // Format to YYYY-MM-DD for easier backend integration
        const formatDate = (d) => d.toISOString().split('T')[0];
        onRangeSelect(formatDate(start), formatDate(end));
      }
    }
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = [];
  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);

  // Padding for start of month
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`pad-${i}`} className="h-12 w-full" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    const type = isDateUnavailable(date)?.type;
    const isSelected = (selection.start && date.getTime() === selection.start.getTime()) || 
                       (selection.end && date.getTime() === selection.end.getTime());
    const isInRange = selection.start && selection.end && date > selection.start && date < selection.end;
    
    const isToday = new Date().toDateString() === date.toDateString();
    const isPast = date < new Date().setHours(0,0,0,0);

    days.push(
      <button
        key={d}
        onClick={() => handleDateClick(d)}
        disabled={!isHost && (isPast || type)}
        className={clsx(
          "h-12 w-full flex flex-col items-center justify-center relative transition-all text-sm rounded-lg",
          isSelected ? "bg-indigo-600 text-white z-10 shadow-md shadow-indigo-100" : 
          isInRange ? "bg-indigo-50 text-indigo-700 font-bold" : 
          type === "booked" ? "bg-red-100 text-red-700 cursor-not-allowed border-red-200/50 border" :
          type === "blocked" ? "bg-amber-100 text-amber-700 cursor-not-allowed border-amber-200/50 border" :
          "hover:bg-gray-100 text-gray-800 border-gray-50 border",
          isToday && !isSelected && "ring-2 ring-indigo-200 ring-offset-1",
          isPast && !isHost && "opacity-40 cursor-not-allowed bg-gray-50"
        )}
      >
        <span>{d}</span>
        {isToday && <div className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm lg:p-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <CalendarIcon className="h-5 w-5 text-indigo-600" />
           <h3 className="font-semibold text-gray-900">
             {currentDate.toLocaleString('default', { month: 'long' })} {year}
           </h3>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border-2 border-gray-300"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500 shadow-sm shadow-red-100"></div>
          <span className="text-gray-700">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500 shadow-sm shadow-amber-100"></div>
          <span className="text-gray-700">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-600 shadow-sm shadow-indigo-100"></div>
          <span className="text-gray-700">Selected</span>
        </div>
      </div>
      
      {selection.start && (
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
          <Info className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-indigo-900 leading-snug">
            {selection.end 
              ? `Selected: ${selection.start.toLocaleDateString('en-GB')} to ${selection.end.toLocaleDateString('en-GB')}`
              : `Selected Check-in: ${selection.start.toLocaleDateString('en-GB')}. Now pick a check-out date.`
            }
          </p>
        </div>
      )}
    </div>
  );
};
