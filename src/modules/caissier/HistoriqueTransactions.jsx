import React from 'react';

const HistoriqueTransactions = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Barre de Recherche et Filtres Avancés */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            type="text" 
            placeholder="Rechercher par N° de facture, client ou chambre..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">filter_alt</span> Filtres
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">calendar_month</span> Période
          </button>
        </div>
      </div>

      {/* 2. Liste des Transactions (Tableau) */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-emerald-500">receipt_long</span>
            Archives des Paiements
          </h3>
          <span className="text-[10px] font-black text-slate-500 uppercase bg-black/40 px-4 py-1.5 rounded-full border border-white/5">
            0 Transactions trouvées
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Référence</th>
                <th className="px-8 py-5">Date & Heure</th>
                <th className="px-8 py-5">Client / Source</th>
                <th className="px-8 py-5">Mode de Paiement</th>
                <th className="px-8 py-5 text-right">Montant Total</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide du tableau */}
              <tr>
                <td colSpan="7" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-10">
                    <span className="material-symbols-outlined text-7xl mb-4">database_off</span>
                    <p className="text-xl font-black uppercase tracking-[0.3em]">Aucun historique</p>
                    <p className="text-[10px] font-bold uppercase mt-2 tracking-widest">Lancez une recherche ou changez les filtres de date</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Basse */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/10">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Page 0 sur 0</p>
           <div className="flex gap-2">
             <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-emerald-500 transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
             </button>
             <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-emerald-500 transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
             </button>
           </div>
        </div>
      </div>

      {/* 3. Résumé de la sélection (Optionnel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600/5 border border-emerald-500/20 p-6 rounded-[2rem] flex flex-col gap-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sélectionné</p>
           <p className="text-2xl font-black text-white">0.00 $</p>
        </div>
        <div className="bg-[#151c2c] border border-white/5 p-6 rounded-[2rem] flex flex-col gap-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volume Transactions</p>
           <p className="text-2xl font-black text-white">0</p>
        </div>
        <button className="bg-[#151c2c] border border-white/5 p-6 rounded-[2rem] flex items-center justify-center gap-4 hover:border-emerald-500/50 transition-all group">
           <span className="material-symbols-outlined text-slate-500 group-hover:text-emerald-500">cloud_download</span>
           <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Exporter le journal</span>
        </button>
      </div>

    </div>
  );
};

export default HistoriqueTransactions;