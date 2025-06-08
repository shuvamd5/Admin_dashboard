'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import Table from '@/components/ui/Table';
import { v4 as uuidv4 } from 'uuid';

const SystemPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const mockData = [
    { id: uuidv4(), setting: 'Store Name', value: 'MyStore', lastUpdated: '2025-06-01' },
    { id: uuidv4(), setting: 'Tax Rate', value: '5%', lastUpdated: '2025-05-30' },
  ];

  return (
    <div className="p-6 ml-64 mt-16">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <Table headers={['Setting', 'Value', 'Last Updated']}>
        {mockData.map((item) => (
          <tr key={item.id} className="border-b border-border">
            <td className="px-4 py-2">{item.setting}</td>
            <td className="px-4 py-2">{item.value}</td>
            <td className="px-4 py-2">{item.lastUpdated}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default SystemPage;