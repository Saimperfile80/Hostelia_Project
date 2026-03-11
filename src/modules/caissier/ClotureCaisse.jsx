import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ClotureCaisse = () => {
  const [stats, setStats] = useState({ usd: { cash: 0, digital: 0 }, loc: { cash: 0, digital: 0 }, rate: 2800 });
  const [fondInitial, setFondInitial] = useState(0);
  const [config, setConfig] = useState({ currency: 'USD', secondary_currency: 'CDF' });
  
  // États pour le comptage physique
  const [declaredCashUSD, setDeclaredCashUSD] = useState('');
  const [declaredCashLOC, setDeclaredCashLOC] = useState('');

  const fetchSessionData = async () => {
    try {
      const [resStats, resFond, resConfig] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/caisse/stats'),
        fetch('http://127.0.0.1:8000/api/caisse/session'),
        fetch('http://127.0.0.1:8000/api/settings')
      ]);
      setStats(await resStats.json());
      const f = await resFond.json();
      setFondInitial(f.opening_balance);
      setConfig(await resConfig.json());
    } catch (err) { console.error("Erreur synchro:", err); }
  };

  useEffect(() => { fetchSessionData(); }, []);

  // CALCULS DES ÉCARTS
  const locLabel = config?.secondary_currency?.split(' ')[0] || '...';
  
  const attenduUSD = fondInitial + stats.usd.cash + stats.usd.digital;
  const attenduLOC = stats.loc.cash + stats.loc.digital; // Souvent le fond initial est en USD uniquement

  const ecartUSD = (parseFloat(declaredCashUSD) || 0) - attenduUSD;
  const ecartLOC = (parseFloat(declaredCashLOC) || 0) - attenduLOC;

  const handleFinalClose = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirmer la clôture Z ?',
      html: `<p style="font-size:12px; color:#aaa;">Ceci réinitialisera le tiroir-caisse pour les deux monnaies.</p>`,
      icon: 'warning',
      showCancelButton: true,
      background: '#151c2c', color: '#fff',
      confirmButtonColor: '#10b981', confirmButtonText: 'Valider et Archiver'
    });

    if (isConfirmed) {
        const res = await fetch('http://127.0.0.1:8000/api/caisse/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            opening_balance: fondInitial,
            sales_usd: stats.usd.cash,
            sales_loc: stats.loc.cash,
            physical_usd: parseFloat(declaredCashUSD) || 0,
            physical_loc: parseFloat(declaredCashLOC) || 0,
            gap_usd: ecartUSD,
            gap_loc: ecartLOC
          })
        });
        if (res.ok) window.location.href = '/dashboard';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Header & Taux */}
      <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 p-8 rounded-[3rem] border border-white/5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Clôture de Caisse Bimonétaire</h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase italic">Session du jour | Taux : 1 USD = {stats.rate} {locLabel}</p>
        </div>
        <div className="text-right">
          <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black text-emerald-500 border border-emerald-500/20 uppercase">Rapport Z en attente</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Saisie Physique */}
        <div className="bg-[#151c2c] rounded-[3rem] border border-white/5 p-10 shadow-2xl space-y-8">
          <h3 className="font-black text-sm uppercase tracking-widest text-white flex items-center gap-3">
            <span className="material-icons text-emerald-500">point_of_sale</span> Comptage du Coffre
          </h3>
          
          <div className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-emerald-500 mb-2 block tracking-widest">Espèces en USD ($)</label>
              <input 
                type="number" 
                value={declaredCashUSD}
                onChange={(e) => setDeclaredCashUSD(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-5 px-8 text-2xl font-black text-white outline-none focus:border-emerald-500 transition-all"
                placeholder="0.00"
              />
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-blue-400 mb-2 block tracking-widest">Espèces en {locLabel}</label>
              <input 
                type="number" 
                value={declaredCashLOC}
                onChange={(e) => setDeclaredCashLOC(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-5 px-8 text-2xl font-black text-white outline-none focus:border-blue-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
            <p className="text-[9px] font-bold text-slate-500 uppercase text-center mb-4 italic">Vérifiez vos billets avant de valider</p>
            <div className="flex gap-4">
                <button className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-white/10 hover:bg-white/10">Calculatrice</button>
                <button className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-white/10 hover:bg-white/10">Détails Digitaux</button>
            </div>
          </div>
        </div>

        {/* 3. Analyse des Écarts */}
        <div className="space-y-6">
          {/* Colonne USD */}
          <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Bilan Dollar (USD)</h4>
                <span className="text-xs font-mono text-emerald-500">$</span>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>Attendu Système</span> <span className="text-white">{attenduUSD.toFixed(2)} $</span></div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>Déclaré Réel</span> <span className="text-white">{(parseFloat(declaredCashUSD) || 0).toFixed(2)} $</span></div>
                <div className={`flex justify-between p-3 rounded-xl border mt-4 ${ecartUSD === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <span className="text-[10px] font-black uppercase">Écart USD</span>
                    <span className={`font-black ${ecartUSD >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{ecartUSD.toFixed(2)} $</span>
                </div>
             </div>
          </div>

          {/* Colonne Monnaie Locale */}
          <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Bilan {locLabel}</h4>
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">LOCAL</span>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>Attendu Système</span> <span className="text-white">{attenduLOC.toLocaleString()} {locLabel}</span></div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>Déclaré Réel</span> <span className="text-white">{(parseFloat(declaredCashLOC) || 0).toLocaleString()} {locLabel}</span></div>
                <div className={`flex justify-between p-3 rounded-xl border mt-4 ${ecartLOC === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <span className="text-[10px] font-black uppercase">Écart {locLabel}</span>
                    <span className={`font-black ${ecartLOC >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{ecartLOC.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 4. Action Finale */}
      <div className="flex gap-6">
        <button onClick={() => window.print()} className="px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
            Imprimer brouillon
        </button>
        <button 
          onClick={handleFinalClose}
          disabled={!declaredCashUSD}
          className={`flex-1 py-5 rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] transition-all shadow-2xl ${declaredCashUSD ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}>
          Valider Clôture Z & Archiver
        </button>
      </div>

    </div>
  );
};

export default ClotureCaisse;