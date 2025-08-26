// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validación básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Crear cliente de Supabase
    const supabase = await createClient();

    // Mapear el subject al texto completo
    const subjectMap: Record<string, string> = {
      'general': 'Consulta General',
      'support': 'Soporte Técnico',
      'business': 'Asociación Empresarial',
      'press': 'Prensa y Medios',
      'other': 'Otro'
    };

    const mappedSubject = subjectMap[subject] || subject;

    // Insertar en la base de datos
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: mappedSubject,
          message: message.trim(),
          status: 'unread'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Manejo específico de errores
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This message has already been sent' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        data 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Opcional: Agregar método GET para health check
export async function GET() {
  return NextResponse.json(
    { status: 'Contact API is working' },
    { status: 200 }
  );
}