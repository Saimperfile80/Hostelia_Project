import React from 'react';

const ReceptionStock = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Zone de scan et recherche rapide */}
      <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <span className="material-icons-round text-3xl">qr_code_scanner</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Réception de Marchandise</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Scanner un bon ou saisir manuellement</p>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input 
              type="text" 
              placeholder="N° Bon de commande ou Fournisseur..." 
              className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] text-white outline-none focus:border-purple-500 transition-all uppercase font-bold"
            />
          </div>
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2">
            <span className="material-icons-round text-sm">inventory</span> Valider Entrée
          </button>
        </div>
      </div>

      {/* 2. Tableau des Réceptions en attente / Récentes */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons-round text-purple-500">pending_actions</span>
            Livraisons à contrôler
          </h3>
          <div className="flex gap-3">
             <span className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase">0 En attente</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">ID Réception</th>
                <th className="px-8 py-6">Fournisseur</th>
                <th className="px-8 py-6">Date Prévue</th>
                <th className="px-8 py-6">Statut Livraison</th>
                <th className="px-8 py-6 text-center">Articles</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-icons-round text-6xl mb-4 text-slate-500">local_shipping</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucune livraison signalée</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase">Les commandes validées apparaîtront ici pour réception</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Recapitulatif & Synchro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <span className="material-icons-round">sync</span>
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Mise à jour automatique</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">
              La validation d'une réception met à jour instantanément les niveaux de stock et génère les écritures comptables associées.
            </p>
          </div>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-icons-round text-sm">summarize</span> Récapitulatif Hebdomadaire
          </h4>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-black text-white">0</p>
              <p className="text-[9px] font-bold text-slate-600 uppercase">Unités reçues</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">0</p>
              <p className="text-[9px] font-bold text-slate-600 uppercase">Écarts constatés</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReceptionStock;