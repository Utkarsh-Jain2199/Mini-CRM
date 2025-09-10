import { NextResponse } from 'next/server';
import { registerUser, generateToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, password, role });
    const token = generateToken(user);

    const response = NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
