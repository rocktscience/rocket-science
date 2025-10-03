'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Check, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CollaboratorDropdownProps {
  value: string;
  onChange: (value: string, collaboratorId?: string) => void;
  onCollaboratorData?: (data: any) => void;
  type?: 'artist' | 'writer' | 'performer' | 'production';
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

interface Collaborator {
  id: string;
  full_name: string;
  artist_name?: string;
  types: string[];
  spotify_verified?: boolean;
  apple_music_verified?: boolean;
  ipi?: string;
  pro?: string;
}

export default function CollaboratorDropdown({
  value,
  onChange,
  onCollaboratorData,
  type = 'artist',
  placeholder = 'Start typing to search or add new...',
  required = false,
  className = '',
  disabled = false,
  multiple = false
}: CollaboratorDropdownProps) {
  const supabase = createClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filtered, setFiltered] = useState<Collaborator[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        setError('Please log in to continue');
      } else {
        setUser(currentUser);
      }
    };
    getUser();
  }, []);

  // Load collaborators when user is available
  useEffect(() => {
    if (user) {
      loadCollaborators();
    }
  }, [user, type]);

  useEffect(() => {
    if (!multiple) {
      setSearch(value || '');
    }
  }, [value, multiple]);

  useEffect(() => {
    filterCollaborators();
  }, [search, collaborators]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (multiple) {
          setSearch('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [multiple]);

  const loadCollaborators = async () => {
    if (!user) {
      console.log('No user available for loading collaborators');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Build query
      let query = supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id);

      // Filter by type
      if (type === 'artist') {
        query = query.contains('types', ['Artist']);
      } else if (type === 'writer') {
        query = query.contains('types', ['Songwriter']);
      } else if (type === 'performer') {
        // For performers, we want Artists and Others
        query = query.or('types.cs.{Artist},types.cs.{Other}');
      } else if (type === 'production') {
        query = query.contains('types', ['Other']);
      }

      const { data, error: queryError } = await query.order('full_name');
      
      if (queryError) {
        console.error('Error loading collaborators:', queryError);
        // Check if table doesn't exist
        if (queryError.message?.includes('relation') && queryError.message?.includes('does not exist')) {
          setError('Collaborators table not found. Please run the database setup.');
        } else {
          setError('Failed to load collaborators');
        }
      } else if (data) {
        setCollaborators(data);
      } else {
        setCollaborators([]);
      }
    } catch (err) {
      console.error('Error in loadCollaborators:', err);
      setError('Failed to load collaborators');
    } finally {
      setLoading(false);
    }
  };

  const filterCollaborators = () => {
    if (!search || search.length < 1) {
      setFiltered(collaborators.slice(0, 10));
      return;
    }

    const searchLower = search.toLowerCase();
    const results = collaborators.filter(c => {
      const nameMatch = c.full_name.toLowerCase().includes(searchLower) ||
                       (c.artist_name && c.artist_name.toLowerCase().includes(searchLower));
      return nameMatch;
    });
    
    setFiltered(results.slice(0, 10));
  };

  const handleSelect = (collaborator: Collaborator) => {
    const displayName = type === 'artist' && collaborator.artist_name 
      ? collaborator.artist_name 
      : collaborator.full_name;
    
    if (multiple) {
      const currentValues = value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
      if (!currentValues.includes(displayName)) {
        currentValues.push(displayName);
        onChange(currentValues.join(', '));
      }
      setSearch('');
    } else {
      setSearch(displayName);
      onChange(displayName, collaborator.id);
      setSelectedIds([collaborator.id]);
    }
    
    if (onCollaboratorData) {
      onCollaboratorData(collaborator);
    }
    
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    if (!search.trim()) return;
    
    if (!user) {
      setError('Please log in to add collaborators');
      return;
    }
    
    setCreating(true);
    setError(null);
    
    try {
      // Check if collaborator already exists
      const { data: existing } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .or(`full_name.ilike.${search.trim()},artist_name.ilike.${search.trim()}`)
        .single();

      if (existing) {
        handleSelect(existing);
        setCreating(false);
        return;
      }

      // Determine types based on field
      let types: string[] = [];
      if (type === 'artist') types = ['Artist'];
      else if (type === 'writer') types = ['Songwriter'];
      else if (type === 'performer') types = ['Artist'];
      else if (type === 'production') types = ['Other'];

      const newCollaborator = {
        user_id: user.id,
        full_name: search.trim(),
        artist_name: type === 'artist' ? search.trim() : null,
        types,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error: insertError } = await supabase
        .from('collaborators')
        .insert(newCollaborator)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating collaborator:', insertError);
        // Check for specific error types
        if (insertError.message?.includes('relation') && insertError.message?.includes('does not exist')) {
          setError('Database table not set up. Please run the SQL setup script in Supabase.');
        } else if (insertError.message?.includes('duplicate')) {
          setError('This collaborator already exists');
        } else if (insertError.message?.includes('permission') || insertError.message?.includes('RLS')) {
          setError('Permission denied. Please check database policies.');
        } else {
          setError(`Failed to add collaborator: ${insertError.message}`);
        }
      } else if (data) {
        // Reload collaborators and select the new one
        await loadCollaborators();
        handleSelect(data);
      }
    } catch (err: any) {
      console.error('Error in handleAddNew:', err);
      setError(`Failed to add collaborator: ${err.message || 'Unknown error'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setError(null);
    
    if (!multiple) {
      onChange(newValue);
      setSelectedIds([]);
    }
    
    if (!isOpen && newValue.length > 0 && user) {
      setIsOpen(true);
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const currentValues = value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
    const newValues = currentValues.filter(v => v !== valueToRemove);
    onChange(newValues.join(', '));
  };

  const showAddNew = search.trim().length > 0 && 
                     !filtered.some(c => 
                       c.full_name.toLowerCase() === search.toLowerCase() ||
                       (c.artist_name && c.artist_name.toLowerCase() === search.toLowerCase())
                     ) && 
                     !creating &&
                     user !== null;

  const currentValues = multiple && value ? value.split(',').map(v => v.trim()).filter(v => v) : [];

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {error && (
        <div className="mb-2 p-2 text-xs text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {multiple && currentValues.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {currentValues.map((val) => (
            <span key={val} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded-full">
              {val}
              <button
                type="button"
                onClick={() => handleRemoveValue(val)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={() => {
            if (user) {
              setIsOpen(true);
              filterCollaborators();
            }
          }}
          placeholder={
            !user 
              ? 'Please log in first' 
              : (multiple && currentValues.length > 0 
                ? 'Add more...' 
                : placeholder)
          }
          required={required && !multiple}
          disabled={disabled || creating || !user}
          className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition pr-10 ${
            isOpen && (filtered.length > 0 || showAddNew) ? 'border-gray-900' : 'border-gray-200'
          } ${(creating || disabled || !user) ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading || creating ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && user && (filtered.length > 0 || showAddNew) && !creating && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filtered.length > 0 ? (
            <>
              {filtered.map((collaborator) => (
                <button
                  key={collaborator.id}
                  type="button"
                  onClick={() => handleSelect(collaborator)}
                  className="w-full px-3 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between group transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {type === 'artist' && collaborator.artist_name 
                        ? collaborator.artist_name 
                        : collaborator.full_name}
                    </p>
                    {type === 'artist' && collaborator.artist_name && collaborator.full_name !== collaborator.artist_name && (
                      <p className="text-xs text-gray-500">{collaborator.full_name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {collaborator.types.join(', ')}
                      </span>
                    </div>
                  </div>
                  {selectedIds.includes(collaborator.id) && (
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </>
          ) : search.trim() && !showAddNew ? (
            <div className="px-3 py-2.5 text-sm text-gray-500">
              No collaborators found
            </div>
          ) : null}
          
          {showAddNew && (
            <>
              {filtered.length > 0 && <div className="border-t border-gray-100" />}
              <button
                type="button"
                onClick={handleAddNew}
                className="w-full px-3 py-3 text-left hover:bg-blue-50 flex items-center space-x-2 text-blue-600 font-medium transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New: "{search}"</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}