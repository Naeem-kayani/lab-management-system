import React, { useEffect, useState } from 'react';
import { ClipboardList, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const PatientDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;

  const total = orders.length;
  const pending = orders.filter((o) => o.status !== 'Completed').length;
  const completed = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-clinic-900">Overview</h2>
        <p className="text-sm text-clinic-500">A quick summary of your test activity</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={ClipboardList} label="Total Tests" value={total} accent="clinic" />
        <StatCard icon={Clock} label="Pending Reports" value={pending} accent="accent" />
        <StatCard icon={CheckCircle2} label="Completed Reports" value={completed} accent="clinic" />
      </div>
    </div>
  );
};

export default PatientDashboard;
