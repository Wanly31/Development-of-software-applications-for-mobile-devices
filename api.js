const API_KEY = 'ccd25eaa';
const BASE_URL = 'https://www.omdbapi.com/';

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
  );
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error);
  return { movies: data.Search, total: Number(data.totalResults) };
}

export async function getMovieDetails(id) {
  const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error);
  return data;
}
