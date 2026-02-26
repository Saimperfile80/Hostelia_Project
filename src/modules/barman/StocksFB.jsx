import React from 'react';

const StocksFB = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. État Global des Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Articles en Rupture", value: "0", icon: "error_outline", color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Alertes Stock Bas", value: "0", icon: "warning_amber", color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Valeur Totale Stock", value: "0.00 $", icon: "inventory_2", color: "text-blue-400", bg: "bg-blue-400/10" }
        ].map((item, i) => (
          <div key={i} className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-xl">
            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
              <span className={`material-icons-round ${item.color}`}>{item.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
              <h3 className="text-2xl font-black text-white">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Gestion de l'Inventaire */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <h3 className="font-black text-sm uppercase tracking-widest text-white">Inventaire Boissons & Ingrédients</h3>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button className="px-4 py-1.5 rounded-lg bg-orange-600 text-[10px] font-black uppercase text-white shadow-lg">Tous</button>
              <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Bar</button>
              <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Cuisine</button>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2">
              <span className="material-icons-round text-sm">history</span> Historique
            </button>
            <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2">
              <span className="material-icons-round text-sm">add</span> Nouvel Article
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Article</th>
                <th className="px-8 py-5">Catégorie</th>
                <th className="px-8 py-5 text-center">Stock Actuel</th>
                <th className="px-8 py-5 text-center">Unité</th>
                <th className="px-8 py-5 text-center">Seuil Alerte</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide du stock */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-icons-round text-6xl mb-4 text-slate-400">inventory</span>
                    <p className="text-xl font-black uppercase tracking-[0.3em] text-slate-400">Aucun article en stock</p>
                    <p className="text-[10px] font-bold uppercase mt-2 text-slate-500 tracking-widest">Enregistrez vos produits pour commencer le suivi</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/10">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Affichage de 0 sur 0 articles</p>
           <div className="flex gap-2">
             <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 cursor-not-allowed"><span className="material-icons-round">chevron_left</span></button>
             <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 cursor-not-allowed"><span className="material-icons-round">chevron_right</span></button>
           </div>
        </div>
      </div>

      {/* 3. Zone d'Ajustement Rapide (Stock Count) */}
      <div className="bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem] p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-start gap-4">
             <span className="material-icons-round text-orange-500 mt-1">receipt_long</span>
             <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Ajustement de Stock</h4>
                <p className="text-xs text-slate-400 mt-1">Saisissez les entrées (livraisons) ou sorties manuelles ici.</p>
             </div>
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            Démarrer un inventaire physique
          </button>
        </div>
      </div>

    </div>
  );
};

export default StocksFB;