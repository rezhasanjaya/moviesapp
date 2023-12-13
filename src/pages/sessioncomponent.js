import React, { useEffect, useState } from 'react';
import { createSession } from '../service/tmdbService';

const SessionPage = () => {
  const [requestToken, setRequestToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const handleSessionCreation = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('request_token');

        if (token) {
          setRequestToken(token);
          const session = await createSession(token);
          setSessionId(session);
        } else {
          console.error('Token request tidak ditemukan dalam URL.');
        }
      } catch (error) {
        console.error('Kesalahan saat membuat sesi:', error);
      }
    };

    handleSessionCreation();
  }, []);

  return (
    <div>
      {sessionId ? (
        <p>Sesi berhasil dibuat! ID: {sessionId}</p>
      ) : (
        <p>Menunggu persetujuan...</p>
      )}
    </div>
  );
};

export default SessionPage;