const clientId = "6c420209f1ce434792ffa638feb06c37"; // Your client id
const redirectUri = "http://localhost:3000/"; // Update this when deploying
let accessToken;

const Spotify = {
  getAccessToken() {
    // If we already have an access token, return it
    if (accessToken) {
      return accessToken;
    }

    // Check the URL for an access token
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    // If we find the access token and its expiration, set it and schedule its expiration
    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Set a timeout to expire the token after the specified time
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

      // Clean up the URL by removing the token and expiration parameters
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } 
    
    
    if (!accessToken) {
      // If we don't have an access token, redirect to the Spotify authorization page
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = authUrl;
    }
      return null; // Return null since the token isn't available yet
  },


  // Search for tracks using the Spotify API
  async search(term) {
    const token = Spotify.getAccessToken();
    if (!token) {
      console.error("No access token found. Please authenticate first.");
      return []; // Return empty array if there's no token
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

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

export default Spotify;