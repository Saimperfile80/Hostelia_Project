import React from 'react';

const HousekeepingDashboard = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Statistiques Flash (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Chambres Sales", value: "0", color: "text-red-500", icon: "cleaning_services" },
          { label: "En cours de ménage", value: "0", color: "text-orange-500", icon: "hourglass_empty" },
          { label: "Inspectées / Prêtes", value: "0", color: "text-green-500", icon: "check_circle" },
          { label: "Alertes Maintenance", value: "0", color: "text-amber-500", icon: "build" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-icons-round ${kpi.color} text-3xl`}>{kpi.icon}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Temps réel</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{kpi.label}</p>
            <h3 className="text-5xl font-black text-white">{kpi.value}</h3>
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-icons-round text-[120px]">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. État d'occupation du jour */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons-round text-green-500">analytics</span>
              Flux des Chambres (Journée)
            </h3>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Arrivées : 0</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Départs : 0</span>
               </div>
            </div>
          </div>
          
          {/* Zone graphique vide */}
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <span className="material-icons-round text-5xl text-slate-800 mb-4">insights</span>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">En attente de mouvements</p>
          </div>
        </div>

        {/* 3. Activité de l'équipe */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-icons-round text-green-500">groups</span>
            Équipe en service
          </h3>
          
          <div className="space-y-6 flex-1">
             {/* État vide équipe */}
             <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <span className="material-icons-round text-slate-700">person_off</span>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                   Aucun agent de ménage<br/>actuellement assigné
                </p>
             </div>
          </div>

          <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all">
            Gérer les affectations
          </button>
        </div>

      </div>

      {/* 4. Alertes Critiques / Maintenance */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] p-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <span className="material-icons-round text-3xl">priority_high</span>
           </div>
           <div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm mb-1 text-amber-500">Priorités du moment</h4>
              <p className="text-xs text-slate-500 font-medium">Aucune urgence signalée. Toutes les chambres prioritaires sont sous contrôle.</p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default HousekeepingDashboard;