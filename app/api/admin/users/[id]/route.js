import { NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '../../../../../lib/auth.js';
import { getUserById, updateUser, deleteUser, getUserByEmail } from '../../../../../lib/database.js';

export async function PUT(request, { params }) {
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

    const user = getUserById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(email);
    if (existingUser && existingUser.id !== params.id) {
      return NextResponse.json(
        { message: 'Email is already taken by another user' },
        { status: 409 }
      );
    }

    const updateData = { name, email, role };

    if (password && password.trim()) {
      if (password.length < 6) {
        return NextResponse.json(
          { message: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(password);
    }

    const updatedUser = updateUser(params.id, updateData);

    const userResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    };

    return NextResponse.json(userResponse);

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const user = getUserById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (params.id === decoded.userId) {
      return NextResponse.json(
        { message: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    deleteUser(params.id);

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
