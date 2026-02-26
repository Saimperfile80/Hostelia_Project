import React from 'react';

const MaintenanceSvc = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Tableau de bord des tickets (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Tickets Ouverts", value: "0", color: "text-amber-500", icon: "pending_actions" },
          { label: "Urgences Critiques", value: "0", color: "text-red-500", icon: "priority_high" },
          { label: "Résolus (Ce mois)", value: "0", color: "text-emerald-500", icon: "task_alt" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className={`material-icons-outlined ${stat.color} text-3xl`}>{stat.icon}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Suivi technique</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 2. Barre d'outils et Filtres */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3">
          {['Tous', 'Électricité', 'Plomberie', 'Climatisation', 'Mobilier'].map((filter, i) => (
            <button key={i} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
              {filter}
            </button>
          ))}
        </div>
        <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
          <span className="material-icons-outlined text-sm">add_circle</span> Déclarer une panne
        </button>
      </div>

      {/* 3. Liste des Tickets de Maintenance */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons-outlined text-emerald-500 text-sm">engineering</span>
            Journal des interventions
          </h3>
          <div className="flex gap-4">
             <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-400 uppercase">Alertes en direct</span>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">ID Ticket</th>
                <th className="px-8 py-6">Emplacement</th>
                <th className="px-8 py-6">Problème / Description</th>
                <th className="px-8 py-6">Priorité</th>
                <th className="px-8 py-6 text-center">Assigné à</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide des tickets */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-icons-outlined text-6xl mb-4 text-slate-500">construction</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun ticket en attente</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase italic">"L'excellence, c'est quand tout fonctionne sans qu'on le remarque."</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Note de maintenance préventive */}
      <div className="p-8 rounded-[2.5rem] bg-emerald-600/5 border border-emerald-500/10 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <span className="material-icons-outlined text-3xl">verified</span>
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Maintenance Préventive</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl uppercase">
            Tous les systèmes critiques (Chauffage, Sécurité Incendie, Ascenseurs) sont à jour de leur révision périodique. 
            <span className="text-emerald-500 font-black ml-2 cursor-pointer hover:underline">Voir le calendrier →</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default MaintenanceSvc;