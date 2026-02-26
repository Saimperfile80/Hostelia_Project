import React from 'react';

const RapportsVenteFB = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Filtres de Période & Export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
        <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {['Jour', 'Semaine', 'Mois', 'Année'].map((period) => (
            <button key={period} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === 'Jour' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              {period}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">calendar_today</span> Choisir dates
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-600/10 border border-orange-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">download</span> Exporter PDF
          </button>
        </div>
      </div>

      {/* 2. KPIs de Performance Ventes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Ventes Totales", value: "0.00 $", icon: "query_stats", color: "text-orange-500" },
          { label: "Nombre de Couverts", value: "0", icon: "groups", color: "text-blue-400" },
          { label: "Panier Moyen", value: "0.00 $", icon: "shopping_cart", color: "text-emerald-500" },
          { label: "Annulations / Pertes", value: "0.00 $", icon: "block", color: "text-red-500" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined ${kpi.color} text-xl`}>{kpi.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{kpi.label}</p>
            <p className="text-3xl font-black text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Graphique de Performance (Placeholder Visuel) */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-outlined text-orange-500">show_chart</span>
              Courbe des Revenus
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
             <span className="material-symbols-outlined text-6xl text-slate-800 mb-4 animate-pulse">monitoring</span>
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">En attente de données transactionnelles</p>
          </div>
        </div>

        {/* 4. Top 5 Articles les plus vendus */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-amber-500">star</span>
            Top Performance
          </h3>
          <div className="space-y-6">
            {/* État vide du classement */}
            <div className="py-20 text-center">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aucune vente enregistrée<br/>pour cette période</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Analyse de l'Efficacité du Personnel (F&B) */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black text-sm uppercase tracking-widest text-white">Performance par Serveur / Barman</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                <th className="px-8 py-5">Collaborateur</th>
                <th className="px-8 py-5">Ventes Réalisées</th>
                <th className="px-8 py-5 text-center">Nombre Services</th>
                <th className="px-8 py-5 text-center">Panier Moyen</th>
                <th className="px-8 py-5 text-right">Efficacité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               <tr>
                 <td colSpan="5" className="px-8 py-20 text-center opacity-20">
                   <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
                   <p className="text-[10px] font-black uppercase tracking-widest">Aucune donnée de performance disponible</p>
                 </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RapportsVenteFB;