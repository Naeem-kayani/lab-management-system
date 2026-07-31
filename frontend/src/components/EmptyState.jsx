import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', subtitle = '' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center text-clinic-400">
    <div className="w-16 h-16 rounded-full bg-clinic-50 flex items-center justify-center mb-4 shadow-sm border border-clinic-100">
      <Inbox className="w-8 h-8 text-clinic-300" />
    </div>
    <p className="font-medium text-clinic-500">{title}</p>
    {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
  </div>
);

export default EmptyState;
