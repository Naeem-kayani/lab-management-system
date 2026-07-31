import React from 'react';

const STYLES = {
  Pending: 'bg-amber-100/80 text-amber-800 border border-amber-200',
  'Sample Collected': 'bg-blue-100/80 text-blue-800 border border-blue-200',
  Processing: 'bg-purple-100/80 text-purple-800 border border-purple-200',
  Completed: 'bg-accent-100/80 text-accent-800 border border-accent-200',
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm ${
      STYLES[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
