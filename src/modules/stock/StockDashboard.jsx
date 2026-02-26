import React from 'react';

const StockDashboard = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Statistiques Flash (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Valeur Totale Stock", value: "0 FCFA", color: "text-purple-500", icon: "inventory_2" },
          { label: "Commandes en cours", value: "0", color: "text-blue-500", icon: "local_shipping" },
          { label: "Ruptures de Stock", value: "0", color: "text-red-500", icon: "error_outline" },
          { label: "Livraisons du jour", value: "0", color: "text-green-500", icon: "pending_actions" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined ${kpi.color} text-3xl`}>{kpi.icon}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Temps réel</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{kpi.label}</p>
            <h3 className="text-4xl font-black text-white">{kpi.value}</h3>
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Flux des stocks (Graphique Placeholder) */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-outlined text-purple-500">trending_up</span>
              Mouvements de Stocks (7 derniers jours)
            </h3>
            <div className="flex gap-2">
               <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Entrées vs Sorties</span>
               </div>
            </div>
          </div>
          
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <span className="material-symbols-outlined text-5xl text-slate-800 mb-4">analytics</span>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">En attente de transactions</p>
          </div>
        </div>

        {/* 3. Dernières Réceptions */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-purple-500">receipt_long</span>
            Réceptions récentes
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-slate-500 text-3xl">history_toggle_off</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
               Aucune réception de marchandise<br/>enregistrée aujourd'hui
            </p>
          </div>

          <button className="w-full mt-6 py-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 transition-all">
            Voir tout l'historique
          </button>
        </div>

      </div>

      {/* 4. Alertes de Stock Critique */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined text-3xl">priority_high</span>
           </div>
           <div>
              <h4 className="font-black text-red-500 uppercase tracking-widest text-sm mb-1">Ruptures imminentes</h4>
              <p className="text-xs text-slate-500 font-medium">Parfait ! Tous les articles essentiels sont au-dessus du seuil de sécurité.</p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default StockDashboard;