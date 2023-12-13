import { useState, useEffect } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getNowPlayingMovies, getTopRatedMovies } from '../service/tmdbService';

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
      slidesToSlide: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 6,
      slidesToSlide: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 6,
      slidesToSlide: 3
    }
  };
export default function Dashboard() {
    const [sessionToken, setSessionToken] = useState(null);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

    useEffect(() => {
      const fetchNowPlayingMovies = async () => {
        try {
          const movies = await getNowPlayingMovies();
          setNowPlayingMovies(movies);
        } catch (error) {
          console.error('Error fetching now playing movies:', error);
        }
      };
  
      fetchNowPlayingMovies();
    }, []);

    const [topRatedMovies, setTopRatedMovies] = useState ([]);
    useEffect(() => {
        const fetchTopRatedMovies = async () => {
            try {
                const topRatedMovies = await getTopRatedMovies();
                setTopRatedMovies(topRatedMovies);
              } catch (error) {
                console.error('Error fetching top rated movies:', error);
              }
        };
        fetchTopRatedMovies();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const requestToken = urlParams.get("request_token");
        const approved = urlParams.get("approved");
    
        if (requestToken && approved === "true") {
          setSessionToken(requestToken);
          localStorage.setItem("sessionToken", requestToken);
          window.location.href = "/homepage";
        } else {
          const storedToken = localStorage.getItem("sessionToken");
          if (storedToken) {
            setSessionToken(storedToken);
          }
        }
      }, []);

    return (
    <>
        <div className="overflow-x-auto px-4 py-2 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory', whiteSpace: 'nowrap' }}>
        <h2 className="text-3xl font-bold tracking-tight mb-1 text-gray-900">Now Playing</h2>
        <Carousel responsive={responsive}>
        {nowPlayingMovies.map((movie) => (
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
                <p className="text-sm font-bold text-gray-500">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
            <div className="mt-1 grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-2">
                
            </div>
        </div>
        <div className=" mt-10 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory', whiteSpace: 'nowrap' }}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Top Rated</h2>
            <div className="mt-1 grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-2">
                {topRatedMovies.map((movie) => (
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
                            <p className="text-sm font-bold text-gray-500">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
                        </div>
                        </div>
                    </div>
                    ))}
            </div>
        </div>
       
    </>
    )
}
