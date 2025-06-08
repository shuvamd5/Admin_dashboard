'use client';

import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-border">
        <thead>
          <tr className="bg-primary text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;