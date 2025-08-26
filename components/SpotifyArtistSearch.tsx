'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import debounce from 'lodash/debounce';

interface SpotifyArtist {
  id: string;
  name: string;
  image?: string;
  url: string;
}

interface SpotifyArtistSearchProps {
  artistName: string;
  selectedArtist?: SpotifyArtist;
  onSelect: (artist: SpotifyArtist) => void;
  noProfile: boolean;
  onNoProfileChange: (value: boolean) => void;
}

export default function SpotifyArtistSearch({
  artistName,
  selectedArtist,
  onSelect,
  noProfile,
  onNoProfileChange
}: SpotifyArtistSearchProps) {
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchSpotify = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=artist`);
      const data = await response.json();
      
      if (data.artists?.items) {
        const artists = data.artists.items.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url,
          url: artist.external_urls?.spotify
        }));
        setSearchResults(artists);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error searching Spotify:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchSpotify(query), 500),
    []
  );

  useEffect(() => {
    if (artistName && !noProfile && !selectedArtist) {
      debouncedSearch(artistName);
    }
  }, [artistName, noProfile, selectedArtist]);

  const handleSelect = (artist: SpotifyArtist) => {
    onSelect(artist);
    setShowResults(false);
  };

  if (noProfile) {
    return (
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={noProfile}
            onChange={(e) => onNoProfileChange(e.target.checked)}
            className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
          <span className="ml-2 text-sm text-gray-700">No Spotify Profile</span>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        {selectedArtist ? (
          <div className="flex items-center space-x-3 p-3 border border-green-500 rounded-lg bg-green-50">
            {selectedArtist.image && (
              <img 
                src={selectedArtist.image} 
                alt={selectedArtist.name}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{selectedArtist.name}</p>
              <a 
                href={selectedArtist.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline"
              >
                View on Spotify
              </a>
            </div>
            <button
              type="button"
              onClick={() => onSelect(undefined as any)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Change
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={artistName}
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search for artist on Spotify..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {searching && (
              <p className="text-sm text-gray-500">Searching...</p>
            )}

            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => handleSelect(artist)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left"
                  >
                    {artist.image && (
                      <img 
                        src={artist.image} 
                        alt={artist.name}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{artist.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={noProfile}
          onChange={(e) => onNoProfileChange(e.target.checked)}
          className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
        />
        <span className="ml-2 text-sm text-gray-700">No Spotify Profile</span>
      </label>
    </div>
  );
}