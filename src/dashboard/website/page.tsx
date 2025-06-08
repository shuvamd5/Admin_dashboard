'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import Table from '@/components/ui/Table';
import { v4 as uuidv4 } from 'uuid';

const WebsitePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const mockData = [
    { id: uuidv4(), page: 'Homepage', status: 'Published', lastUpdated: '2025-06-01' },
    { id: uuidv4(), page: 'Product Listing', status: 'Draft', lastUpdated: '2025-05-30' },
  ];

  return (
    <div className="p-6 ml-64 mt-16">
      <h1 className="text-2xl font-bold mb-6">Website</h1>
      <Table headers={['Page', 'Status', 'Last Updated']}>
        {mockData.map((item) => (
          <tr key={item.id} className="border-b border-border">
            <td className="px-4 py-2">{item.page}</td>
            <td className="px-4 py-2">{item.status}</td>
            <td className="px-4 py-2">{item.lastUpdated}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default WebsitePage;