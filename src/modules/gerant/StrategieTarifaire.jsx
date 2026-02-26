import React from 'react';

const StrategieTarifaire = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Contrôle du Yield Management */}
      <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Yield Management & Optimisation</h3>
            <p className="text-xs text-slate-500 font-medium">Ajustement automatique des tarifs selon l'occupation</p>
          </div>
          <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black text-slate-400 ml-2 uppercase">Mode Automatique</span>
            <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { label: "Indice de Demande", value: "--", icon: "trending_up", color: "text-red-500" },
            { label: "Prix Moyen Concurrents", value: "-- $", icon: "monitoring", color: "text-blue-400" },
            { label: "Prévision Occupation", value: "-- %", icon: "online_prediction", color: "text-emerald-500" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined ${item.color} text-xl`}>{item.icon}</span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
              </div>
              <p className="text-3xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Facteurs Externes & Influenceurs de Prix */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-red-500">hub</span>
            Facteurs d'Influence
          </h3>
          <div className="space-y-8">
            {[
              { label: "Demande OTA (Booking/Expedia)", status: "Calcul...", val: 0, color: "bg-red-500" },
              { label: "Vols entrants (Aéroport)", status: "Stable", val: 0, color: "bg-sky-500" },
              { label: "Météo Prévue (Week-end)", status: "Favorable", val: 0, color: "bg-amber-500" }
            ].map((factor, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span className="text-slate-400">{factor.label}</span>
                  <span className="text-white opacity-40">{factor.status}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${factor.color} w-0 transition-all duration-1000`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Calendrier des Événements & Saisons */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-outlined text-amber-500">event_note</span>
              Calendrier des Variations
            </h3>
            <button className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest">
              Ajouter un événement
            </button>
          </div>
          
          <div className="h-48 border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center group hover:border-red-500/20 transition-all cursor-pointer">
             <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-slate-700 group-hover:text-red-500 transition-colors mb-2">calendar_month</span>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                  Aucun événement tarifaire spécifique<br/>configuré pour cette période
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* 4. Tableau des Règles de Prix */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black text-sm uppercase tracking-widest">Règles de Majoration / Réduction</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Règle</th>
                <th className="px-8 py-5">Condition</th>
                <th className="px-8 py-5 text-center">Impact</th>
                <th className="px-8 py-5 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Initialisation du module stratégique...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StrategieTarifaire;