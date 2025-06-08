'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Truck, Package, DollarSign, Tag, Users, Globe, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: <Home className="sidebar-icon" /> },
  { label: 'Follow Up', href: '/dashboard/follow-up', icon: <Truck className="sidebar-icon" /> },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: <Package className="sidebar-icon" />,
    subItems: [
      { label: 'Order List', href: '/dashboard/orders' },
      { label: 'New Order', href: '/dashboard/orders/new' },
    ],
  },
  { label: 'Dispatch Orders', href: '/dashboard/dispatch-orders', icon: <Truck className="sidebar-icon" /> },
  {
    label: 'Bulk Actions',
    href: '/dashboard/bulk-actions',
    icon: <Menu className="sidebar-icon" />,
    subItems: [
      { label: 'Print Labels', href: '/dashboard/bulk-actions/print-labels' },
      { label: 'Assign Orders', href: '/dashboard/bulk-actions/assign-orders' },
      { label: 'Change Order Status', href: '/dashboard/bulk-actions/change-status' },
      { label: 'Settle Orders', href: '/dashboard/bulk-actions/settle-orders' },
    ],
  },
  { label: 'Payments', href: '/dashboard/payments', icon: <DollarSign className="sidebar-icon" /> },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: <Package className="sidebar-icon" />,
    subItems: [
      { label: 'All Products', href: '/dashboard/products' },
      { label: 'Categories', href: '/dashboard/products/categories' },
      { label: 'Stock Levels', href: '/dashboard/products/stock' },
      { label: 'Default Attributes', href: '/dashboard/products/attributes' },
      { label: 'Product Reviews', href: '/dashboard/products/reviews' },
    ],
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: <Menu className="sidebar-icon" />,
    subItems: [
      { label: 'Follow Up & Details', href: '/dashboard/reports/follow-up' },
      { label: 'Order & Sales', href: '/dashboard/reports/orders' },
      { label: 'Delivery Status', href: '/dashboard/reports/delivery' },
      { label: 'Product Performance', href: '/dashboard/reports/products' },
      { label: 'Stock Status', href: '/dashboard/reports/stock' },
    ],
  },
  {
    label: 'Discounts',
    href: '/dashboard/discounts',
    icon: <Tag className="sidebar-icon" />,
    subItems: [{ label: 'Promo Codes', href: '/dashboard/discounts/promocodes' }],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: <Users className="sidebar-icon" />,
    subItems: [
      { label: 'Staff', href: '/dashboard/users/staff' },
      { label: 'Logistics', href: '/dashboard/users/logistics' },
      { label: 'Customers', href: '/dashboard/users/customers' },
      { label: 'Roles & Permissions', href: '/dashboard/users/roles' },
    ],
  },
  {
    label: 'Website',
    href: '/dashboard/website',
    icon: <Globe className="sidebar-icon" />,
    subItems: [
      { label: 'Headers', href: '/dashboard/website/headers' },
      { label: 'Sliders', href: '/dashboard/website/sliders' },
      { label: 'Pages', href: '/dashboard/website/pages' },
      { label: 'Footers', href: '/dashboard/website/footers' },
    ],
  },
  {
    label: 'System',
    href: '/dashboard/system',
    icon: <Settings className="sidebar-icon" />,
    subItems: [
      { label: 'Multiple Stores', href: '/dashboard/system/stores' },
      { label: 'Delivery Locations', href: '/dashboard/system/locations' },
      { label: 'Settings', href: '/dashboard/system/settings' },
    ],
  },
];

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Admin Dashboard</h2>
        <button className={styles.closeBtn} onClick={toggleSidebar} aria-label="Close Sidebar">
          <X className="sidebar-icon" />
        </button>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <div key={item.label}>
            <Link
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              onClick={() => item.subItems && toggleSubmenu(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
            {item.subItems && openSubmenu === item.label && (
              <div className={styles.submenu}>
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href}
                    className={`${styles.subItem} ${pathname === subItem.href ? styles.active : ''}`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}