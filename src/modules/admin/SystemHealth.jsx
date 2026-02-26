import React, { useState, useEffect } from 'react';

const SystemHealth = () => {
  const [stats, setStats] = useState({
    cpu: 0, ram: 0, disk: 0, db_latency: 0, db_status: "En attente", api_status: "En attente"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/system/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) { console.error("Erreur télémétrie"); }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Mise à jour auto toutes les 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Serveurs Core", status: stats.api_status, color: "text-emerald-500", icon: "dns" },
          { label: "Base de Données", status: stats.db_status, color: "text-emerald-500", icon: "database" },
          { label: "Services API", status: "Opérationnel", color: "text-blue-500", icon: "api" }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                <span className="material-icons-round text-3xl">{item.icon}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Uptime 24h</span>
                <span className="text-xs font-bold text-white tracking-tighter">100%</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{item.label}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${item.color === 'text-emerald-500' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
              <h3 className="text-xl font-black text-white uppercase">{item.status}</h3>
            </div>
            <div className="absolute -right-4 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <span className="material-icons-round text-[120px]">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Monitoring Ressources RÉEL */}
        <div className="bg-[#121721] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
              <span className="material-icons-round text-blue-500">insights</span>
              Charge Ressources Système
            </h3>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Temps de réponse: {stats.db_latency}ms</span>
          </div>
          
          <div className="space-y-6">
            {/* Barre CPU */}
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                <span>Utilisation CPU</span>
                <span>{stats.cpu}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stats.cpu}%` }}></div>
              </div>
            </div>
            {/* Barre RAM */}
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                <span>Mémoire RAM</span>
                <span>{stats.ram}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.ram}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Journal des Événements */}
        <div className="bg-[#121721] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/[0.01]">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
              <span className="material-icons-round text-blue-500">terminal</span>
              Logs Système Récents
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] p-6 space-y-3">
             <div className="text-[10px] font-mono text-emerald-500">[OK] Base de données Hostelia synchronisée</div>
             <div className="text-[10px] font-mono text-blue-500">[INFO] Nouveau scan des ressources effectué</div>
             <div className="text-[10px] font-mono text-slate-500">[LOG] Session Root Admin active</div>
          </div>
          <div className="p-6 border-t border-white/5">
            <button className="w-full py-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all">
              Consulter l'historique complet
            </button>
          </div>
        </div>
      </div>

      {/* 4. Network Health */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <span className="material-icons-round text-3xl">language</span>
           </div>
           <div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm mb-1 italic">Latence Réseau</h4>
              <p className="text-xs text-slate-500 font-medium">Analyse des flux vers le Cloud Hostelia : {stats.db_latency}ms</p>
           </div>
        </div>
        <div className="flex gap-4 items-end">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className={`w-1.5 rounded-full ${i < 4 ? 'bg-blue-500' : 'bg-slate-800'}`} style={{ height: `${i * 6}px` }}></div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default SystemHealth;