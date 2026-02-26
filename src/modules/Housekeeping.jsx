import React, { useState } from 'react';
// Importations des sous-modules
import HousekeepingDashboard from './housekeeping/HousekeepingDashboard';
import PlanningMenage from './housekeeping/PlanningMenage';
import StatutChambres from './housekeeping/StatutChambres';
import StocksLinge from './housekeeping/StocksLinge';
import MaintenanceSvc from './housekeeping/MaintenanceSvc';
import RapportsPerformance from './housekeeping/RapportsPerformance';

const Housekeeping = ({ onBack }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Ménage', icon: 'fa-th-large' },
    { id: 'planning', label: 'Planning Ménage', icon: 'fa-calendar-alt' },
    { id: 'statut', label: 'Statut des Chambres', icon: 'fa-bed' },
    { id: 'stocks', label: 'Stocks de Linge / Produits', icon: 'fa-box-open' },
    { id: 'maintenance', label: 'Maintenance', icon: 'fa-tools' },
    { id: 'rapports', label: 'Rapports de Performance', icon: 'fa-chart-line' },
  ];

  // Logique de rendu dynamique
  const renderContent = () => {
    switch (activeSubMenu) {
      case 'dashboard':  return <HousekeepingDashboard />;
      case 'planning':   return <PlanningMenage />;
      case 'statut':     return <StatutChambres />;
      case 'stocks':     return <StocksLinge />;
      case 'maintenance':return <MaintenanceSvc />;
      case 'rapports':   return <RapportsPerformance />;
      default:           return <HousekeepingDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-hostelia-dark text-white overflow-hidden">
      {/* Sidebar Housekeeping */}
      <nav className="w-80 bg-[#151c2c] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-green-600 transition-all group"
          >
            <i className="fas fa-arrow-left text-slate-400 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-xs font-black text-green-500 tracking-tighter uppercase font-inter">Service</h2>
            <h1 className="text-xl font-black tracking-widest font-inter">HOUSEKEEPING</h1>
          </div>
        </div>

        <ul className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              onClick={() => setActiveSubMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeSubMenu === item.id 
                ? 'bg-green-600 text-white font-bold shadow-xl shadow-green-600/20 translate-x-2' 
                : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${activeSubMenu === item.id ? 'scale-110' : 'opacity-50'}`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Info Statut Équipe */}
        <div className="mt-6 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Équipe en Service</p>
              <p className="text-xs text-slate-400 font-black">MATIN / SHIFT A</p>
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
            <p className="text-slate-500 font-medium italic mt-1 text-sm italic">Gestion de la propreté et de l'état des lieux</p>
          </div>
          <div className="bg-[#151c2c] px-6 py-4 rounded-[1.5rem] border border-white/5 text-slate-300 text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
            <i className="far fa-clock text-green-500 text-lg"></i>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {/* Contenu du sous-module */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Housekeeping;