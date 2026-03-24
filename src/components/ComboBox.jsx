import React, { useState, useRef, useEffect } from 'react';

export default function ComboBox({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);

  // Sync when value changes externally (e.g. modal reset)
  useEffect(() => { setQuery(value || ''); }, [value]);

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(query.toLowerCase())
  );

  const select = (opt) => {
    setQuery(opt);
    onChange(opt);
    setOpen(false);
  };

  const handleBlur = (e) => {
    if (containerRef.current?.contains(e.relatedTarget)) return;
    // Keep whatever was typed as a custom value
    const trimmed = query.trim();
    onChange(trimmed || value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); e.target.blur(); }
    if (e.key === 'Enter' && query.trim()) { select(query.trim()); }
  };

  return (
    <div ref={containerRef} className="combobox" onBlur={handleBlur}>
      <input
        className="form-input combobox__input"
        value={query}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="combobox__dropdown">
          {filtered.map((opt) => (
            <li
              key={opt}
              className={`combobox__option${opt === value ? ' combobox__option--active' : ''}`}
              onMouseDown={() => select(opt)}
            >
              {opt}
            </li>
          ))}
          {query.trim() && !options.includes(query.trim()) && (
            <li className="combobox__option combobox__option--new" onMouseDown={() => select(query.trim())}>
              + Add "{query.trim()}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
