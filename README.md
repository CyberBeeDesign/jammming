# Jammming 🎵

Jammming is a React web application that allows users to search for songs, albums, or artists using the Spotify API, build custom playlists, and save them directly to their Spotify account.

## 🚀 Features

- 🔍 Search the Spotify catalog for tracks by keyword
- ➕ Add tracks to a custom playlist
- 📝 Name and rename your playlist
- 💾 Save the playlist directly to your Spotify account
- 🎛 Seamless integration with Spotify's Web API

## 🛠 Built With

- React
- JavaScript (ES6+)
- Spotify Web API
- CSS Modules

## 📸 Screenshots

| Search | Playlist |
|--------|----------|
| ![Search Screenshot](./screenshots/search.png) | ![Playlist Screenshot](./screenshots/playlist.png) |

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/jammming.git
   cd jammming

2. Install dependencies:
   npm install

3. Start the app:
   npm start

4. The app will open at http://localhost:3000/.

🔐 Spotify API Setup
You’ll need to register a Spotify application to get your clientId.

Go to Spotify Developer Dashboard

Log in and create a new application

Set your redirect URI to:

arduino
Copy
Edit
http://localhost:3000/
Copy your Client ID and paste it into Spotify.js:

js
Copy
Edit
const clientId = "your-client-id";
📁 Project Structure
css
Copy
Edit
src/
│
├── components/
│   ├── SearchBar.js
│   ├── SearchResults.js
│   ├── Playlist.js
│   ├── Track.js
│   └── TrackList.js
│
├── utils/
│   └── Spotify.js
│
├── App.js
├── App.css
└── index.js
🧠 How It Works
On page load, the app checks for an access token in the URL.

If absent, it redirects to Spotify's auth page.

Once authenticated, you can search for music.

Results are shown dynamically.

Add/remove tracks to/from a playlist.

Save the playlist directly to your Spotify account.

✅ Known Limitations
Token expires after 1 hour (refresh logic not yet implemented)

Playlist is saved as public (scope: playlist-modify-public)

🎯 Future Improvements
Add token refresh support

Allow saving private playlists

Add user feedback loading spinners

Show preview or track duration
