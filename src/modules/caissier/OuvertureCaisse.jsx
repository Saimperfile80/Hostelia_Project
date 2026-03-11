import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const OuvertureCaisse = ({ onSessionOpened }) => {
  const [amounts, setAmounts] = useState({ usd: '', loc: '' });
  const [config, setConfig] = useState({ rate: 2800, secSymbol: 'CDF' });

  // Récupérer le taux actuel pour l'affichage informatif
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.exchange_rate) {
          setConfig({
            rate: data.exchange_rate,
            secSymbol: data.secondary_currency?.split(' ')[0] || 'CDF'
          });
        }
      });
  }, []);

  const totalEnUsd = () => {
    const u = parseFloat(amounts.usd) || 0;
    const l = parseFloat(amounts.loc) || 0;
    return u + (l / config.rate);
  };

  const handleOpenSession = async () => {
    if (!amounts.usd && !amounts.loc) {
      Swal.fire('Attention', 'Veuillez saisir au moins un montant', 'warning');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/caisse/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          opening_usd: parseFloat(amounts.usd) || 0,
          opening_loc: parseFloat(amounts.loc) || 0,
          total_usd_equivalent: totalEnUsd()
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Session Ouverte',
          html: `<p style="color:#fff">Fond de caisse total : <b>${totalEnUsd().toFixed(2)} $</b></p>`,
          background: '#151c2c',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
        if (onSessionOpened) onSessionOpened();
      }
    } catch (error) {
      Swal.fire('Erreur', 'Impossible d\'ouvrir la session', 'error');
    }
  };

  return (
    <div className="bg-[#151c2c] p-10 rounded-[3rem] border-2 border-emerald-500/20 shadow-2xl max-w-lg mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <span className="material-symbols-rounded text-3xl text-emerald-500">point_of_sale</span>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Initialisation Caisse</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Taux actuel : 1$ = {config.rate} {config.secSymbol}</p>
      </div>
      
      <div className="space-y-6">
        {/* Champ USD */}
        <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5">
          <label className="text-[10px] font-black text-emerald-500 uppercase mb-2 block">Espèces en Dollars ($)</label>
          <div className="flex items-center">
            <input 
              type="number"
              value={amounts.usd}
              onChange={(e) => setAmounts({...amounts, usd: e.target.value})}
              placeholder="0.00"
              className="bg-transparent text-3xl font-black text-white outline-none w-full"
            />
            <span className="text-2xl opacity-20 text-white font-black">$</span>
          </div>
        </div>

        {/* Champ Monnaie Locale */}
        <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5">
          <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block">Espèces en {config.secSymbol}</label>
          <div className="flex items-center">
            <input 
              type="number"
              value={amounts.loc}
              onChange={(e) => setAmounts({...amounts, loc: e.target.value})}
              placeholder="0"
              className="bg-transparent text-3xl font-black text-white outline-none w-full"
            />
            <span className="text-xl opacity-20 text-white font-black">{config.secSymbol}</span>
          </div>
        </div>
      </div>

      {/* Résumé du total */}
      <div className="mt-8 px-4 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Total équivalent en coffre</p>
        <p className="text-xl font-black text-white">{totalEnUsd().toLocaleString()} $</p>
      </div>

      <button 
        onClick={handleOpenSession}
        className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20"
      >
        Ouvrir la caisse
      </button>
    </div>
  );
};

export default OuvertureCaisse;