import React, { useEffect, useState } from 'react';
import { Eye, Download, FileText } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const MyReports = () => {
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: myOrders } = await api.get('/orders/my');
      const completed = myOrders.filter((o) => o.status === 'Completed');
      setOrders(completed);

      const reportMap = {};
      await Promise.all(
        completed.map(async (o) => {
          try {
            const { data } = await api.get(`/reports/${o._id}`);
            reportMap[o._id] = data;
          } catch (e) {
            // no report found yet
          }
        })
      );
      setReports(reportMap);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading your reports..." />;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-clinic-900 mb-4">My Reports</h2>
      {orders.length === 0 ? (
        <EmptyState title="No completed reports" subtitle="Completed test reports will appear here" />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
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
                      {new Date(o.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {report?.fileUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline flex items-center gap-1 text-sm py-1.5 px-3"
                    >
                      <Eye className="w-4 h-4" /> View
                    </a>
                    <a
                      href={report.fileUrl}
                      download
                      className="btn-primary flex items-center gap-1 text-sm py-1.5 px-3"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-clinic-500 bg-clinic-50 px-3 py-1.5 rounded-lg border border-clinic-100">
                    {report?.resultValue || 'No file uploaded'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReports;
