import { useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import Song from './Song';

function Search() {
  const spotifyApi = useSpotify();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = spotifyApi.search(searchTerm, 'track');
      const tracks = response.body.tracks.items;
      setSearchResults(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    handleSearch();
  };

  return (
    <div>
      <form className='center' onSubmit={handleSubmit}>
        <input
          className='border-2 border-gray-900 rounded-md text-black'
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for a song..."
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {searchResults.map((track, index) => (
          <Song key={track.id} track={track} order={index} />
        ))}
      </div>
    </div>
  );
}

export default Search;
