import React, { useState } from 'react';
// Importations de tous les modules (fichiers que nous allons créer)
import Dashboard from './reception/Dashboard';
import Reservations from './reception/Reservations';
import Inventory from './reception/Inventory';
import CheckInOut from './reception/CheckInOut';
import Facturation from './reception/Facturation';
import Demandes from './reception/Demandes';
import Rapports from './reception/Rapports';
import Tarifs from './reception/Tarifs';

const Reception = ({ onBack }) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({ arrivals: 0, departures: 0, available: 0, dirty: 0 });

  // Fonction de rendu dynamique pour basculer entre les fichiers
  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'dashboard':    return <Dashboard stats={stats} />;
      case 'reservations': return <Reservations />;
      case 'chambres':     return <Inventory />;
      case 'checkin':      return <CheckInOut />;
      case 'factures':     return <Facturation />;
      case 'demandes':     return <Demandes />;
      case 'rapports':     return <Rapports />;
      case 'tarifs':       return <Tarifs />;
      default:             return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-hostelia-dark text-white overflow-hidden">
      {/* Sidebar Interne Réception */}
      <nav className="w-80 bg-[#151c2c] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-10 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all group"
          >
            <i className="fas fa-arrow-left text-slate-400 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-sm font-black text-blue-400 tracking-tighter uppercase">Espace</h2>
            <h1 className="text-xl font-black tracking-widest text-white">RÉCEPTION</h1>
          </div>
        </div>

        <ul className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-th-large' },
            { id: 'reservations', label: 'Réservations', icon: 'fa-calendar-check' },
            { id: 'chambres', label: 'Chambres / Inventaire', icon: 'fa-bed' },
            { id: 'checkin', label: 'Check-in / Check-out', icon: 'fa-key' },
            { id: 'factures', label: 'Facturation / Paiement', icon: 'fa-file-invoice-dollar' },
            { id: 'demandes', label: 'Demandes client', icon: 'fa-hand-holding-heart' },
            { id: 'rapports', label: 'Rapports réception', icon: 'fa-chart-line' },
            { id: 'tarifs', label: 'Paramètres tarifs', icon: 'fa-tags' },
          ].map(item => (
            <li 
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all text-sm ${
                activeMenu === item.id 
                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Agent Connecté</p>
            <p className="text-xs text-slate-400 truncate font-medium">Réceptionniste Principal</p>
        </div>
      </nav>

      {/* Zone de travail Dynamique */}
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-b from-[#0b1120] to-[#0f172a]">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              {activeMenu === 'dashboard' ? 'Aperçu général' : 
               activeMenu === 'chambres' ? 'Inventaire Chambres' :
               activeMenu === 'checkin' ? 'Check-in / Out' :
               activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
            </h1>
            <p className="text-slate-500 font-medium">Gestion et suivi des opérations de réception</p>
          </div>
          <div className="bg-[#151c2c] px-6 py-3 rounded-2xl border border-white/5 text-slate-300 text-sm font-bold shadow-xl">
            <i className="far fa-calendar-alt mr-2 text-blue-400"></i>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Affichage du module actif */}
        {renderActiveModule()}
      </main>
    </div>
  );
};

export default Reception;