'use client';

import { useRouter } from 'next/navigation';

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleDisplay = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'manager') return 'Manager';
    return 'Sales Rep';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Mini CRM</div>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="status-badge status-contacted">
            {getRoleDisplay(user?.role)}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
