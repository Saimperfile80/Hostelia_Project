import React from 'react';

const InventaireStock = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Entête & Statistiques d'Inventaire */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <span className="material-symbols-outlined text-3xl">inventory</span>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">État Global</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Valeur & Quantités en temps réel</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white uppercase tracking-tighter">0 Items</p>
            <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Actifs en stock</p>
          </div>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dernier Inventaire</p>
          <p className="text-sm font-bold text-white uppercase italic">Jamais effectué</p>
        </div>

        <button className="bg-purple-600 hover:bg-purple-500 p-8 rounded-[2.5rem] shadow-xl shadow-purple-900/20 transition-all flex flex-col items-center justify-center gap-2 group">
          <span className="material-symbols-outlined text-white text-3xl group-hover:scale-110 transition-transform">add_circle</span>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Ajuster Stock</span>
        </button>
      </div>

      {/* 2. Filtres & Recherche */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['Général', 'F&B', 'Équipements', 'Consommables'].map((cat, i) => (
            <button key={i} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Référence ou nom..." 
            className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-[10px] text-white outline-none focus:border-purple-500 transition-all font-bold"
          />
        </div>
      </div>

      {/* 3. Liste de l'Inventaire */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-symbols-outlined text-purple-500">list_alt</span>
            Catalogue d'Inventaire
          </h3>
          <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span> Filtrer par statut
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">Article / SKU</th>
                <th className="px-8 py-6">Catégorie</th>
                <th className="px-8 py-6 text-center">Qté Disponible</th>
                <th className="px-8 py-6 text-center">Seuil Alerte</th>
                <th className="px-8 py-6 text-center">Statut Stock</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-symbols-outlined text-6xl mb-4 text-slate-500">shelves</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun article référencé</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase">Veuillez intégrer des produits via le module réception ou ajustement</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Légende des Statuts */}
      <div className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[9px] font-black text-slate-500 uppercase">Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-[9px] font-black text-slate-500 uppercase">Stock Bas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-[9px] font-black text-slate-500 uppercase">Rupture</span>
        </div>
      </div>

    </div>
  );
};

export default InventaireStock;