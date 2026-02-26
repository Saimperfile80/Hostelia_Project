import React from 'react';

const ModesPaiement = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Configuration des Devises & Taux de Change */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-outlined text-emerald-500">currency_exchange</span>
              Gestion des Devises
            </h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Définissez vos taux de change opérationnels</p>
          </div>
          <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Ajouter une devise
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                <th className="px-8 py-5">Devise</th>
                <th className="px-8 py-5">Code</th>
                <th className="px-8 py-5">Symbole</th>
                <th className="px-8 py-5">Taux (vs Principal)</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État initial / Vide */}
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center opacity-30 italic text-sm text-slate-400">
                  Aucune devise secondaire configurée
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Méthodes de Paiement Actives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-emerald-500">account_balance_wallet</span>
            Canaux d'Encaissement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Espèces (Cash)', icon: 'payments', status: 'Activé' },
              { label: 'Cartes Bancaires', icon: 'credit_card', status: 'Activé' },
              { label: 'Mobile Money', icon: 'smartphone', status: 'Configuration requise' },
              { label: 'Virement Bancaire', icon: 'account_balance', status: 'Activé' }
            ].map((method, idx) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-black/20 border border-white/5 flex items-center justify-between group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <span className="material-symbols-outlined">{method.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">{method.label}</p>
                    <p className={`text-[9px] font-bold uppercase ${method.status === 'Activé' ? 'text-emerald-500' : 'text-amber-500'}`}>{method.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">settings</span></button>
                   <div className="w-10 h-5 bg-emerald-600/20 rounded-full relative border border-emerald-500/30">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Note d'information */}
        <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
            <span className="material-symbols-outlined">info</span>
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Note de Sécurité</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
            "Les modifications apportées aux taux de change ou aux modes de paiement affectent instantanément le module d'encaissement et la facturation client. Assurez-vous de la conformité de vos taux avec votre établissement bancaire."
          </p>
        </div>
      </div>

    </div>
  );
};

export default ModesPaiement;