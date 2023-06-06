import { useState } from 'react';
import useSpotify from "../hooks/useSpotify";
import Song from './Song';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

function HomeComponent () {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState(null);



  const getTracks = async () => {
    const response = await spotifyApi.getFeaturedPlaylists({ limit: 10 });
    const featuredPlaylists = response.body.playlists.items;
    
    const tracks = await spotifyApi.getPlaylistTracks(featuredPlaylists[1].id);
    console.log(tracks);
    setPlaylists(tracks);
  }
  
  useEffect(() => {
    getTracks();
  }, []); // 空数组作为依赖项，确保只在组件加载时调用一次

  return (
    <div className='px-4 flex flex-col space-y-1 pb-28 text-white'>
      {playlists?.body.items.map((track, i) => (
        <div key={track.track.id} className="text-white flex">     
          <Song key={track.track.id} track={track.track} order={i}/>
        </div>
      ))}
    </div>
  );
}

export default HomeComponent
