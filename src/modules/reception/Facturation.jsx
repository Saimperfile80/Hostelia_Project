import React, { useState, useEffect } from 'react';

const Facturation = () => {
  const [billingData, setBillingData] = useState({
    kpi: { day: 0, pending: 0, total: 0, unpaid: 0 },
    transactions: [],
    methods: { 'Carte Bancaire': 0, 'Espèces': 0, 'Virement/Autres': 0 }
  });

  const fetchData = () => {
    fetch('http://127.0.0.1:8000/api/billing/stats')
      .then(res => res.json())
      .then(data => setBillingData(data))
      .catch(err => console.error("Erreur chargement facturation:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIQUE DE GÉNÉRATION DE REÇU PDF ---
  const generateReceipt = (transaction) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu Hostelia - ${transaction.invoice_ref}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .details { margin-top: 30px; line-height: 1.6; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
            .price { font-size: 24px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HOSTELIA RESORT</h1>
            <p>Facture N° : ${transaction.invoice_ref}</p>
          </div>
          <div class="details">
            <p><strong>Client :</strong> ${transaction.guest_name}</p>
            <p><strong>Date :</strong> ${transaction.date}</p>
            <p><strong>Mode de paiement :</strong> ${transaction.method}</p>
            <p><strong>Statut :</strong> ${transaction.status}</p>
            <div class="price">TOTAL : ${transaction.amount} $</div>
          </div>
          <div class="footer">
            <p>Merci de votre visite. Ce document sert de preuve de paiement.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleAction = (type) => {
    if (type === 'summarize') {
       window.location.hash = "#rapport-reception"; // Redirige vers rapports
    } else if (type === 'history') {
       window.print(); // Imprime la liste actuelle de la page
    } else if (type === 'receipt') {
       if(billingData.transactions.length > 0) {
         generateReceipt(billingData.transactions[0]); // Génère pour la dernière transaction
       } else {
         alert("Aucune donnée de caisse disponible pour générer un reçu.");
       }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Revenu du Jour" val={billingData.kpi.day} color="blue" />
        <KPICard label="En Attente" val={billingData.kpi.pending} color="amber" />
        <KPICard label="Total Encaissé" val={billingData.kpi.total} color="emerald" />
        <KPICard label="Impayés" val={billingData.kpi.unpaid} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Tableau des Transactions Récentes */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons-round text-blue-500">receipt_long</span>
              Flux de Caisse Direct
            </h3>
            <button onClick={fetchData} className="text-white/50 hover:text-white transition-colors">
                <span className="material-icons-round text-sm">refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-8 py-5">Facture</th>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5">Mode</th>
                  <th className="px-8 py-5">Statut</th>
                  <th className="px-8 py-5 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {billingData.transactions.length > 0 ? (
                  billingData.transactions.map((tr) => (
                    <tr key={tr.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => generateReceipt(tr)}>
                      <td className="px-8 py-5 text-xs font-bold text-blue-400">{tr.invoice_ref}</td>
                      <td className="px-8 py-5 text-xs text-white uppercase">{tr.guest_name}</td>
                      <td className="px-8 py-5 text-[10px] text-slate-400 font-bold">{tr.method}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${tr.status === 'Payé' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {tr.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-xs font-black text-white">{tr.amount} $</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <span className="material-icons-round text-6xl mb-4 text-slate-400">payments</span>
                        <p className="text-xl font-bold uppercase tracking-[0.3em] text-slate-300">En attente de la caisse...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Sidebar de Gestion Financière */}
        <div className="space-y-6">
          <div className="bg-[#151c2c] border border-white/5 rounded-[2rem] p-8 shadow-xl">
            <h3 className="font-black mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white">
              <span className="material-icons-round text-blue-500">donut_large</span>
              Modes de Paiement
            </h3>
            <div className="space-y-6">
              <MethodBar label="Carte Bancaire" color="bg-blue-500" percent={billingData.methods['Carte Bancaire'] || 0} />
              <MethodBar label="Espèces" color="bg-emerald-500" percent={billingData.methods['Espèces'] || 0} />
              <MethodBar label="Virement/Autres" color="bg-amber-500" percent={billingData.methods['Virement/Autres'] || 0} />
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2rem] p-8 shadow-xl">
            <h3 className="font-black mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-blue-400">
              <span className="material-icons-round">bolt</span>
              Actions de Sortie
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: 'Générer un reçu', desc: 'Imprimer la dernière vente', icon: 'receipt', key: 'receipt' },
                { title: 'Historique de caisse', desc: 'Exporter la liste PDF', icon: 'history', key: 'history' },
                { title: 'Rapport mensuel', desc: 'Statistiques de revenus', icon: 'summarize', key: 'summarize' }
              ].map((action) => (
                <button 
                  key={action.title} 
                  onClick={() => handleAction(action.key)}
                  className="flex items-center gap-4 p-4 bg-[#151c2c] hover:bg-[#1e273a] rounded-2xl border border-white/5 transition-all text-left group"
                >
                  <div className="bg-blue-600/10 p-2 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round">{action.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight">{action.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, val, color }) => (
  <div className={`bg-${color}-600/10 border border-${color}-500/20 p-6 rounded-[2rem] shadow-xl`}>
    <p className={`text-[10px] font-black uppercase tracking-widest text-${color}-400 mb-2`}>{label}</p>
    <h3 className="text-3xl font-black text-white">{val} $</h3>
  </div>
);

const MethodBar = ({ label, color, percent }) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter mb-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{percent}%</span>
    </div>
    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Facturation;