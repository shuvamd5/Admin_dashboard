'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import Table from '@/components/ui/Table';
import { v4 as uuidv4 } from 'uuid';

const ReportsPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const mockData = [
    { id: uuidv4(), report: 'Sales Summary', period: 'May 2025', revenue: 5000, orders: 50 },
    { id: uuidv4(), report: 'Customer Growth', period: 'Q2 2025', newCustomers: 200, retention: '80%' },
  ];

  return (
    <div className="p-6 ml-64 mt-16">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <Table headers={['Report', 'Period', 'Key Metric', 'Value']}>
        {mockData.map((item) => (
          <tr key={item.id} className="border-b border-border">
            <td className="px-4 py-2">{item.report}</td>
            <td className="px-4 py-2">{item.period}</td>
            <td className="px-4 py-2">{item.report === 'Sales Summary' ? 'Revenue' : 'New Customers'}</td>
            <td className="px-4 py-2">{item.report === 'Sales Summary' ? `$${item.revenue}` : item.newCustomers}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default ReportsPage;