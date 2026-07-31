import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchData = async () => {
    const params = filter ? { status: filter } : {};
    const [ordersRes, staffRes] = await Promise.all([
      api.get('/orders', { params }),
      api.get('/users', { params: { role: 'staff' } }),
    ]);
    setOrders(ordersRes.data);
    setStaff(staffRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleAssign = async (orderId, staffId) => {
    await api.put(`/orders/${orderId}/assign`, { staffId });
    fetchData();
  };

  if (loading) return <LoadingSpinner label="Loading orders..." />;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-clinic-900">Manage Orders</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-clinic-200 bg-white text-clinic-700 rounded-xl text-sm px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Sample Collected">Sample Collected</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders found" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-400 border-b border-clinic-100">
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Patient</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Test</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Assign Staff</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-clinic-50 hover:bg-clinic-50/50 transition-colors last:border-0">
                  <td className="py-4 font-medium text-clinic-800">{o.patientId?.name}</td>
                  <td className="py-4 text-clinic-500">{o.testId?.name}</td>
                  <td className="py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-4">
                    <select
                      value={o.staffId?._id || ''}
                      onChange={(e) => handleAssign(o._id, e.target.value)}
                      className="border border-clinic-200 bg-white text-clinic-700 rounded-lg text-xs px-2 py-1"
                    >
                      <option value="">Unassigned</option>
                      {staff.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
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

export default ManageOrders;
