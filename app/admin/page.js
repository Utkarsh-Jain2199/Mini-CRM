'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Navigation from '../../components/Navigation';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'rep'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, usersResponse] = await Promise.all([
        fetch('/api/user/me'),
        fetch('/api/admin/users')
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);

        if (userData.role !== 'admin') {
          window.location.href = '/dashboard';
        }
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
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
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadData();
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'rep' });
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '', // Don't show existing password
      role: userToEdit.role
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      'admin': 'status-won',
      'manager': 'status-proposal',
      'rep': 'status-new'
    };
    return `status-badge ${roleClasses[role] || 'status-new'}`;
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'manager') return 'Sales Manager';
    return 'Sales Rep';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container">
        <div className="text-center">
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header user={user} />
      <Navigation user={user} />

      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1>Admin Panel</h1>
            <p className="mb-0">Manage users and system settings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add New User
          </button>
        </div>

        {showForm && (
          <div className="card mb-4">
            <h3 className="card-title">
              {editingUser ? 'Edit User' : 'Add New User'}
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
                <label className="form-label">Password {!editingUser && '(required)'}</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="rep">Sales Rep</option>
                  <option value="manager">Sales Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                    setFormData({ name: '', email: '', password: '', role: 'rep' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h3 className="card-title">System Users</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((systemUser) => (
                  <tr key={systemUser.id}>
                    <td>{systemUser.name}</td>
                    <td>{systemUser.email}</td>
                    <td>
                      <span className={getRoleBadge(systemUser.role)}>
                        {getRoleLabel(systemUser.role)}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(systemUser)}
                          className="btn btn-small btn-secondary"
                        >
                          Edit
                        </button>
                        {systemUser.id !== user.id && (
                          <button
                            onClick={() => handleDelete(systemUser.id)}
                            className="btn btn-small btn-danger"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">System Statistics</h3>
          <div className="flex gap-4">
            <div>
              <strong>Total Users:</strong> {users.length}
            </div>
            <div>
              <strong>Administrators:</strong> {users.filter(u => u.role === 'admin').length}
            </div>
            <div>
              <strong>Managers:</strong> {users.filter(u => u.role === 'manager').length}
            </div>
            <div>
              <strong>Sales Reps:</strong> {users.filter(u => u.role === 'rep').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
