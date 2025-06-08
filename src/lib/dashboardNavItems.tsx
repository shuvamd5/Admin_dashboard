'use client';

import React from 'react';
import { Home, Phone, Package, Truck, Settings, CreditCard, Tag, ShoppingCart, BarChart, Users, Globe, Server } from 'lucide-react';
import HomeComponent from '@/components/dashboard/Home';
import Orders from '@/dashboard/orders/page';
import Product from '@/dashboard/products/page'
import Placeholder from '@/components/dashboard/Placeholder';
import Categories from '@/dashboard/home/page';
import Discount from '@/dashboard/discounts/page';
import OrderDiscount from '@/dashboard/order-discounts/page';
import Promo from'@/dashboard/promo-codes/page';
import Reviews from '@/dashboard/reviews/page';
import Customers from '@/dashboard/customers/page';
import RP from '@/dashboard/variants/revertpage'

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component?: React.ComponentType;
  subItems?: NavItem[];
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: <Home className="sidebar-icon" />, component: HomeComponent },
  { id: 'follow-up', label: 'Follow Up', icon: <Phone className="sidebar-icon" />, component: RP },
  { id: 'orders', label: 'Orders', icon: <Package className="sidebar-icon" />, component: Orders },
  { id: 'dispatch-orders', label: 'Dispatch Orders', icon: <Truck className="sidebar-icon" />, component: Placeholder },
  {
    id: 'bulk-actions',
    label: 'Bulk Actions',
    icon: <Settings className="sidebar-icon" />,
    subItems: [
      {
        id: 'print-labels', label: 'Print Labels', component: Placeholder,
        icon: undefined
      },
      {
        id: 'assign-orders', label: 'Assign Orders', component: Placeholder,
        icon: undefined
      },
      {
        id: 'change-order-status', label: 'Change Order Status', component: Placeholder,
        icon: undefined
      },
      {
        id: 'settle-orders', label: 'Settle Orders', component: Placeholder,
        icon: undefined
      },
    ],
  },
  { id: 'payments', label: 'Payments', icon: <CreditCard className="sidebar-icon" />, component: Placeholder },
  {
    id: 'products',
    label: 'Products',
    icon: <ShoppingCart className="sidebar-icon" />,
    subItems: [
      {
        id: 'all-products', label: 'All Products', component: Product,
        icon: undefined
      },
      {
        id: 'categories', label: 'Categories', component: Categories,
        icon: undefined
      },
      {
        id: 'stock-levels', label: 'Stock Levels', component: Placeholder,
        icon: undefined
      },
      {
        id: 'default-attributes', label: 'Default Attributes', component: Placeholder,
        icon: undefined
      },
      {
        id: 'product-reviews', label: 'Product Reviews', component: Reviews,
        icon: undefined
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <BarChart className="sidebar-icon" />,
    subItems: [
      {
        id: 'follow-up-details', label: 'Follow Up & Details', component: Placeholder,
        icon: undefined
      },
      {
        id: 'order-sales', label: 'Order & Sales', component: Placeholder,
        icon: undefined
      },
      {
        id: 'delivery-status-report', label: 'Delivery Status', component: Placeholder,
        icon: undefined
      },
      {
        id: 'product-performance', label: 'Product Performance', component: Placeholder,
        icon: undefined
      },
      {
        id: 'stock-status-report', label: 'Stock Status', component: Placeholder,
        icon: undefined
      },
    ],
  },
  { 
    id: 'discounts',
    label: 'Discounts', 
    icon: <Tag className="sidebar-icon" />, 
    subItems: [
      {
        id: 'discounts', label: 'Discounts', component: Discount,
        icon: undefined
      },
      {
        id: 'order-discounts', label: 'Order Discounts', component: OrderDiscount,
        icon: undefined
      },
      {
        id: 'promo-codes', label: 'Promo codes', component: Promo,
        icon: undefined
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="sidebar-icon" />,
    subItems: [
      {
        id: 'staffs', label: 'Staffs', component: Placeholder,
        icon: undefined
      },
      {
        id: 'logistics', label: 'Logistics', component: Placeholder,
        icon: undefined
      },
      {
        id: 'customers', label: 'Customers', component: Customers,
        icon: undefined
      },
      {
        id: 'roles-permissions', label: 'Roles & Permissions', component: Placeholder,
        icon: undefined
      },
    ],
  },
  {
    id: 'website',
    label: 'Website',
    icon: <Globe className="sidebar-icon" />,
    subItems: [
      {
        id: 'headers', label: 'Headers', component: Placeholder,
        icon: undefined
      },
      {
        id: 'sliders', label: 'Sliders', component: Placeholder,
        icon: undefined
      },
      {
        id: 'pages', label: 'Pages', component: Placeholder,
        icon: undefined
      },
      {
        id: 'footers', label: 'Footers', component: Placeholder,
        icon: undefined
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: <Server className="sidebar-icon" />,
    subItems: [
      {
        id: 'multiple-store', label: 'Multiple Store', component: Placeholder,
        icon: undefined
      },
      {
        id: 'delivery-locations', label: 'Delivery Locations', component: Placeholder,
        icon: undefined
      },
      {
        id: 'settings', label: 'Settings', component: Placeholder,
        icon: undefined
      },
    ],
  },
];