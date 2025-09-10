import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth.js';
import { getOpportunityById, updateOpportunity, deleteOpportunity } from '../../../../lib/database.js';

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

    const opportunity = getOpportunityById(params.id);
    if (!opportunity) {
      return NextResponse.json(
        { message: 'Opportunity not found' },
        { status: 404 }
      );
    }

    if (decoded.role !== 'manager' && opportunity.ownerId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(opportunity);

  } catch (error) {
    console.error('Get opportunity error:', error);
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

    const opportunity = getOpportunityById(params.id);
    if (!opportunity) {
      return NextResponse.json(
        { message: 'Opportunity not found' },
        { status: 404 }
      );
    }

    if (decoded.role !== 'manager') {
      return NextResponse.json(
        { message: 'Only managers can update opportunity stages' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const updatedOpportunity = updateOpportunity(params.id, updates);

    return NextResponse.json(updatedOpportunity);

  } catch (error) {
    console.error('Update opportunity error:', error);
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

    const opportunity = getOpportunityById(params.id);
    if (!opportunity) {
      return NextResponse.json(
        { message: 'Opportunity not found' },
        { status: 404 }
      );
    }

    if (decoded.role !== 'manager' && opportunity.ownerId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    deleteOpportunity(params.id);

    return NextResponse.json({ message: 'Opportunity deleted successfully' });

  } catch (error) {
    console.error('Delete opportunity error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
