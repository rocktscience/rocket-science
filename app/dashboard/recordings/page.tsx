// app/dashboard/recordings/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RecordingsTab from '../tabs/RecordingsTab';

export default async function RecordingsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    redirect('/login');
  }

  // Check if user has access to recordings
  const hasAccess = profile.role === 'admin' || 
                    profile.services?.includes('distribution') ||
                    profile.role === 'viewer';

  if (!hasAccess) {
    redirect('/dashboard');
  }

  return <RecordingsTab profile={profile} isViewer={profile.role === 'viewer'} />;
}