import React from 'react';

const Fournisseurs = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Barre d'actions et Statistiques rapides */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Partenaires</span>
            <span className="text-3xl font-black text-white text-purple-500">0</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Contrats Actifs</span>
            <span className="text-3xl font-black text-white">0</span>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Rechercher un fournisseur..." 
              className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-[10px] text-white outline-none focus:border-purple-500 transition-all uppercase font-bold"
            />
          </div>
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span> Nouveau Fournisseur
          </button>
        </div>
      </div>

      {/* 2. Liste des Fournisseurs */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-symbols-outlined text-purple-500">import_contacts</span>
            Répertoire des prestataires
          </h3>
          <div className="flex gap-2">
             <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">Fournisseur</th>
                <th className="px-8 py-6">Catégorie</th>
                <th className="px-8 py-6">Contact Principal</th>
                <th className="px-8 py-6">Délai Moyen</th>
                <th className="px-8 py-6 text-center">Score Fiabilité</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide du répertoire */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-symbols-outlined text-6xl mb-4 text-slate-500">contact_page</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun fournisseur enregistré</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase">Référencez vos partenaires pour automatiser vos commandes</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section Intelligence Achat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-purple-500/5 border border-purple-500/10 p-8 rounded-[2.5rem]">
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                  <span className="material-symbols-outlined">verified</span>
               </div>
               <div>
                  <h4 className="font-black text-white uppercase tracking-widest text-xs mb-2 text-purple-400">Évaluation Continue</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">
                     Le système analyse automatiquement les retards de livraison et la conformité des produits pour attribuer un score de fiabilité à chaque fournisseur.
                  </p>
               </div>
            </div>
         </div>
         
         <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rapports d'achats</span>
               <span className="text-sm font-bold text-white uppercase">Dernière analyse exportée</span>
            </div>
            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
               <span className="material-symbols-outlined">download</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default Fournisseurs;