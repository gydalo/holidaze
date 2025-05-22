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

  const formattedDate = (date: Date | null) =>
    date ? date.toLocaleDateString("en-GB") : "";

  const getCustomInput = (variantStyle: string, withBorder: boolean = true) => (
    <div
      className={`flex justify-between text-sm text-gray-700 divide-x divide-gray-300 whitespace-nowrap overflow-x-auto ${
        withBorder ? "bg-white border rounded-full shadow-sm" : ""
      } ${variantStyle}`}
    >
      <div className="px-4 py-2 w-1/2 font-lateef  text-gray-700">
        {formattedDate(selectedDates[0]) || "Check in"}
      </div>
      <div className="px-4 py-2 w-1/2 font-lateef  text-gray-700">
        {formattedDate(selectedDates[1]) || "Check out"}
      </div>
    </div>
  );

  if (variant === "homepage") {
    return (
      <DatePicker
        selected={selectedDates[0]}
        onChange={handleChange}
        startDate={selectedDates[0]}
        endDate={selectedDates[1]}
        selectsRange
        minDate={new Date()}
        filterDate={(date) => !isDateDisabled(date)}
        customInput={getCustomInput(
          "w-full min-w-[320px] sm:min-w-[400px] md:min-w-[520px] lg:min-w-[620px]",
          false
        )}
      />
    );
  }

  if (variant === "venuepage") {
    return (
      <DatePicker
        selected={selectedDates[0]}
        onChange={handleChange}
        startDate={selectedDates[0]}
        endDate={selectedDates[1]}
        selectsRange
        minDate={new Date()}
        filterDate={(date) => !isDateDisabled(date)}
        customInput={getCustomInput(
          "w-full px-2 py-2",
          true
        )}
      />
    );
  }

  return null;
};

export default Calendar;

