'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import StatisticsStrip from '../../components/StatisticsStrip';

export default function OpportunitiesPage() {
  const [user, setUser] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
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
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Discovery'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, opportunitiesResponse, statsResponse] = await Promise.all([
        fetch('/api/user/me'),
        fetch('/api/opportunities'),
        fetch('/api/dashboard/stats')
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      if (opportunitiesResponse.ok) {
        const opportunitiesData = await opportunitiesResponse.json();
        setOpportunities(opportunitiesData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingOpportunity ? `/api/opportunities/${editingOpportunity.id}` : '/api/opportunities';
      const method = editingOpportunity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value) || 0
        })
      });

      if (response.ok) {
        await loadData();
        setShowForm(false);
        setEditingOpportunity(null);
        setFormData({ title: '', value: '', stage: 'Discovery' });
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving opportunity');
      }
    } catch (error) {
      console.error('Error saving opportunity:', error);
      alert('Error saving opportunity');
    }
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      value: opportunity.value.toString(),
      stage: opportunity.stage
    });
    setShowForm(true);
  };

  const handleDelete = async (opportunityId) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting opportunity');
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert('Error deleting opportunity');
    }
  };

  const handleStageUpdate = async (opportunityId, newStage) => {
    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });

      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.message || 'Error updating stage');
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Error updating stage');
    }
  };

  const getStageBadge = (stage) => {
    const stageClasses = {
      'Discovery': 'status-discovery',
      'Proposal': 'status-proposal',
      'Won': 'status-won',
      'Lost': 'status-lost'
    };
    return `status-badge ${stageClasses[stage] || 'status-discovery'}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
        <div className="flex justify-between items-center mb-4">
          <h1>Opportunities</h1>
          {user?.role === 'manager' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add New Opportunity
            </button>
          )}
        </div>

        <StatisticsStrip stats={stats} />

        {user?.role === 'rep' && (
          <div className="card mb-4">
            <h3 className="mb-2">💡 Sales Rep Permissions</h3>
            <p>
              As a Sales Rep, you can only create opportunities by converting leads. 
              Go to the <strong>Leads</strong> page, find a qualified lead, and click "Convert to Opportunity".
              <br /><br />
              <strong>Note:</strong> Only Sales Managers can update opportunity stages and values.
            </p>
          </div>
        )}

        {showForm && (
          <div className="card mb-4">
            <h3 className="card-title">
              {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Value ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select
                  className="form-select"
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                >
                  <option value="Discovery">Discovery</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingOpportunity ? 'Update Opportunity' : 'Add Opportunity'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingOpportunity(null);
                    setFormData({ title: '', value: '', stage: 'Discovery' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>{opportunity.title}</td>
                  <td>{formatCurrency(opportunity.value)}</td>
                  <td>
                    <span className={getStageBadge(opportunity.stage)}>
                      {opportunity.stage}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {(user?.role === 'rep' && opportunity.ownerId === user?.id) && (
                        <>
                          <button 
                            onClick={() => handleEdit(opportunity)}
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(opportunity.id)}
                            className="btn btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                    {user?.role === 'manager' && (
                      <div className="mt-2">
                        <select
                          value={opportunity.stage}
                          onChange={(e) => handleStageUpdate(opportunity.id, e.target.value)}
                          className="form-select"
                        >
                          <option value="Discovery">Discovery</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {opportunities.length === 0 && (
            <div className="text-center p-4">
              No opportunities found. {user?.role === 'rep' && 'Add your first opportunity or convert a lead!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
