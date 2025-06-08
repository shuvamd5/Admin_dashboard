// components/dashboard/DashboardLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/redux/slices/authSlice';
import styles from './DashboardLayout.module.css';
import { DASHBOARD_NAV_ITEMS, NavItem } from '@/lib/dashboardNavItems';
import { ChevronDown, Menu, User, LogOut } from 'lucide-react';
import Card from '@/components/ui/Card'; // Import the Card component

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [activeSectionId, setActiveSectionId] = useState<string>('home');
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  // Initialize isSidebarOpen based on screen size on mount
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true for SSR/larger screens

  useEffect(() => {
    const handleResize = () => {
      // If screen is small, default to sidebar closed
      // If screen is large, default to sidebar open
      if (window.innerWidth <= 768) { // Your mobile breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener for future resizes
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Run only once on mount

  const findActiveComponent = (items: NavItem[]): React.ComponentType | undefined => {
    for (const item of items) {
      if (item.id === activeSectionId) {
        return item.component;
      }
      if (item.subItems) {
        const subComponent = findActiveComponent(item.subItems);
        if (subComponent) return subComponent;
      }
    }
    return undefined;
  };

  const ActiveComponent = findActiveComponent(DASHBOARD_NAV_ITEMS);

  const handleNavClick = (item: NavItem) => {
    if (item.subItems) {
      setOpenSubMenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    } else {
      setActiveSectionId(item.id);
      // Close sidebar on mobile after clicking a main nav item
      if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        setIsSidebarOpen(false);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button
          className={styles.menuToggleBtn}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <Menu size={24} />
        </button>
        <div className={styles.headerTitle}>Admin Dashboard</div>
        <div className={styles.userInfo}>
          <User size={20} className={styles.userIcon} />
          <span>Admin</span> {/* Replace with dynamic user name if available */}
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            aria-label="Logout"
          >
            <LogOut size={20} className={styles.logoutIcon} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {/* Add sidebarOpenMobile class to mainWrapper for overlay on mobile */}
      <div className={`${styles.mainWrapper} ${isSidebarOpen ? styles.sidebarOpenMobile : ''}`}>
        {/* Sidebar */}
        <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
          <div className={styles.logo}>Admin Dashboard</div> {/* Duplicated for mobile sidebar, consider hiding or removing */}
          <ul className={styles.navList}>
            {DASHBOARD_NAV_ITEMS.map((item) => (
              <React.Fragment key={item.id}>
                <li
                  className={`${styles.navItem} ${activeSectionId === item.id ? styles.active : ''}`}
                  onClick={() => handleNavClick(item)}
                  role="button"
                  aria-expanded={item.subItems ? openSubMenus[item.id] : undefined}
                  aria-label={item.label}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.subItems && (
                    <ChevronDown
                      className={`${styles.arrow} ${openSubMenus[item.id] ? styles.open : ''}`}
                      size={16}
                    />
                  )}
                </li>
                {item.subItems && openSubMenus[item.id] && (
                  <ul className={styles.subMenu}>
                    {item.subItems.map((subItem) => (
                      <li
                        key={subItem.id}
                        className={`${styles.subNavItem} ${activeSectionId === subItem.id ? styles.active : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSectionId(subItem.id);
                          // Close sidebar on mobile after clicking a sub-nav item
                          if (window.innerWidth <= 768) { // Adjust breakpoint as needed
                            setIsSidebarOpen(false);
                          }
                        }}
                        role="button"
                        aria-label={subItem.label}
                      >
                        <span className={styles.subNavItemLabel}>{subItem.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Use the Card component here */}
          <Card>
            {ActiveComponent ? (
              <ActiveComponent />
            ) : (
              <p>Select a dashboard section from the sidebar.</p>
            )}
          </Card>
        </main>
      </div>
      {/* Add an overlay that can be clicked to close the sidebar on mobile */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div className={styles.mobileOverlay} onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default DashboardLayout;