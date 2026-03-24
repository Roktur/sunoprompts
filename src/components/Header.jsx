import React from 'react';
import SearchBar from './SearchBar';

export default function Header({ searchQuery, onSearch, activeFilterCount, onOpenFilter, sort, onSort, onAddPrompt }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="url(#lg)" strokeWidth="2" />
            <path d="M9 14c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="14" r="2" fill="url(#lg)" />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6d28d9" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
          <span className="header__logo-text">SunoVault</span>
        </div>

        <div className="header__search">
          <SearchBar value={searchQuery} onChange={onSearch} />
        </div>

        <div className="header__actions">
          <button
            className={`btn-icon${activeFilterCount > 0 ? ' btn-icon--active' : ''}`}
            onClick={onOpenFilter}
            aria-label="Open filters"
            title="Filters"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M5 9h8M8 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {activeFilterCount > 0 && (
              <span className="btn-icon__badge">{activeFilterCount}</span>
            )}
          </button>

          <select
            className="sort-select"
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            aria-label="Sort prompts"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="favorites">Favorites first</option>
          </select>

          <button className="btn-primary" onClick={onAddPrompt}>
            <span>+</span> Add Prompt
          </button>
        </div>
      </div>
    </header>
  );
}
