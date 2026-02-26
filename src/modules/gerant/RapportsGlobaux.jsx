import React from 'react';

const RapportsGlobaux = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Sélecteur Stratégique & Actions */}
      <div className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-black/20 p-1.5 rounded-2xl border border-white/5 flex gap-2">
            {['Trimestre', 'Semestre', 'Annuel', 'Comparatif'].map((mode, idx) => (
              <button 
                key={mode}
                className={`px-5 py-2 text-[10px] font-black rounded-xl transition-all ${
                  idx === 2 ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <button className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black flex items-center gap-3 shadow-xl shadow-rose-900/20 transition-all active:scale-95">
          <span className="material-icons text-sm">ios_share</span>
          GÉNÉRER BILAN EXÉCUTIF
        </button>
      </div>

      {/* 2. Analyse de la Satisfaction & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Widget Satisfaction Client (NPS) */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-600/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
          <h3 className="font-black mb-10 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-icons text-rose-500">reviews</span>
            Satisfaction Globale
          </h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset="440" className="text-rose-600 transition-all duration-1000" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">--</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Score NPS</span>
              </div>
            </div>
            <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Données de feedback en attente</p>
          </div>
        </div>

        {/* Répartition Sectorielle (Logement vs F&B) */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons text-emerald-500">donut_small</span>
              Performance par Pôle
            </h3>
            <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full uppercase">Période en cours</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48">
            <div className="border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center">
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Analyse Sectorielle</p>
            </div>
            <div className="space-y-6 flex flex-col justify-center">
              {['Hébergement', 'Restauration', 'Spa / Loisirs', 'Autres services'].map(pôle => (
                <div key={pôle} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-500">{pôle}</span>
                    <span className="text-white">--%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 opacity-20 w-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comparatif Annuel (Tableau de bord) */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black text-sm uppercase tracking-widest">Indicateurs de Croissance (YTD)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Indicateur</th>
                <th className="px-8 py-5 text-center">N-1</th>
                <th className="px-8 py-5 text-center">Actuel</th>
                <th className="px-8 py-5 text-center">Croissance</th>
                <th className="px-8 py-5 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td colSpan="5" className="px-8 py-24 text-center">
                   <div className="flex flex-col items-center opacity-20 group">
                    <span className="material-icons text-6xl mb-4 group-hover:scale-110 transition-transform">query_stats</span>
                    <p className="text-xl font-black uppercase tracking-[0.3em] text-slate-400">Génération du comparatif...</p>
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

export default RapportsGlobaux;