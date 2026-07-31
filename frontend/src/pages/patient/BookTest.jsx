import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookTest = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/tests').then((res) => {
      setTests(res.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post('/orders', { testId, age, gender });
      setMessage({ type: 'success', text: 'Test booked successfully! Status: Pending' });
      setTestId('');
      setAge('');
      setGender('Male');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    }
  };

  if (loading) return <LoadingSpinner label="Loading available tests..." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg card"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-clinic-50 border border-clinic-100 flex items-center justify-center shadow-sm">
          <CalendarPlus className="w-5 h-5 text-clinic-600" />
        </div>
        <h2 className="text-lg font-semibold text-clinic-900">Book a New Test</h2>
      </div>

      {message && (
        <div
          className={`text-sm px-4 py-2 rounded-xl mb-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-clinic-700 mb-1 block">Select Test</label>
          <select
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Choose a test...</option>
            {tests.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} — {t.category} (Rs. {t.price})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-clinic-700 mb-1 block">Age</label>
          <input
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-clinic-700 mb-1 block">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full py-2.5">
          Book Test
        </button>
      </form>
    </motion.div>
  );
};

export default BookTest;
