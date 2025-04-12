import React from "react";
import "./SearchBar.css";

export default function SearchBar({onSearch}) {

    const [searchTerm, setSearchTerm] = React.useState('');

    
   // This function will handle the search button click event
    const handleSearch = (e) => {
        // Prevent the default action of the button click event
        e.preventDefault();


        if (searchTerm) {
            onSearch(searchTerm.trim());
        } else {
            alert("Please enter a search term.");
        }
    }

    // This function will handle the input change event
    const onChange = (e) => {
        setSearchTerm(e.target.value);
    }   

    return (
        <div className="search-bar">
            <input type="text" placeholder="Enter A Song, Album, or Artist" value={searchTerm} onChange={onChange}/>
            <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
    );
}

