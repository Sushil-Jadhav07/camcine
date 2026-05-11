// Place your files in src/assets/ with these exact names:
//   akhri-khat-poster.png   (2:3 ratio, min 500x750px)
//   akhri-khat-backdrop.png (16:9, min 1280x720px)
//   akhri-khat-trailer.mov
//   black-cat-poster.png
//   black-cat-backdrop.png
//   black-cat-trailer.mov
//
// Optional wide hero banner files:
//   akhri-khat-banner.png   (same as backdrop, or a separate wide banner)
//   black-cat-banner.png

export const CAMCINE_MOVIES = [
  {
    id: 'camcine-1',
    title: 'Black Cat',
    description: 'A gripping thriller about a shadowy operative who never misses her mark.',
    type: 'movie',
    status: 'premium',
    poster: '/Black Cat.png',
    backdrop: '/Black Cat.png',
    trailerSrc: '/akhri khat.MOV',
    releaseYear: 2026,
    rating: 'A',
    tmdbRating: null,
    duration: 6600,
    genres: ['Thriller', 'Action'],
    languages: ['EN'],
    region: 'India',
    cast: [],
    crew: [],
    seasons: [],
  },
    {
    id: 'camcine-2',
    title: 'Akhri Khat',
    description: 'A powerful story of love, loss, and the last letter that changed everything.',
    type: 'movie',
    status: 'premium',
    poster: '/akhri khat.png',
    backdrop: '/akhri khat.png',
    trailerSrc: '/Black Cat.MOV',
    releaseYear: 2026,
    rating: 'U/A',
    tmdbRating: null,
    duration: 7200,
    genres: ['Drama'],
    languages: ['HI'],
    region: 'India',
    cast: [],
    crew: [],
    seasons: [],
  },
];

export function getCamcineById(id) {
  return CAMCINE_MOVIES.find((m) => m.id === id) || null;
}
