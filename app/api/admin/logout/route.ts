import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Delete the cookie by setting it to an expired date
  cookieStore.delete('admin_auth');
  
  return NextResponse.json({ success: true });
}