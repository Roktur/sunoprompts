import { supabase } from '../lib/supabase';

// ── camelCase ↔ snake_case mapping ──────────────────────────────

function toRow(p) {
  return {
    id: p.id,
    title: p.title,
    prompt: p.prompt,
    tags: p.tags ?? [],
    genre: p.genre ?? null,
    mood: p.mood ?? null,
    bpm: p.bpm ?? null,
    is_favorite: p.isFavorite ?? false,
    image: p.image ?? null,
    cover_preset: p.coverPreset ?? null,
    created_at: p.createdAt,
  };
}

function fromRow(r) {
  return {
    id: r.id,
    title: r.title,
    prompt: r.prompt,
    tags: r.tags ?? [],
    genre: r.genre,
    mood: r.mood,
    bpm: r.bpm,
    isFavorite: r.is_favorite,
    image: r.image,
    coverPreset: r.cover_preset ?? null,
    createdAt: r.created_at,
  };
}

// ── CRUD ─────────────────────────────────────────────────────────

export async function fetchAll() {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertPrompt(prompt) {
  const { data, error } = await supabase
    .from('prompts')
    .insert(toRow(prompt))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updatePrompt(id, changes) {
  const row = {};
  if ('title' in changes)      row.title       = changes.title;
  if ('prompt' in changes)     row.prompt      = changes.prompt;
  if ('tags' in changes)       row.tags        = changes.tags;
  if ('genre' in changes)      row.genre       = changes.genre;
  if ('mood' in changes)       row.mood        = changes.mood;
  if ('bpm' in changes)        row.bpm         = changes.bpm;
  if ('isFavorite' in changes)   row.is_favorite  = changes.isFavorite;
  if ('image' in changes)        row.image        = changes.image;
  if ('coverPreset' in changes)  row.cover_preset = changes.coverPreset;

  const { data, error } = await supabase
    .from('prompts')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deletePrompt(id) {
  const { error } = await supabase.from('prompts').delete().eq('id', id);
  if (error) throw error;
}
