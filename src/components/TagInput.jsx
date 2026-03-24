import React, { useState } from 'react';
import TagPill from './TagPill';

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const val = raw.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (input.trim()) addTag(input);
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="tag-input-container">
      {tags.map((tag) => (
        <TagPill key={tag} tag={tag} onRemove={removeTag} />
      ))}
      <input
        className="tag-input-field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? 'Type tag + Enter' : ''}
      />
    </div>
  );
}
