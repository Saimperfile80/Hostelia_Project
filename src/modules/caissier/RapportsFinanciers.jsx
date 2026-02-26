import React from 'react';

const RapportsFinanciers = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Sélecteur de Période Global */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white">Analyse Financière</h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Générez des rapports détaillés sur vos flux</p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {['Aujourd\'hui', 'Semaine', 'Mois', 'Trimestre'].map((t) => (
            <button key={t} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Aujourd\'hui' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Cartes de Synthèse (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Chiffre d'Affaire Net</p>
          <h3 className="text-3xl font-black text-white">0.00 $</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-600">
            <span className="material-symbols-outlined text-sm">trending_flat</span> 0% vs période précédente
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-5 text-emerald-500 group-hover:scale-110 transition-transform">payments</span>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Taxes Collectées</p>
          <h3 className="text-3xl font-black text-white">0.00 $</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-600">
             <span className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500/20 h-full w-0"></div>
             </span>
          </div>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Moyenne Transaction</p>
          <h3 className="text-3xl font-black text-white">0.00 $</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-600">
            <span className="material-symbols-outlined text-sm">analytics</span> Basé sur 0 ventes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 3. Répartition par Mode de Paiement */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-emerald-500">pie_chart</span>
            Modes de Règlement
          </h3>
          <div className="space-y-4">
            {['Espèces', 'Cartes Bancaires', 'Mobile Money', 'Virements'].map((mode) => (
              <div key={mode} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span className="text-slate-400">{mode}</span>
                    <span className="text-white">0%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-0"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Zone Graphique (Placeholder) */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-3xl text-slate-700 animate-pulse">monitoring</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Données insuffisantes</p>
          <p className="text-[9px] text-slate-600 uppercase font-bold mt-2">Le graphique apparaîtra après les premières ventes</p>
        </div>
      </div>

      {/* 5. Actions d'Exportation */}
      <div className="flex justify-end gap-4">
        <button className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all">
          <span className="material-symbols-outlined text-sm">print</span> Imprimer Journal
        </button>
        <button className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all">
          <span className="material-symbols-outlined text-sm">description</span> Exporter (.xlsx)
        </button>
      </div>

    </div>
  );
};

export default RapportsFinanciers;