// app/dashboard/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from '@/app/providers/TranslationProvider';
import { 
  Camera,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Music,
  Phone,
  Plus,
  Shield,
  Trash2,
  User,
  X,
  Edit2,
  Building,
  FileText,
  Upload
} from 'lucide-react';
import CollaboratorModal from '@/components/CollaboratorModal';
import { proOrganizations, countries, usStates } from '@/lib/constants/musicData';

interface Collaborator {
  id: string;
  full_name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  artist_name?: string;
  types: string[];
  spotify_profile?: any;
  no_spotify_profile?: boolean;
  ipi?: string;
  pro?: string;
  songwriter_not_affiliated?: boolean;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
}

const businessStructures = [
  'Sole Proprietorship',
  'Partnership',
  'DBA (doing business as)',
  'LLC',
  'Corporation',
  'S-Corporation'
];

const accountTypeOptions = [
  'Business Checking',
  'Business Savings',
  'Personal Checking',
  'Personal Savings'
];

const taxCountries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  ...countries.filter(c => !['United States', 'Canada', 'United Kingdom', 'Australia'].includes(c))
];

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [w9File, setW9File] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditingTaxId, setIsEditingTaxId] = useState(false);
  
  // Account Types - will be grayed out for non-admin users
  const [accountTypes, setAccountTypes] = useState({
    label: false,
    publisher: false,
    songwriter: false
  });

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    entity_name: '',
    email: '',
    phone: '',
    mailing_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    profile_image: ''
  });

  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    business_structure: '',
    tax_id: '',
    w9_file_url: '',
    // Tax information moved here
    tax_country: 'United States',
    tax_form: '',
    // Payment information moved here
    bank_name: '',
    account_holder: '',
    account_type: 'Business Checking',
    account_number: '',
    routing_number: '',
    swift_code: ''
  });

  const [labelInfo, setLabelInfo] = useState({
    label_name: '',
    label_code: '',
    label_isni: '',
    label_dpid: '',
    label_ppl_id: ''
  });

  const [publisherInfo, setPublisherInfo] = useState({
    self_published: false,
    publisher_name: '',
    publisher_pro: '',
    publisher_ipi: '',
    publisher_p_number: '',
    publisher_isni: '',
    publisher_dpid: '',
    publisher_cmrra: '',
    publisher_abramus_id: '',
    publisher_ecad_id: ''
  });

  const [songwriterInfo, setSongwriterInfo] = useState({
    songwriter_pro: '',
    songwriter_not_affiliated: false,
    songwriter_ipi: '',
    songwriter_ipn: '',
    songwriter_abramus_id: '',
    songwriter_ecad_id: ''
  });

  const [passwordInfo, setPasswordInfo] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // States list - Puerto Rico is already in usStates
  const statesList = [...usStates].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    loadUserData();
    loadCollaborators();
  }, []);

  // Update entity name when business structure or company name changes
  useEffect(() => {
    if (['Sole Proprietorship', 'Partnership'].includes(companyInfo.business_structure)) {
      setPersonalInfo(prev => ({ ...prev, entity_name: personalInfo.full_name }));
    } else if (companyInfo.business_structure === 'DBA (doing business as)') {
      // For DBA, they can enter their own company name
      setPersonalInfo(prev => ({ ...prev, entity_name: companyInfo.company_name || personalInfo.full_name }));
    } else {
      setPersonalInfo(prev => ({ ...prev, entity_name: companyInfo.company_name }));
    }
  }, [companyInfo.business_structure, companyInfo.company_name, personalInfo.full_name]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Check if user is admin
        setIsAdmin(profile.role === 'admin');

        // Personal Info
        setPersonalInfo({
          full_name: profile.full_name || '',
          entity_name: profile.entity_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          mailing_address: profile.mailing_address || profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          postal_code: profile.postal_code || '',
          country: profile.country || 'United States',
          profile_image: profile.profile_image || ''
        });

        if (profile.profile_image) {
          setProfileImageUrl(profile.profile_image);
        }

        // Account Types
        setAccountTypes({
          label: profile.account_types?.includes('label') || false,
          publisher: profile.account_types?.includes('publisher') || false,
          songwriter: profile.account_types?.includes('songwriter') || false
        });

        // Company Info
        setCompanyInfo({
          company_name: profile.company_name || '',
          business_structure: profile.business_structure || '',
          tax_id: profile.tax_id || '',
          w9_file_url: profile.w9_file_url || '',
          tax_country: profile.tax_country || 'United States',
          tax_form: profile.tax_form || '',
          bank_name: profile.bank_name || '',
          account_holder: profile.account_holder || '',
          account_type: profile.account_type || 'Business Checking',
          account_number: profile.account_number || '',
          routing_number: profile.routing_number || '',
          swift_code: profile.swift_code || ''
        });

        // Label Info
        setLabelInfo({
          label_name: profile.label_name || '',
          label_code: profile.label_code || '',
          label_isni: profile.label_isni || '',
          label_dpid: profile.label_dpid || '',
          label_ppl_id: profile.label_ppl_id || ''
        });

        // Publisher Info
        setPublisherInfo({
          self_published: profile.self_published || false,
          publisher_name: profile.publisher_name || '',
          publisher_pro: profile.publisher_pro || '',
          publisher_ipi: profile.publisher_ipi || '',
          publisher_p_number: profile.publisher_p_number || '',
          publisher_isni: profile.publisher_isni || '',
          publisher_dpid: profile.publisher_dpid || '',
          publisher_cmrra: profile.publisher_cmrra || '',
          publisher_abramus_id: profile.publisher_abramus_id || '',
          publisher_ecad_id: profile.publisher_ecad_id || ''
        });

        // Songwriter Info
        setSongwriterInfo({
          songwriter_pro: profile.songwriter_pro || '',
          songwriter_not_affiliated: profile.songwriter_not_affiliated || false,
          songwriter_ipi: profile.songwriter_ipi || '',
          songwriter_ipn: profile.songwriter_ipn || '',
          songwriter_abramus_id: profile.songwriter_abramus_id || '',
          songwriter_ecad_id: profile.songwriter_ecad_id || ''
        });

        setTwoFactorEnabled(profile.two_factor_enabled || false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollaborators = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading collaborators:', error);
        return;
      }

      if (data) {
        setCollaborators(data);
      }
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // First check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const profileBucketExists = buckets?.some(bucket => bucket.name === 'profiles');
      
      if (!profileBucketExists) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('profiles', { public: true });
      }

      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setProfileImageUrl(publicUrl);
      setPersonalInfo(prev => ({ ...prev, profile_image: publicUrl }));

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleW9Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file');
      return;
    }

    setW9File(file);
    setMessage('W-9 file selected. Save to upload.');
  };

  // Format Functions
  const formatIPI = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 9) return '00' + digits;
    if (digits.length === 10) return '0' + digits;
    if (digits.length === 11) return digits;
    return digits;
  };

  const formatISNI = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatLabelCode = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 5);
  };

  const formatPPLID = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const formatZipCode = (value: string, country: string) => {
    if (country === 'United States') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    }
    // For other countries, allow alphanumeric
    return value.toUpperCase().slice(0, 10);
  };

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  };

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  };

  const formatRoutingNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 9);
  };

  const formatAccountNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 17);
  };

  const formatSWIFT = (value: string) => {
    const alphanumeric = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return alphanumeric.slice(0, 11);
  };

  const formatDPID = (value: string) => {
    // PA-DPIDA-XXXXXXXXXX-A format
    const input = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Remove existing formatting
    const clean = input.replace(/-/g, '');
    
    // Apply format
    if (clean.length <= 2) return clean;
    if (clean.length <= 7) return `PA-${clean.slice(2)}`;
    if (clean.length <= 17) return `PA-${clean.slice(2, 7)}-${clean.slice(7)}`;
    return `PA-${clean.slice(2, 7)}-${clean.slice(7, 17)}-${clean.slice(17, 18)}`;
  };

  const maskTaxId = (taxId: string) => {
    if (!taxId || taxId.length < 4) return '';
    const digits = taxId.replace(/\D/g, '');
    if (digits.length >= 4) {
      return `***-**-${digits.slice(-4)}`;
    }
    return '';
  };

  const validateForm = (tab: string) => {
    const errors: string[] = [];

    if (tab === 'personal') {
      if (!personalInfo.full_name) errors.push('Full Name');
      if (!personalInfo.phone) errors.push('Phone');
      if (!personalInfo.mailing_address) errors.push('Mailing Address');
      if (!personalInfo.city) errors.push('City');
      if (!personalInfo.country) errors.push('Country');
      if (personalInfo.country === 'United States' && !personalInfo.state) errors.push('State');
      if (!personalInfo.postal_code) errors.push('Zip/Postal Code');
    } else if (tab === 'company') {
      // Company fields
      if (!companyInfo.business_structure) errors.push('Business Structure');
      if (!['Sole Proprietorship', 'Partnership'].includes(companyInfo.business_structure) && !companyInfo.company_name) {
        errors.push('Company Name');
      }
      
      // Tax fields
      if (!companyInfo.tax_id) errors.push('SSN/Tax ID');
      if (!companyInfo.w9_file_url && !w9File) errors.push('W-9 Form');
      if (!companyInfo.tax_country) errors.push('Tax Country');
      if (!companyInfo.tax_form) errors.push('Tax Form Type');
      
      // Validate Tax ID format
      if (companyInfo.tax_id) {
        const digits = companyInfo.tax_id.replace(/\D/g, '');
        if (digits.length !== 9) {
          errors.push(`${isSoleOrPartnershipOrDBA ? 'SSN' : 'Tax ID'} must be 9 digits`);
        }
      }
      
      // Payment fields
      if (!companyInfo.account_type) errors.push('Account Type');
      if (!companyInfo.bank_name) errors.push('Bank Name');
      if (!companyInfo.account_holder) errors.push('Account Holder Name');
      if (!companyInfo.account_number) errors.push('Account Number');
      if (!companyInfo.routing_number) errors.push('Routing Number');
      
      // Validate Routing Number format
      if (companyInfo.routing_number && companyInfo.routing_number.length !== 9) {
        errors.push('Routing Number must be exactly 9 digits');
      }
      
      // Validate SWIFT format if provided
      if (companyInfo.swift_code && companyInfo.swift_code.length !== 8 && companyInfo.swift_code.length !== 11) {
        errors.push('SWIFT/BIC Code must be 8 or 11 characters');
      }
    } else if (tab === 'label') {
      if (!labelInfo.label_name) errors.push('Label Name');
      
      // Validate optional formats
      if (labelInfo.label_code && labelInfo.label_code.length !== 5) {
        errors.push('Label Code must be exactly 5 digits');
      }
      if (labelInfo.label_isni) {
        const digits = labelInfo.label_isni.replace(/\s/g, '');
        if (digits.length !== 16) {
          errors.push('ISNI must be exactly 16 digits');
        }
      }
      if (labelInfo.label_dpid && !labelInfo.label_dpid.match(/^PA-[A-Z0-9]{5}-[A-Z0-9]{10}-[A-Z]$/)) {
        errors.push('DPID format is invalid (should be PA-XXXXX-XXXXXXXXXX-X)');
      }
      if (labelInfo.label_ppl_id && labelInfo.label_ppl_id.length !== 10) {
        errors.push('PPL ID must be exactly 10 digits');
      }
    } else if (tab === 'publisher') {
      if (!publisherInfo.self_published) {
        if (!publisherInfo.publisher_name) errors.push('Publisher Name');
        if (!publisherInfo.publisher_pro) errors.push('PRO');
        if (!publisherInfo.publisher_ipi) errors.push('IPI Number');
        
        // Validate IPI format
        if (publisherInfo.publisher_ipi) {
          const digits = publisherInfo.publisher_ipi.replace(/\D/g, '');
          if (digits.length < 9 || digits.length > 11) {
            errors.push('IPI Number must be 9-11 digits');
          }
        }
        
        // Validate optional formats
        if (publisherInfo.publisher_p_number && publisherInfo.publisher_p_number.length !== 6) {
          errors.push('P Number must be exactly 6 characters');
        }
        if (publisherInfo.publisher_isni) {
          const digits = publisherInfo.publisher_isni.replace(/\s/g, '');
          if (digits.length !== 16) {
            errors.push('Publisher ISNI must be exactly 16 digits');
          }
        }
        if (publisherInfo.publisher_dpid && !publisherInfo.publisher_dpid.match(/^PA-[A-Z0-9]{5}-[A-Z0-9]{10}-[A-Z]$/)) {
          errors.push('Publisher DPID format is invalid');
        }
      }
    } else if (tab === 'songwriter') {
      if (!songwriterInfo.songwriter_not_affiliated) {
        if (!songwriterInfo.songwriter_pro) errors.push('PRO');
        if (!songwriterInfo.songwriter_ipi) errors.push('IPI Number');
        
        // Validate IPI format
        if (songwriterInfo.songwriter_ipi) {
          const digits = songwriterInfo.songwriter_ipi.replace(/\D/g, '');
          if (digits.length < 9 || digits.length > 11) {
            errors.push('IPI Number must be 9-11 digits');
          }
        }
      }
      
      // Validate IPN format if provided
      if (songwriterInfo.songwriter_ipn && songwriterInfo.songwriter_ipn.length !== 6) {
        errors.push('IPN must be exactly 6 characters');
      }
    }

    return errors;
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setMessage('');

    // Validate form before saving
    const validationErrors = validateForm(activeTab);
    if (validationErrors.length > 0) {
      setMessage(`Error: Missing or invalid fields - ${validationErrors.join(', ')}`);
      setSaving(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Build account types array
      const accountTypesArray = Object.entries(accountTypes)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

      // Prepare update data based on active tab
      let updateData: any = {
        account_types: accountTypesArray
      };

      if (activeTab === 'personal') {
        updateData = {
          ...updateData,
          full_name: personalInfo.full_name,
          entity_name: personalInfo.entity_name,
          phone: personalInfo.phone,
          mailing_address: personalInfo.mailing_address,
          address: personalInfo.mailing_address,
          city: personalInfo.city,
          state: personalInfo.state,
          postal_code: personalInfo.postal_code,
          country: personalInfo.country,
          profile_image: personalInfo.profile_image
        };
      } else if (activeTab === 'company') {
        // Handle W9 upload if file is selected
        if (w9File) {
          const fileExt = w9File.name.split('.').pop();
          const fileName = `w9-${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `documents/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, w9File);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('documents')
              .getPublicUrl(filePath);
            
            updateData.w9_file_url = publicUrl;
          }
        }

        updateData = {
          ...updateData,
          company_name: companyInfo.company_name,
          business_structure: companyInfo.business_structure,
          tax_id: companyInfo.tax_id,
          w9_file_url: updateData.w9_file_url || companyInfo.w9_file_url,
          // Tax information
          tax_country: companyInfo.tax_country,
          tax_form: companyInfo.tax_form,
          // Payment information
          bank_name: companyInfo.bank_name,
          account_holder: companyInfo.account_holder,
          account_type: companyInfo.account_type,
          account_number: companyInfo.account_number,
          routing_number: companyInfo.routing_number,
          swift_code: companyInfo.swift_code
        };
      } else if (activeTab === 'label') {
        updateData = {
          ...updateData,
          label_name: labelInfo.label_name,
          label_code: labelInfo.label_code,
          label_isni: labelInfo.label_isni,
          label_dpid: labelInfo.label_dpid,
          label_ppl_id: labelInfo.label_ppl_id
        };
      } else if (activeTab === 'publisher') {
        // Auto-format IPI on save
        let formattedIPI = publisherInfo.publisher_ipi;
        if (formattedIPI && !publisherInfo.self_published) {
          formattedIPI = formatIPI(formattedIPI);
        }

        updateData = {
          ...updateData,
          self_published: publisherInfo.self_published,
          publisher_name: publisherInfo.self_published ? '' : publisherInfo.publisher_name,
          publisher_pro: publisherInfo.self_published ? null : publisherInfo.publisher_pro,
          publisher_ipi: publisherInfo.self_published ? null : formattedIPI,
          publisher_p_number: publisherInfo.self_published ? '' : publisherInfo.publisher_p_number,
          publisher_isni: publisherInfo.self_published ? '' : publisherInfo.publisher_isni,
          publisher_dpid: publisherInfo.self_published ? '' : publisherInfo.publisher_dpid,
          publisher_cmrra: publisherInfo.self_published ? '' : publisherInfo.publisher_cmrra,
          publisher_abramus_id: publisherInfo.self_published ? '' : publisherInfo.publisher_abramus_id,
          publisher_ecad_id: publisherInfo.self_published ? '' : publisherInfo.publisher_ecad_id
        };
      } else if (activeTab === 'songwriter') {
        // Auto-format IPI on save
        let formattedIPI = songwriterInfo.songwriter_ipi;
        if (formattedIPI && !songwriterInfo.songwriter_not_affiliated) {
          formattedIPI = formatIPI(formattedIPI);
        }

        updateData = {
          ...updateData,
          songwriter_pro: songwriterInfo.songwriter_not_affiliated ? null : songwriterInfo.songwriter_pro,
          songwriter_not_affiliated: songwriterInfo.songwriter_not_affiliated,
          songwriter_ipi: songwriterInfo.songwriter_not_affiliated ? null : formattedIPI,
          songwriter_ipn: songwriterInfo.songwriter_ipn,
          songwriter_abramus_id: songwriterInfo.songwriter_abramus_id,
          songwriter_ecad_id: songwriterInfo.songwriter_ecad_id
        };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        // Parse database error for more specific messages
        if (error.message.includes('violates check constraint')) {
          setMessage('Error: Invalid data format. Please check all fields.');
        } else if (error.message.includes('null value')) {
          setMessage('Error: Required fields are missing. Please fill in all required fields.');
        } else {
          setMessage(`Error saving settings: ${error.message}`);
        }
        return;
      }

      setMessage('Settings saved successfully!');
      setW9File(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage(`Error saving settings: ${error.message || 'Please check all required fields and try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordInfo.new_password !== passwordInfo.confirm_password) {
      setMessage('Passwords do not match');
      return;
    }

    if (passwordInfo.new_password.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordInfo.new_password
      });

      if (error) throw error;

      setMessage('Password updated successfully');
      setPasswordInfo({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCollaborator = async (collaboratorData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check for duplicates before saving
      const nameToCheck = collaboratorData.full_name.toLowerCase();
      const existingCollaborator = collaborators.find(c => 
        c.id !== editingCollaborator?.id && // Exclude current if editing
        c.full_name.toLowerCase() === nameToCheck
      );

      if (existingCollaborator && !editingCollaborator) {
        // Check if we're trying to add duplicate types
        const existingTypes = existingCollaborator.types || [];
        const newTypes = collaboratorData.types || [];
        const overlappingTypes = newTypes.filter((type: string) => existingTypes.includes(type));
        
        if (overlappingTypes.length > 0) {
          setMessage(`Error: ${collaboratorData.full_name} already exists as ${overlappingTypes.join(', ')}`);
          return;
        }

        // If no overlapping types, merge the types
        const mergedTypes = [...new Set([...existingTypes, ...newTypes])];
        
        const { error } = await supabase
          .from('collaborators')
          .update({ 
            types: mergedTypes,
            // Update other fields if provided
            artist_name: collaboratorData.artist_name || existingCollaborator.artist_name,
            spotify_profile: collaboratorData.spotify_profile || existingCollaborator.spotify_profile,
            no_spotify_profile: collaboratorData.no_spotify_profile || existingCollaborator.no_spotify_profile,
            ipi: collaboratorData.ipi || existingCollaborator.ipi,
            pro: collaboratorData.pro || existingCollaborator.pro,
            songwriter_not_affiliated: collaboratorData.songwriter_not_affiliated || existingCollaborator.songwriter_not_affiliated,
            instagram: collaboratorData.instagram || existingCollaborator.instagram,
            twitter: collaboratorData.twitter || existingCollaborator.twitter,
            facebook: collaboratorData.facebook || existingCollaborator.facebook,
            website: collaboratorData.website || existingCollaborator.website
          })
          .eq('id', existingCollaborator.id);

        if (error) throw error;
        setMessage(`Added ${newTypes.join(', ')} role(s) to existing contributor ${collaboratorData.full_name}`);
        await loadCollaborators();
        setShowCollaboratorModal(false);
        return;
      }

      const dataToSave = {
        user_id: user.id,
        full_name: collaboratorData.full_name,
        first_name: collaboratorData.first_name || null,
        middle_name: collaboratorData.middle_name || null,
        last_name: collaboratorData.last_name || null,
        artist_name: collaboratorData.artist_name || null,
        types: collaboratorData.types,
        spotify_profile: collaboratorData.spotify_profile || null,
        no_spotify_profile: collaboratorData.no_spotify_profile || false,
        ipi: collaboratorData.ipi || null,
        pro: collaboratorData.pro || null,
        songwriter_not_affiliated: collaboratorData.songwriter_not_affiliated || false,
        instagram: collaboratorData.instagram || null,
        twitter: collaboratorData.twitter || null,
        facebook: collaboratorData.facebook || null,
        website: collaboratorData.website || null
      };

      if (editingCollaborator) {
        const { error } = await supabase
          .from('collaborators')
          .update(dataToSave)
          .eq('id', editingCollaborator.id);

        if (error) throw error;
        setMessage('Contributor updated successfully');
      } else {
        const { error } = await supabase
          .from('collaborators')
          .insert([dataToSave]);

        if (error) throw error;
        setMessage('Contributor added successfully');
      }

      await loadCollaborators();
      setShowCollaboratorModal(false);
      setEditingCollaborator(null);
    } catch (error) {
      console.error('Error saving collaborator:', error);
      setMessage('Error saving contributor');
    }
  };

  const handleDeleteCollaborator = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contributor?')) return;

    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('Contributor deleted successfully');
      await loadCollaborators();
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      setMessage('Error deleting contributor');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Get tabs based on account types
  const getTabs = () => {
    const tabs = ['personal', 'company'];
    if (accountTypes.label) tabs.push('label');
    if (accountTypes.publisher) tabs.push('publisher');
    if (accountTypes.songwriter) tabs.push('songwriter');
    tabs.push('contributors', 'security');
    return tabs;
  };

  const tabs = getTabs();

  const isSoleOrPartnershipOrDBA = ['Sole Proprietorship', 'Partnership', 'DBA (doing business as)'].includes(companyInfo.business_structure);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {t.dashboard?.settings || 'Settings'}
      </h1>

      {/* Account Type Selection - Grayed out for non-admin */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Type *</h2>
        <p className="text-sm text-gray-500 mb-4">
          {isAdmin ? 'Select all that apply. This determines your access to different sections of the platform.' : 'Account type is set by the administrator.'}
        </p>
        <div className="flex gap-6">
          {Object.entries({ label: 'Label', publisher: 'Publisher', songwriter: 'Songwriter' }).map(([key, label]) => (
            <label key={key} className={`flex items-center ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="checkbox"
                checked={accountTypes[key as keyof typeof accountTypes]}
                onChange={(e) => {
                  if (isAdmin) {
                    setAccountTypes({ ...accountTypes, [key]: e.target.checked });
                  }
                }}
                disabled={!isAdmin}
                className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap
                ${activeTab === tab
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab === 'contributors' ? 'Contributors' : tab === 'company' ? 'Company & Payment' : tab} Information
            </button>
          ))}
        </nav>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') || message.includes('do not match') || message.includes('must be')
            ? 'bg-red-50 text-red-800'
            : 'bg-green-50 text-green-800'
        }`}>
          {message.startsWith('Error: Missing or invalid fields') ? (
            <div>
              <p className="font-semibold mb-2">Error: Missing or invalid fields</p>
              <ul className="list-disc list-inside space-y-1">
                {message.split(' - ')[1].split(', ').map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          ) : (
            message
          )}
        </div>
      )}

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
          <p className="text-sm text-gray-500 mb-6">* All fields are required</p>
          
          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <div className="text-sm text-gray-500">
                {uploadingImage ? 'Uploading...' : 'Click camera icon to upload'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={personalInfo.full_name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entity Name *
              </label>
              <input
                type="text"
                value={personalInfo.entity_name}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-filled based on business structure</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={personalInfo.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setPersonalInfo({ ...personalInfo, phone: formatted });
                }}
                placeholder="(555) 555-5555"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mailing Address *
              </label>
              <input
                type="text"
                value={personalInfo.mailing_address}
                onChange={(e) => setPersonalInfo({ ...personalInfo, mailing_address: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={personalInfo.city}
                onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={personalInfo.country}
                onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value, state: '' })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {personalInfo.country === 'United States' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={personalInfo.state}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select State</option>
                  {statesList.map((state) => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {personalInfo.country === 'United States' ? 'Zip Code' : 'Postal Code'} *
              </label>
              <input
                type="text"
                value={personalInfo.postal_code}
                onChange={(e) => {
                  const formatted = formatZipCode(e.target.value, personalInfo.country);
                  setPersonalInfo({ ...personalInfo, postal_code: formatted });
                }}
                placeholder={personalInfo.country === 'United States' ? '12345 or 12345-6789' : ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Company & Payment Information Tab */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          {/* Company Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Company Information</h2>
            <p className="text-sm text-gray-500 mb-6">* All fields are required</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={['Sole Proprietorship', 'Partnership'].includes(companyInfo.business_structure) ? personalInfo.full_name : companyInfo.company_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                  disabled={['Sole Proprietorship', 'Partnership'].includes(companyInfo.business_structure)}
                  required
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 ${
                    ['Sole Proprietorship', 'Partnership'].includes(companyInfo.business_structure) ? 'bg-gray-50' : ''
                  }`}
                />
                {companyInfo.business_structure === 'DBA (doing business as)' && (
                  <p className="text-xs text-gray-500 mt-1">Enter your DBA name</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Structure *
                </label>
                <select
                  value={companyInfo.business_structure}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_structure: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select Structure</option>
                  {businessStructures.map((structure) => (
                    <option key={structure} value={structure}>{structure}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tax Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-6">Tax Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isSoleOrPartnershipOrDBA ? 'SSN' : 'Tax ID'} *
                </label>
                <input
                  type="text"
                  value={isEditingTaxId ? companyInfo.tax_id : maskTaxId(companyInfo.tax_id)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9-]/g, '');
                    const formatted = isSoleOrPartnershipOrDBA 
                      ? formatSSN(value.replace(/-/g, ''))
                      : formatEIN(value.replace(/-/g, ''));
                    setCompanyInfo({ ...companyInfo, tax_id: formatted });
                  }}
                  onFocus={() => setIsEditingTaxId(true)}
                  onBlur={() => setIsEditingTaxId(false)}
                  placeholder={isSoleOrPartnershipOrDBA ? 'XXX-XX-XXXX' : 'XX-XXXXXXX'}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only last 4 digits are displayed for security
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  W-9 Form *
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload W-9</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleW9Upload}
                      className="hidden"
                    />
                  </label>
                  {(w9File || companyInfo.w9_file_url) && (
                    <span className="text-sm text-green-600">
                      {w9File ? w9File.name : 'W-9 uploaded'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Country *
                </label>
                <select
                  value={companyInfo.tax_country}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, tax_country: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select Country</option>
                  {taxCountries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Form Type *
                </label>
                <select
                  value={companyInfo.tax_form}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, tax_form: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select Form</option>
                  <option value="W9">W-9 (US)</option>
                  <option value="W8BEN">W-8BEN (Non-US Individual)</option>
                  <option value="W8BENE">W-8BEN-E (Non-US Entity)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-6">Payment Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <select
                  value={companyInfo.account_type}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, account_type: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  {accountTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={companyInfo.bank_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, bank_name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={companyInfo.account_holder}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, account_holder: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={companyInfo.account_number}
                  onChange={(e) => {
                    const formatted = formatAccountNumber(e.target.value);
                    setCompanyInfo({ ...companyInfo, account_number: formatted });
                  }}
                  maxLength={17}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number *
                </label>
                <input
                  type="text"
                  value={companyInfo.routing_number}
                  onChange={(e) => {
                    const formatted = formatRoutingNumber(e.target.value);
                    setCompanyInfo({ ...companyInfo, routing_number: formatted });
                  }}
                  placeholder="9 digits"
                  maxLength={9}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SWIFT/BIC Code
                </label>
                <input
                  type="text"
                  value={companyInfo.swift_code}
                  onChange={(e) => {
                    const formatted = formatSWIFT(e.target.value);
                    setCompanyInfo({ ...companyInfo, swift_code: formatted });
                  }}
                  placeholder="8 or 11 characters"
                  maxLength={11}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - Required for international transfers</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Label Information Tab */}
      {activeTab === 'label' && accountTypes.label && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Label Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label Name *
              </label>
              <input
                type="text"
                value={labelInfo.label_name}
                onChange={(e) => setLabelInfo({ ...labelInfo, label_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label Code
              </label>
              <input
                type="text"
                value={labelInfo.label_code}
                onChange={(e) => setLabelInfo({ ...labelInfo, label_code: formatLabelCode(e.target.value) })}
                placeholder="5 digits"
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 5 digits</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISNI
              </label>
              <input
                type="text"
                value={labelInfo.label_isni}
                onChange={(e) => setLabelInfo({ ...labelInfo, label_isni: formatISNI(e.target.value) })}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 16 digits</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DPID
              </label>
              <input
                type="text"
                value={labelInfo.label_dpid}
                onChange={(e) => setLabelInfo({ ...labelInfo, label_dpid: formatDPID(e.target.value) })}
                placeholder="PA-DPIDA-XXXXXXXXXX-A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Format: PA-DPIDA-XXXXXXXXXX-A</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PPL ID
              </label>
              <input
                type="text"
                value={labelInfo.label_ppl_id}
                onChange={(e) => setLabelInfo({ ...labelInfo, label_ppl_id: formatPPLID(e.target.value) })}
                placeholder="10 digits"
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 10 digits</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Publisher Tab */}
      {activeTab === 'publisher' && accountTypes.publisher && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Publisher Information</h2>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={publisherInfo.self_published}
                onChange={(e) => setPublisherInfo({ 
                  ...publisherInfo, 
                  self_published: e.target.checked
                })}
                className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">Self-Published</span>
            </label>
          </div>

          {!publisherInfo.self_published && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publisher Name *
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_name}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PRO *
                </label>
                <select
                  value={publisherInfo.publisher_pro}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_pro: e.target.value })}
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
                  value={publisherInfo.publisher_ipi}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setPublisherInfo({ ...publisherInfo, publisher_ipi: digits });
                  }}
                  onBlur={(e) => {
                    const formatted = formatIPI(e.target.value);
                    setPublisherInfo({ ...publisherInfo, publisher_ipi: formatted });
                  }}
                  placeholder="9-11 digits"
                  maxLength={11}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">9-11 digits</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  P Number
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_p_number}
                  onChange={(e) => {
                    const alphanumeric = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                    setPublisherInfo({ ...publisherInfo, publisher_p_number: alphanumeric.slice(0, 6) });
                  }}
                  placeholder="6 characters"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISNI
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_isni}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_isni: formatISNI(e.target.value) })}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DPID
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_dpid}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_dpid: formatDPID(e.target.value) })}
                  placeholder="PA-DPIDA-XXXXXXXXXX-A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CMRRA Account Number
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_cmrra}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_cmrra: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abramus ID
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_abramus_id}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_abramus_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ecad ID
                </label>
                <input
                  type="text"
                  value={publisherInfo.publisher_ecad_id}
                  onChange={(e) => setPublisherInfo({ ...publisherInfo, publisher_ecad_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Songwriter Tab */}
      {activeTab === 'songwriter' && accountTypes.songwriter && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Songwriter Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={songwriterInfo.songwriter_not_affiliated}
                  onChange={(e) => setSongwriterInfo({ 
                    ...songwriterInfo, 
                    songwriter_not_affiliated: e.target.checked,
                    songwriter_pro: e.target.checked ? '' : songwriterInfo.songwriter_pro,
                    songwriter_ipi: e.target.checked ? '' : songwriterInfo.songwriter_ipi
                  })}
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-2 text-sm text-gray-700">Not affiliated with a PRO</span>
              </label>
            </div>

            {!songwriterInfo.songwriter_not_affiliated && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PRO *
                  </label>
                  <select
                    value={songwriterInfo.songwriter_pro}
                    onChange={(e) => setSongwriterInfo({ ...songwriterInfo, songwriter_pro: e.target.value })}
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
                    value={songwriterInfo.songwriter_ipi}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setSongwriterInfo({ ...songwriterInfo, songwriter_ipi: digits });
                    }}
                    onBlur={(e) => {
                      const formatted = formatIPI(e.target.value);
                      setSongwriterInfo({ ...songwriterInfo, songwriter_ipi: formatted });
                    }}
                    placeholder="9-11 digits"
                    maxLength={11}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">9-11 digits</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                International Performer Number (IPN)
              </label>
              <input
                type="text"
                value={songwriterInfo.songwriter_ipn}
                onChange={(e) => {
                  const alphanumeric = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                  setSongwriterInfo({ ...songwriterInfo, songwriter_ipn: alphanumeric.slice(0, 6) });
                }}
                placeholder="6 characters"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abramus ID
              </label>
              <input
                type="text"
                value={songwriterInfo.songwriter_abramus_id}
                onChange={(e) => setSongwriterInfo({ ...songwriterInfo, songwriter_abramus_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ecad ID
              </label>
              <input
                type="text"
                value={songwriterInfo.songwriter_ecad_id}
                onChange={(e) => setSongwriterInfo({ ...songwriterInfo, songwriter_ecad_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Contributors Tab */}
      {activeTab === 'contributors' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Contributors</h2>
            <button
              onClick={() => {
                setEditingCollaborator(null);
                setShowCollaboratorModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              Add Contributor
            </button>
          </div>

          {collaborators.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No contributors added yet</p>
              <p className="text-sm mt-2">Add your collaborators, songwriters, and producers</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {collaborator.artist_name || collaborator.full_name}
                      </h3>
                      {collaborator.artist_name && (
                        <p className="text-sm text-gray-500">{collaborator.full_name}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {collaborator.types.map((type) => (
                          <span key={type} className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                      {collaborator.pro && (
                        <p className="text-sm text-gray-600 mt-1">PRO: {collaborator.pro}</p>
                      )}
                      {collaborator.ipi && (
                        <p className="text-sm text-gray-600">IPI: {collaborator.ipi}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCollaborator(collaborator);
                          setShowCollaboratorModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCollaborator(collaborator.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
          
          {/* Change Password */}
          <div className="mb-8">
            <h3 className="text-md font-medium mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordInfo.new_password}
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, new_password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordInfo.confirm_password}
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, confirm_password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <h3 className="text-md font-medium mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-2 rounded-lg ${
                  twoFactorEnabled 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborator Modal */}
      {showCollaboratorModal && (
        <CollaboratorModal
          collaborator={editingCollaborator}
          onSave={handleSaveCollaborator}
          onClose={() => {
            setShowCollaboratorModal(false);
            setEditingCollaborator(null);
          }}
        />
      )}
    </div>
  );
}