import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ArrowRight, Leaf, ShieldCheck, Globe, Zap, BarChart3, Clock } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000" 
          alt="Circuit Board"
          className="w-full h-full object-cover opacity-30 fixed"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/40 to-slate-950"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="z-50 p-6 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-2xl">
          <Recycle size={32} />
          <span className="tracking-tighter uppercase italic">EcoCycle</span>
        </div>
        <div className="flex gap-4">
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate('/login')} className="font-bold text-slate-400 hover:text-white transition">Login</button>
              <button onClick={() => navigate('/register')} className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-full font-black text-sm hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">Get Started</button>
            </>
          ) : (
            <button onClick={() => navigate('/services')} className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-full font-black text-sm hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">Dashboard</button>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8 text-emerald-400 text-xs font-black tracking-widest uppercase">
          <Leaf size={14} /> Towards a Zero-Waste Future
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[0.9]">
          SUSTAINABLE <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-500">
            WASTE MANAGEMENT
          </span>
        </h1>
        
        <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl mb-12">
          By 2050, global waste levels will reach 3.4 billion tonnes per year. Join us in making a difference today.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => navigate(isLoggedIn ? '/services' : '/register')}
            className="group flex items-center gap-3 bg-emerald-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-400 transition-all shadow-2xl active:scale-95"
          >
            Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button onClick={() => navigate('/services')} className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all">
            Our Services
          </button>
        </div>
      </main>

      {/* --- STATISTICS SECTION (As per your request) --- */}
      <section className="relative z-10 container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard value="63M" label="Tonnes of Waste Managed" color="emerald" />
        <StatCard value="2026" label="Target Sustainability Year" color="yellow" />
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4 text-emerald-400">Why it matters?</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Proper disposal of e-waste prevents toxic materials from damaging our environment and human health. Every device recycled is a step toward a cleaner planet.
          </p>
        </div>
      </section>

      {/* --- OUR PROCESS SECTION --- */}
      <section className="relative z-10 container mx-auto px-6 py-24 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Our <span className="text-emerald-400">Process</span></h2>
          <p className="text-slate-500">Recycling made simple for everyone.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <ProcessStep 
            number="01" 
            icon={<Zap />} 
            title="Book Request" 
            desc="Schedule a pickup via our portal in seconds." 
          />
          <ProcessStep 
            number="02" 
            icon={<ShieldCheck />} 
            title="Secure Pickup" 
            desc="Our team ensures safe transport and data security." 
          />
          <ProcessStep 
            number="03" 
            icon={<BarChart3 />} 
            title="Track Impact" 
            desc="See your contribution and earn green rewards." 
          />
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-900 pt-20 pb-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-2xl">
              <Recycle size={32} />
              <span className="tracking-tighter uppercase italic">EcoCycle</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Leading the transition to a circular economy. We make e-waste recycling secure, rewarding, and accessible for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <FooterLinks title="Platform" links={["Services", "About Us", "Our Process", "Sustainability"]} />
          <FooterLinks title="Support" links={["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"]} />

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-black text-white uppercase tracking-widest text-xs">Contact</h4>
            <p className="text-slate-500 text-sm">support@ecocycle.com</p>
            <p className="text-slate-500 text-sm">+1 (555) 000-GREEN</p>
            <div className="flex gap-4 pt-2">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors border border-slate-800">
                <Globe size={18} />
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors border border-slate-800">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-10 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-xs font-medium">
            © 2026 EcoCycle Management. All rights reserved. Made with 💚 for the Planet.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Sub-components for cleaner code */

function StatCard({ value, label, color }) {
  const colorClass = color === 'emerald' ? 'text-emerald-400' : 'text-yellow-500';
  return (
    <div className="bg-slate-900/80 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-sm text-center md:text-left transition-transform hover:-translate-y-2">
      <h2 className={`text-6xl font-black mb-2 ${colorClass}`}>{value}</h2>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{label}</p>
    </div>
  );
}

function ProcessStep({ number, icon, title, desc }) {
  return (
    <div className="relative group text-center">
      <div className="text-8xl font-black text-slate-900 absolute -top-10 left-1/2 -translate-x-1/2 -z-10 group-hover:text-emerald-950 transition-colors">
        {number}
      </div>
      <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
        {React.cloneElement(icon, { size: 30 })}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div className="space-y-4">
      <h4 className="font-black text-white uppercase tracking-widest text-xs">{title}</h4>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors text-sm">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}