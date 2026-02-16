import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Recycle, AlertCircle, X } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Verification Logic from LocalStorage
    const savedEmail = localStorage.getItem('registered_email');
    const savedPass = localStorage.getItem('registered_password');

    if (formData.email === savedEmail && formData.password === savedPass) {
      localStorage.setItem('isLoggedIn', 'true');
      // Redirect to Services Page after successful login
      navigate('/services');
    } else {
      setError("Invalid Email or Password. Please try again.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // In a real app, this would call an API. 
    // For now, we show an alert if the email matches the registered one.
    const savedEmail = localStorage.getItem('registered_email');
    if (resetEmail === savedEmail) {
      alert(`Password hint: Your password starts with "${localStorage.getItem('registered_password').substring(0, 2)}..."`);
    } else {
      alert("Email not found in our records.");
    }
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm relative">
            <button onClick={() => setShowForgotModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
            <p className="text-slate-400 text-sm mb-6">Enter your email to receive a password hint.</p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input 
                type="email" required placeholder="Registered Email"
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-emerald-500"
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-500 transition">
                Send Hint
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-slate-900 w-full max-w-md p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-2xl mb-4 border border-emerald-500/20">
            <Recycle className="text-emerald-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2">Log in to manage your e-waste</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 p-4 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              name="email" type="email" required placeholder="Email Address" 
              className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:border-emerald-500 outline-none transition"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              name="password" type={showPass ? "text" : "password"} required placeholder="Password" 
              className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:border-emerald-500 outline-none transition"
              onChange={handleChange}
            />
            <button 
              type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-4 text-slate-600 hover:text-emerald-400 transition"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)] mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-emerald-400 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}