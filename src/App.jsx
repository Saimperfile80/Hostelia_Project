import React, { useState, createContext, useContext, useEffect } from 'react';

// Tes importations restent les mêmes
import Reception from './modules/Reception';
import Housekeeping from './modules/Housekeeping';
import Barman from './modules/Barman';
import Stock from './modules/Stock';
import Caissier from './modules/Caissier';
import Gerant from './modules/Gerant';
import AdminIT from './modules/AdminIT';

// 1. CRÉATION DU CONTEXT DIRECTEMENT ICI
const SettingsContext = createContext();

function AppContent() {
  const [currentActor, setCurrentActor] = useState(null);
  
  // On récupère les réglages avec une sécurité (|| {})
  const context = useContext(SettingsContext);
  const settings = context?.settings || { hotel_name: 'HOSTELIA', currency: 'USD ($)' };

  const actors = [
    { id: 'reception', name: 'Réceptionniste', icon: 'fa-concierge-bell', color: 'bg-blue-600', component: Reception },
    { id: 'housekeeping', name: 'Ménage / Personnel', icon: 'fa-broom', color: 'bg-green-600', component: Housekeeping },
    { id: 'barman', name: 'Bar & Restaurant', icon: 'fa-utensils', color: 'bg-orange-600', component: Barman },
    { id: 'stock', name: 'Approvisionnement', icon: 'fa-boxes', color: 'bg-purple-600', component: Stock },
    { id: 'caissier', name: 'Caisse', icon: 'fa-cash-register', color: 'bg-emerald-600', component: Caissier },
    { id: 'gerant', name: 'Direction Générale', icon: 'fa-user-tie', color: 'bg-red-600', component: Gerant },
    { id: 'admin', name: 'Admin Système / IT', icon: 'fa-user-shield', color: 'bg-slate-700', component: AdminIT },
  ];

  const goBack = () => setCurrentActor(null);

  if (currentActor) {
    const activeActor = actors.find(a => a.id === currentActor);
    const ComponentToRender = activeActor ? activeActor.component : null;
    return (
      <div className="h-screen w-full bg-hostelia-dark">
        {ComponentToRender ? <ComponentToRender onBack={goBack} /> : <div>Erreur de chargement</div>}
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0f18] p-12 overflow-y-auto text-white">
      <div className="text-center mb-16">
        <div className="inline-block bg-[#d4af37] text-slate-900 px-4 py-1 rounded-full font-black text-xs mb-4">
          V 2.0 - {settings.currency || "USD ($)"}
        </div>
        <h1 className="text-6xl font-black text-white mb-2 tracking-tighter uppercase">
            {settings.hotel_name || "HOSTELIA"}
        </h1>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">Système de Gestion Hôtelière</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {actors.map(actor => (
          <div 
            key={actor.id}
            onClick={() => setCurrentActor(actor.id)}
            className="group bg-[#151c2c] border border-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:border-blue-500/50 transition-all hover:-translate-y-2 shadow-2xl"
          >
            <div className={`${actor.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <i className={`fas ${actor.icon} text-xl text-white`}></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{actor.name}</h3>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Accès Professionnel</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. LE PROVIDER QUI ENToure TOUT
export default function App() {
  const [settings, setSettings] = useState({ hotel_name: 'HOSTELIA', currency: 'USD ($)' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (e) { console.log("Backend non atteint, mode par défaut"); }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      <AppContent />
    </SettingsContext.Provider>
  );
}
