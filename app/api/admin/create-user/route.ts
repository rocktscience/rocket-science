// app/api/admin/create-user/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verify admin access
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if admin (add your admin verification logic here)
    const adminEmails = ['admin@rocketscience.com'];
    if (!adminEmails.includes(adminUser.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { email, password, full_name, entity_name, services } = data;
    
    // Validate required fields
    if (!email || !password || !full_name || !entity_name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Create auth user using service role client
    const serviceSupabase = await createClient();
    
    // First create the auth user
    const { data: signUpData, error: signUpError } = await serviceSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          entity_name,
        }
      }
    });
    
    if (signUpError) {
      console.error('Signup error:', signUpError);
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }
    
    if (!signUpData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: signUpData.user.id,
        email,
        full_name,
        entity_name,
        role: 'client',
        services: services || []
      }]);
    
    if (profileError) {
      console.error('Profile error:', profileError);
      // Try to delete the auth user if profile creation fails
      await serviceSupabase.auth.admin.deleteUser(signUpData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'User created successfully',
        userId: signUpData.user.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}