import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Recycle, LogOut, ArrowRight, HardDrive, ShieldAlert, 
  Truck, X, CheckCircle2, Zap, ShieldCheck, BarChart3, Globe 
} from 'lucide-react';

export default function Services() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const savedName = localStorage.getItem('registered_name');
    if (loginStatus !== 'true') navigate('/login');
    if (savedName) setUserName(savedName);
  }, [navigate]);

  const confirmLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 relative">
      
      {/* --- NEW TECHNICAL BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000" 
          alt="Technical Background"
          className="w-full h-full object-cover opacity-15 fixed"
        />
        {/* Deep Radial Overlay for contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-950/20 via-slate-950/80 to-slate-950"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
          <Recycle size={28} /> 
          <span className="tracking-tighter uppercase italic">EcoCycle</span>
        </div>

        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/profile')} className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 cursor-pointer hover:border-emerald-500/50 transition-all group">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 font-black">{userName.charAt(0).toUpperCase()}</div>
            <div className="hidden md:block">
              <p className="text-[10px] text-slate-500 font-black uppercase leading-none">Account</p>
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{userName}</p>
            </div>
          </div>
          <button onClick={() => setIsLogoutModalOpen(true)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Services</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">Select a professional disposal method for your e-waste below.</p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <ServiceCard icon={<Recycle />} title="Recycling" desc="Safe consumer electronics processing." onBook={() => {setSelectedService("Recycling"); setIsBookingOpen(true);}} />
          <ServiceCard icon={<HardDrive />} title="Data Wiping" desc="Certified permanent data destruction." onBook={() => {setSelectedService("Data Wiping"); setIsBookingOpen(true);}} />
          <ServiceCard icon={<ShieldAlert />} title="Asset Disposal" desc="Enterprise-grade hardware solutions." onBook={() => {setSelectedService("Asset Disposal"); setIsBookingOpen(true);}} />
          <ServiceCard icon={<Truck />} title="Doorstep Pickup" desc="Convenient home and office collection." onBook={() => {setSelectedService("Pickup"); setIsBookingOpen(true);}} />
        </div>

        {/* --- ADDED: VALUE PROPOSITION SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 border-t border-slate-900/50">
          <FeatureItem icon={<Zap className="text-yellow-400" />} title="Rapid Response" desc="Booking requests are typically confirmed within 24 hours." />
          <FeatureItem icon={<ShieldCheck className="text-emerald-400" />} title="Secure Logistics" desc="GPS-tracked vehicles ensure your hardware stays safe until arrival." />
          <FeatureItem icon={<BarChart3 className="text-blue-400" />} title="Impact Reports" desc="Receive digital certificates showing your CO2 savings after recycling." />
        </div>

        {/* --- ADDED: GLOBAL REACH SECTION --- */}
        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] text-center mb-20 backdrop-blur-md">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe size={32} />
          </div>
          <h2 className="text-3xl font-black mb-4">Certified Recycling Network</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            We partner with ISO 14001 certified facilities globally to ensure that zero e-waste ends up in landfills. Your old gadgets become the raw materials for tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="font-bold tracking-widest uppercase">ISO Certified</span>
            <span className="font-bold tracking-widest uppercase">E-Steward</span>
            <span className="font-bold tracking-widest uppercase">Green Guard</span>
          </div>
        </div>
      </main>

      {/* --- LOGOUT MODAL --- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsLogoutModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2 text-white">Confirm Logout</h2>
              <p className="text-slate-400 text-sm mb-8">Are you sure you want to exit your session?</p>
              <div className="flex gap-4">
                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 bg-slate-800 py-3 rounded-xl font-bold hover:bg-slate-700 transition">Cancel</button>
                <button onClick={confirmLogout} className="flex-1 bg-rose-500 py-3 rounded-xl font-black hover:bg-rose-600 transition shadow-lg shadow-rose-500/20">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper Components */
function ServiceCard({ icon, title, desc, onBook }) {
  return (
    <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/60 hover:border-emerald-500/50 transition-all group backdrop-blur-lg">
      <div className="text-emerald-400 mb-6 bg-emerald-400/10 w-fit p-4 rounded-2xl group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{desc}</p>
      <button onClick={onBook} className="flex items-center gap-2 text-emerald-400 font-bold text-sm hover:gap-4 transition-all">Book Now <ArrowRight size={16}/></button>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="text-center md:text-left">
      <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}