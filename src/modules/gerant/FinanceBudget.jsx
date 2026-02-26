import React from 'react';

const FinanceBudget = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Résumé de Trésorerie (KPIs Financiers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151c2c] p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[5rem] group-hover:bg-emerald-500/10 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Trésorerie Disponible</p>
          <h3 className="text-3xl font-black text-white">-- $</h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">account_balance_wallet</span>
            SOLDE BANCAIRE RÉEL
          </p>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 rounded-bl-[5rem] group-hover:bg-rose-500/10 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Charges Fixes (Prév.)</p>
          <h3 className="text-3xl font-black text-white">-- $</h3>
          <p className="text-[10px] text-rose-500 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">trending_down</span>
            DÉPENSES DU MOIS
          </p>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-[5rem] group-hover:bg-blue-500/10 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Marge Opérationnelle</p>
          <h3 className="text-3xl font-black text-white">-- %</h3>
          <p className="text-[10px] text-blue-500 font-bold mt-2 flex items-center gap-1">
            <span className="material-icons text-xs">shutter_speed</span>
            PERFORMANCE EBITDA
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Suivi Budgétaire par Département */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-icons text-red-500">pie_chart</span>
            Utilisation du Budget
          </h3>
          <div className="space-y-6">
            {['Hébergement', 'Restauration', 'Maintenance', 'Marketing'].map((dept) => (
              <div key={dept} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                  <span className="text-slate-400">{dept}</span>
                  <span className="text-white">-- / -- $</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600/20 w-0 transition-all duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Actions & Alertes Financières */}
        <div className="space-y-6">
          <div className="bg-red-600/5 border border-red-500/20 rounded-[2rem] p-8">
            <h3 className="text-red-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-icons">gavel</span>
              Contrôle de Gestion
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-4 p-4 bg-black/20 hover:bg-black/40 rounded-2xl border border-white/5 transition-all text-left group">
                <span className="material-icons text-red-500 group-hover:scale-110 transition-transform">add_chart</span>
                <div>
                  <p className="text-xs font-black text-white uppercase">Nouvel Investissement (CAPEX)</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">Soumettre un projet de dépense</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-black/20 hover:bg-black/40 rounded-2xl border border-white/5 transition-all text-left group">
                <span className="material-icons text-red-500 group-hover:scale-110 transition-transform">account_balance</span>
                <div>
                  <p className="text-xs font-black text-white uppercase">Rapprochement Bancaire</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">Synchroniser les flux réels</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tableau des Dépenses & Factures Fournisseurs */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <h3 className="font-black text-sm uppercase tracking-widest">Dernières Dépenses & Factures</h3>
          <span className="material-icons text-slate-600">filter_list</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Désignation</th>
                <th className="px-8 py-5">Catégorie</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Montant</th>
                <th className="px-8 py-5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td colSpan="5" className="px-8 py-24 text-center">
                   <div className="flex flex-col items-center opacity-20">
                    <span className="material-icons text-6xl mb-4">payments</span>
                    <p className="text-xl font-black uppercase tracking-[0.3em] text-slate-400">Aucun flux financier enregistré</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceBudget;