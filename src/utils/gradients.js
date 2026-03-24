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
