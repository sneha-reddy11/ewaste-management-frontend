import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, MapPin } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    city: '', // This will now store the typed city name
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Save all details to LocalStorage for the Profile and Password Reset logic
    localStorage.setItem('registered_name', formData.name);
    localStorage.setItem('registered_city', formData.city); // Saves typed city
    localStorage.setItem('registered_email', formData.email);
    localStorage.setItem('registered_phone', formData.phone);
    localStorage.setItem('user_password', formData.password);
    localStorage.setItem('security_question', formData.securityQuestion);
    localStorage.setItem('security_answer', formData.securityAnswer);
    localStorage.setItem('isLoggedIn', 'true');
    
    alert("Registration Successful!");
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-emerald-400 font-black tracking-widest uppercase text-xs mb-2">E-Waste Management System</h2>
          <h1 className="text-4xl font-black text-white">Create Account</h1>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <InputField label="Name" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} />
            <InputField label="Phone Number" name="phone" placeholder="e.g. 9876543210" value={formData.phone} onChange={handleChange} />
            <InputField label="Password" name="password" type="password" placeholder="Create password" value={formData.password} onChange={handleChange} />
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 ml-1">Security Question</label>
              <select 
                name="securityQuestion"
                required
                className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition"
                onChange={handleChange}
                value={formData.securityQuestion}
              >
                <option value="">Select a question</option>
                <option value="What was your first school?">What was your first school?</option>
                <option value="What is your pet's name?">What is your pet's name?</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            {/* CHANGED: City is now a text input instead of a dropdown */}
            <InputField 
                label="City" 
                name="city" 
                placeholder="Enter your city name" 
                value={formData.city} 
                onChange={handleChange} 
            />
            
            <InputField label="Email-ID" name="email" type="email" placeholder="abc@gmail.com" value={formData.email} onChange={handleChange} />
            <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} />
            <InputField label="Security Answer" name="securityAnswer" placeholder="Your secret answer" value={formData.securityAnswer} onChange={handleChange} />
          </div>

          {/* Form Footer */}
          <div className="md:col-span-2 mt-4 space-y-6">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                name="acceptTerms" 
                className="w-5 h-5 accent-emerald-500 rounded border-slate-800 bg-slate-950" 
                onChange={handleChange} 
                required 
              />
              <span className="text-sm text-slate-400 font-medium">I agree to the <span className="text-blue-500 cursor-pointer hover:underline">Terms of Service</span></span>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 p-5 rounded-2xl font-black text-lg hover:from-yellow-400 hover:to-amber-500 transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-widest"
            >
              Register Now
            </button>

            <p className="text-center text-slate-500 text-sm font-medium">
              Already have an account? <span onClick={() => navigate('/login')} className="text-blue-500 font-bold cursor-pointer hover:underline ml-1">Login here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", placeholder, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-400 ml-1">{label}</label>
      <input 
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-all"
        required
      />
    </div>
  );
}