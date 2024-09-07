import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const Calendar = ({
  startDate,
  title,
  setStartDate,
}: {
  startDate: Date | null;
  title: string;
  setStartDate: (date: Date | null) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="w-full flex flex-col p-2 rounded-t-md cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="flex text-xs items-center font-medium uppercase gap-2">
        <p>{title}</p>
      </span>
      <span className="text-gray-700 text-sm">
        <DatePicker
          className="w-fit max-w-[90px]"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
        />
      </span>
    </div>
  );
};

export default Calendar;
