import React, { useEffect } from 'react';
import { authenticate } from '../service/tmdbService';

const LoginPage = () => {
  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        const loginUrl = await authenticate();
        window.location.href = loginUrl;
      } catch (error) {
        console.error('Kesalahan saat mengarahkan ke halaman login:', error);
      }
    };

    handleAuthentication();
  }, []);

  return (
    <div>
      <p>Mengarahkan ke halaman login TMDB...</p>
    </div>
  );
};

export default LoginPage;