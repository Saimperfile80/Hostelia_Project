import React, { useState } from 'react';
// Importations des sous-modules IT
import SystemHealth from './admin/SystemHealth';
import UserManagement from './admin/UserManagement';
import SecurityAudit from './admin/SecurityAudit';
import GlobalConfig from './admin/GlobalConfig';
import IntegrationsPOS from './admin/IntegrationsPOS';
import BackupRestore from './admin/BackupRestore';

const AdminIT = ({ onBack }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Système Health', icon: 'fa-heartbeat' },
    { id: 'users', label: 'Utilisateurs & Rôles', icon: 'fa-user-lock' },
    { id: 'security', label: 'Sécurité & Audit', icon: 'fa-shield-alt' },
    { id: 'config', label: 'Configuration Globale', icon: 'fa-cogs' },
    { id: 'integrations', label: 'Intégrations (POS, API)', icon: 'fa-plug' },
    { id: 'backup', label: 'Sauvegarde / Restauration', icon: 'fa-database' },
  ];

  // Sélecteur de contenu dynamique
  const renderContent = () => {
    switch (activeSubMenu) {
      case 'dashboard':    return <SystemHealth />;
      case 'users':        return <UserManagement />;
      case 'security':     return <SecurityAudit />;
      case 'config':       return <GlobalConfig />;
      case 'integrations': return <IntegrationsPOS />;
      case 'backup':       return <BackupRestore />;
      default:             return <SystemHealth />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-white overflow-hidden">
      {/* Sidebar Technique */}
      <nav className="w-80 bg-[#111827] border-r border-white/5 p-8 flex flex-col shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all group"
          >
            <i className="fas fa-arrow-left text-slate-500 group-hover:text-white"></i>
          </button>
          <div>
            <h2 className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase">Control Center</h2>
            <h1 className="text-xl font-black tracking-tighter uppercase">ADMIN IT</h1>
          </div>
        </div>

        <ul className="space-y-1 flex-1">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              onClick={() => setActiveSubMenu(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeSubMenu === item.id 
                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 translate-x-2' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${activeSubMenu === item.id ? 'scale-110' : 'opacity-40'}`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* System Version Indicator */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">System Engine v4.0</p>
            </div>
            <p className="text-[9px] text-slate-600 font-bold uppercase">Uptime: 99.9%</p>
          </div>
        </div>
      </nav>

      {/* Main Command Center Area */}
      <main className="flex-1 p-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#111827] via-[#0a0f1a] to-[#0a0f1a]">
        <header className="mb-10 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="h-px w-8 bg-blue-500"></span>
               <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Module Administration</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              {menuItems.find(m => m.id === activeSubMenu)?.label}
            </h1>
          </div>
          
          <div className="flex gap-4">
              <div className="bg-[#111827] px-5 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <i className="fas fa-terminal text-blue-500"></i>
                Root Session
              </div>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <div className="animate-in fade-in zoom-in-95 duration-500">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminIT;