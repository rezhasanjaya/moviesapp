import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
// const API_KEY = 'YOUR_API_KEY';
// const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'
// const ACCOUNT_ID = 'YOUR_ACCOUNT_ID';

const authenticate = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`);
      const requestToken = response.data.request_token;
      const loginUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=http://localhost:3000/homepage`;
  
      return loginUrl;
    } catch (error) {
      console.error('Error during authentication:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
const createSession = async (requestToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/authentication/session/new?api_key=${API_KEY}`, {
        request_token: requestToken,
      });
      const sessionId = response.data.session_id;
  
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error.response ? error.response.data : error.message);
      throw error;
    }
};

  
const getAccountDetails = async (sessionToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionToken}`);
      const accountDetails = response.data;
  
      return accountDetails;
    } catch (error) {
      console.error('Error getting account details:', error.response ? error.response.data : error.message);
      throw error;
    }
};
  
  
  
  const getNowPlayingMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/now_playing?language=en-US&page=1`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
  
      if (!response.data || !response.data.results) {
        throw new Error('Invalid response from TMDB API');
      }
  
      return response.data.results;
    } catch (error) {
      console.error('Error fetching now playing movies:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const getTopRatedMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/top_rated?language=en-US&page=1`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        });
        if(!response.data || !response.data.results){
            throw new Error('Invalid response from TMDB API')
        }
        
        return response.data.results;
    }catch(error) {
        console.error('Error fetching top rated movies:', error.response ? error.response.data : error.message);
        throw error;
    }
  }

  const searchMovie = async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          query: query,
          page: 1,
        },
      });
  
      if (response.data && response.data.results) {
        return response.data.results;
      } else {
        throw new Error('Invalid response from TMDB API');
      }
    } catch (error) {
      console.error('Error searching movie:', error);
      throw error;
    }
  };

  
const getMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
        },
      });
  
      if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from TMDB API');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  };

  const getRecommendedMovies = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US`
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch recommended movies');
      }
  
      const data = await response.json();
      return data.results;
    } catch (error) {
      throw new Error(`Error in getRecommendedMovies: ${error.message}`);
    }
  };

  const submitRatingToApi = async (userRating, sessionToken, movieId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/movie/${movieId}/rating`,
        {
          value: userRating,
        },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.success) {
        console.log('Rating added successfully:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to add rating');
      }
    } catch (error) {
      console.error('Error adding rating:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // const submitRatingToApi = async (movieId, userRating, sessionToken) => {
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/movie/${movieId}/rating`,
  //       {
  //         value: userRating,
  //       },
  //       {
  //         params: {
  //           api_key: API_KEY,
  //           session_id: sessionToken,
  //         },
  //       }
  //     );
  
  //     if (response.data && response.data.success) {
  //       return response.data.success;
  //     } else {
  //       throw new Error(`Failed to submit rating: ${JSON.stringify(response.data)}`);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting rating to API:', error.message);
  //     throw error;
  //   }
  // };

  const addToFavorites = async (sessionToken, movieId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/account/${ACCOUNT_ID}/favorite`,
        {
          media_type: 'movie',
          media_id: movieId,
          favorite: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.success) {
        console.log('Added to favorites successfully:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const addToWatchlist = async (sessionToken, movieId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/account/${ACCOUNT_ID}/watchlist`,
        {
          media_type: 'movie',
          media_id: movieId,
          watchlist: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.success) {
        console.log('Added to favorites successfully:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  const getFavoriteMovies = async (sessionToken) => {
    try {
      let allResults = [];
      let page = 1;
      let totalPages = 1;
  
      while (page <= totalPages) {
        const url = `${BASE_URL}/account/${ACCOUNT_ID}/favorite/movies?language=en-US&sort_by=created_at.asc&page=${page}`;
  
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        };
  
        const response = await fetch(url, options);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.results) {
          allResults = [...allResults, ...data.results];
          totalPages = data.total_pages;
          page++;
        } else {
          throw new Error('Invalid response from TMDB API');
        }
      }
  
      return allResults;
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      throw error;
    }
  };
  
  const getWatchlistMovies = async (sessionToken) => {
    try {
      let allResults = [];
      let page = 1;
      let totalPages = 1; // Assuming there's information about the total number of pages in the response
  
      while (page <= totalPages) {
        const url = `${BASE_URL}/account/${ACCOUNT_ID}/watchlist/movies?language=en-US&sort_by=created_at.asc&page=${page}`;
  
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        };
  
        const response = await fetch(url, options);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.results) {
          allResults = [...allResults, ...data.results];
          totalPages = data.total_pages;
          page++;
        } else {
          throw new Error('Invalid response from TMDB API');
        }
      }
  
      return allResults;
    } catch (error) {
      console.error('Error fetching watchlist movies:', error);
      throw error;
    }
  };
  

export { authenticate, createSession, getWatchlistMovies, getNowPlayingMovies,addToWatchlist, getTopRatedMovies, searchMovie, getMovieDetails, getRecommendedMovies,getFavoriteMovies, submitRatingToApi, addToFavorites, getAccountDetails };
