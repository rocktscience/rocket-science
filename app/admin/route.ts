// app/admin/route.ts
import { redirect } from 'next/navigation';

export async function GET() {
  // Redirect to the unified dashboard instead of a separate admin dashboard
  redirect('/dashboard');
}