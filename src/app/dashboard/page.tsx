'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
};

export default DashboardPage;