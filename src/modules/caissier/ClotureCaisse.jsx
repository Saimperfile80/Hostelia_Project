import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ClotureCaisse = () => {
  const [stats, setStats] = useState({ cash: 0, digital: 0, solde: 0 });
  const [fondInitial, setFondInitial] = useState(0);
  const [declaredCash, setDeclaredCash] = useState('');
  const [declaredDigital, setDeclaredDigital] = useState('');

  // 1. Charger les données
  const fetchSessionData = async () => {
    try {
      const resStats = await fetch('http://127.0.0.1:8000/api/caisse/stats');
      const dataStats = await resStats.json();
      const resFond = await fetch('http://127.0.0.1:8000/api/caisse/session');
      const dataFond = await resFond.json();

      setStats(dataStats);
      setFondInitial(dataFond.opening_balance);
    } catch (err) {
      console.error("Erreur de synchronisation clôture:", err);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  // 2. Calculs
  const attenduTotal = fondInitial + stats.cash + stats.digital;
  const declareTotal = (parseFloat(declaredCash) || 0) + (parseFloat(declaredDigital) || 0);
  const ecart = declareTotal - attenduTotal;

  // --- ACTION : IMPRIMER LE RAPPORT ---
  const handlePrint = () => {
    window.print(); 
  };

  // --- ACTION : VOIR HISTORIQUE ---
  const handleShowHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/caisse/history'); // Assure-toi que cette route existe en Python
      const history = await res.json();
      
      const historyHtml = history.length > 0 ? history.map(h => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333; font-size:12px;">
          <span>${h.date}</span>
          <span style="font-weight:bold; color:${h.gap < 0 ? '#f87171' : '#10b981'}">Écart: ${h.gap.toFixed(2)}$</span>
        </div>
      `).join('') : '<p>Aucun historique disponible</p>';

      Swal.fire({
        title: 'Dernières Clôtures',
        html: `<div style="text-align:left; max-height:300px; overflow-y:auto;">${historyHtml}</div>`,
        background: '#151c2c',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de charger l\'historique', 'error');
    }
  };

  // 3. Action de clôture
  const handleFinalClose = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirmer la clôture Z ?',
      text: "Les données de vente seront archivées et remises à zéro.",
      icon: 'warning',
      showCancelButton: true,
      background: '#151c2c',
      color: '#fff',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Valider et Archiver'
    });

    if (isConfirmed) {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/caisse/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            opening_balance: fondInitial,
            sales_cash: stats.cash,
            sales_digital: stats.digital,
            physical_cash: parseFloat(declaredCash) || 0,
            gap: ecart
          })
        });
        
        if (res.ok) {
          await Swal.fire({ title: 'Session Clôturée !', text: 'Le tiroir-caisse a été remis à zéro.', icon: 'success', background: '#151c2c' });
          // Redirection ou Refresh pour vider le dashboard
          window.location.href = '/dashboard'; 
        }
      } catch (err) {
        Swal.fire('Erreur', 'Serveur injoignable', 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Alerte de Sécurité */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] flex items-start gap-4">
        <span className="material-icons text-amber-500">warning</span>
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Attention</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            La validation de la clôture est définitive. Elle archivera toutes les transactions de la session actuelle et réinitialisera le tiroir-caisse.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 2. Formulaire de Comptage Physique */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl space-y-6">
          <h3 className="font-black text-sm uppercase tracking-widest text-white flex items-center gap-3">
            <span className="material-icons text-emerald-500">payments</span>
            Comptage Physique
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Espèces déclarées (Cash)</label>
              <input 
                type="number" 
                value={declaredCash}
                onChange={(e) => setDeclaredCash(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Total Cartes / Digitaux</label>
              <input 
                type="number" 
                value={declaredDigital}
                onChange={(e) => setDeclaredDigital(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
             <button className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all">
               Calculatrice de billets
             </button>
          </div>
        </div>

        {/* 3. Résumé du Système vs Réel */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-white flex items-center gap-3">
              <span className="material-icons text-emerald-500">balance</span>
              Vérification Système
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Attendu (Système)</span>
                <span className="text-lg font-black text-white">{attenduTotal.toFixed(2)} $</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Déclaré (Réel)</span>
                <span className="text-lg font-black text-white">{declareTotal.toFixed(2)} $</span>
              </div>
              <div className={`flex justify-between items-center p-4 rounded-2xl border ${ecart === 0 ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${ecart === 0 ? 'text-emerald-500' : 'text-red-500'}`}>Écart / Différence</span>
                <span className={`text-lg font-black ${ecart === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{ecart.toFixed(2)} $</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button 
              onClick={handleFinalClose}
              disabled={!declaredCash}
              className={`w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${declaredCash ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}>
              Valider la clôture (Z)
            </button>
          </div>
        </div>

      </div>

      {/* 4. Actions Additionnelles BRANCHÉES */}
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-3 p-6 rounded-[2rem] bg-[#151c2c] border border-white/5 hover:bg-white/5 transition-all group">
          <span className="material-icons text-slate-500 group-hover:text-emerald-500">print</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Imprimer rapport de session</span>
        </button>
        <button 
          onClick={handleShowHistory}
          className="flex-1 flex items-center justify-center gap-3 p-6 rounded-[2rem] bg-[#151c2c] border border-white/5 hover:bg-white/5 transition-all group">
          <span className="material-icons text-slate-500 group-hover:text-emerald-500">history</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Voir dernières clôtures</span>
        </button>
      </div>

    </div>
  );
};

export default ClotureCaisse;