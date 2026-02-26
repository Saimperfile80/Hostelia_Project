import React from 'react';

const StatutChambres = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Filtres et Légende */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-4">
          <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-400 outline-none focus:border-emerald-500 transition-all">
            <option>Tous les étages</option>
          </select>
          <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-400 outline-none focus:border-emerald-500 transition-all">
            <option>Tous les statuts</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
            <span className="text-[9px] font-black uppercase text-slate-500">Prête</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-[9px] font-black uppercase text-slate-500">Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-[9px] font-black uppercase text-slate-500">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-[9px] font-black uppercase text-slate-500">Inspectée</span>
          </div>
        </div>
      </div>

      {/* 2. Grille des Chambres (Vue par Étages) */}
      <div className="space-y-12">
        {/* Exemple de section Étale 1 */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 ml-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Étage 1</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {/* État vide : Aucune chambre générée */}
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
              <span className="material-icons-round text-5xl text-slate-800 mb-4">bed</span>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed text-center">
                Aucune chambre configurée<br/>dans la base de données
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Panneau de Détails Latéral (Structure invisible par défaut) */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0b0e14] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 transform translate-x-full transition-transform duration-500">
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-black uppercase tracking-tighter">Détails Chambre</h4>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 transition-colors">
              <span className="material-icons-round text-sm">close</span>
            </button>
          </div>
          
          {/* Contenu du Panel (Vide) */}
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
             <span className="material-icons-round text-6xl mb-4">info</span>
             <p className="text-xs font-bold uppercase">Sélectionnez une chambre</p>
          </div>
        </div>
      </div>

      {/* 4. Barre d'action flottante */}
      <div className="fixed bottom-10 right-10 flex gap-4">
        <button className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/40 transition-all flex items-center gap-3">
          <span className="material-icons-round text-lg">sync</span>
          Mise à jour rapide
        </button>
      </div>

    </div>
  );
};

export default StatutChambres;