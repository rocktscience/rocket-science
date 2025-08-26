// types/database.ts

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  entity_name: string | null;
  role: 'admin' | 'client' | 'viewer';
  services: string[];
  phone: string | null;
  company_name: string | null;
  tax_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Release {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  label: string | null;
  upc: string | null;
  release_date: string | null;
  genre: string | null;
  language: string | null;
  explicit: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'released' | 'rejected';
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  release_id: string;
  user_id: string;
  title: string;
  artist: string;
  duration: string | null;
  isrc: string | null;
  track_number: number;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  date: string;
  platform: string;
  streams: number;
  revenue: number;
  created_at: string;
}

export interface Earnings {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  amount: number;
  type: string;
  status: 'pending' | 'paid' | 'processing';
  streams: number;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string | null;
  transaction_id: string | null;
  status: string;
  created_at: string;
}

export interface Composition {
  id: string;
  user_id: string;
  title: string;
  writers: string[];
  iswc: string | null;
  status: 'draft' | 'registered' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  user_id: string;
  title: string;
  type: 'distribution' | 'publishing' | 'both';
  status: 'draft' | 'active' | 'expired' | 'terminated';
  start_date: string;
  end_date: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserViewer {
  id: string;
  client_id: string;
  viewer_id: string;
  created_at: string;
  created_by: string;
}

export interface ReleasePlatform {
  id: string;
  release_id: string;
  platform: string;
  status: 'pending' | 'live' | 'removed' | 'failed';
  url: string | null;
  submitted_at: string | null;
  live_at: string | null;
  created_at: string;
}

export interface TrackAnalytics {
  id: string;
  track_id: string;
  date: string;
  platform: string;
  streams: number;
  revenue: number;
  territory: string | null;
  created_at: string;
}

export interface RoyaltySplit {
  id: string;
  track_id: string;
  recipient_name: string;
  recipient_email: string;
  split_percentage: number;
  role: 'artist' | 'producer' | 'writer' | 'label' | 'other';
  created_at: string;
}

export interface File {
  id: string;
  user_id: string;
  release_id: string | null;
  track_id: string | null;
  file_type: 'audio' | 'artwork' | 'document' | 'other';
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: any;
  new_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}