import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [logo, setLogo] = useState('/logo-transparent.png');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo_url) setLogo(data.logo_url);
      })
      .catch(console.error);
  }, []);

  // Auto-dismiss the popup message
  useEffect(() => {
    if (error || msg) {
      const timer = setTimeout(() => {
        setError('');
        setMsg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, msg]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to recover password.');
      setMsg('');
      return;
    }
    setError('');
    setMsg('');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMsg(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {(error || msg) && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-10 left-1/2 px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3 z-50 ${
              error ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{error || msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden pt-0 px-8 pb-10">
        <div className="text-center mb-2">
          <div className="w-64 h-auto flex items-center justify-center mx-auto -mt-6 -mb-6 group overflow-hidden">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo-transparent.png';
              }}
            />
          </div>
          <h1 className="text-4xl font-black text-gray-900">Admin Login</h1>
          <p className="text-gray-500 mt-1">Enter credentials to manage site content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                required
              />
            </div>
            <div className="flex justify-end mt-2">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm text-red-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
