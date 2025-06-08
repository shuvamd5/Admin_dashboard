'use client';

import { Menu, User, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/redux/slices/authSlice';
import styles from './Navbar.module.css';

export default function Navbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className={styles.navbar}>
      <button
        className={styles.menuBtn}
        onClick={toggleSidebar}
        aria-label="Open Sidebar"
      >
        <Menu className="sidebar-icon" />
      </button>
      <div className={styles.user}>
        <User className="sidebar-icon" />
        <span>Admin</span>
      </div>
      <button
        onClick={handleLogout}
        className={styles.logoutBtn}
        aria-label="Logout"
      >
        <LogOut className="sidebar-icon" />
      </button>
    </header>
  );
}