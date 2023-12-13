import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getRecommendedMovies, submitRatingToApi, addToWatchlist, addToFavorites } from '../service/tmdbService';
import Carousel from 'react-multi-carousel';
import Rating from 'react-rating-stars-component';
import { useSession } from '../service/sessionContext';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
    slidesToSlide: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 6,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 6,
    slidesToSlide: 3,
  },
};

const MovieDetail = () => {
  const { movieId } = useParams();
  const { session } = useSession();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const details = await getMovieDetails(movieId, sessionToken);
        setMovieDetails(details);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const fetchRecommendedMoviesData = async () => {
      try {
        const recommended = await getRecommendedMovies(movieId, sessionToken);
        setRecommendedMovies(recommended);
      } catch (error) {
        console.error('Error fetching recommended movies:', error);
      }
    };


    const urlParams = new URLSearchParams(window.location.search);
    const requestToken = urlParams.get('request_token');
    const approved = urlParams.get('approved');

    if (requestToken && approved === 'true') {
      setSessionToken(requestToken);
      localStorage.setItem('sessionToken', requestToken);

      window.location.href = '/homepage';
    } else {
      const storedToken = localStorage.getItem('sessionToken');
      if (storedToken) {
        setSessionToken(storedToken);
      }
    }

    if (session) {
      console.log('Session:', session);
    }

    if (movieId && sessionToken) {
      fetchMovieDetails();
      fetchRecommendedMoviesData();
    }
  }, [movieId, sessionToken, session]);

  if (!movieDetails || recommendedMovies.length === 0) {
    return <p>Loading...</p>;
  }



  const {
    title,
    release_date,
    genres,
    backdrop_path,
    poster_path,
    overview,
    vote_average,
    runtime,
  } = movieDetails;

  const formattedReleaseDate = new Date(release_date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const backgroundImageUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;
  const posterImageUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;

  const handleRatingChange = (newRating) => {
    // Convert the newRating to fit the 0-10 scale
    const tmdbRating = newRating * 2;
  
    try {
      submitRatingToApi(tmdbRating, sessionToken, movieId);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };
  const handleAddToFavorites = async () => {
    try {
      const result = await addToFavorites(sessionToken, movieId);
      console.log('Added to favorites successfully:', result);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      const result = await addToWatchlist(sessionToken, movieId);
      console.log('Added to watchlist successfully:', result);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };
  
  return (
    <div>
      <div
        className="h-96 relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="flex items-center justify-center h-full relative">
          <img src={posterImageUrl} alt={title} className="w-32 h-48 ml-10 rounded shadow-md" />
          <div className="ml-4 text-white mr-10">
            <h1 className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            <Rating
              count={5} // Set the count to 5 for 5 clickable stars
              value={0} // The initial value, you may set it based on the user's existing rating if applicable
              onChange={handleRatingChange}
              size={30}
              activeColor="#ffd700"
              isHalf={true} // Enable half-star ratings
            />

              {title} ({release_date.split('-')[0]})
            </h1>
            <p
              className="text-sm font-light"
              style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
            >
              {formattedReleaseDate} - {genres.map((genre) => genre.name).join(', ')} - {runtime} min
            </p>
            <p className="text-sm font-bold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
              Overall Score: {vote_average}
            </p>
            <h2 className="text-xl font-bold mt-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
              Overview
            </h2>
            <p className="text-sm" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
              {overview}
            </p>
            <button
              onClick={handleAddToFavorites}
              className="border border-white border-1 hover:bg-red-300 mt-2 hover:border-red-400 text-white text-sm font-sm py-0 px-2 rounded"
            >
              	&hearts;
            </button>
            <button
              onClick={handleAddToWatchlist}
              className="bg-sky-600 mr-2 ml-2 hover:bg-gray-300 hover:text-neutral-800 text-white text-xs font-sm py-1 px-2 rounded"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className=" mt-10 overflow-x-auto mb-3 px-4 py-2 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory', whiteSpace: 'nowrap' }}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Recommendations</h2>
          <Carousel responsive={responsive}>
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="group relative mx-1">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white lg:aspect-none group-hover:opacity-30 lg:h-">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                  <div>
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
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
