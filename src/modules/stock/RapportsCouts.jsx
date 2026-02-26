import React from 'react';

const RapportsCouts = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Sélecteur de Période & Export */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <span className="material-icons-round text-2xl">payments</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Analyse des Coûts</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Suivi financier des approvisionnements</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-slate-400 outline-none focus:border-purple-500 transition-all">
            <option>Mois en cours</option>
            <option>Dernier Trimestre</option>
            <option>Année Fiscale</option>
          </select>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2">
            <span className="material-icons-round text-sm">download</span> Rapport Complet
          </button>
        </div>
      </div>

      {/* 2. KPIs Financiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Dépenses Totales", value: "0 FCFA", sub: "+0% vs mois précédent", color: "text-purple-400", icon: "account_balance_wallet" },
          { label: "Coût Moyen Commande", value: "0 FCFA", sub: "Optimisation requise", color: "text-blue-400", icon: "analytics" },
          { label: "Écarts de Prix", value: "0%", sub: "Stabilité du marché", color: "text-orange-400", icon: "trending_up" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-8 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className={`material-icons-round ${kpi.color} text-3xl`}>{kpi.icon}</span>
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Hostelia Finance</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{kpi.label}</p>
            <p className="text-3xl font-black text-white">{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 3. Analyse des Dépenses par Catégorie (Placeholder) */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl overflow-hidden relative">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white mb-10">
            <span className="material-icons-round text-purple-500">pie_chart</span>
            Répartition des achats
          </h3>
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
             <span className="material-icons-round text-5xl text-slate-800 mb-4">donut_large</span>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aucune donnée de facturation</p>
          </div>
        </div>

        {/* 4. Top Fournisseurs par Volume d'Achat */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white mb-8">
            <span className="material-icons-round text-purple-500">stars</span>
            Partenaires Stratégiques
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
               <span className="material-icons-round text-4xl">storefront</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed px-10">
               Le classement des fournisseurs par volume financier s'affichera après les premières factures validées
            </p>
          </div>
        </div>

      </div>

      {/* 5. Alerte Marché / Insights */}
      <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
          <span className="material-icons-round text-3xl">info</span>
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic underline decoration-blue-500/30">Intelligence Achat</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-3xl uppercase">
            Le système compare automatiquement les prix de vos derniers bons de commande pour identifier les augmentations tarifaires anormales de vos fournisseurs habituels.
          </p>
        </div>
      </div>

    </div>
  );
};

export default RapportsCouts;