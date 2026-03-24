import { useMemo, useRef } from 'react';
import Fuse from 'fuse.js';

const fuseOptions = {
  keys: ['title', 'prompt', 'tags', 'genre', 'mood'],
  threshold: 0.35,
  includeScore: true,
};

export function useSearch(prompts, query) {
  const fuseRef = useRef(null);

  const fuse = useMemo(() => {
    fuseRef.current = new Fuse(prompts, fuseOptions);
    return fuseRef.current;
  }, [prompts]);

  const results = useMemo(() => {
    if (!query.trim()) return prompts;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, prompts]);

  return results;
}
