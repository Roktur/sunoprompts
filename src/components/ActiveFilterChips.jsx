import React from 'react';

export default function ActiveFilterChips({ filters, onChange }) {
  const chips = [];

  filters.genres.forEach((g) => chips.push({
    label: `Genre: ${g}`,
    remove: () => onChange({ ...filters, genres: filters.genres.filter((x) => x !== g) }),
  }));
  filters.moods.forEach((m) => chips.push({
    label: `Mood: ${m}`,
    remove: () => onChange({ ...filters, moods: filters.moods.filter((x) => x !== m) }),
  }));
  if (filters.favoritesOnly) chips.push({
    label: 'Favorites',
    remove: () => onChange({ ...filters, favoritesOnly: false }),
  });

  if (chips.length === 0) return null;

  return (
    <div className="active-chips">
      {chips.map((chip) => (
        <button key={chip.label} className="active-chip" onClick={chip.remove}>
          {chip.label}
          <span className="active-chip__x">×</span>
        </button>
      ))}
    </div>
  );
}
