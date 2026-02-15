import React, { useState } from 'react';
import { MailCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmailVerification() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (code === '1111') {
      navigate('/login');
    } else {
      setError(true);
      // Reset error after 3 seconds
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-emerald-100 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck size={40} />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Verify Email</h2>
        <p className="text-slate-500 mb-8">Enter the 4-digit code sent to your email.</p>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength="4"
            placeholder="0 0 0 0"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full text-center text-3xl tracking-[1rem] font-bold py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-emerald-500'
            }`}
          />

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 font-medium animate-bounce">
              <AlertCircle size={18} /> Invalid Code. Try 1111.
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
          >
            Verify & Continue <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}