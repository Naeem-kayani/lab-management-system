import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner label="Loading your orders..." />;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-clinic-900 mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" subtitle="Book a test to see it here" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-400 border-b border-clinic-100">
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Test Name</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Booking Date</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-clinic-50 hover:bg-clinic-50/50 transition-colors last:border-0">
                  <td className="py-4 font-medium text-clinic-800">{o.testId?.name}</td>
                  <td className="py-4 text-clinic-500">
                    {new Date(o.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
