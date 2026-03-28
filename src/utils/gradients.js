export const genreGradients = {
  Pop: 'linear-gradient(135deg, #f472b6, #8b5cf6)',
  Rock: 'linear-gradient(135deg, #374151, #1f2937)',
  'Hip-Hop': 'linear-gradient(135deg, #f59e0b, #ef4444)',
  Jazz: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
  Orchestral: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
  'Lo-fi': 'linear-gradient(135deg, #6b7280, #374151)',
  EDM: 'linear-gradient(135deg, #06b6d4, #6d28d9)',
  Folk: 'linear-gradient(135deg, #78350f, #166534)',
  Metal: 'linear-gradient(135deg, #111827, #000000)',
  Ambient: 'linear-gradient(135deg, #0c4a6e, #1e1b4b)',
  Other: 'linear-gradient(135deg, #4b5563, #1f2937)',
};

export function getGradient(genre) {
  return genreGradients[genre] || genreGradients.Other;
}

export const presetCovers = [
  { id: 'sunset',   name: 'Sunset',   gradient: 'linear-gradient(135deg, #f97316, #ec4899)' },
  { id: 'ocean',    name: 'Ocean',    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
  { id: 'aurora',   name: 'Aurora',   gradient: 'linear-gradient(135deg, #10b981, #6366f1)' },
  { id: 'midnight', name: 'Midnight', gradient: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' },
  { id: 'lava',     name: 'Lava',     gradient: 'linear-gradient(135deg, #dc2626, #f97316)' },
  { id: 'galaxy',   name: 'Galaxy',   gradient: 'linear-gradient(135deg, #4f46e5, #a21caf)' },
  { id: 'mint',     name: 'Mint',     gradient: 'linear-gradient(135deg, #34d399, #0ea5e9)' },
  { id: 'rose',     name: 'Rose',     gradient: 'linear-gradient(135deg, #f43f5e, #c026d3)' },
  { id: 'gold',     name: 'Gold',     gradient: 'linear-gradient(135deg, #fbbf24, #f97316)' },
  { id: 'arctic',   name: 'Arctic',   gradient: 'linear-gradient(135deg, #bae6fd, #818cf8)' },
  { id: 'forest',   name: 'Forest',   gradient: 'linear-gradient(135deg, #166534, #14532d)' },
  { id: 'neon',     name: 'Neon',     gradient: 'linear-gradient(135deg, #22d3ee, #a855f7)' },
  { id: 'coral',    name: 'Coral',    gradient: 'linear-gradient(135deg, #fb923c, #f472b6)' },
  { id: 'storm',    name: 'Storm',    gradient: 'linear-gradient(135deg, #374151, #6366f1)' },
  { id: 'lavender', name: 'Lavender', gradient: 'linear-gradient(135deg, #a78bfa, #f0abfc)' },
];

export function getPresetGradient(id) {
  return presetCovers.find((p) => p.id === id)?.gradient || null;
}
