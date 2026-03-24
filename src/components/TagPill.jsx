import React from 'react';

export default React.memo(function TagPill({ tag, onRemove }) {
  return (
    <span className="tag-pill">
      {tag}
      {onRemove && (
        <button
          className="tag-pill__remove"
          onClick={() => onRemove(tag)}
          aria-label={`Remove tag ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  );
});
