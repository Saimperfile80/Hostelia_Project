import React, { useState, useEffect } from 'react';

const RapportsFinanciers = () => {
  const [period, setPeriod] = useState('Aujourd\'hui');
  const [rate, setRate] = useState(2800);
  const [secLabel, setSecLabel] = useState('CDF');
  const [data, setData] = useState({
    ca_net: 0,
    taxes: 0,
    moyenne: 0,
    nb_ventes: 0,
    variation: 0,
    modes: { 'Espèces': 0, 'Cartes Bancaires': 0, 'Mobile Money': 0, 'Virements': 0 }
  });

  const fetchFinancialData = async () => {
    try {
      const periodMap = { 'Aujourd\'hui': 'day', 'Semaine': 'week', 'Mois': 'month', 'Trimestre': 'quarter' };
      
      // On récupère les stats financières ET les settings pour le taux
      const [resFinance, resSettings] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/reports/finance?period=${periodMap[period]}`),
        fetch('http://127.0.0.1:8000/api/settings')
      ]);

      const result = await resFinance.json();
      const settings = await resSettings.json();

      setData(result);
      setRate(settings.exchange_rate || 2800);
      setSecLabel(settings.secondary_currency?.split(' ')[0] || 'CDF');
    } catch (err) {
      console.error("Erreur de récupération financière:", err);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [period]);

  // Helper pour formater la monnaie locale
  const formatLoc = (val) => (val * rate).toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Header avec Sélecteur & Taux */}
      <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Analyse de Performance</h3>
          <p className="text-[10px] text-emerald-500 uppercase font-black mt-1 italic">
            Taux de change appliqué : 1 USD = {rate} {secLabel}
          </p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {['Aujourd\'hui', 'Semaine', 'Mois', 'Trimestre'].map((t) => (
            <button 
              key={t} 
              onClick={() => setPeriod(t)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KPIs Bimonétaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Chiffre d'Affaire Net" 
          val={data.ca_net} 
          locVal={formatLoc(data.ca_net)} 
          secLabel={secLabel}
          icon="account_balance"
          variation={data.variation}
        />
        <KPICard 
          label="TVA & Taxes" 
          val={data.taxes} 
          locVal={formatLoc(data.taxes)} 
          secLabel={secLabel}
          icon="Description"
          color="blue"
        />
        <KPICard 
          label="Panier Moyen" 
          val={data.moyenne} 
          locVal={formatLoc(data.moyenne)} 
          secLabel={secLabel}
          icon="analytics"
          color="purple"
          subText={`Basé sur ${data.nb_ventes} ventes`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. Répartition Modes de Règlement */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-emerald-500">pie_chart</span>
            Mix des Paiements
          </h3>
          <div className="space-y-6">
            {Object.entries(data.modes).map(([mode, percent]) => (
              <div key={mode} className="group">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-slate-500 group-hover:text-white transition-colors">{mode}</span>
                  <span className="text-white">{percent}%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                  <div className="h-full bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Zone Statut d'Activité */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl flex flex-col items-center justify-center min-h-[350px]">
          <div className="text-center">
             <div className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center mb-6 border border-emerald-500/10">
                <span className="material-symbols-outlined text-4xl text-emerald-500 animate-pulse">monitoring</span>
             </div>
             <p className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Flux d'activité {data.nb_ventes > 0 ? 'Positif' : 'Nul'}</p>
             <p className="text-[9px] text-slate-600 mt-2 uppercase font-bold italic">Rapport généré le {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* 5. Actions */}
      <div className="flex justify-end gap-4 border-t border-white/5 pt-8">
        <button onClick={() => window.print()} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">print</span> Imprimer le Rapport
        </button>
        <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40 transition-all flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">ios_share</span> Exporter Excel
        </button>
      </div>
    </div>
  );
};

// Sous-composant pour les KPIs
const KPICard = ({ label, val, locVal, secLabel, icon, color = "emerald", variation, subText }) => (
  <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</p>
    <h3 className="text-3xl font-black text-white">{val.toFixed(2)} $</h3>
    <p className={`text-xs font-bold text-${color}-500 mt-1`}>≈ {locVal} {secLabel}</p>
    
    {variation !== undefined && (
      <div className="mt-4 flex items-center gap-2 text-[10px] font-black bg-white/5 px-3 py-1 rounded-full w-fit">
        <span className={`material-symbols-outlined text-sm ${variation >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {variation >= 0 ? 'trending_up' : 'trending_down'}
        </span> 
        <span className={variation >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{Math.abs(variation)}%</span>
      </div>
    )}
    
    {subText && <p className="mt-4 text-[10px] font-bold text-slate-600 uppercase italic">{subText}</p>}
    
    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:scale-110 transition-transform">{icon}</span>
  </div>
);

export default RapportsFinanciers;