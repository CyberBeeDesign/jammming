import React, {useState} from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import SavedPlaylists from './components/SavedPlaylists';
import Spotify from './utils/Spotify';
import './App.css';


export default function App() {

  // This variable will hold the user profile information
  const [userProfile, setUserProfile] = useState(null); 

  // This variable will hold the state of the popup visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false); 

  // This variable will hold the message to be displayed in the popup
  const [popupMessage, setPopupMessage] = useState(''); 

  // This variable will hold the search results
  const [searchResults, setSearchResults] = useState([]);
  
  // This variable will hold the tracks that are added to the playlist
  const [playlistTracks, setPlaylistTracks] = useState([]);

  //This variable will hold the name of the playlist
  const [playlistName, setPlaylistName] = useState('New Playlist');

  //This variable will hold the saved playlists
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = Spotify.getAccessToken();
      const endpoint = 'https://api.spotify.com/v1/me';
      const headers = { Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      try {
        const response = await fetch(endpoint, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUserProfile({
          name: data.display_name,
          image: data.images[0]?.url || 'https://via.placeholder.com/150',
url: data.external_urls.spotify          
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);


  // Load playlists from local storage on app load
  React.useEffect(() => {
    const storedPlaylists = localStorage.getItem('savedPlaylists');
    console.log('Raw data from localStorage:', storedPlaylists);
    if (storedPlaylists) {
        try {
            const parsedPlaylists = JSON.parse(storedPlaylists);
            console.log('Parsed playlists:', parsedPlaylists);
            setSavedPlaylists(parsedPlaylists);
        } catch (error) {
            console.error('Error parsing playlists from localStorage:', error);
        }
    } else {
        console.log('No playlists found in localStorage.');
    }
  }, []);

  // Save playlists to local storage whenever they are updated
  React.useEffect(() => {
    console.log('Saving playlists to localStorage:', savedPlaylists);
    localStorage.setItem('savedPlaylists', JSON.stringify(savedPlaylists));
  }, [savedPlaylists]);

  //This function will get the access token from Spotify
  React.useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  //This function will save the playlist in the saved playlists
  const saveToLocalPlaylists = (name, tracks) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks
    };
    setSavedPlaylists(prev => [...prev, newPlaylist]);
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
  };

  //This function will rename the playlist in the saved playlists
  const renamePlaylist = (id, newName) => {
    setSavedPlaylists((prev) =>
        prev.map((playlist) =>
            playlist.id === id ? { ...playlist, name: newName } : playlist
        )
    );
  };

  //This function will search for tracks in Spotify 
  const searchSpotify = async (term) => {
    const results = await Spotify.search(term); 
    setSearchResults(results);
  }

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
      setIsPopupVisible(true);
    } else {
      setPopupMessage(`There was an error saving your playlist ${playlistName}. Please try again.`);
      setIsPopupVisible(true);
    }

    setPlaylistName('New Playlist');
    setPlaylistTracks([]);  
  }

  //This function will delete a playlist from the saved playlists
  const deletePlaylist = (id) => {
    setSavedPlaylists((prev) => prev.filter((playlist) => playlist.id !== id));
  };

  //This function will update the tracks in the playlist
  const updatePlaylistTracks = (id, updatedTracks) => {
    setSavedPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === id ? { ...playlist, tracks: updatedTracks } : playlist
      )
    );
  }


  return (
    <div className="App">
      <div className="app-background">
        <header className="app-header">
          <img src="/Jamming Logo.svg" className="app-logo" alt="Jammming logo" />
{userProfile && (
            <div className="user-profile" onClick={() => window.open(userProfile.url, '_blank')}>
              <img src={userProfile.image} alt="User Profile" className="user-profile-image" />
              <span className="user-profile-name">{userProfile.name}</span>
            </div>
          )}
        </header>
        <SearchBar onSearch={searchSpotify} />
        <div className="app-content">
          <SearchResults className="search-results" tracks={searchResults} onAdd={addTrack} />
          <Playlist 
          className="playlist" 
          playlistName={playlistName} 
          setPlaylistName={setPlaylistName} 
          playListTracks={playlistTracks} 
          onRemove={removeTrack} 
          saveToLocalPlaylists={saveToLocalPlaylists}/>
        </div>
        <div className="saved-playlist">
          <SavedPlaylists 
          savedPlaylist={savedPlaylists || []} 
          onRename= {renamePlaylist}
          saveToSpotify={savePlaylist}
          popupMessage = {popupMessage}
          onDelete = {deletePlaylist}
          onUpdateTracks={updatePlaylistTracks} 
          />
          
          {isPopupVisible && (
            <div className="popup">
              <p>{popupMessage}</p>
              <button className="popup-close" onClick={() => setIsPopupVisible(false)}>
                Close
                </button>
  </div>
)}
        </div>
      </div>
    </div>
    
  );
}
