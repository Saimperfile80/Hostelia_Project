import React, { useState } from 'react';
// Importations des sous-modules
import StockDashboard from './stock/StockDashboard';
import Fournisseurs from './stock/Fournisseurs';
import BonsCommande from './stock/BonsCommande';
import ReceptionStock from './stock/ReceptionStock';
import InventaireStock from './stock/InventaireStock';
import RapportsCouts from './stock/RapportsCouts';

const Stock = ({ onBack }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Stock', icon: 'fa-boxes' },
    { id: 'fournisseurs', label: 'Fournisseurs', icon: 'fa-truck-loading' },
    { id: 'bons_commande', label: 'Bons de commande', icon: 'fa-file-signature' },
    { id: 'reception', label: 'Réception Stocks', icon: 'fa-dolly' },
    { id: 'inventaire', label: 'Inventaire', icon: 'fa-clipboard-list' },
    { id: 'couts', label: 'Rapports Coûts', icon: 'fa-coins' },
  ];

  // Rendu dynamique du contenu
  const renderContent = () => {
    switch (activeSubMenu) {
      case 'dashboard':     return <StockDashboard />;
      case 'fournisseurs':  return <Fournisseurs />;
      case 'bons_commande': return <BonsCommande />;
      case 'reception':     return <ReceptionStock />;
      case 'inventaire':    return <InventaireStock />;
      case 'couts':         return <RapportsCouts />;
      default:              return <StockDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-hostelia-dark text-white overflow-hidden">
      {/* Sidebar Approvisionnement */}
      <nav className="w-80 bg-[#151c2c] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-purple-600 transition-all group"
          >
            <i className="fas fa-arrow-left text-slate-400 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-xs font-black text-purple-500 tracking-tighter uppercase">Gestion</h2>
            <h1 className="text-xl font-black tracking-widest uppercase">STOCKS</h1>
          </div>
        </div>

        <ul className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              onClick={() => setActiveSubMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeSubMenu === item.id 
                ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-600/20 translate-x-2' 
                : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${activeSubMenu === item.id ? 'scale-110' : 'opacity-50'}`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Status Logistique */}
        <div className="mt-6 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Entrepôt Principal</p>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Prochaine livraison : Aujourd'hui</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b0e14] via-[#0f172a] to-[#0b0e14]">
        <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              {menuItems.find(m => m.id === activeSubMenu)?.label}
            </h1>
            <p className="text-slate-500 font-medium italic mt-1 text-sm">Contrôle des flux, fournisseurs et inventaires</p>
          </div>
          
          <div className="flex gap-4">
              <div className="bg-[#151c2c] px-6 py-4 rounded-[1.5rem] border border-white/5 text-slate-300 text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                <i className="fas fa-warehouse text-purple-500 text-lg"></i>
                Stock Central
              </div>
          </div>
        </header>

        {/* Contenu Dynamique */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Stock;