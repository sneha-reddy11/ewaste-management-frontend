import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Recycle, ArrowLeft, Check, Pencil, LogOut } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "", city: "" });

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') navigate('/login');
    setUserData({
      name: localStorage.getItem('registered_name') || "",
      email: localStorage.getItem('registered_email') || "",
      phone: localStorage.getItem('registered_phone') || "",
      city: localStorage.getItem('registered_city') || ""
    });
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem('registered_name', userData.name);
    localStorage.setItem('registered_city', userData.city);
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative">
      <nav className="p-6 flex justify-between items-center relative z-10">
        <button onClick={() => navigate('/services')} className="flex items-center gap-2 text-slate-400"><ArrowLeft size={20}/> Back</button>
        <div className="text-emerald-400 font-bold flex items-center gap-2"><Recycle size={24}/> EcoCycle</div>
      </nav>

      <main className="container mx-auto px-6 py-12 flex justify-center relative z-10">
        <div className="w-full max-w-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl rounded-[3rem] p-12">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black">User Profile</h1>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${isEditing ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}
            >
              {isEditing ? <><Check size={18}/> Save</> : <><Pencil size={18}/> Edit</>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableBox label="Name" name="name" value={userData.name} isEditing={isEditing} onChange={(e) => setUserData({...userData, name: e.target.value})} />
            <EditableBox label="City" name="city" value={userData.city} isEditing={isEditing} onChange={(e) => setUserData({...userData, city: e.target.value})} />
            <EditableBox label="Email" value={userData.email} isEditing={false} />
            <EditableBox label="Phone" value={userData.phone} isEditing={false} />
          </div>

          <button onClick={() => {localStorage.removeItem('isLoggedIn'); navigate('/');}} className="mt-10 flex items-center gap-2 text-rose-500 font-bold"><LogOut size={20}/> Logout</button>
        </div>
      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl font-black shadow-2xl animate-bounce">
          PROFILE UPDATED SUCCESSFULLY!
        </div>
      )}
    </div>
  );
}

function EditableBox({ label, value, isEditing, onChange, name }) {
  return (
    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      {isEditing ? (
        <input name={name} value={value} onChange={onChange} className="bg-transparent border-b border-emerald-500 w-full outline-none text-lg py-1" />
      ) : (
        <p className="text-lg font-bold">{value}</p>
      )}
    </div>
  );
}