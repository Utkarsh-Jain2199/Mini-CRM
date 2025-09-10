'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import StatisticsStrip from '../../components/StatisticsStrip';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    qualifiedLeads: 0,
    totalOpportunities: 0,
    discoveryOpps: 0,
    proposalOpps: 0,
    wonOpps: 0,
    lostOpps: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, statsResponse] = await Promise.all([
        fetch('/api/user/me'),
        fetch('/api/dashboard/stats')
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header user={user} />
      <Navigation user={user} />

      <div className="container">
        <h1>Dashboard</h1>
        <p className="mb-4">Welcome back, {user?.name}!</p>
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="flex gap-4">
            <a href="/leads" className="btn btn-primary">View All Leads</a>
            <a href="/opportunities" className="btn btn-secondary">View All Opportunities</a>
            {user?.role === 'rep' && (
              <a href="/leads" className="btn btn-success">Add New Lead</a>
            )}
          </div>
        </div>

        <StatisticsStrip stats={stats} />

        {/* <div className="flex gap-4 mb-4">
          <div className="card">
            <h3 className="card-title">Leads Overview</h3>
            <div className="flex justify-between mb-2">
              <span>Total Leads:</span>
              <strong>{stats.totalLeads}</strong>
            </div>
            <div className="flex justify-between mb-2">
              <span>New:</span>
              <span className="status-badge status-new">{stats.newLeads}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Contacted:</span>
              <span className="status-badge status-contacted">{stats.contactedLeads}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Qualified:</span>
              <span className="status-badge status-qualified">{stats.qualifiedLeads}</span>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Opportunities Overview</h3>
            <div className="flex justify-between mb-2">
              <span>Total Opportunities:</span>
              <strong>{stats.totalOpportunities}</strong>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discovery:</span>
              <span className="status-badge status-discovery">{stats.discoveryOpps}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Proposal:</span>
              <span className="status-badge status-proposal">{stats.proposalOpps}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Won:</span>
              <span className="status-badge status-won">{stats.wonOpps}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Lost:</span>
              <span className="status-badge status-lost">{stats.lostOpps}</span>
            </div>
          </div>
        </div> */}

       
      </div>
    </div>
  );
}
