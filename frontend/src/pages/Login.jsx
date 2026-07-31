import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clinic-50 via-white to-clinic-100/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-clinic-600 to-accent-500 shadow-md flex items-center justify-center mb-3">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-clinic-900">Welcome Back</h1>
          <p className="text-sm text-clinic-500">Sign in to MediLab</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-clinic-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-clinic-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6 space-y-2">
          <Link to="/forgot-password" className="text-sm text-clinic-600 hover:underline">
            Forgot Password?
          </Link>
          <p className="text-center text-sm text-clinic-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-clinic-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
