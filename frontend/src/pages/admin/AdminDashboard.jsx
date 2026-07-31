import React, { useEffect, useState } from 'react';
import { Users, TestTube, ClipboardList, Clock, DollarSign } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const COLORS = ['#1e40af', '#10b981', '#3b82f6', '#34d399', '#1d4ed8', '#059669'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalTests: 0,
    ordersToday: 0,
    pendingReports: 0,
    totalRevenue: 0,
  });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [usersRes, testsRes, ordersRes] = await Promise.all([
        api.get('/users', { params: { role: 'patient' } }),
        api.get('/tests'),
        api.get('/orders'),
      ]);

      const patients = usersRes.data;
      const tests = testsRes.data;
      const orders = ordersRes.data;

      const today = new Date().toDateString();
      const ordersToday = orders.filter((o) => new Date(o.date).toDateString() === today).length;
      const pendingReports = orders.filter((o) => o.status !== 'Completed').length;
      const totalRevenue = orders
        .filter((o) => o.status === 'Completed')
        .reduce((sum, o) => sum + (o.testId?.price || 0), 0);

      setStats({
        totalPatients: patients.length,
        totalTests: tests.length,
        ordersToday,
        pendingReports,
        totalRevenue,
      });

      // Pie: tests by category
      const categoryCount = {};
      tests.forEach((t) => {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
      });
      setPieData(Object.entries(categoryCount).map(([name, value]) => ({ name, value })));

      // Bar: orders last 7 days
      const last7 = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });
      const barCounts = last7.map((d) => ({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: orders.filter((o) => new Date(o.date).toDateString() === d.toDateString()).length,
      }));
      setBarData(barCounts);

      // Line: revenue last 30 days
      const last30 = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d;
      });
      const lineValues = last30.map((d) => {
        const revenue = orders
          .filter(
            (o) =>
              o.status === 'Completed' && new Date(o.date).toDateString() === d.toDateString()
          )
          .reduce((sum, o) => sum + (o.testId?.price || 0), 0);
        return { date: `${d.getDate()}/${d.getMonth() + 1}`, revenue };
      });
      setLineData(lineValues);

      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Crunching the numbers..." />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} accent="clinic" />
        <StatCard icon={TestTube} label="Total Tests" value={stats.totalTests} accent="accent" />
        <StatCard icon={ClipboardList} label="Orders Today" value={stats.ordersToday} accent="clinic" />
        <StatCard icon={Clock} label="Pending Reports" value={stats.pendingReports} accent="accent" />
        <StatCard icon={DollarSign} label="Total Revenue" value={stats.totalRevenue} prefix="Rs. " accent="clinic" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-clinic-900 mb-4">Tests by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-clinic-900 mb-4">Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="orders" fill="#1e40af" radius={[6, 6, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-clinic-900 mb-4">Revenue (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} interval={4} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
