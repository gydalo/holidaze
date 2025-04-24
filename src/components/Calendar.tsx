import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) onDateChange(date);
  };

  return (
    <div className="calendar-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        minDate={new Date()}
        inline
      />
    </div>
  );
};

export default Calendar;