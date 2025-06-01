# Jammming 🎵

Jammming is a React web application that allows users to search for songs, albums, or artists using the Spotify API, build custom playlists, and save them directly to their Spotify account.

## 🚀 Features

- 🔍 Search the Spotify catalog for tracks by keyword
- ➕ Add tracks to a custom playlist
- 📝 Name and rename your playlist
- 💾 Save the playlist directly to your Spotify account
- 🎛 Seamless integration with Spotify's Web API
- 🗂 Manage saved playlists locally with options to edit, delete, or expand playlists

## 🛠 Built With

- React
- JavaScript (ES6+)
- Spotify Web API
- CSS Modules

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CyberBeeDesign/jammming.git
   cd jammming

2. Install dependencies:
   ```bash
   npm install

4. Start the app:
   ```bash
   npm start

6. The app will open at http://localhost:3000/.

## 🔐 Spotify API Setup

You’ll need to register a Spotify application to get your clientId.

1. Go to Spotify Developer Dashboard
2. Log in and create a new application
3. Set your redirect URI to:
   ```arduino
   http://localhost:3000/

4. Copy your Client ID and paste it into Spotify.js:
   ```js
   const clientId = "your-client-id";

## 📁 Project Structure


```
src/
│
├── components/
│   ├── SearchBar.js
│   ├── SearchResults.js
│   ├── Playlist.js
│   ├── SavedPlaylists.js
│   ├── Track.js
│   └── TrackList.js
│
├── utils/
│   └── Spotify.js
│
├── App.js
├── App.css
└── index.js
```


## 🧠 How It Works

1. **Authentication**: On page load, the app checks for an access token in the URL. If absent, it redirects to Spotify's authorization page.
2. **Search**: Users can search for songs, albums, or artists using the search bar.
3. **Playlist Management**: Users can add tracks to a playlist, rename it, and save it locally or directly to their Spotify account.
4. **Saved Playlists**: Playlists are stored in local storage and can be edited, deleted, or expanded to view tracks.

## ✅ Known Limitations
- Token expires after 1 hour (refresh logic not yet implemented)
- Playlist is saved as public (scope: playlist-modify-public)

## 🎯 Future Improvements
- Add token refresh support.
- Allow saving private playlists.
- Add user feedback loading spinners.
- Show track previews or durations.
- Improve mobile responsiveness.
