'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Check } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/app/providers/UserProvider';

interface CollaboratorSearchProps {
  value: string;
  onChange: (value: string, collaboratorId?: string) => void;
  type: 'artist' | 'songwriter' | 'all';
  required?: boolean;
  placeholder?: string;
  className?: string;
}

interface Collaborator {
  id: string;
  full_name: string;
  artist_name?: string;
  types: string[];
  spotify_verified?: boolean;
  apple_music_verified?: boolean;
}

export default function CollaboratorSearch({
  value,
  onChange,
  type,
  required = false,
  placeholder = 'Search collaborators...',
  className = ''
}: CollaboratorSearchProps) {
  const supabase = createClientComponentClient();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filtered, setFiltered] = useState<Collaborator[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCollaborators();
  }, [user]);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    if (search.length > 0) {
      const searchLower = search.toLowerCase();
      const results = collaborators.filter(c => {
        const matchesName = c.full_name.toLowerCase().includes(searchLower) ||
                           (c.artist_name && c.artist_name.toLowerCase().includes(searchLower));
        
        if (type === 'all') return matchesName;
        if (type === 'artist') return matchesName && c.types.includes('Artist');
        if (type === 'songwriter') return matchesName && c.types.includes('Songwriter');
        return false;
      });
      
      setFiltered(results);
      setShowAddNew(results.length === 0 && search.length > 2);
    } else {
      setFiltered([]);
      setShowAddNew(false);
    }
  }, [search, collaborators, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCollaborators = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('collaborators')
      .select('*')
      .eq('user_id', user.id)
      .order('full_name');
      
    if (data) {
      setCollaborators(data);
    }
  };

  const handleSelect = (collaborator: Collaborator) => {
    const displayName = collaborator.artist_name || collaborator.full_name;
    onChange(displayName, collaborator.id);
    setSearch(displayName);
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    // Open add collaborator modal or redirect to settings
    // For now, we'll just set the value
    onChange(search);
    setIsOpen(false);
    
    // In production, you'd open a modal to add the collaborator properly
    alert(`Add new collaborator: ${search}\n\nNote: For artists, Spotify and Apple Music profiles must be verified before submission.`);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (filtered.length > 0 || showAddNew) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filtered.map((collaborator) => (
            <button
              key={collaborator.id}
              type="button"
              onClick={() => handleSelect(collaborator)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {collaborator.artist_name || collaborator.full_name}
                </p>
                {collaborator.artist_name && (
                  <p className="text-sm text-gray-500">{collaborator.full_name}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {collaborator.types.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {t}
                    </span>
                  ))}
                  {collaborator.spotify_verified && (
                    <span className="text-xs text-green-600 flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Spotify
                    </span>
                  )}
                  {collaborator.apple_music_verified && (
                    <span className="text-xs text-green-600 flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Apple
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {showAddNew && (
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 border-t"
            >
              <Plus className="w-4 h-4 text-gray-600" />
              <span className="text-gray-900">Add new: "{search}"</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}