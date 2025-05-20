import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  onDateChange: (dates: [Date | null, Date | null]) => void;
  value?: [Date | null, Date | null];
  disabledRanges?: [Date, Date][];
  variant?: "homepage" | "venuepage";
}
const Calendar: React.FC<CalendarProps> = ({
  onDateChange,
  value,
  disabledRanges = [],
  variant = "inputs",
}) => {
  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null]
  >(value || [null, null]);

  const handleChange = (dates: [Date | null, Date | null]) => {
    setSelectedDates(dates);
    onDateChange(dates);
  };

  const isDateDisabled = (date: Date) => {
    return disabledRanges.some(([start, end]) => date >= start && date <= end);
  };

  if (variant === "homepage") {
    return (
      <div className="flex space-x-4">
        <DatePicker
          selected={selectedDates[0]}
          onChange={handleChange}
          startDate={selectedDates[0]}
          endDate={selectedDates[1]}
          selectsRange
          placeholderText="Check in"
          className="outline-none border-r pr-4"
          minDate={new Date()}
          filterDate={(date) => !isDateDisabled(date)}
        />
        <DatePicker
          selected={selectedDates[1]}
          onChange={handleChange}
          startDate={selectedDates[0]}
          endDate={selectedDates[1]}
          selectsRange
          placeholderText="Check out"
          className="outline-none border-r pr-4"
          minDate={selectedDates[0] || new Date()}
          filterDate={(date) => !isDateDisabled(date)}
        />
      </div>
    );
  }

  if (variant === "venuepage") {
    return (
      <div className="flex items-center border rounded-full shadow-sm overflow-hidden divide-x divide-gray-300 bg-white">
        <DatePicker
          selected={selectedDates[0]}
          onChange={handleChange}
          startDate={selectedDates[0]}
          endDate={selectedDates[1]}
          selectsRange
          placeholderText="Check in"
          className="px-4 py-2 outline-none bg-transparent text-sm"
          minDate={new Date()}
          filterDate={(date) => !isDateDisabled(date)}
        />
        <DatePicker
          selected={selectedDates[1]}
          onChange={handleChange}
          startDate={selectedDates[0]}
          endDate={selectedDates[1]}
          selectsRange
          placeholderText="Check out"
          className="px-4 py-2 outline-none bg-transparent text-sm"
          minDate={selectedDates[0] || new Date()}
          filterDate={(date) => !isDateDisabled(date)}
        />
      </div>
    );
  }
  return null;
};
export default Calendar;
