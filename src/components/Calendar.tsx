import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  onDateChange: (dates: [Date | null, Date | null]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);

  const handleChange = (dates: [Date | null, Date | null]) => {
    setSelectedDates(dates);
    onDateChange(dates);
  };

  return (
    <div className="calendar-container">
      <DatePicker
      selected={selectedDates[0]}
      onChange={handleChange}
      startDate={selectedDates[0]}
      endDate={selectedDates[1]}
      selectsRange
      minDate={new Date()}
        inline
      />
    </div>
  );
};

export default Calendar;