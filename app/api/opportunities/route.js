import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth.js';
import { getOpportunities, addOpportunity } from '../../../lib/database.js';

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

    const opportunities = decoded.role === 'manager' 
      ? getOpportunities() 
      : getOpportunities(decoded.userId);

    return NextResponse.json(opportunities);

  } catch (error) {
    console.error('Get opportunities error:', error);
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

    const isLeadConversion = request.headers.get('x-lead-conversion');
    
    if (decoded.role === 'rep' && !isLeadConversion) {
      return NextResponse.json(
        { message: 'Sales reps can only create opportunities by converting leads' },
        { status: 403 }
      );
    }
    
    if (decoded.role === 'manager' && isLeadConversion) {
      return NextResponse.json(
        { message: 'Managers cannot convert leads to opportunities' },
        { status: 403 }
      );
    }

    const { title, value, stage, leadId } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    const newOpportunity = addOpportunity({
      title,
      value: value || 0,
      stage: stage || 'Discovery',
      ownerId: decoded.userId,
      leadId: leadId || null
    });

    return NextResponse.json(newOpportunity, { status: 201 });

  } catch (error) {
    console.error('Create opportunity error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
