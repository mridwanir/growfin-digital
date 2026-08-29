import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const validPasscode = process.env.ADMIN_PASSCODE || 'growfin2026';

    if (passcode === validPasscode) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      
      // Set secure HTTP-only session cookie
      response.cookies.set('growfin_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Passcode salah' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
