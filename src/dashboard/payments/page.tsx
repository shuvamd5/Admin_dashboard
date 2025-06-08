'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import Table from '@/components/ui/Table';
import { v4 as uuidv4 } from 'uuid';

const PaymentsPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const mockData = [
    { id: uuidv4(), orderId: 'ORD123', amount: 99.99, method: 'Card', status: 'Paid', date: '2025-06-03' },
    { id: uuidv4(), orderId: 'ORD124', amount: 49.99, method: 'PayPal', status: 'Pending', date: '2025-06-02' },
  ];

  return (
    <div className="p-6 ml-64 mt-16">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <Table headers={['Order ID', 'Amount', 'Method', 'Status', 'Date']}>
        {mockData.map((item) => (
          <tr key={item.id} className="border-b border-border">
            <td className="px-4 py-2">{item.orderId}</td>
            <td className="px-4 py-2">${item.amount.toFixed(2)}</td>
            <td className="px-4 py-2">{item.method}</td>
            <td className="px-4 py-2">{item.status}</td>
            <td className="px-4 py-2">{item.date}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default PaymentsPage;