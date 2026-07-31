import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const emptyForm = { name: '', price: '', category: '' };

const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchTests = async () => {
    const { data } = await api.get('/tests');
    setTests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (test) => {
    setEditingId(test._id);
    setForm({ name: test.name, price: test.price, category: test.category });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/tests/${editingId}`, form);
    } else {
      await api.post('/tests', form);
    }
    setModalOpen(false);
    fetchTests();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    await api.delete(`/tests/${id}`);
    fetchTests();
  };

  if (loading) return <LoadingSpinner label="Loading tests..." />;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-clinic-900">Manage Tests</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1 text-sm">
          <Plus className="w-4 h-4" /> Add Test
        </button>
      </div>

      {tests.length === 0 ? (
        <EmptyState title="No tests added yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-400 border-b border-clinic-100">
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Name</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Category</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Price</th>
                <th className="py-3 font-medium uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t._id} className="border-b border-clinic-50 hover:bg-clinic-50/50 transition-colors last:border-0">
                  <td className="py-4 font-medium text-clinic-800">{t.name}</td>
                  <td className="py-4 text-clinic-500">{t.category}</td>
                  <td className="py-4 text-clinic-500">Rs. {t.price}</td>
                  <td className="py-4 flex gap-2">
                    <button onClick={() => openEdit(t)} className="text-clinic-600 hover:text-clinic-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Test' : 'Add Test'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Test name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary w-full py-2.5">
            {editingId ? 'Update Test' : 'Add Test'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTests;
