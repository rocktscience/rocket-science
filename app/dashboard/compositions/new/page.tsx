'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from '@/app/providers/TranslationProvider';
import CollaboratorDropdown from '@/components/CollaboratorDropdown';
import { 
  territories, 
  proOrganizations, 
  musicLanguages 
} from '@/lib/constants/musicData';

interface Publisher {
  unknown: boolean;
  selfPublished: boolean;
  name: string;
  ipi: string;
  pro: string;
  role: string;
  territory: string;
  share: number;
}

interface Writer {
  unknown: boolean;
  fullName: string;
  ipi: string;
  pro: string;
  role: string;
  share: number;
  publishers: Publisher[];
}

interface WorkReference {
  organization: string;
  code: string;
}

export default function NewCompositionPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { t } = useTranslations();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedWriters, setExpandedWriters] = useState<number[]>([0]);
  
  // Basic Information
  const [title, setTitle] = useState('');
  const [alternateTitles, setAlternateTitles] = useState<string[]>(['']);
  const [iswc, setIswc] = useState('');
  const [duration, setDuration] = useState('');
  const [language, setLanguage] = useState('');
  const [copyrightDate, setCopyrightDate] = useState('');
  const [copyrightNumber, setCopyrightNumber] = useState('');
  
  // Writers and Publishers
  const [writers, setWriters] = useState<Writer[]>([{
    unknown: false,
    fullName: '',
    ipi: '',
    pro: '',
    role: 'Composer/Author',
    share: 100,
    publishers: [{
      unknown: false,
      selfPublished: false,
      name: '',
      ipi: '',
      pro: '',
      role: 'Original Publisher',
      territory: 'World',
      share: 100
    }]
  }]);
  
  // Work References
  const [workReferences, setWorkReferences] = useState<WorkReference[]>([]);
  
  // Advanced fields
  const [musicalWorkCategory, setMusicalWorkCategory] = useState('Popular');
  const [textMusicRelationship, setTextMusicRelationship] = useState('Music and Text (same creation)');
  const [compositeType, setCompositeType] = useState('');
  const [compositeComponentCount, setCompositeComponentCount] = useState('');
  const [versionType, setVersionType] = useState('Original Work');
  const [excerptType, setExcerptType] = useState('');
  const [musicArrangement, setMusicArrangement] = useState('Original');
  const [lyricAdaptation, setLyricAdaptation] = useState('Original');
  const [cwrWorkType, setCwrWorkType] = useState('');
  const [grandRights, setGrandRights] = useState('No');
  const [priorityFlag, setPriorityFlag] = useState('No');

  const validateISWC = (value: string): boolean => {
    const iswcRegex = /^T-\d{3}\.\d{3}\.\d{3}-\d$/;
    return iswcRegex.test(value);
  };

  const formatISWC = (value: string): string => {
    const clean = value.replace(/[^\dT]/gi, '').toUpperCase();
    
    if (!clean.startsWith('T')) {
      return clean ? `T-${clean}` : 'T-';
    }
    
    const digits = clean.slice(1);
    
    if (digits.length <= 3) {
      return `T-${digits}`;
    } else if (digits.length <= 6) {
      return `T-${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `T-${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `T-${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 10)}`;
    }
  };

  const formatIPI = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 9) return '00' + digits;
    if (digits.length === 10) return '0' + digits;
    return digits;
  };

  const validateIPI = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 11;
  };

  const validateCopyrightNumber = (value: string): boolean => {
    if (!value) return true;
    const copyrightRegex = /^(TX|SR)\d{10}$/;
    return copyrightRegex.test(value);
  };

  const toggleWriterExpanded = (index: number) => {
    setExpandedWriters(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleAddAlternateTitle = () => {
    setAlternateTitles([...alternateTitles, '']);
  };

  const handleRemoveAlternateTitle = (index: number) => {
    setAlternateTitles(alternateTitles.filter((_, i) => i !== index));
  };

  const handleAddWriter = () => {
    const newWriterIndex = writers.length;
    setWriters([...writers, {
      unknown: false,
      fullName: '',
      ipi: '',
      pro: '',
      role: 'Composer/Author',
      share: 0,
      publishers: [{
        unknown: false,
        selfPublished: false,
        name: '',
        ipi: '',
        pro: '',
        role: 'Original Publisher',
        territory: 'World',
        share: 100
      }]
    }]);
    setExpandedWriters([...expandedWriters, newWriterIndex]);
  };

  const handleRemoveWriter = (index: number) => {
    if (writers.length > 1) {
      setWriters(writers.filter((_, i) => i !== index));
      setExpandedWriters(expandedWriters.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    }
  };

  const handleAddPublisher = (writerIndex: number) => {
    const updated = [...writers];
    updated[writerIndex].publishers.push({
      unknown: false,
      selfPublished: false,
      name: '',
      ipi: '',
      pro: '',
      role: 'Original Publisher',
      territory: 'World',
      share: 0
    });
    setWriters(updated);
  };

  const handleRemovePublisher = (writerIndex: number, publisherIndex: number) => {
    const updated = [...writers];
    if (updated[writerIndex].publishers.length > 1) {
      updated[writerIndex].publishers = updated[writerIndex].publishers.filter((_, i) => i !== publisherIndex);
      setWriters(updated);
    }
  };

  const handleAddWorkReference = () => {
    setWorkReferences([...workReferences, { organization: '', code: '' }]);
  };

  const handleRemoveWorkReference = (index: number) => {
    setWorkReferences(workReferences.filter((_, i) => i !== index));
  };

  const calculateTotalWriterShares = () => {
    return writers.reduce((sum, writer) => sum + (writer.share || 0), 0);
  };

  const calculateWriterPublisherShares = (writerIndex: number) => {
    return writers[writerIndex].publishers.reduce((sum, pub) => sum + (pub.share || 0), 0);
  };

  const getShareError = (): string | null => {
    const writerTotal = calculateTotalWriterShares();
    if (writerTotal !== 100) {
      return `Writer shares must total exactly 100% (currently ${writerTotal}%)`;
    }

    for (let i = 0; i < writers.length; i++) {
      const publisherTotal = calculateWriterPublisherShares(i);
      if (publisherTotal !== 100) {
        return `Writer ${i + 1}'s publisher shares must total exactly 100% (currently ${publisherTotal}%)`;
      }
    }

    return null;
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Format writers data with auto-padded IPI
      const formattedWriters = writers.map(writer => ({
        ...writer,
        ipi: writer.ipi ? formatIPI(writer.ipi) : '',
        publishers: writer.publishers.map(pub => ({
          ...pub,
          ipi: pub.ipi ? formatIPI(pub.ipi) : ''
        }))
      }));

      const compositionData = {
        user_id: user.id,
        title,
        alternate_titles: alternateTitles.filter(t => t),
        iswc: iswc || null,
        duration: duration || null,
        language,
        copyright_date: copyrightDate || null,
        copyright_number: copyrightNumber || null,
        writers: formattedWriters,
        work_references: workReferences.filter(ref => ref.organization && ref.code),
        musical_work_category: musicalWorkCategory,
        text_music_relationship: textMusicRelationship,
        composite_type: compositeType || null,
        composite_component_count: compositeComponentCount || null,
        version_type: versionType,
        excerpt_type: excerptType || null,
        music_arrangement: musicArrangement,
        lyric_adaptation: lyricAdaptation,
        cwr_work_type: cwrWorkType || null,
        grand_rights: grandRights === 'Yes',
        priority_flag: priorityFlag === 'Yes',
        status: 'draft'
      };

      const { error: compositionError } = await supabase
        .from('compositions')
        .insert(compositionData);

      if (compositionError) throw compositionError;

      router.push('/dashboard/compositions');
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const shareError = getShareError();
    if (shareError) {
      setError(shareError);
      setLoading(false);
      return;
    }

    if (iswc && !validateISWC(iswc)) {
      setError('Invalid ISWC format. Should be T-XXX.XXX.XXX-X (e.g., T-123.456.789-1)');
      setLoading(false);
      return;
    }

    if (copyrightNumber && !validateCopyrightNumber(copyrightNumber)) {
      setError('Invalid copyright number format. Should be TX or SR followed by 10 digits');
      setLoading(false);
      return;
    }

    for (let i = 0; i < writers.length; i++) {
      const writer = writers[i];
      if (!writer.unknown && writer.ipi && !validateIPI(writer.ipi)) {
        setError(`Writer ${i + 1}: IPI must be 9-11 digits`);
        setLoading(false);
        return;
      }

      for (let j = 0; j < writer.publishers.length; j++) {
        const publisher = writer.publishers[j];
        if (!publisher.unknown && !publisher.selfPublished && publisher.ipi && !validateIPI(publisher.ipi)) {
          setError(`Writer ${i + 1}, Publisher ${j + 1}: IPI must be 9-11 digits`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Format writers data with auto-padded IPI
      const formattedWriters = writers.map(writer => ({
        ...writer,
        ipi: writer.ipi ? formatIPI(writer.ipi) : '',
        publishers: writer.publishers.map(pub => ({
          ...pub,
          ipi: pub.ipi ? formatIPI(pub.ipi) : ''
        }))
      }));

      const compositionData = {
        user_id: user.id,
        title,
        alternate_titles: alternateTitles.filter(t => t),
        iswc: iswc || null,
        duration: duration || null,
        language,
        copyright_date: copyrightDate || null,
        copyright_number: copyrightNumber || null,
        writers: formattedWriters,
        work_references: workReferences.filter(ref => ref.organization && ref.code),
        musical_work_category: musicalWorkCategory,
        text_music_relationship: textMusicRelationship,
        composite_type: compositeType || null,
        composite_component_count: compositeComponentCount || null,
        version_type: versionType,
        excerpt_type: excerptType || null,
        music_arrangement: musicArrangement,
        lyric_adaptation: lyricAdaptation,
        cwr_work_type: cwrWorkType || null,
        grand_rights: grandRights === 'Yes',
        priority_flag: priorityFlag === 'Yes',
        status: 'submitted'
      };

      const { error: compositionError } = await supabase
        .from('compositions')
        .insert(compositionData);

      if (compositionError) throw compositionError;

      router.push('/dashboard/compositions');
    } catch (err) {
      console.error('Error creating composition:', err);
      setError(err instanceof Error ? err.message : 'Failed to register work');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/compositions"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">{t.backToCompositions}</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
              Register Musical Work
            </span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {getShareError() && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">{getShareError()}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Alternate Titles
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAlternateTitle}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {alternateTitles.map((altTitle, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={altTitle}
                      onChange={(e) => {
                        const updated = [...alternateTitles];
                        updated[index] = e.target.value;
                        setAlternateTitles(updated);
                      }}
                      placeholder="Alternate title"
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    />
                    {alternateTitles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAlternateTitle(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="iswc" className="block text-sm font-medium text-gray-700 mb-2">
                  ISWC
                </label>
                <input
                  type="text"
                  id="iswc"
                  value={iswc}
                  onChange={(e) => setIswc(formatISWC(e.target.value))}
                  placeholder="T-123.456.789-1"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-1">Format: T-XXX.XXX.XXX-X</p>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="00:00"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                >
                  <option value="">Select Language</option>
                  {musicLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shares Section */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shares</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Writer Total: {calculateTotalWriterShares()}% (must equal 100%)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddWriter}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Writer
              </button>
            </div>

            <div className="space-y-4">
              {writers.map((writer, writerIndex) => (
                <div key={writerIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleWriterExpanded(writerIndex)}
                  >
                    <div className="flex items-center space-x-4">
                      {expandedWriters.includes(writerIndex) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">Writer {writerIndex + 1}</h3>
                        <p className="text-sm text-gray-600">
                          Publisher Total: {calculateWriterPublisherShares(writerIndex)}%
                        </p>
                      </div>
                    </div>
                    {writers.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveWriter(writerIndex);
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {expandedWriters.includes(writerIndex) && (
                    <div className="p-6 border-t">
                      {/* Writer Information */}
                      <div className="space-y-4 mb-6">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={writer.unknown}
                            onChange={(e) => {
                              const updated = [...writers];
                              updated[writerIndex].unknown = e.target.checked;
                              setWriters(updated);
                            }}
                            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                          />
                          <span className="text-sm font-medium text-gray-700">Writer Unknown</span>
                        </label>

                        {!writer.unknown && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                              </label>
                              <CollaboratorDropdown
                                value={writer.fullName}
                                onChange={(value) => {
                                  const updated = [...writers];
                                  updated[writerIndex].fullName = value;
                                  setWriters(updated);
                                }}
                                type="writer"
                                placeholder="Type to search or add new writer..."
                                required={!writer.unknown}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                IPI *
                              </label>
                              <input
                                type="text"
                                value={writer.ipi}
                                onChange={(e) => {
                                  const updated = [...writers];
                                  updated[writerIndex].ipi = e.target.value.replace(/\D/g, '');
                                  setWriters(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = [...writers];
                                  updated[writerIndex].ipi = formatIPI(e.target.value);
                                  setWriters(updated);
                                }}
                                placeholder="9-11 digits"
                                required
                                maxLength={11}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                              />
                              <p className="text-xs text-gray-500 mt-1">Auto-pads with zeros if needed</p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                PRO *
                              </label>
                              <select
                                value={writer.pro}
                                onChange={(e) => {
                                  const updated = [...writers];
                                  updated[writerIndex].pro = e.target.value;
                                  setWriters(updated);
                                }}
                                required
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                              >
                                <option value="">Select PRO</option>
                                {proOrganizations.map((org) => (
                                  <option key={org.code} value={org.code}>
                                    {org.name} ({org.country})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Writer Role *
                            </label>
                            <select
                              value={writer.role}
                              onChange={(e) => {
                                const updated = [...writers];
                                updated[writerIndex].role = e.target.value;
                                setWriters(updated);
                              }}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            >
                              <option value="Composer/Author">Composer/Author</option>
                              <option value="Composer">Composer</option>
                              <option value="Author">Author</option>
                              <option value="Arranger">Arranger</option>
                              <option value="Adaptor">Adaptor</option>
                              <option value="Translator">Translator</option>
                              <option value="Sub Arranger">Sub Arranger</option>
                              <option value="Sub Author">Sub Author</option>
                              <option value="Income Participant">Income Participant</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Writer Share % *
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={writer.share}
                              onChange={(e) => {
                                const updated = [...writers];
                                updated[writerIndex].share = parseInt(e.target.value) || 0;
                                setWriters(updated);
                              }}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Publishers for this Writer */}
                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">Publishers</h4>
                          <button
                            type="button"
                            onClick={() => handleAddPublisher(writerIndex)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {writer.publishers.map((publisher, publisherIndex) => (
                            <div key={publisherIndex} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="text-sm font-medium text-gray-700">
                                  Publisher {publisherIndex + 1}
                                </h5>
                                {writer.publishers.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePublisher(writerIndex, publisherIndex)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center space-x-6">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={publisher.selfPublished}
                                      onChange={(e) => {
                                        const updated = [...writers];
                                        updated[writerIndex].publishers[publisherIndex].selfPublished = e.target.checked;
                                        setWriters(updated);
                                      }}
                                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Self-Published</span>
                                  </label>

                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={publisher.unknown}
                                      onChange={(e) => {
                                        const updated = [...writers];
                                        updated[writerIndex].publishers[publisherIndex].unknown = e.target.checked;
                                        setWriters(updated);
                                      }}
                                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Unknown</span>
                                  </label>
                                </div>

                                {!publisher.unknown && !publisher.selfPublished && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Publisher Name *
                                      </label>
                                      <input
                                        type="text"
                                        value={publisher.name}
                                        onChange={(e) => {
                                          const updated = [...writers];
                                          updated[writerIndex].publishers[publisherIndex].name = e.target.value;
                                          setWriters(updated);
                                        }}
                                        required
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        IPI *
                                      </label>
                                      <input
                                        type="text"
                                        value={publisher.ipi}
                                        onChange={(e) => {
                                          const updated = [...writers];
                                          updated[writerIndex].publishers[publisherIndex].ipi = e.target.value.replace(/\D/g, '');
                                          setWriters(updated);
                                        }}
                                        onBlur={(e) => {
                                          const updated = [...writers];
                                          updated[writerIndex].publishers[publisherIndex].ipi = formatIPI(e.target.value);
                                          setWriters(updated);
                                        }}
                                        placeholder="9-11 digits"
                                        required
                                        maxLength={11}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">Auto-pads with zeros</p>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        PRO *
                                      </label>
                                      <select
                                        value={publisher.pro}
                                        onChange={(e) => {
                                          const updated = [...writers];
                                          updated[writerIndex].publishers[publisherIndex].pro = e.target.value;
                                          setWriters(updated);
                                        }}
                                        required
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                      >
                                        <option value="">Select PRO</option>
                                        {proOrganizations.map((org) => (
                                          <option key={org.code} value={org.code}>
                                            {org.name} ({org.country})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Publisher Role *
                                    </label>
                                    <select
                                      value={publisher.role}
                                      onChange={(e) => {
                                        const updated = [...writers];
                                        updated[writerIndex].publishers[publisherIndex].role = e.target.value;
                                        setWriters(updated);
                                      }}
                                      required
                                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    >
                                      <option value="Original Publisher">Original Publisher</option>
                                      <option value="Acquirer">Acquirer</option>
                                      <option value="Administrator">Administrator</option>
                                      <option value="Income Participant">Income Participant</option>
                                      <option value="Substituted Publisher">Substituted Publisher</option>
                                      <option value="Sub Publisher">Sub Publisher</option>
                                    </select>
                                  </div>

                                  {!publisher.unknown && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Territory *
                                      </label>
                                      <select
                                        value={publisher.territory}
                                        onChange={(e) => {
                                          const updated = [...writers];
                                          updated[writerIndex].publishers[publisherIndex].territory = e.target.value;
                                          setWriters(updated);
                                        }}
                                        required
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                      >
                                        {territories.map((terr) => (
                                          <option key={terr} value={terr}>{terr}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Publisher Share % *
                                      <span className="text-xs text-gray-500 ml-1">
                                        (of writer's {writer.share}%)
                                      </span>
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={publisher.share}
                                      onChange={(e) => {
                                        const updated = [...writers];
                                        updated[writerIndex].publishers[publisherIndex].share = parseInt(e.target.value) || 0;
                                        setWriters(updated);
                                      }}
                                      required
                                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work References */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Work References</h2>
              <button
                type="button"
                onClick={handleAddWorkReference}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Reference
              </button>
            </div>
            
            {workReferences.length === 0 ? (
              <p className="text-sm text-gray-600">Add any existing IDs from performing rights organizations</p>
            ) : (
              <div className="space-y-3">
                {workReferences.map((ref, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <select
                      value={ref.organization}
                      onChange={(e) => {
                        const updated = [...workReferences];
                        updated[index].organization = e.target.value;
                        setWorkReferences(updated);
                      }}
                      className="w-1/3 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    >
                      <option value="">Select Organization</option>
                      <option value="ISWC">ISWC</option>
                      {proOrganizations.map((org) => (
                        <option key={org.code} value={org.code}>
                          {org.name}
                        </option>
                      ))}
                      <option value="ISRC">ISRC</option>
                      <option value="MLC">MLC</option>
                      <option value="ICE">ICE</option>
                    </select>
                    <input
                      type="text"
                      value={ref.code}
                      onChange={(e) => {
                        const updated = [...workReferences];
                        updated[index].code = e.target.value;
                        setWorkReferences(updated);
                      }}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWorkReference(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Advanced Options</h2>
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="copyrightDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Copyright Date
                  </label>
                  <input
                    type="date"
                    id="copyrightDate"
                    value={copyrightDate}
                    onChange={(e) => setCopyrightDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="copyrightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Copyright Number
                  </label>
                  <input
                    type="text"
                    id="copyrightNumber"
                    value={copyrightNumber}
                    onChange={(e) => setCopyrightNumber(e.target.value.toUpperCase())}
                    placeholder="TX0000123456 or SR0000123456"
                    pattern="^(TX|SR)\d{10}$"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">TX for compositions, SR for recordings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Musical Work Distribution Category
                  </label>
                  <select
                    value={musicalWorkCategory}
                    onChange={(e) => setMusicalWorkCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  >
                    <option value="Popular">Popular</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Serious">Serious</option>
                    <option value="Unclassified">Unclassified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version Type
                  </label>
                  <select
                    value={versionType}
                    onChange={(e) => setVersionType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  >
                    <option value="Original Work">Original Work</option>
                    <option value="Modified Version of a musical work">Modified Version</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grand Rights
                  </label>
                  <select
                    value={grandRights}
                    onChange={(e) => setGrandRights(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Flag
                  </label>
                  <select
                    value={priorityFlag}
                    onChange={(e) => setPriorityFlag(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pb-8">
            <button
              type="button"
              onClick={() => router.push('/dashboard/compositions')}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-full font-medium transition"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading || !!getShareError()}
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Register Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}