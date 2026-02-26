import React from 'react';

const DirectionDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. KPIs Stratégiques (Chiffres Clés) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Taux d'occupation", value: "--%", color: "text-white", icon: "analytics" },
          { label: "Revenu Total (F&B + Logement)", value: "-- $", color: "text-emerald-400", icon: "payments" },
          { label: "RevPAR (Rev. par chambre)", value: "-- $", color: "text-blue-400", icon: "leaderboard" },
          { label: "Alertes Audit", value: "--", color: "text-red-500", icon: "gavel" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl group hover:border-red-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-red-500 transition-colors">{kpi.label}</p>
              <span className="material-symbols-outlined text-slate-600 text-sm">{kpi.icon}</span>
            </div>
            <p className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</p>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-0 transition-all duration-1000"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Performance Mensuelle (Graphique Placeholder) */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-outlined text-red-500">trending_up</span>
              Courbe de Croissance
            </h3>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">LOGEMENT</span>
               <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">RESTAURATION</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em] italic animate-pulse">Calcul des tendances en cours...</p>
          </div>
        </div>

        {/* 3. Journal d'Audit & Activités Critiques */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-red-500">history_edu</span>
            Journal d'Audit
          </h3>
          <div className="space-y-6 flex-1">
             {/* État vide pour le journal d'audit */}
             <div className="flex flex-col items-center justify-center h-full opacity-20">
                <span className="material-symbols-outlined text-5xl mb-2">fact_check</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Aucune anomalie détectée</p>
             </div>
          </div>
          <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all">
            Télécharger Log Complet
          </button>
        </div>
      </div>

      {/* 4. Tableau des Objectifs de la Direction */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black text-sm uppercase tracking-widest">Récapitulatif de la Performance par Département</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Département</th>
                <th className="px-8 py-5">Responsable</th>
                <th className="px-8 py-5 text-center">Objectif (%)</th>
                <th className="px-8 py-5 text-center">Actuel</th>
                <th className="px-8 py-5 text-right">Ecart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Données stratégiques en attente de synchronisation</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DirectionDashboard;