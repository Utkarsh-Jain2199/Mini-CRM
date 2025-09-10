'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navigation({ user }) {
  const pathname = usePathname();

  if (user?.role === 'admin') {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leads', label: 'Leads' },
    { href: '/opportunities', label: 'Opportunities' }
  ];

  return (
    <nav className="nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.href} className="nav-item">
            <Link
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
