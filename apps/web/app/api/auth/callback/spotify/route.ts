import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '../../../../../lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  // Forward the authorization code and state to our Express backend
  // The backend will handle the token exchange and final redirect
  return NextResponse.redirect(`${API_URL}/auth/spotify/callback?code=${code}&state=${state}`);
}
