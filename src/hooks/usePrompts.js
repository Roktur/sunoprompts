import { useState, useMemo, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSearch } from './useSearch';
import * as svc from '../services/promptsService';

const PAGE_SIZE = 48;

const DEFAULT_GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Orchestral', 'Lo-fi', 'EDM', 'Folk', 'Metal', 'Ambient', 'Other'];
const DEFAULT_MOODS  = ['Dark', 'Energetic', 'Melancholic', 'Happy', 'Aggressive', 'Calm', 'Romantic', 'Epic', 'Mysterious', 'Other'];

export function usePrompts() {
  const [prompts, setPrompts]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters]       = useState({ genres: [], moods: [], favoritesOnly: false });
  const [sort, setSort]             = useState('newest');
  const [page, setPage]             = useState(1);

  // ── Initial load ─────────────────────────────────────────────
  useEffect(() => {
    svc.fetchAll()
      .then(setPrompts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // ── Derived: unique genres/moods ─────────────────────────────
  const uniqueGenres = useMemo(() => {
    const fromData = [...new Set(prompts.map((p) => p.genre).filter(Boolean))];
    return [...new Set([...DEFAULT_GENRES, ...fromData])];
  }, [prompts]);

  const uniqueMoods = useMemo(() => {
    const fromData = [...new Set(prompts.map((p) => p.mood).filter(Boolean))];
    return [...new Set([...DEFAULT_MOODS, ...fromData])];
  }, [prompts]);

  // ── Search + filter + sort + paginate ────────────────────────
  const searchResults = useSearch(prompts, searchQuery);

  const filtered = useMemo(() => {
    let r = searchResults;
    if (filters.genres.length)    r = r.filter((p) => filters.genres.includes(p.genre));
    if (filters.moods.length)     r = r.filter((p) => filters.moods.includes(p.mood));
    if (filters.favoritesOnly)    r = r.filter((p) => p.isFavorite);
    return r;
  }, [searchResults, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case 'newest':   return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':   return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'az':       return arr.sort((a, b) => a.title.localeCompare(b.title));
      case 'favorites':return arr.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
      default:         return arr;
    }
  }, [filtered, sort]);

  const paginated = useMemo(() => sorted.slice(0, page * PAGE_SIZE), [sorted, page]);
  const hasMore   = paginated.length < sorted.length;
  const loadMore  = useCallback(() => setPage((p) => p + 1), []);

  const activeFilterCount =
    filters.genres.length + filters.moods.length + (filters.favoritesOnly ? 1 : 0);

  // ── CRUD ─────────────────────────────────────────────────────
  const addPrompt = useCallback(async (data) => {
    const draft = {
      ...data,
      id: uuidv4(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
      image: data.image ?? null,
    };
    // Optimistic
    setPrompts((prev) => [draft, ...prev]);
    try {
      const saved = await svc.insertPrompt(draft);
      setPrompts((prev) => prev.map((p) => (p.id === draft.id ? saved : p)));
    } catch (e) {
      setPrompts((prev) => prev.filter((p) => p.id !== draft.id));
      throw e;
    }
  }, []);

  const updatePrompt = useCallback(async (id, data) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    try {
      await svc.updatePrompt(id, data);
    } catch (e) {
      // Revert on error — refetch
      svc.fetchAll().then(setPrompts).catch(console.error);
      throw e;
    }
  }, []);

  const deletePrompt = useCallback(async (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    try {
      await svc.deletePrompt(id);
    } catch (e) {
      svc.fetchAll().then(setPrompts).catch(console.error);
      throw e;
    }
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    const current = prompts.find((p) => p.id === id);
    if (!current) return;
    const next = !current.isFavorite;
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: next } : p)));
    svc.updatePrompt(id, { isFavorite: next }).catch(console.error);
  }, [prompts]);

  const duplicatePrompt = useCallback(async (prompt) => {
    const dup = {
      ...prompt,
      id: uuidv4(),
      title: `${prompt.title} (copy)`,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    setPrompts((prev) => {
      const idx = prev.findIndex((p) => p.id === prompt.id);
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
    try {
      const saved = await svc.insertPrompt(dup);
      setPrompts((prev) => prev.map((p) => (p.id === dup.id ? saved : p)));
    } catch (e) {
      setPrompts((prev) => prev.filter((p) => p.id !== dup.id));
      throw e;
    }
  }, []);

  return {
    prompts,
    loading,
    error,
    paginated,
    total: sorted.length,
    totalAll: prompts.length,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sort,
    setSort,
    activeFilterCount,
    uniqueGenres,
    uniqueMoods,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
  };
}
