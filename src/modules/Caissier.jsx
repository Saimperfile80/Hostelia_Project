import React, { useState } from 'react';
// Importations anticipées des sous-modules Caisse
import DashboardCaisse from './caissier/DashboardCaisse';
import Encaissement from './caissier/Encaissement';
import ClotureCaisse from './caissier/ClotureCaisse';
import HistoriqueTransactions from './caissier/HistoriqueTransactions';
import RapportsFinanciers from './caissier/RapportsFinanciers';
import ModesPaiement from './caissier/ModesPaiement';

const Caissier = ({ onBack }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord Caisse', icon: 'fa-cash-register' },
    { id: 'encaissement', label: 'Encaissement / Paiements', icon: 'fa-money-bill-wave' },
    { id: 'cloture', label: 'Clôture de caisse', icon: 'fa-lock' },
    { id: 'historique', label: 'Historique Transactions', icon: 'fa-history' },
    { id: 'rapports_fin', label: 'Rapports Financiers', icon: 'fa-file-invoice-dollar' },
    { id: 'params_monnaie', label: 'Modes de paiement', icon: 'fa-credit-card' },
  ];

  // Logique de rendu dynamique
  const renderContent = () => {
    switch (activeSubMenu) {
      case 'dashboard':      return <DashboardCaisse />;
      case 'encaissement':   return <Encaissement />;
      case 'cloture':        return <ClotureCaisse />;
      case 'historique':     return <HistoriqueTransactions />;
      case 'rapports_fin':    return <RapportsFinanciers />;
      case 'params_monnaie': return <ModesPaiement />;
      default:               return <DashboardCaisse />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0e14] text-white overflow-hidden">
      {/* Sidebar - Univers Émeraude */}
      <nav className="w-80 bg-[#151c2c] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-all group shadow-lg"
          >
            <i className="fas fa-arrow-left text-slate-400 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase">Finance</h2>
            <h1 className="text-lg font-black tracking-tighter uppercase">La Caisse</h1>
          </div>
        </div>

        <ul className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              onClick={() => setActiveSubMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeSubMenu === item.id 
                ? 'bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 translate-x-2' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${activeSubMenu === item.id ? 'scale-110' : 'opacity-50'}`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Status de la session de caisse */}
        <div className="mt-6 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex items-center gap-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Session Actuelle</p>
            <p className="text-[11px] font-bold text-emerald-500">Ouverte à 08:00</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b0e14] via-[#0f172a] to-[#0b0e14]">
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
              {menuItems.find(m => m.id === activeSubMenu)?.label}
            </h2>
            <p className="text-slate-500 font-medium italic mt-1">Contrôle des flux financiers et encaissements</p>
          </div>
          
          <div className="flex items-center gap-6 bg-[#151c2c] p-4 rounded-3xl border border-white/5 shadow-xl">
             <div className="text-right">
                
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center">
                <i className="fas fa-wallet text-emerald-500"></i>
             </div>
          </div>
        </header>

        {/* Injection dynamique du sous-module avec animation */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Caissier;