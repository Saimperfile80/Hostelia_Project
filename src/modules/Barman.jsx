import React, { useState, useEffect } from 'react';
import DashboardFB from './barman/DashboardFB';
import PrendreCommande from './barman/PrendreCommande';
import MenuCarte from './barman/MenuCarte';
import StocksFB from './barman/StocksFB';
import FacturationFB from './barman/FacturationFB';
import RapportsVenteFB from './barman/RapportsVenteFB';
import GestionTables from './barman/GestionTables'; // Nouveau module

const Barman = ({ onBack }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');
  const [dailySales, setDailySales] = useState(0);

  // Calcul dynamique des ventes du jour
  const fetchDailySales = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/fb/orders');
      const orders = await res.json();
      const today = new Date().toISOString().split('T')[0];
      const total = orders
        .filter(o => o.timestamp.startsWith(today))
        .reduce((acc, o) => acc + o.total_amount, 0);
      setDailySales(total);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchDailySales();
    const interval = setInterval(fetchDailySales, 30000); // Update chaque 30s
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord F&B', icon: 'fa-utensils' },
    { id: 'commande', label: 'Prendre commande', icon: 'fa-plus-circle' },
    { id: 'tables', label: 'Gestion des Tables', icon: 'fa-table' }, // Nouveau
    { id: 'carte', label: 'Menu / Carte', icon: 'fa-book-open' },
    { id: 'stocks_fb', label: 'Stocks Boissons & Ingrédients', icon: 'fa-wine-bottle' },
    { id: 'facturation_fb', label: 'Facturation F&B', icon: 'fa-file-invoice' },
    { id: 'rapports_fb', label: 'Rapports de vente', icon: 'fa-chart-bar' },
  ];

  const renderContent = () => {
    switch (activeSubMenu) {
      case 'dashboard':      return <DashboardFB />;
      case 'commande':       return <PrendreCommande />;
      case 'tables':         return <GestionTables />; // Nouveau
      case 'carte':          return <MenuCarte />;
      case 'stocks_fb':      return <StocksFB />;
      case 'facturation_fb': return <FacturationFB />;
      case 'rapports_fb':    return <RapportsVenteFB />;
      default:               return <DashboardFB />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0e14] text-white overflow-hidden">
      <nav className="w-80 bg-[#151c2c] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-all group shadow-lg">
            <i className="fas fa-arrow-left text-slate-400 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase">Service</h2>
            <h1 className="text-lg font-black tracking-tighter uppercase">BAR & RESTO</h1>
          </div>
        </div>

        <ul className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <li key={item.id} onClick={() => setActiveSubMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeSubMenu === item.id ? 'bg-orange-600 text-white font-bold shadow-xl shadow-orange-600/20 translate-x-2' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
              <i className={`fas ${item.icon} w-5 text-center ${activeSubMenu === item.id ? 'scale-110' : 'opacity-50'}`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b0e14] via-[#0f172a] to-[#0b0e14]">
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
              {menuItems.find(m => m.id === activeSubMenu)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-6 bg-[#151c2c] p-4 rounded-3xl border border-white/5 shadow-xl">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ventes Jour</p>
                <p className="text-xl font-black text-orange-500">{dailySales.toFixed(2)} $</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center">
                <i className="fas fa-cash-register text-orange-500"></i>
             </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Barman;