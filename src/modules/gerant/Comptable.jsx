import React from 'react';

const Comptable = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Barre d'outils Audit */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
            <i className="fas fa-calculator text-xl"></i>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Grand Livre & Audit</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Supervision comptable et conformité fiscale</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all flex items-center gap-2">
            <i className="fas fa-file-export text-red-500"></i> Clôture Annuelle
          </button>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all flex items-center gap-2">
            <i className="fas fa-plus"></i> Écriture Manuelle
          </button>
        </div>
      </div>

      {/* 2. Vue d'ensemble des comptes (Balances) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Trésorerie Globale", value: "0.00 $", icon: "fa-vault", color: "text-emerald-500" },
          { label: "Créances Clients", value: "0.00 $", icon: "fa-hand-holding-dollar", color: "text-blue-400" },
          { label: "Dettes Fournisseurs", value: "0.00 $", icon: "fa-file-invoice-dollar", color: "text-red-400" },
          { label: "TVA à Décaisser", value: "0.00 $", icon: "fa-percent", color: "text-purple-400" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-red-500/30 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <i className={`fas ${kpi.icon} ${kpi.color} text-lg`}></i>
              <span className="text-[10px] font-black text-slate-700 uppercase">Audit OK</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Journal des Écritures Comptables */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <i className="fas fa-stream text-red-500"></i>
            Journal Général des Opérations
          </h3>
          <div className="flex gap-2">
             <input type="text" placeholder="Rechercher un compte..." className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-red-500 w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-widest">
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">N° Compte</th>
                <th className="px-8 py-5">Libellé de l'opération</th>
                <th className="px-8 py-5">Débit</th>
                <th className="px-8 py-5">Crédit</th>
                <th className="px-8 py-5 text-right">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide du journal */}
              <tr>
                <td colSpan="6" className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <i className="fas fa-folder-open text-5xl mb-4 text-slate-500"></i>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucune écriture comptable sur cette période</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer du Tableau */}
        <div className="p-6 bg-black/20 border-t border-white/5 flex justify-end gap-12">
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Débit</p>
                <p className="text-lg font-black text-white">0.00 $</p>
            </div>
            <div className="text-right border-l border-white/10 pl-12">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Crédit</p>
                <p className="text-lg font-black text-white">0.00 $</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Comptable;