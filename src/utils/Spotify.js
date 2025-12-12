
const clientId = "6c420209f1ce434792ffa638feb06c37"; // Your client id
const redirectUri = `${window.location.origin}/`;
let accessToken = null;


const Spotify = {
  getAccessToken() {
    // Prevent multiple redirects
    if (window.__spotify_auth_in_progress) {
      return null;
    }
    // 1. Check in-memory
    if (accessToken) {
      return accessToken;
    }
    // 2. Check localStorage
    const storedToken = window.localStorage.getItem('spotify_access_token');
    const storedExpiration = window.localStorage.getItem('spotify_token_expiration');
    if (storedToken && storedExpiration && Number(storedExpiration) > Date.now()) {
      accessToken = storedToken;
      return accessToken;
    }
    // 3. Check URL for token
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // Set expiration time in ms
      const expirationTime = Date.now() + expiresIn * 1000;
      window.localStorage.setItem('spotify_access_token', accessToken);
      window.localStorage.setItem('spotify_token_expiration', expirationTime.toString());
      window.setTimeout(() => {
        accessToken = null;
        window.localStorage.removeItem('spotify_access_token');
        window.localStorage.removeItem('spotify_token_expiration');
      }, expiresIn * 1000);
      // Clean up the URL
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    // 4. If not found, show a message and redirect only once
    if (!accessToken) {
      window.__spotify_auth_in_progress = true;
      // Show a message to the user before redirecting
      document.body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h2>Redirecting to Spotify for authentication...</h2><p>If you are stuck here, please check your popup blocker or try again later.</p></div>';
      setTimeout(() => {
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = authUrl;
      }, 1500);
    }
    return null;
  },


  // Search for tracks using the Spotify API
  async search(term) {
    const token = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}&limit=50`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await fetch(endpoint, { headers });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonResponse = await response.json();
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Error fetching data from Spotify API:", error);
      return [];
    }
  }, 


  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) return;

    const token = Spotify.getAccessToken();
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const response = await fetch("https://api.spotify.com/v1/me", { headers });
    const jsonResponse = await response.json();
    const userId = jsonResponse.id;

    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ name: name }),
      }
    );

    const createPlaylistJson = await createPlaylistResponse.json();
    const playlistId = createPlaylistJson.id;

    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ uris: trackURIs }),
      }
    );
    return true;
  },
};

export const renamePlaylist = async (playlistId, newName) => {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ name: newName })
        });

        if (!response.ok) {
            throw new Error('Failed to rename playlist on Spotify');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default Spotify;