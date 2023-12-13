import React, { useState, useEffect } from 'react';
import { searchMovie, getNowPlayingMovies } from '../service/tmdbService';

const SearchMovies = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  useEffect(() => {
    // Ambil film yang rilis 2 bulan sebelumnya jika belum ada hasil pencarian
    if (!query) {
      const fetchNowPlaying = async () => {
        try {
          const results = await getNowPlayingMovies();
          setNowPlayingMovies(results);
        } catch (error) {
          console.error('Error fetching now playing movies:', error);
        }
      };

      fetchNowPlaying();
    }
  }, [query]);

  const handleSearch = async () => {
    try {
      const results = await searchMovie(query);
      setMovies(results);
    } catch (error) {
      console.error('Error searching movie:', error);
    }
  };
  
  const handleKeyDown = (e) => {
    // Tanggapi jika tombol "Enter" ditekan (keyCode 13)
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div>
        <div className="overflow-x-auto px-4 py-2 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory', whiteSpace: 'nowrap' }}>
            <div className="flex border mt-2 mb-2 border-gray-300 rounded-md overflow-hidden">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full py-1 px-3"
                    placeholder="Search movies..."
                />
                <button onClick={handleSearch} className="py-1 px-3 bg-gray-200">
                    Search
                </button>
            </div>

        {/* Menampilkan film yang rilis 2 bulan sebelumnya jika belum ada hasil pencarian */}
        {!query && (
            <div>
            <h2 className="text-3xl font-bold mt-2 tracking-tight text-gray-900">Now Playing</h2>
            <div className="mt-1 grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-2">
                {nowPlayingMovies.map((movie) => (
                <div key={movie.id} className="group relative mx-1">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white lg:aspect-none group-hover:opacity-30 lg:h-">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                    <div className="p-2 bg-white">
                        <h3 className="text-sm text-gray-700">
                        <a href={`/movie/${movie.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            <p className="text-base font-bold text-neutral-800">{movie.title}</p>
                        </a>
                        </h3>
                        <p className="text-sm font-bold text-gray-500">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* Menampilkan hasil pencarian */}
        {query && (
            <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Search Results</h2>
            <div className="mt-1 grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-2">
                {movies.map((movie) => (
                <div key={movie.id} className="group relative mx-1">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white lg:aspect-none group-hover:opacity-30 lg:h-">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                    <div className="p-2 bg-white">
                        <h3 className="text-sm text-gray-700">
                        <a href={`/movie/${movie.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            <p className="text-base font-bold text-neutral-800">{movie.title}</p>
                        </a>
                        </h3>
                        <p className="text-sm font-bold text-gray-500">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}
        </div>
    </div>
  );
};

export default SearchMovies;
