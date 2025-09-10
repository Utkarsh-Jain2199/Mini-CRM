import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth.js';
import { getLeads, getOpportunities } from '../../../../lib/database.js';

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
    
    const opportunities = decoded.role === 'manager'
      ? getOpportunities()
      : getOpportunities(decoded.userId);
    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'New').length,
      contactedLeads: leads.filter(l => l.status === 'Contacted').length,
      qualifiedLeads: leads.filter(l => l.status === 'Qualified').length,
      totalOpportunities: opportunities.length,
      discoveryOpps: opportunities.filter(o => o.stage === 'Discovery').length,
      proposalOpps: opportunities.filter(o => o.stage === 'Proposal').length,
      wonOpps: opportunities.filter(o => o.stage === 'Won').length,
      lostOpps: opportunities.filter(o => o.stage === 'Lost').length
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
