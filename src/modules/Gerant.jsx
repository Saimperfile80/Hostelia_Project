import React, { useState } from 'react';
import DirectionDashboard from './gerant/DirectionDashboard';
import RapportsGlobaux from './gerant/RapportsGlobaux';
import FinanceBudget from './gerant/FinanceBudget';
import RHPersonnel from './gerant/RHPersonnel';
import StrategieTarifaire from './gerant/StrategieTarifaire';
import ParamsGlobaux from './gerant/ParamsGlobaux';
import Comptable from './gerant/Comptable'; 

const Gerant = ({ onBack }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Direction / KPIs', icon: 'fa-chart-line' },
    { id: 'rapports_globaux', label: 'Rapports Globaux', icon: 'fa-file-medical-alt' },
    { id: 'finance', label: 'Finance & Budget', icon: 'fa-wallet' },
    { id: 'rh', label: 'Personnel & RH', icon: 'fa-users-cog' },
    { id: 'strategie', label: 'Stratégie Tarifaire', icon: 'fa-chess-knight' },
    { id: 'comptable', label: 'Audit & Comptabilité', icon: 'fa-calculator' }, // <--- Nouveau menu
    { id: 'params_globaux', label: 'Paramètres Globaux', icon: 'fa-globe' },
  ];

  // Logique de rendu dynamique
  const renderContent = () => {
    switch (activeSubMenu) {
      case 'dashboard':         return <DirectionDashboard />;
      case 'rapports_globaux':  return <RapportsGlobaux />;
      case 'finance':           return <FinanceBudget />;
      case 'rh':                return <RHPersonnel />;
      case 'strategie':         return <StrategieTarifaire />;
      case 'comptable':         return <Comptable />; // <--- Nouvel appel
      case 'params_globaux':    return <ParamsGlobaux />;
      default:                  return <DirectionDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-hostelia-dark text-white overflow-hidden">
      {/* Sidebar Direction */}
      <nav className="w-80 bg-[#151c2c] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all group"
          >
            <i className="fas fa-arrow-left text-slate-400 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-xs font-black text-red-500 tracking-tighter uppercase">Haute</h2>
            <h1 className="text-xl font-black tracking-widest">DIRECTION</h1>
          </div>
        </div>

        <ul className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              onClick={() => setActiveSubMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeSubMenu === item.id 
                ? 'bg-red-600 text-white font-bold shadow-xl shadow-red-600/20 translate-x-2' 
                : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${activeSubMenu === item.id ? 'scale-110' : 'opacity-50'}`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Badge Administrateur */}
        <div className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase">Session Active</p>
              <p className="text-xs text-slate-400 truncate font-black tracking-widest">DIRECTEUR GÉNÉRAL</p>
            </div>
        </div>
      </nav>

      {/* Zone de travail Dynamique */}
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b0e14] via-[#0f172a] to-[#0b0e14]">
        <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              {menuItems.find(m => m.id === activeSubMenu)?.label}
            </h1>
            <p className="text-slate-500 font-medium italic mt-1 text-sm">Pilotage stratégique et supervision de l'établissement</p>
          </div>
          <div className="bg-[#151c2c] px-6 py-4 rounded-[1.5rem] border border-white/5 text-slate-300 text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
            <i className="far fa-calendar-alt text-red-500 text-lg"></i>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        {/* Appel du fichier module correspondant avec animation de montée */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Gerant;