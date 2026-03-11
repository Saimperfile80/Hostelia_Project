import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const HistoriqueTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ count: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `http://127.0.0.1:8000/api/caisse/payments/all${searchTerm ? `?search=${searchTerm}` : ''}`
        : `http://127.0.0.1:8000/api/caisse/history/all`;
      const res = await fetch(url);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setStats({ count: data.count || 0, total: data.total_sum || 0 });
    } catch (err) { console.error("Erreur fetch"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchTransactions(); }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // --- NOUVELLES FONCTIONS ---
  const handleExport = () => {
    window.location.href = "http://127.0.0.1:8000/api/caisse/history/export";
  };

  const handleViewDetails = (t) => {
    Swal.fire({
      title: `Détails ${t.invoice_ref}`,
      html: `<div style="text-align:left; font-size:14px;">
                <p><b>Client:</b> ${t.guest_name}</p>
                <p><b>Montant:</b> ${t.amount} $</p>
                <p><b>Méthode:</b> ${t.method}</p>
                <p><b>Date:</b> ${t.date}</p>
             </div>`,
      background: '#151c2c',
      color: '#fff',
      confirmButtonColor: '#10b981'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Barre de Recherche et Filtres */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N° de facture, client ou chambre..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">filter_alt</span> Filtres
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">calendar_month</span> Période
          </button>
        </div>
      </div>

      {/* 2. Tableau */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-emerald-500">receipt_long</span>
            Archives des Paiements
          </h3>
          <span className="text-[10px] font-black text-slate-500 uppercase bg-black/40 px-4 py-1.5 rounded-full border border-white/5">
            {stats.count} Transactions trouvées
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Référence</th>
                <th className="px-8 py-5">Date & Heure</th>
                <th className="px-8 py-5">Client / Source</th>
                <th className="px-8 py-5">Mode de Paiement</th>
                <th className="px-8 py-5 text-right">Montant Total</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 text-xs font-black text-emerald-500">{t.invoice_ref}</td>
                      <td className="px-8 py-5 text-[10px] font-bold text-slate-400">{t.date}</td>
                      <td className="px-8 py-5 text-xs font-bold text-white uppercase">{t.guest_name}</td>
                      <td className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.method}</td>
                      <td className="px-8 py-5 text-right text-xs font-black text-white">{t.amount.toFixed(2)} $</td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-full uppercase italic">Payé</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button 
                          onClick={() => handleViewDetails(t)}
                          className="text-slate-600 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                         </button>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center opacity-10">
                      <span className="material-symbols-outlined text-7xl mb-4">database_off</span>
                      <p className="text-xl font-black uppercase tracking-[0.3em]">Aucun historique</p>
                      <p className="text-[10px] font-bold uppercase mt-2 tracking-widest">Lancez une recherche ou changez les filtres de date</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/10">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Page 1 sur 1</p>
           <div className="flex gap-2">
             <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-emerald-500 transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
             </button>
             <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-emerald-500 transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
             </button>
           </div>
        </div>
      </div>

      {/* 3. Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600/5 border border-emerald-500/20 p-6 rounded-[2rem] flex flex-col gap-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sélectionné</p>
           <p className="text-2xl font-black text-white">{stats.total.toFixed(2)} $</p>
        </div>
        <div className="bg-[#151c2c] border border-white/5 p-6 rounded-[2rem] flex flex-col gap-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volume Transactions</p>
           <p className="text-2xl font-black text-white">{stats.count}</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-[#151c2c] border border-white/5 p-6 rounded-[2rem] flex items-center justify-center gap-4 hover:border-emerald-500/50 transition-all group">
           <span className="material-symbols-outlined text-slate-500 group-hover:text-emerald-500">cloud_download</span>
           <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Exporter le journal</span>
        </button>
      </div>
    </div>
  );
};

export default HistoriqueTransactions;