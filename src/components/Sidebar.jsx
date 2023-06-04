import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playLists, setPlayLists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlayLists(data.body.items);
      });
    }
  }, [session, spotifyApi]);
  return (
    <div className="text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll h-screen">
      <div className="space-y-4">
        <button className="flex items-center sapce-x-2 hover:text-white">
        </button>
        <button className="flex items-center sapce-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5"/>
          <p>Home</p>
        </button>
        <button className="flex items-center sapce-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5"/>
          <p>Search</p>
        </button>
        <button className="flex items-center sapce-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5"/>
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900"/>
        <button className="flex items-center sapce-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5"/>
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center sapce-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5"/>
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center sapce-x-2 hover:text-white">
          <RssIcon className="h-5 w-5"/>
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900"/>
        <h2 className="weight">TAGS:</h2>
        {playLists.map((playlist) => (
          <p key={playlist.id} className="cursor-pointer hover:text-white" 
          onClick={() => setPlaylistId(playlist.id)}>{playlist.name}</p>
        ))}
        <hr className="border-t-[0.1px] border-gray-900"/>
      </div>
    </div>
  ); 
}

export default Sidebar;