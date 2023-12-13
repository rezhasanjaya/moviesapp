import { Routes, Route, Navigate } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import Homepage from "./pages/homepage"
import FavoritePage from "./pages/favoritepage"
import Watchlist from "./pages/watchlistpage"
import Navbar from "./layout/navbar"
import LoginPage from  "./pages/loginpage"
import SessionPage from "./pages/sessioncomponent"
import MovieDetail from "./pages/moviedetailpage"
import { SessionProvider } from './service/sessionContext';
import SearchMovies from "./pages/searchmovies"

function App() {
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    // Cek session token di localStorage saat komponen dimount
    const storedToken = localStorage.getItem("sessionToken");
    if (storedToken) {
      setSessionToken(storedToken);
    }
  }, []);
  return (
    <div className="App">
      <SessionProvider>
          <Navbar sessionToken={sessionToken} />
          <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/" element={<Homepage sessionToken={sessionToken} />} />
              <Route path="/searchmovies" element={<SearchMovies />} />
              <Route path="/favorite" element={<FavoritePage />} />
              <Route path="/movie/:movieId" element={<MovieDetail />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/session" element={<SessionPage />} />
          </Routes>
      </SessionProvider>
    </div>
  );
}

export default App;