import React, { useCallback, useRef } from 'react';

export default function SearchBar({ value, onChange }) {
  const debounceRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(val), 150);
    },
    [onChange]
  );

  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 20 20" fill="none">
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search prompts, genres, tags..."
        defaultValue={value}
        onChange={handleChange}
        aria-label="Search prompts"
      />
    </div>
  );
}
