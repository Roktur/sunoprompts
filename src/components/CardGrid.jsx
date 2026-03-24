import React, { useEffect, useRef } from 'react';
import PromptCard from './PromptCard';

export default function CardGrid({ prompts, hasMore, loadMore, onOpen, onToggleFavorite }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (prompts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🎵</div>
        <h3>No prompts found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="card-grid-wrapper">
      <div className="card-grid">
        {prompts.map((p) => (
          <PromptCard
            key={p.id}
            prompt={p}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="sentinel" />}
    </div>
  );
}
