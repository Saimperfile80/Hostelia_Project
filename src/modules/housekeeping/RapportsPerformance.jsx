import React from 'react';

const RapportsPerformance = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Sélecteur de Période & Export */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
            <span className="material-icons-round text-2xl">analytics</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Analytique Housekeeping</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Performance opérationnelle & Qualité</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-slate-400 outline-none focus:border-green-500 transition-all">
            <option>7 derniers jours</option>
            <option>Mois en cours</option>
            <option>Trimestre</option>
          </select>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2">
            <span className="material-icons-round text-sm">ios_share</span> Exporter PDF
          </button>
        </div>
      </div>

      {/* 2. KPIs de Performance Global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Temps Moyen / Chambre", value: "0 min", icon: "timer", color: "text-blue-400" },
          { label: "Score Qualité Moyen", value: "0.0", icon: "verified_user", color: "text-green-400" },
          { label: "Taux de Conformité", value: "0%", icon: "fact_check", color: "text-purple-400" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-8 rounded-[2rem] border border-white/5 shadow-xl group hover:border-green-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className={`material-icons-round ${kpi.color} text-3xl`}>{kpi.icon}</span>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Objectif 100%</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{kpi.label}</p>
            <p className="text-3xl font-black text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 3. Graphique de Productivité (Placeholder) */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl overflow-hidden relative">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white mb-10">
            <span className="material-icons-round text-green-500">trending_up</span>
            Volume de nettoyage hebdomadaire
          </h3>
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
             <span className="material-icons-round text-5xl text-slate-800 mb-4">bar_chart</span>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">En attente de données historiques</p>
          </div>
        </div>

        {/* 4. Classement Performance Équipe */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white mb-8">
            <span className="material-icons-round text-green-500">military_tech</span>
            Top Performance Agents
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
               <span className="material-icons-round text-slate-500">person_search</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed">
               Les statistiques individuelles<br/>seront affichées ici
            </p>
          </div>
        </div>

      </div>

      {/* 5. Flux d'activité récent (Audit Trail) */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons-round text-green-500">history</span>
            Journal d'audit qualité récent
          </h3>
        </div>
        <div className="p-12 text-center border-t border-white/5">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Aucune inspection enregistrée pour le moment</p>
        </div>
      </div>

    </div>
  );
};

export default RapportsPerformance;