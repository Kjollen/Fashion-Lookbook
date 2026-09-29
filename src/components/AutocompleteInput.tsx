import { useState, useRef, useEffect } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export default function AutocompleteInput({ label, value, onChange, options, placeholder }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const q = value.toLowerCase();
      setFiltered(options.filter(o => o.toLowerCase().includes(q) && o.toLowerCase() !== q));
    } else {
      setFiltered(options);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isOpen && filtered.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        placeholder={placeholder}
      />
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-40 overflow-y-auto">
          {filtered.map((option, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-purple-500/20 hover:text-white transition first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {options.length > 0 && value === '' && (
        <p className="text-[10px] text-gray-600 mt-1">
          {options.length} {options.length === 1 ? 'вариант' : options.length < 5 ? 'варианта' : 'вариантов'} в истории
        </p>
      )}
    </div>
  );
}
