import React, { useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import Song from './Song';
import { randomBytes } from 'crypto';

function SearchTags() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 处理搜索表单提交的函数 handleSubmit()
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const spotifyApi = useSpotify();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 将用户输入的搜索词按分号分割为数组
    const playlistNames = searchTerm.split(';').map((name) => name.trim());
    
    // 使用useSpotify的搜索方法进行歌单搜索
    const searchPromises = playlistNames.map(async (name) => {
      console.log(spotifyApi.searchPlaylists(name));
      const tracks =  await spotifyApi.searchPlaylists(name);
      return tracks;
    });

    try {
      const searchResponses = await Promise.all(searchPromises);
      

      // 从每个搜索响应中提取歌曲结果并合并为一个数组
      const tracks = searchResponses.flatMap((response) => {
        return response.body.playlists.items.flatMap(async (playlist) => {
          const t = await spotifyApi.getPlaylistTracks(playlist.id);
          console.log(t);
          return playlist.tracks.items.map((item) => item.track);
        });
      });
      console.log("tracks", tracks);

      setSearchResults(tracks);
    } catch (error) {
      console.error('Error searching playlists:', error);
    }
  };


  return (
    <div className='flex flex-col items-center justify-center'> 
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

export default SearchTags;