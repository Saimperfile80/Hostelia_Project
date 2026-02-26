import React from 'react';

const DashboardFB = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. État des Ventes & Flux (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Commandes Actives", value: "0", color: "text-orange-500", icon: "restaurant" },
          { label: "Chiffre d'Affaire (Jour)", value: "0.00 $", color: "text-emerald-500", icon: "payments" },
          { label: "Tables Occupées", value: "0/0", color: "text-blue-400", icon: "table_restaurant" },
          { label: "Temps d'attente moyen", value: "-- min", color: "text-amber-500", icon: "schedule" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl group hover:border-orange-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-orange-500 transition-colors">{kpi.label}</p>
              <span className="material-icons-outlined text-slate-600 text-sm">{kpi.icon}</span>
            </div>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Suivi des Commandes en Direct (Flux Cuisine/Bar) */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons-outlined text-orange-500">pending_actions</span>
              Flux des Commandes
            </h3>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-orange-500/10 rounded-full text-[10px] font-bold text-orange-500 uppercase">En cuisine (0)</span>
            </div>
          </div>
          
          <div className="space-y-4 h-80 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <span className="material-icons-outlined text-5xl text-slate-800 mb-2">lunch_dining</span>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Aucune commande en préparation</p>
          </div>
        </div>

        {/* 3. Alertes Stocks Critiques (Bar/Cuisine) */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons-outlined text-red-500">inventory_2</span>
              Stocks Critiques
            </h3>
            <button className="text-[10px] font-bold text-orange-500 hover:underline uppercase">Gérer</button>
          </div>
          
          <div className="flex-1 space-y-4">
            {/* État vide du stock */}
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <span className="material-icons-outlined text-4xl mb-2 text-slate-400">wine_bottle</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-center">Tous les produits sont<br/>en stock</p>
            </div>
          </div>

          <button className="w-full mt-6 py-4 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 rounded-2xl border border-orange-500/10 text-[10px] font-black uppercase tracking-widest transition-all">
            Faire une demande d'achat
          </button>
        </div>
      </div>

      {/* 4. Plan de salle & Disponibilité */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-sm uppercase tracking-widest">Aperçu rapide de la Salle</h3>
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Libre</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Occupée</span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Les tables seront générées dynamiquement ici */}
          <div className="col-span-full py-10 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Plan de salle non configuré ou vide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFB;