import React, {useState} from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import './App.css';
import Spotify from './utils/Spotify';


export default function App() {

  // This variable will hold the message to be displayed in the popup
  const [popupMessage, setPopupMessage] = useState(''); 

  // This variable will hold the search results
  const [searchResults, setSearchResults] = useState([]);
  
  // This variable will hold the tracks that are added to the playlist
  const [playlistTracks, setPlaylistTracks] = useState([]);

  //This variable will hold the name of the playlist
  const [playlistName, setPlaylistName] = useState('New Playlist');

  //This function will search for tracks in Spotify 
  const searchSpotify = async (term) => {
    const results = await Spotify.search(term); 
    setSearchResults(results);
  }

  //This function will get the access token from Spotify
  React.useEffect(() => {
    Spotify.getAccessToken();
  }, []); 

  //This function will add a track to the playlist
  const addTrack = (track) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks(prev => [...prev, track]);
  };

  //This function will remove a track from the playlist
  const removeTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(savedTrack => savedTrack.id !== track.id));
  };

  //This function will save the playlist to Spotify
  const savePlaylist = async () => {
    const trackURIs = playlistTracks.map(track => track.uri);

    if (!playlistName || !trackURIs.length) {
      return;
    }

    const success = await Spotify.savePlaylist(playlistName, trackURIs);
    if (success) {
      setPopupMessage(`Your playlist ${playlistName} has been saved in your account!`);
    } else {
      setPopupMessage(`There was an error saving your playlist ${playlistName}. Please try again.`);
    }

    setPlaylistName('New Playlist');
    setPlaylistTracks([]);

    
    
  }


  return (
    <div className="App">
      <div className="app-background">
        <header className="app-header">
          <img src="/Jamming Logo.svg" className="app-logo" alt="Jammming logo" />
        </header>
        <SearchBar onSearch={searchSpotify} />
        <div className="app-content">
          <SearchResults className="search-results" tracks={searchResults} onAdd={addTrack} />
          <Playlist className="playlist" playlistName={playlistName} setPlaylistName={setPlaylistName} playListTracks={playlistTracks} onRemove={removeTrack} onSave={savePlaylist} popupMessage={popupMessage} setPopupMessage={setPopupMessage}/>
        </div>
      </div>
    </div>
  );
}
