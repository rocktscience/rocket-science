// components/CollaboratorModal.tsx
'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { proOrganizations } from '@/lib/constants/musicData';
import SpotifyArtistSearch from '@/components/SpotifyArtistSearch';

interface CollaboratorModalProps {
  collaborator: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function CollaboratorModal({ collaborator, onSave, onClose }: CollaboratorModalProps) {
  const [formData, setFormData] = useState({
    id: collaborator?.id || '',
    first_name: collaborator?.first_name || '',
    middle_name: collaborator?.middle_name || '',
    last_name: collaborator?.last_name || '',
    types: collaborator?.types || [],
    artist_name: collaborator?.artist_name || '',
    spotify_profile: collaborator?.spotify_profile || null,
    no_spotify_profile: collaborator?.no_spotify_profile || false,
    ipi: collaborator?.ipi || '',
    pro: collaborator?.pro || '',
    songwriter_not_affiliated: collaborator?.songwriter_not_affiliated || false,
    instagram: collaborator?.instagram || '',
    twitter: collaborator?.twitter || '',
    facebook: collaborator?.facebook || '',
    website: collaborator?.website || '',
  });

  const [websiteError, setWebsiteError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState('');
  
  const showArtistFields = formData.types.includes('Artist');
  const showSongwriterFields = formData.types.includes('Songwriter');
  const showOtherFields = formData.types.includes('Other');
  
  // Name is required if: Songwriter only, Other only, or Artist with Songwriter/Other
  const nameRequired = (
    !showArtistFields || 
    (showArtistFields && (showSongwriterFields || showOtherFields))
  );

  const formatIPI = (value: string) => {
    const digits = value.replace(/\D/g, '');
    // Auto-pad with zeros if 9 or 10 digits
    if (digits.length === 9) return '00' + digits;
    if (digits.length === 10) return '0' + digits;
    if (digits.length === 11) return digits;
    return digits; // Return as-is for validation later
  };

  const validateWebsite = (url: string) => {
    if (!url) {
      setWebsiteError('');
      return true;
    }
    
    const invalidInputs = ['none', 'n/a', 'na', 'null'];
    if (invalidInputs.includes(url.toLowerCase())) {
      setWebsiteError('Please enter a valid website URL');
      return false;
    }
    
    if (url.includes('@')) {
      setWebsiteError('Please enter a website URL, not an email address');
      return false;
    }
    
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      setWebsiteError('');
      return true;
    } catch {
      setWebsiteError('Please enter a valid website URL');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one type is selected
    if (formData.types.length === 0) {
      alert('Please select at least one contributor type');
      return;
    }
    
    // Validate required fields based on selected types
    if (nameRequired && !formData.first_name && !formData.last_name) {
      alert('First and Last name are required for this contributor type');
      return;
    }
    
    if (showArtistFields) {
      if (!formData.artist_name) {
        alert('Artist name is required when Artist type is selected');
        return;
      }
      
      if (!formData.no_spotify_profile && !formData.spotify_profile) {
        alert('Spotify Profile is required unless "No Spotify Profile" is checked');
        return;
      }
    }
    
    if (showSongwriterFields) {
      if (!formData.songwriter_not_affiliated) {
        if (!formData.pro) {
          alert('PRO is required for affiliated songwriters');
          return;
        }
        
        if (!formData.ipi) {
          alert('IPI Number is required for affiliated songwriters');
          return;
        }
        
        const digits = formData.ipi.replace(/\D/g, '');
        if (digits.length < 9 || digits.length > 11) {
          alert('IPI must be 9-11 digits');
          return;
        }
      }
    }
    
    if (!validateWebsite(formData.website)) {
      return;
    }

    // Format IPI if provided (auto-pad with zeros)
    if (formData.ipi) {
      formData.ipi = formatIPI(formData.ipi);
    }
    
    // Build full_name for storage
    let fullName = '';
    if (formData.first_name || formData.middle_name || formData.last_name) {
      fullName = `${formData.first_name} ${formData.middle_name} ${formData.last_name}`.trim();
    } else if (formData.artist_name) {
      fullName = formData.artist_name;
    }
    
    onSave({
      ...formData,
      full_name: fullName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {collaborator ? 'Edit Contributor' : 'Add New Contributor'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Contributor Types */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contributor Types *
              </label>
              <div className="flex gap-4">
                {['Artist', 'Songwriter', 'Other'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.types.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, types: [...formData.types, type] });
                        } else {
                          setFormData({ ...formData, types: formData.types.filter((t: string) => t !== type) });
                        }
                      }}
                      className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select all that apply. Name fields are required for Songwriters and Production/Engineering roles.
              </p>
            </div>

            {/* Name Fields - Always shown, required based on type selection */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name {nameRequired && '*'}
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required={nameRequired}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middle_name}
                  onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name {nameRequired && '*'}
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required={nameRequired}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Artist Fields */}
            {showArtistFields && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Artist Information</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artist/Stage Name *
                  </label>
                  <input
                    type="text"
                    value={formData.artist_name}
                    onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spotify Profile {!formData.no_spotify_profile && '*'}
                  </label>
                  <SpotifyArtistSearch
                    artistName={formData.artist_name}
                    selectedArtist={formData.spotify_profile}
                    onSelect={(artist) => setFormData({ 
                      ...formData, 
                      spotify_profile: artist,
                      no_spotify_profile: false 
                    })}
                    noProfile={formData.no_spotify_profile}
                    onNoProfileChange={(value) => setFormData({ 
                      ...formData, 
                      no_spotify_profile: value,
                      spotify_profile: value ? null : formData.spotify_profile
                    })}
                  />
                </div>
              </div>
            )}

            {/* Songwriter Fields */}
            {showSongwriterFields && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Songwriter Information</h4>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.songwriter_not_affiliated}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        songwriter_not_affiliated: e.target.checked,
                        pro: e.target.checked ? '' : formData.pro,
                        ipi: e.target.checked ? '' : formData.ipi
                      })}
                      className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="ml-2 text-sm text-gray-700">Not affiliated with a PRO</span>
                  </label>
                </div>

                {!formData.songwriter_not_affiliated && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PRO *
                      </label>
                      <select
                        value={formData.pro}
                        onChange={(e) => setFormData({ ...formData, pro: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="">Select PRO</option>
                        {proOrganizations.map((org) => (
                          <option key={org.code} value={org.code}>
                            {org.name} ({org.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IPI Number *
                      </label>
                      <input
                        type="text"
                        value={formData.ipi}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setFormData({ ...formData, ipi: digits });
                        }}
                        onBlur={(e) => {
                          const formatted = formatIPI(e.target.value);
                          setFormData({ ...formData, ipi: formatted });
                        }}
                        placeholder="9-11 digits"
                        maxLength={11}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                      />
                      <p className="text-xs text-gray-500 mt-1">9-11 digits</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social Media */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Social Media</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      instagram.com/
                    </span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace('@', '') })}
                      placeholder="username"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Twitter/X</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      x.com/
                    </span>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value.replace('@', '') })}
                      placeholder="username"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      facebook.com/
                    </span>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="username"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, website: value });
                      validateWebsite(value);
                    }}
                    placeholder="https://example.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 ${
                      websiteError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {websiteError && (
                    <p className="text-xs text-red-600 mt-1">{websiteError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                {collaborator ? 'Update' : 'Add'} Contributor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}