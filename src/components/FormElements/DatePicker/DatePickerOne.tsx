"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

type DatePickerOneProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  title?: string;
};

const DatePickerOne: React.FC<DatePickerOneProps> = ({
  value,
  onChange,
  title,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      defaultDate: value || undefined,
      onChange: (selectedDates: Date[]) => {
        onChange?.(selectedDates[0] || null);
      },
    });

    return () => fp.destroy();
  }, [value, onChange]);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {title || "Select Date"}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="mm/dd/yyyy"
          readOnly
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;
