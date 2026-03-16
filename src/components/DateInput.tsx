import React, { useRef } from 'react';

interface DateInputProps {
  day: string;
  month: string;
  year: string;
  onChange: (field: 'day' | 'month' | 'year', value: string) => void;
}

export function DateInput({ day, month, year, onChange }: DateInputProps) {
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'day' | 'month' | 'year', maxLength: number, nextRef: React.RefObject<HTMLInputElement> | null) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    onChange(field, value);
    if (value.length === maxLength && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={dayRef}
        type="text"
        placeholder="DD"
        value={day}
        onChange={(e) => handleChange(e, 'day', 2, monthRef)}
        className="w-12 text-center focus:ring-slate-500 focus:border-slate-500 sm:text-sm border-slate-300 rounded-lg py-2 border"
      />
      <span className="text-slate-400">-</span>
      <input
        ref={monthRef}
        type="text"
        placeholder="MM"
        value={month}
        onChange={(e) => handleChange(e, 'month', 2, yearRef)}
        className="w-12 text-center focus:ring-slate-500 focus:border-slate-500 sm:text-sm border-slate-300 rounded-lg py-2 border"
      />
      <span className="text-slate-400">-</span>
      <input
        ref={yearRef}
        type="text"
        placeholder="YYYY"
        value={year}
        onChange={(e) => handleChange(e, 'year', 4, null)}
        className="w-16 text-center focus:ring-slate-500 focus:border-slate-500 sm:text-sm border-slate-300 rounded-lg py-2 border"
      />
    </div>
  );
}
