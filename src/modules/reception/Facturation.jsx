import React, { useState, useEffect } from 'react';

const Facturation = ({ setMenu }) => {
  const [billingData, setBillingData] = useState({
    kpi: { day: 0, pending: 0, total: 0, unpaid: 0 },
    transactions: [],
    methods: { 'Carte Bancaire': 0, 'Espèces': 0, 'Virement/Autres': 0 }
  });
  
  // On récupère le taux depuis les réglages pour la conversion visuelle
  const [rate, setRate] = useState(2800);
  const [currencyLabels, setCurrencyLabels] = useState({ main: 'USD', sec: 'CDF' });

  const fetchData = async () => {
    try {
      const [resBilling, resSettings] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/billing/stats'),
        fetch('http://127.0.0.1:8000/api/settings')
      ]);
      
      const bData = await resBilling.json();
      const sData = await resSettings.json();
      
      setBillingData(bData);
      setRate(sData.exchange_rate || 2800);
      setCurrencyLabels({
        main: sData.currency?.split(' ')[0] || 'USD',
        sec: sData.secondary_currency?.split(' ')[0] || 'CDF'
      });
    } catch (err) { console.error("Erreur API Facturation:", err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- REÇU PROFESSIONNEL AMÉLIORÉ ---
  const generateReceipt = (transaction) => {
    const printWindow = window.open('', '_blank');
    const totalLocal = (transaction.amount * rate).toLocaleString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu - ${transaction.invoice_ref}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .details { margin: 20px 0; }
            .total { font-size: 1.5em; font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }
            .footer { text-align: center; margin-top: 50px; font-size: 0.8em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>HOSTELIA RESORT</h2>
            <p>Facture N°: ${transaction.invoice_ref}</p>
            <p>Date: ${transaction.date}</p>
          </div>
          <div class="details">
            <p><strong>Client:</strong> ${transaction.guest_name}</p>
            <p><strong>Mode de paiement:</strong> ${transaction.method}</p>
          </div>
          <div class="total">
            <p>TOTAL USD: ${transaction.amount.toFixed(2)} $</p>
            <p>TOTAL ${currencyLabels.sec}: ${totalLocal}</p>
          </div>
          <p style="font-size: 0.7em;">Taux appliqué: 1 USD = ${rate} ${currencyLabels.sec}</p>
          <div class="footer">
            <p>Merci de votre visite !</p>
            <p>Logiciel de Gestion Hostelia V3.0</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* KPI Cards avec Double Devises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Revenu du Jour" val={billingData.kpi.day} rate={rate} secLabel={currencyLabels.sec} color="blue" />
        <KPICard label="En Attente" val={billingData.kpi.pending} rate={rate} secLabel={currencyLabels.sec} color="amber" />
        <KPICard label="Total Encaissé" val={billingData.kpi.total} rate={rate} secLabel={currencyLabels.sec} color="emerald" />
        <KPICard label="Impayés / Annulés" val={billingData.kpi.unpaid} rate={rate} secLabel={currencyLabels.sec} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table des Transactions */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div>
              <h3 className="font-black text-sm text-white uppercase tracking-widest flex items-center gap-3">
                <span className="material-icons-round text-blue-500">receipt_long</span>
                Transactions de Caisse
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase">Journal des flux financiers entrants</p>
            </div>
            <button onClick={fetchData} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <span className="material-icons-round text-sm">refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-8 py-5">Référence</th>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5">Statut</th>
                  <th className="px-8 py-5 text-right">Montant ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {billingData.transactions.map((tr) => (
                  <tr key={tr.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group" onClick={() => generateReceipt(tr)}>
                    <td className="px-8 py-5 text-xs font-bold text-blue-400 group-hover:underline">{tr.invoice_ref}</td>
                    <td className="px-8 py-5 text-xs text-white uppercase font-medium">{tr.guest_name}</td>
                    <td className="px-8 py-5 text-[9px]">
                      <span className={`px-3 py-1 rounded-full font-black tracking-tighter ${tr.status === 'Payé' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {tr.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-xs font-black text-white">{tr.amount.toLocaleString()} $</p>
                      <p className="text-[9px] text-slate-500">{(tr.amount * rate).toLocaleString()} {currencyLabels.sec}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Actions & Stats */}
        <div className="space-y-6">
          <div className="bg-[#151c2c] border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
             <h3 className="font-black mb-8 text-[10px] uppercase text-slate-400 tracking-widest">Mix des règlements</h3>
             <div className="space-y-6">
                <MethodBar label="Cartes" color="bg-blue-500" percent={billingData.methods['Carte Bancaire']} />
                <MethodBar label="Espèces" color="bg-emerald-500" percent={billingData.methods['Espèces']} />
                <MethodBar label="Autres" color="bg-purple-500" percent={billingData.methods['Virement/Autres']} />
             </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="font-black mb-6 text-[10px] uppercase text-blue-400 tracking-widest">Outils de Gestion</h3>
            <div className="space-y-3">
              <ActionButton onClick={() => handleAction('receipt')} icon="receipt" title="Générer reçu" desc="Réimprimer dernier" color="blue" />
              <ActionButton onClick={() => handleAction('history')} icon="history" title="Journal complet" desc="Archive transactions" color="emerald" />
              <ActionButton onClick={() => handleAction('summarize')} icon="summarize" title="Rapports PDF" desc="Exports financiers" color="amber" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANTS AUXILIAIRES ---
const ActionButton = ({ onClick, icon, title, desc, color }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-4 bg-[#151c2c]/50 hover:bg-[#151c2c] rounded-2xl border border-white/5 transition-all text-left group">
    <div className={`bg-${color}-500/10 p-2 rounded-xl text-${color}-500 group-hover:scale-110 transition-transform`}>
      <span className="material-icons-round text-xl">{icon}</span>
    </div>
    <div>
      <p className="text-[10px] font-black text-white uppercase tracking-tighter">{title}</p>
      <p className="text-[9px] text-slate-500">{desc}</p>
    </div>
  </button>
);

const KPICard = ({ label, val, rate, secLabel, color }) => {
  const colors = {
    blue: "from-blue-500/20 to-transparent border-blue-500/20 text-blue-400",
    amber: "from-amber-500/20 to-transparent border-amber-500/20 text-amber-400",
    emerald: "from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400",
    rose: "from-rose-500/20 to-transparent border-rose-500/20 text-rose-400",
  };

  return (
    <div className={`bg-gradient-to-tr ${colors[color]} border p-7 rounded-[2.5rem] shadow-xl relative overflow-hidden`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-3">{label}</p>
      <h3 className="text-3xl font-black text-white mb-1">{val.toLocaleString()} $</h3>
      <p className="text-[11px] font-bold text-slate-400 italic">≈ {(val * rate).toLocaleString()} {secLabel}</p>
      <div className="absolute -right-4 -bottom-4 opacity-5">
         <span className="material-icons-round text-8xl">payments</span>
      </div>
    </div>
  );
};

const MethodBar = ({ label, color, percent }) => (
  <div>
    <div className="flex justify-between text-[9px] font-black uppercase mb-2 tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className="text-white">{percent}%</span>
    </div>
    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Facturation;