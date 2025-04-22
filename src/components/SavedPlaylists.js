import React, {useState} from "react";
import './SavedPlaylists.css';
import Spotify from "../utils/Spotify";

const SavedPlaylists = ({ savedPlaylist, onDelete, onRename, onUpdateTracks }) => {
    const [editId, setEditId] = useState(null);
    const [newName, setNewName] = useState("");
    const [popupMessage, setPopupMessage] = useState(null);
    const [expandedPlaylistId, setExpandedPlaylistId] = useState(null); 


    const handleEdit = (playlist) => {
        setEditId(playlist.id);
        setNewName(playlist.name);
        setPopupMessage(null); // Clear any previous popup message  
    }

    const handleSaveName = async () => {
        if (!newName) {
            setPopupMessage("Please enter a new name.");
            return;
        }

        try {
            console.log("Renaming playlist with ID:", editId, "to new name:", newName);
            await onRename(editId, newName); // Use the onRename prop to update the local state
            setPopupMessage("Playlist name updated successfully!");
            setEditId(null);
            setNewName("");
        } catch (error) {
            console.error("Error renaming playlist:", error);
            setPopupMessage("Failed to rename playlist.");
        }
    }

    const handleCancel = () => {
        setEditId(null);
        setNewName("");
    }

    const handleSaveToSpotify = async (playlist) => {
        console.log("Saving playlist to Spotify:", playlist);
        try {
            await Spotify.savePlaylist(playlist.name, playlist.tracks.map(track => track.uri));
            setPopupMessage("Playlist saved to Spotify successfully!");
        } catch (error) {
            console.error("Error saving playlist:", error);
            setPopupMessage("Failed to save playlist to Spotify.");
        }
    }

    const toggleExpand = (id) => {
        setExpandedPlaylistId(expandedPlaylistId === id ? null : id);
    }

    // Function to handle removing a track from a playlist
    const handleRemoveTrack = (playlistId, trackId) => {
        console.log("Removing track with ID:", trackId, "from playlist with ID:", playlistId);

        // Find the playlist by ID
        const playlist = savedPlaylist.find(p => p.id === playlistId);
        const updatedTracks = playlist.tracks.filter(track => track.id !== trackId);

        onUpdateTracks(playlistId, updatedTracks); // Call the function to update the tracks in the playlist

    }

    // Clear the popup message after 3 seconds
    React.useEffect(() => {
        if (popupMessage) {
            const timer = setTimeout(() => {
                setPopupMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popupMessage]);


    

    return (
        <div className="SavedPlaylists">
            <h2>Saved Playlists</h2>
            {popupMessage && <div className="popup">{popupMessage}</div>}
            {savedPlaylist.length === 0 && <p>No saved playlists</p>}
            <ul>
                {savedPlaylist.map((playlist) => (
                    <li key={playlist.id}>
                        {editId === playlist.id ? (
                            <div className="edit-playlist">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <button onClick={handleSaveName}>Modify</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        ) : (
                            <div className="playlist-item">
                                <span onClick={()=> toggleExpand(playlist.id)} style={{cursor: 'pointer'}}>{playlist.name}</span>
                                <button onClick={() => handleEdit(playlist)}>Edit Name</button>
                                <button onClick={() => onDelete(playlist.id)}>Delete</button>
                                <button onClick={() => handleSaveToSpotify(playlist)}>Save to Spotify</button>
                                
                            </div>
                        )}
                        {expandedPlaylistId === playlist.id && (
                            <div className="playlist-tracks">
                                <h3>Tracks:</h3>
                                <ul>
                                    {playlist.tracks.map((track, index) => (
                                        <li key={index} className="track-item">
                                            <h3>{track.name}</h3>
                                            <p>{track.artist} | {track.album}</p>
                                            <button className="remove-track-button" onClick={() => handleRemoveTrack(playlist.id, track.id)}>-</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            </div>
    );
};

export default SavedPlaylists;