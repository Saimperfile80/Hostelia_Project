import React from 'react';

const StocksLinge = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Entête & Actions d'Inventaire */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <span className="material-icons text-2xl">inventory_2</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Gestion des Stocks</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Linge, Produits d'accueil & Entretien</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2">
            <span className="material-icons text-sm">history</span> Historique Mouvements
          </button>
          <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
            <span className="material-icons text-sm">add_box</span> Nouvel Arrivage
          </button>
        </div>
      </div>

      {/* 2. Filtres de Catégories */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {['Tous les articles', 'Linge de lit', 'Linge de bain', 'Produits d\'accueil', 'Produits d\'entretien'].map((cat, i) => (
          <button key={i} className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Tableau d'Inventaire */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons text-emerald-500 text-sm">list_alt</span>
            Inventaire Actuel
          </h3>
          <div className="relative">
            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              className="bg-black/20 border border-white/10 rounded-2xl pl-10 pr-6 py-2.5 text-[10px] text-white outline-none focus:border-emerald-500 w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">Article</th>
                <th className="px-8 py-6">Catégorie</th>
                <th className="px-8 py-6 text-center">En Stock</th>
                <th className="px-8 py-6 text-center">Seuil Alerte</th>
                <th className="px-8 py-6 text-center">État Statut</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide du stock */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-icons text-6xl mb-4 text-slate-500">production_quantity_limits</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun article dans l'inventaire</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase">Veuillez ajouter des produits pour commencer le suivi</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Résumé des Alertes (Invisible si vide, mais structure préparée) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <span className="material-icons">check_circle</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Disponibilité</p>
                <p className="text-sm font-bold text-slate-300">Tous les articles essentiels sont en stock.</p>
            </div>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <span className="material-icons">priority_high</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Alertes de Stock</p>
                <p className="text-sm font-bold text-slate-300">Aucune rupture de stock signalée.</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default StocksLinge;