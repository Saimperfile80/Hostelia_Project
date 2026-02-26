import React from 'react';

const FacturationFB = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Résumé des Encaissements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-orange-500">point_of_sale</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Encaissé (Jour)</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">0.00 $</h3>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Factures en Attente</p>
          <h3 className="text-3xl font-black text-orange-500 tracking-tighter">0</h3>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Moyenne / Couvert</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">-- $</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Liste des Factures Récentes */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-black text-sm uppercase tracking-widest text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-500">history_edu</span>
              Dernières Transactions
            </h3>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500"><span className="material-symbols-outlined">filter_list</span></button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-8 py-5">N° Facture</th>
                  <th className="px-8 py-5">Table / Client</th>
                  <th className="px-8 py-5">Mode de Paiement</th>
                  <th className="px-8 py-5 text-right">Montant</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* État vide */}
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <span className="material-symbols-outlined text-5xl mb-3">receipt_long</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucune transaction aujourd'hui</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Panel de Clôture & Actions */}
        <div className="space-y-6">
          <section className="bg-orange-600 rounded-[2.5rem] p-8 shadow-2xl shadow-orange-900/20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-6">Action Rapide</h4>
              <p className="text-xl font-black leading-tight mb-8 italic">Prêt pour la clôture de caisse ?</p>
              <button className="w-full bg-black/20 hover:bg-black/40 backdrop-blur-md py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10">
                Imprimer le rapport X
              </button>
              <button className="w-full mt-3 bg-white text-orange-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">
                Clôture de Caisse (Z)
              </button>
            </div>
            {/* Décoration fond */}
            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[12rem] opacity-10 rotate-12">payments</span>
          </section>

          <section className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
             <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">print</span> Options d'impression
             </h4>
             <div className="space-y-3">
               <button className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all group">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Réimprimer dernier ticket</span>
                 <span className="material-symbols-outlined text-sm text-slate-600">chevron_right</span>
               </button>
               <button className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all group">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Générer facture A4</span>
                 <span className="material-symbols-outlined text-sm text-slate-600">chevron_right</span>
               </button>
             </div>
          </section>
        </div>
      </div>

    </div>
  );
};

export default FacturationFB;