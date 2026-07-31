import React, { useEffect, useState } from 'react';
import { UserPlus, Ban, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });

  const fetchUsers = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    await api.post('/users', form);
    setModalOpen(false);
    setForm({ name: '', email: '', password: '', role: 'staff' });
    fetchUsers();
  };

  const changeRole = async (id, role) => {
    await api.put(`/users/${id}`, { role });
    fetchUsers();
  };

  const toggleActive = async (user) => {
    await api.put(`/users/${user._id}`, { isActive: !user.isActive });
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to completely delete this user?')) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  if (loading) return <LoadingSpinner label="Loading users..." />;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-clinic-900">Manage Users</h2>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1 text-sm">
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-400 border-b border-clinic-100">
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Name</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Email</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Role</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-clinic-50 hover:bg-clinic-50/50 transition-colors last:border-0">
                  <td className="py-4 font-medium text-clinic-800">{u.name}</td>
                  <td className="py-4 text-clinic-500">{u.email}</td>
                  <td className="py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                      className="border border-clinic-200 rounded-lg text-xs px-2 py-1 text-clinic-700 bg-white"
                    >
                      <option value="patient">patient</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.isActive ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleActive(u)}
                        className={`text-xs flex items-center gap-1 ${
                          u.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-emerald-600 hover:text-emerald-800'
                        }`}
                      >
                        {u.isActive ? (
                          <>
                            <Ban className="w-3.5 h-3.5" /> Disable
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Enable
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            minLength={6}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="input-field"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary w-full py-2.5">
            Add User
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
