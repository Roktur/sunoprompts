import React from 'react';

const genreColors = {
  Pop: '#f472b6',
  Rock: '#9ca3af',
  'Hip-Hop': '#f59e0b',
  Jazz: '#3b82f6',
  Orchestral: '#60a5fa',
  'Lo-fi': '#6b7280',
  EDM: '#06b6d4',
  Folk: '#a16207',
  Metal: '#6b7280',
  Ambient: '#0ea5e9',
  Other: '#8b5cf6',
};

export default React.memo(function GenreBadge({ genre }) {
  const color = genreColors[genre] || genreColors.Other;
  return (
    <span
      className="genre-badge"
      style={{ '--badge-color': color }}
    >
      {genre}
    </span>
  );
});
