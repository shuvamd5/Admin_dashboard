// components/auth/ProtectedRoute.tsx
'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/lib/redux/store';
// import styles from './ProtectedRoute.module.css'; // REMOVE THIS LINE

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check localStorage for token on initial load, as Redux state might not be hydrated yet
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token && !storedToken) {
      router.push('/login');
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <div className="loading-container"> {/* Using global loading-container */}
        <div className="spinner" role="status" aria-label="Verifying authentication..."></div>
        <p className="loading-text">Verifying authentication...</p> {/* Using global loading-text */}
      </div>
    );
  }

  // Render children only if authenticated (token in Redux or localStorage)
  return token || (typeof window !== 'undefined' && localStorage.getItem('token')) ? <>{children}</> : null;
};

export default ProtectedRoute;