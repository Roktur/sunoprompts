import React, { useEffect, useRef } from 'react';

function CheckGroup({ label, options, selected, onToggle }) {
  return (
    <div className="filter-group">
      <div className="filter-group__label">{label}</div>
      {options.map((opt) => (
        <label key={opt} className="filter-check">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function FilterDrawer({ open, onClose, filters, onChange, genres, moods }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const toggleItem = (key, val) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
    });
  };

  const clearAll = () => onChange({ genres: [], moods: [], favoritesOnly: false });

  return (
    <>
      {open && <div className="drawer-backdrop" onClick={onClose} />}
      <aside ref={drawerRef} className={`filter-drawer${open ? ' filter-drawer--open' : ''}`}>
        <div className="filter-drawer__header">
          <span>Filters</span>
          <button className="filter-drawer__clear" onClick={clearAll}>Clear all</button>
        </div>

        <label className="filter-check filter-check--favorites">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={(e) => onChange({ ...filters, favoritesOnly: e.target.checked })}
          />
          <span>Favorites only</span>
        </label>

        <CheckGroup
          label="Genre"
          options={genres}
          selected={filters.genres}
          onToggle={(v) => toggleItem('genres', v)}
        />
        <CheckGroup
          label="Mood"
          options={moods}
          selected={filters.moods}
          onToggle={(v) => toggleItem('moods', v)}
        />

        <button className="filter-drawer__close-btn" onClick={onClose}>Done</button>
      </aside>
    </>
  );
}
