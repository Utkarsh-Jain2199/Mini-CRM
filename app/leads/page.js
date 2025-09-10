'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import StatisticsStrip from '../../components/StatisticsStrip';

export default function LeadsPage() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
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
    name: '',
    email: '',
    phone: '',
    status: 'New'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, leadsResponse, statsResponse] = await Promise.all([
        fetch('/api/user/me'),
        fetch('/api/leads'),
        fetch('/api/dashboard/stats')
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setLeads(leadsData);
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
      const url = editingLead ? `/api/leads/${editingLead.id}` : '/api/leads';
      const method = editingLead ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadData();
        setShowForm(false);
        setEditingLead(null);
        setFormData({ name: '', email: '', phone: '', status: 'New' });
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving lead');
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Error saving lead');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status
    });
    setShowForm(true);
  };

  const handleDelete = async (leadId) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead');
    }
  };

  const handleConvert = async (lead) => {
    if (!confirm(`Convert "${lead.name}" to an opportunity?`)) return;

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-lead-conversion': 'true'
        },
        body: JSON.stringify({
          title: `${lead.name} – Deal`,
          value: 0,
          stage: 'Discovery',
          leadId: lead.id
        })
      });

      if (response.ok) {
        await fetch(`/api/leads/${lead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Qualified' })
        });
        
        await loadData();
        alert('Lead converted to opportunity successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error converting lead');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Error converting lead');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'New': 'status-new',
      'Contacted': 'status-contacted',
      'Qualified': 'status-qualified'
    };
    return `status-badge ${statusClasses[status] || 'status-new'}`;
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
          <h1>Leads</h1>
          {user?.role === 'rep' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add New Lead
            </button>
          )}
        </div>

        <StatisticsStrip stats={stats} />

        {user?.role === 'manager' && (
          <div className="card mb-4">
            <h3 className="mb-2">👥 Manager View</h3>
            <p>
              As a Sales Manager, you can view all leads and opportunities across your team. 
              You can update opportunity stages, but only Sales Reps can create leads and convert them to opportunities.
            </p>
          </div>
        )}

        {showForm && (
          <div className="card mb-4">
            <h3 className="card-title">
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingLead ? 'Update Lead' : 'Add Lead'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingLead(null);
                    setFormData({ name: '', email: '', phone: '', status: 'New' });
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                {user?.role === 'rep' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>
                    <span className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </span>
                  </td>
                  {user?.role === 'rep' && (
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(lead)}
                          className="btn btn-small btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="btn btn-small btn-danger"
                        >
                          Delete
                        </button>
                        {lead.status !== 'Qualified' && (
                          <button 
                            onClick={() => handleConvert(lead)}
                            className="btn btn-small btn-success"
                          >
                            Convert
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {leads.length === 0 && (
            <div className="text-center p-4">
              No leads found. {user?.role === 'rep' && 'Add your first lead to get started!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
