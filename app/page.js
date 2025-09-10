'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
          router.push(redirectPath);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <h1>Mini CRM</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center">
        <h1>Mini CRM</h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
