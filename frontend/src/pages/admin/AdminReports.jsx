import React, { useEffect, useState } from 'react';
import { Search, FileText, Eye } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/orders', { params: { status: 'Completed' } });
      setOrders(data);

      const reportMap = {};
      await Promise.all(
        data.map(async (o) => {
          try {
            const { data: report } = await api.get(`/reports/${o._id}`);
            reportMap[o._id] = report;
          } catch (e) {
            // no report
          }
        })
      );
      setReports(reportMap);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading reports..." />;

  const filtered = orders.filter(
    (o) =>
      o.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.testId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-clinic-900">Completed Reports</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-clinic-400" />
          <input
            type="text"
            placeholder="Search patient or test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No reports found" />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const report = reports[o._id];
            return (
              <div
                key={o._id}
                className="flex items-center justify-between border border-clinic-100 bg-white hover:border-clinic-200 hover:shadow-sm transition-all rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-medium text-clinic-800">{o.testId?.name}</p>
                    <p className="text-xs text-clinic-500">
                      {o.patientId?.name} • {new Date(o.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {report?.fileUrl ? (
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline flex items-center gap-1 text-sm py-1.5 px-3"
                  >
                    <Eye className="w-4 h-4" /> View
                  </a>
                ) : (
                  <span className="text-sm font-medium text-clinic-500 bg-clinic-50 px-3 py-1.5 rounded-lg border border-clinic-100">{report?.resultValue || '—'}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
