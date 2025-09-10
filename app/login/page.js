'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        const redirectPath = data.user.role === 'admin' ? '/admin' : '/dashboard';
        window.location.href = redirectPath;
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="text-center mb-4">Login to CRM</h1>
        
        {error && (
          <div className="mb-4 text-center text-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select your role</option>
              <option value="rep">Sales Rep</option>
              <option value="manager">Sales Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Don't have an account? <a href="/signup" className="text-link">Sign up</a></p>
        </div>

        <div className="mt-4 card">
          <h3 className="mb-2">Demo Accounts:</h3>
          <p className="mb-1"><strong>Sales Rep:</strong> alice@acme.com / password</p>
          <p className="mb-1"><strong>Sales Manager:</strong> bob@acme.com / password</p>
          <p className="mb-1"><strong>Administrator:</strong> admin@acme.com / password</p>        
        </div>
      </div>
    </div>
  );
}
