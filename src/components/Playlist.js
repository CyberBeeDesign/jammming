import React from 'react';
import Tracklist from './TrackList';
import './Playlist.css';

export default function Playlist({playlistName, setPlaylistName, playListTracks, onRemove, saveToLocalPlaylists}) {

  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  }


  return (
    <div className="playlist">
      <input className="Playlist-name" type='text' value={playlistName} onChange={handleNameChange} />
      <Tracklist tracks={playListTracks} onRemove={onRemove} isRemoval={true} />
      <button className="playlist-save" onClick={() => saveToLocalPlaylists(playlistName, playListTracks)}>
        Save to Saved Playlists
      </button>
    </div>
  );
} 