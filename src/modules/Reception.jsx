import React, { useState } from 'react';
import Dashboard from './reception/Dashboard';
import Reservations from './reception/Reservations';
import Inventory from './reception/Inventory';
import CheckInOut from './reception/CheckInOut';
import Facturation from './reception/Facturation';
import Demandes from './reception/Demandes';
import Rapports from './reception/Rapports';
import Tarifs from './reception/Tarifs';

// AJOUT DES IMPORTS POUR ÉVITER LA PAGE VIDE
import HistoriqueTransactions from './caissier/HistoriqueTransactions'; 
import RapportsFinanciers from './caissier/RapportsFinanciers';

const Reception = ({ onBack }) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({ arrivals: 0, departures: 0, available: 0, dirty: 0 });

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'dashboard':    return <Dashboard stats={stats} />;
      case 'reservations': return <Reservations />;
      case 'chambres':     return <Inventory />;
      case 'checkin':      return <CheckInOut />;
      case 'factures':     return <Facturation setMenu={setActiveMenu} />; 
      
      // CES CAS DOIVENT CORRESPONDRE AUX SETMENU DE FACTURATION
      case 'historique-transactions': return <HistoriqueTransactions />; 
      case 'rapports-financiers':    return <RapportsFinanciers />;    
      
      case 'demandes':     return <Demandes />;
      case 'rapports':     return <Rapports />;
      case 'tarifs':       return <Tarifs />;
      default:             return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b1120] text-white overflow-hidden">
      {/* Sidebar */}
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
                activeMenu === item.id || (activeMenu === 'historique-transactions' && item.id === 'factures')
                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Zone principale */}
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-b from-[#0b1120] to-[#0f172a]">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              {activeMenu === 'dashboard' ? 'Aperçu général' : 
               activeMenu === 'historique-transactions' ? 'Historique Caisse' :
               activeMenu === 'rapports-financiers' ? 'Rapports Financiers' :
               activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
            </h1>
            <p className="text-slate-500 font-medium">Gestion Electron Desktop Hostelia</p>
          </div>
          <div className="bg-[#151c2c] px-6 py-3 rounded-2xl border border-white/5 text-slate-300 text-sm font-bold shadow-xl">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {renderActiveModule()}
      </main>
    </div>
  );
};

export default Reception;