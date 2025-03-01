import React, { useState, useEffect } from "react";

const CLIENT_ID = "1a5dd2d334174c10b63e128f0af2a880";
const REDIRECT_URI = "http://localhost:5173"; // Uygun URL'yi ayarla
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative", // Yetki ekledik
  "streaming"
];

const SpotifyWidget = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Spotify yetkilendirmesi
  const authenticateSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES.join("%20")}`;
    window.location.href = authUrl;
  };

  // Tokeni localStorage'dan al
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      const token = urlParams.get("access_token");
      const expiresIn = urlParams.get("expires_in");

      if (token && expiresIn) {
        const expirationTime = Date.now() + expiresIn * 1000;
        localStorage.setItem("spotify_token", token);
        localStorage.setItem("spotify_token_expiration", expirationTime);
        setAccessToken(token);
        window.history.pushState({}, null, "/");
      }
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      const expirationTime = localStorage.getItem("spotify_token_expiration");

      if (storedToken && expirationTime) {
        if (Date.now() > expirationTime) {
          console.warn("Token süresi doldu, tekrar giriş yap.");
          logoutSpotify();
        } else {
          setAccessToken(storedToken);
        }
      }
    }
  }, []);

  // Kullanıcının çalma listelerini çek
  useEffect(() => {
    if (!accessToken) return;

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          console.error(`🚨 API Hatası: ${res.status}`);
          if (res.status === 403) {
            console.warn("🚨 403 Forbidden: Yetki eksik olabilir.");
          }
          if (res.status === 401) {
            console.warn("🚨 401 Unauthorized: Token süresi dolmuş olabilir.");
            logoutSpotify(); // Çıkış yaptır
          }
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.items) {
          setPlaylists(data.items);
        } else {
          console.warn("🚨 Çalma listesi verisi boş geldi!");
        }
      })
      .catch(err => {
        console.error("❌ API Hatası:", err);
      });
  }, [accessToken]);

  // Spotify'dan çıkış yap
  const logoutSpotify = () => {
    console.log("🚪 Kullanıcı çıkış yapıyor...");
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_token_expiration");
    setAccessToken(null);
  };

  return (
    <div>
      {!accessToken ? (
        <button onClick={authenticateSpotify}>🎵 Spotify'a Giriş Yap</button>
      ) : (
        <div>
          {selectedPlaylist ? (
            <div>
              <button onClick={() => setSelectedPlaylist(null)}>🔙 Geri</button>
              <div style={{ width: "450px", height: "420px", position: "relative" }}>
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${selectedPlaylist}`}
                  style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute", border: 0 }}
                  allowFullScreen
                  allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="spotify-playlists">
              <h2>🎶 Spotify Çalma Listelerin</h2>
              <ul className="spotify-playlists-container">
                {playlists.map(playlist => (
                  <li className="spotify-playlist-container" key={playlist.id} onClick={() => setSelectedPlaylist(playlist.id)} >
                    <img src={playlist.images[0]?.url} alt={playlist.name}  />
                    <div className="playlist-name">{playlist.name}</div>
                    <div className="play-icon">▶</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {accessToken && <button onClick={logoutSpotify}>🚪 Çıkış Yap</button>}
    </div>
  );
};

export default SpotifyWidget;
