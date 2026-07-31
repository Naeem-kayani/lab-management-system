import React from 'react';

const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-clinic-500">
    <div className="w-10 h-10 border-4 border-clinic-200 border-t-clinic-600 rounded-full animate-spin mb-3 shadow-sm" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default LoadingSpinner;
