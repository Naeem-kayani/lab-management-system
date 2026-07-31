import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const NEXT_STATUS = {
  Pending: 'Sample Collected',
  'Sample Collected': 'Processing',
  Processing: 'Completed',
};

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOrder, setModalOrder] = useState(null);
  const [resultValue, setResultValue] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const advanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next || next === 'Completed') return; // Completed handled via upload
    await api.put(`/orders/${order._id}/status`, { status: next });
    fetchOrders();
  };

  const openUpload = (order) => {
    setModalOrder(order);
    setResultValue('');
    setFile(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('orderId', modalOrder._id);
      formData.append('resultValue', resultValue);
      if (file) formData.append('file', file);

      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setModalOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading assigned orders..." />;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-clinic-900 mb-4">Assigned Orders</h2>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" subtitle="Orders assigned to you will show up here" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-400 border-b border-clinic-100">
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Patient</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Test</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Action</th>
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
                    {o.status !== 'Completed' && o.status !== 'Processing' && (
                      <button
                        onClick={() => advanceStatus(o)}
                        className="btn-outline text-xs py-1.5 px-3 mr-2"
                      >
                        Mark {NEXT_STATUS[o.status]}
                      </button>
                    )}
                    {o.status === 'Processing' && (
                      <button
                        onClick={() => openUpload(o)}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 inline-flex"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Result
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!modalOrder} onClose={() => setModalOrder(null)} title="Upload Test Result">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-clinic-700 mb-1 block">Result Value</label>
            <input
              type="text"
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              placeholder="e.g. Hemoglobin: 13.5 g/dL"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-clinic-700 mb-1 block">
              Or Upload PDF / Image
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={uploading} className="btn-primary w-full py-2.5">
            {uploading ? 'Uploading...' : 'Submit Result'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StaffDashboard;
