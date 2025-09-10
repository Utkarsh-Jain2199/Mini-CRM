import { NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '../../../../lib/auth.js';
import { getUsers, addUser, getUserByEmail } from '../../../../lib/database.js';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    const users = getUsers().map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));

    return NextResponse.json(users);

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

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

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = addUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
