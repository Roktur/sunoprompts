import React from 'react';
import GenreBadge from './GenreBadge';
import TagPill from './TagPill';
import { getGradient, getPresetGradient } from '../utils/gradients';

const PromptCard = React.memo(function PromptCard({ prompt, onOpen, onToggleFavorite }) {
  const { title, prompt: text, genre, mood, bpm, tags, image, coverPreset, isFavorite } = prompt;
  const coverBg = coverPreset ? getPresetGradient(coverPreset) : getGradient(genre);

  const handleCardClick = (e) => {
    if (e.target.closest('.card__star')) return;
    onOpen(prompt);
  };

  const handleStar = (e) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const visibleTags = tags.slice(0, 3);
  const extraTags = tags.length - 3;

  return (
    <article className="card" onClick={handleCardClick} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(prompt)}>
      <div className="card__cover">
        {image ? (
          <img src={image} alt={title} className="card__image" loading="lazy" />
        ) : (
          <div className="card__gradient" style={{ background: coverBg }} />
        )}
        <button
          className={`card__star${isFavorite ? ' card__star--active' : ''}`}
          onClick={handleStar}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>
      </div>

      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__prompt-preview">{text}</p>
        <GenreBadge genre={genre} />
      </div>

      <div className="card__footer">
        <div className="card__tags">
          {visibleTags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {extraTags > 0 && <span className="card__extra-tags">+{extraTags}</span>}
        </div>
        {bpm && <span className="card__bpm">{bpm} BPM</span>}
      </div>
    </article>
  );
});

export default PromptCard;
