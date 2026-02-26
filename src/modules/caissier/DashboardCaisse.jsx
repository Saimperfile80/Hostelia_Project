import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import OuvertureCaisse from './OuvertureCaisse'; // Importation du nouveau fichier

const DashboardCaisse = () => {
  const [data, setData] = useState({
    solde: 0,
    cash: 0,
    digital: 0,
    ecarts: 0,
    transactions: []
  });
  
  const [fondDeCaisse, setFondDeCaisse] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Charger les statistiques et le fond de caisse
  const fetchCaisseData = async () => {
    try {
      // Récupérer les stats (Invoices)
      const resStats = await fetch('http://127.0.0.1:8000/api/caisse/stats');
      const resultStats = await resStats.json();
      
      // Récupérer le fond de caisse (Session)
      const resFond = await fetch('http://127.0.0.1:8000/api/caisse/session');
      const resultFond = await resFond.json();

      setData(resultStats);
      setFondDeCaisse(resultFond.opening_balance);
      setIsLoaded(true);
    } catch (err) {
      console.error("Erreur chargement caisse:", err);
    }
  };

  useEffect(() => {
    fetchCaisseData();
    const interval = setInterval(fetchCaisseData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Action : Déposer du Cash
  const handleDeposit = () => {
    Swal.fire({
      title: 'Dépôt de Fond de Caisse',
      input: 'number',
      inputLabel: 'Montant à ajouter ($)',
      inputPlaceholder: '0.00',
      background: '#151c2c',
      color: '#fff',
      confirmButtonColor: '#10b981',
      showCancelButton: true,
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Confirmer le dépôt'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Dépôt enregistré',
          text: `Le montant de ${result.value}$ a été ajouté.`,
          background: '#151c2c',
          color: '#fff'
        });
        fetchCaisseData(); // Actualiser
      }
    });
  };

  // Action : Clôture Rapide
  const handleClosing = () => {
    Swal.fire({
      title: 'Clôturer la session ?',
      html: `
        <div style="text-align: left; font-size: 0.8rem;">
          <p>Fond Initial: <b>${fondDeCaisse.toFixed(2)} $</b></p>
          <p>Ventes du jour: <b>${data.solde.toFixed(2)} $</b></p>
          <hr style="border: 0.1px solid #333; margin: 10px 0;">
          <p style="font-size: 1rem;">Total attendu: <b style="color: #10b981;">${(fondDeCaisse + data.solde).toFixed(2)} $</b></p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      background: '#151c2c',
      color: '#fff',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Oui, clôturer'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Session Clôturée', icon: 'success', background: '#151c2c', color: '#fff' });
      }
    });
  };

  // --- CONDITION DE SÉCURITÉ ---
  // Si le fond de caisse est à 0, on force l'ouverture avant d'afficher le Dashboard
  if (isLoaded && fondDeCaisse === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <OuvertureCaisse onSessionOpened={fetchCaisseData} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Résumé de la Session Actuelle (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Fonds de Caisse (Initial)", value: `${fondDeCaisse.toFixed(2)} $`, icon: "lock", color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Ventes du Jour (Total)", value: `${data.solde.toFixed(2)} $`, icon: "account_balance_wallet", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Entrées (Espèces)", value: `${data.cash.toFixed(2)} $`, icon: "payments", color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Paiements Digitaux", value: `${data.digital.toFixed(2)} $`, icon: "credit_card", color: "text-purple-400", bg: "bg-purple-400/10" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-emerald-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <span className="material-symbols-rounded text-xl">{kpi.icon}</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Dernières Transactions */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-rounded text-emerald-500 text-xl">history</span>
              Journal de Caisse (Session)
            </h3>
            <button onClick={fetchCaisseData} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
              Actualiser
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-8 py-5">Réf / Heure</th>
                  <th className="px-8 py-5">Source / Client</th>
                  <th className="px-8 py-5">Mode</th>
                  <th className="px-8 py-5 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.transactions.length > 0 ? data.transactions.map((tx, i) => (
                  <tr key={i} className="text-white hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4 text-xs font-bold uppercase">{tx.invoice_ref || 'TRX-MOD'}</td>
                    <td className="px-8 py-4 text-xs">{tx.guest_name}</td>
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase font-black">{tx.method}</span>
                    </td>
                    <td className="px-8 py-4 text-right font-black text-emerald-400">{tx.amount.toFixed(2)} $</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-8 py-24 text-center opacity-20">Aucune transaction</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Actions Rapides */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/20 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total en Coffre</h4>
              <p className="text-4xl font-black italic mb-6">{(fondDeCaisse + data.solde).toFixed(2)} $</p>
              
              <div className="space-y-3">
                <button onClick={handleDeposit} className="w-full bg-black/20 hover:bg-black/40 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 flex items-center justify-center gap-3">
                   <span className="material-symbols-rounded text-sm">move_to_inbox</span> Déposer du Cash
                </button>
                <button onClick={handleClosing} className="w-full bg-white text-emerald-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                   <span className="material-symbols-rounded text-sm">logout</span> Clôture Rapide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCaisse;