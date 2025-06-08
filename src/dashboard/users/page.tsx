'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/mockAuth';
import Table from '@/components/ui/Table';
import { v4 as uuidv4 } from 'uuid';

const UsersPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const mockData = [
    { id: uuidv4(), name: 'Admin One', email: 'admin1@example.com', role: 'Admin', status: 'Active' },
    { id: uuidv4(), name: 'Staff Two', email: 'staff2@example.com', role: 'Staff', status: 'Inactive' },
  ];

  return (
    <div className="p-6 ml-64 mt-16">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <Table headers={['Name', 'Email', 'Role', 'Status']}>
        {mockData.map((item) => (
          <tr key={item.id} className="border-b border-border">
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2">{item.email}</td>
            <td className="px-4 py-2">{item.role}</td>
            <td className="px-4 py-2">{item.status}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default UsersPage;