import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth.js';
import { getLeads, addLead } from '../../../lib/database.js';

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

    const leads = decoded.role === 'manager' 
      ? getLeads() 
      : getLeads(decoded.userId);

    return NextResponse.json(leads);

  } catch (error) {
    console.error('Get leads error:', error);
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

    const { name, email, phone, status } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const newLead = addLead({
      name,
      email,
      phone: phone || '',
      status: status || 'New',
      ownerId: decoded.userId
    });

    return NextResponse.json(newLead, { status: 201 });

  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
