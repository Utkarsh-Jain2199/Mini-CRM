import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth.js';
import { getLeadById, updateLead, deleteLead } from '../../../../lib/database.js';

export async function GET(request, { params }) {
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

    const lead = getLeadById(params.id);
    if (!lead) {
      return NextResponse.json(
        { message: 'Lead not found' },
        { status: 404 }
      );
    }

    if (decoded.role !== 'manager' && lead.ownerId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(lead);

  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const lead = getLeadById(params.id);
    if (!lead) {
      return NextResponse.json(
        { message: 'Lead not found' },
        { status: 404 }
      );
    }

    if (decoded.role !== 'manager' && lead.ownerId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const updatedLead = updateLead(params.id, updates);

    return NextResponse.json(updatedLead);

  } catch (error) {
    console.error('Update lead error:', error);
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

    const lead = getLeadById(params.id);
    if (!lead) {
      return NextResponse.json(
        { message: 'Lead not found' },
        { status: 404 }
      );
    }

    if (decoded.role !== 'manager' && lead.ownerId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    deleteLead(params.id);

    return NextResponse.json({ message: 'Lead deleted successfully' });

  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
