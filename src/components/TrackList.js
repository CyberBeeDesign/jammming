import React from "react";
import Track from "./Track";
import "./SearchResults.css";

export default function TrackList({tracks, isRemoval, onAdd, onRemove}) {
  return (
    <div className="track-list">
    {tracks.map((track) => (
      <Track key={track.id} track={track} onRemove={onRemove} onAdd={onAdd} isRemoval={isRemoval}/>
    ))}
</div>
  );
}