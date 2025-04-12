import React from 'react';
import Tracklist from './TrackList';
import './Playlist.css';

export default function Playlist({playlistName, setPlaylistName, playListTracks, onRemove, onSave, popupMessage, setPopupMessage}) {

  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  }


  return (
    <div className="playlist">
      <input className="Playlist-name" type='text' value={playlistName} onChange={handleNameChange} />
      <Tracklist tracks={playListTracks} onRemove={onRemove} isRemoval={true} />
      <button className="playlist-save" onClick={onSave}>Save to Spotify</button>
      
      {popupMessage && 
      <div className="popup">
        {popupMessage}
        <button className="popup-close" onClick={() => setPopupMessage('')}>Close</button>
        </div>
      }
    </div>
  );
} 