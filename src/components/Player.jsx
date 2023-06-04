import React from 'react'
import useSpotify from '../hooks/useSpotify'
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import { isPlayingState } from '../atoms/songAtom';
import { useState, useEffect } from 'react';
import useSongInfo from '../hooks/useSongInfo';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  VolumeUpIcon,
  ViewGridAddIcon,
} from "@heroicons/react/solid";
import { HeartIcon } from "@heroicons/react/outline";



export default function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status} = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(0.5);
  const songInfo = useSongInfo();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: ", data.body?.item?.id);
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }
  
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // 处理提交事件
    setInputValue("");
    setShowModal(false);
  };

  const handleCancel = () => {
    // 处理取消事件
    setInputValue("");
    setShowModal(false);
  };


  return (
    <div className='bottom-0 fixed h-18 bg-gradient-to-b from-black to-gray-800 text-white grid grid-cols-3 w-screen'>
      <div className='flex items-center space-x-4'> 
        <img className='h-10 w-10' src={songInfo?.album.images?.[0]?.url} alt="album image" />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.map((artist) => artist.name).join(", ")}</p>
        </div>
      </div>
      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button'/>
        <RewindIcon className='button'/>
        {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className='button w-10 h-10' />) 
          : (
            <PlayIcon onClick={handlePlayPause} className='button w-10 h-10' />)
        }
        <FastForwardIcon className='button'/>
        <div className="relative"
        onClick={() => setShowModal(true)}
        >
          <ViewGridAddIcon className='button'/>
        </div>
        
      {showModal && (
        <div className="absolute -top-20 left-0 w-full h-full flex justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50" />

          <div className="bg-white rounded-lg shadow-lg z-10">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Modal Title</h2>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="input"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Input Label
                </label>
                <input
                  id="input"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-black"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )

}
