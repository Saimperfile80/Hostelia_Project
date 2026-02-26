import React, { useState, useEffect } from 'react';

const Rapports = () => {
  const [activePeriod, setActivePeriod] = useState('Mois');
  // Initialisation TRÈS robuste
  const [reportData, setReportData] = useState({
    occupancy_rate: 0,
    revenue_split: { standard: 0, vip: 0, extras: 0, total: 0 },
    details: []
  });

  const fetchReport = (period) => {
    const p = period.toLowerCase();
    fetch(`http://127.0.0.1:8000/api/reports/reception?period=${p}`)
      .then(res => res.json())
      .then(data => {
        // Sécurité : on fusionne les données reçues avec la structure par défaut
        setReportData({
          occupancy_rate: data.occupancy_rate || 0,
          revenue_split: {
            standard: data.revenue_split?.standard || 0,
            vip: data.revenue_split?.vip || 0,
            extras: data.revenue_split?.extras || 0,
            total: data.revenue_split?.total || 0
          },
          details: data.details || []
        });
      })
      .catch(err => console.error("Erreur rapport:", err));
  };

  useEffect(() => {
    fetchReport(activePeriod);
  }, [activePeriod]);

  // --- FONCTION D'EXPORT PDF ---
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    const dateStr = new Date().toLocaleDateString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Rapport de Réception - ${dateStr}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
            h1 { color: #1e40af; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .kpi-box { display: flex; gap: 20px; margin: 20px 0; }
            .kpi { padding: 15px; border: 1px solid #ddd; border-radius: 8px; flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Rapport d'Activité Réception - Hostelia</h1>
          <p>Période : <strong>${activePeriod}</strong> | Généré le : ${dateStr}</p>
          
          <div class="kpi-box">
            <div class="kpi">Taux d'Occupation : <strong>${reportData.occupancy_rate}%</strong></div>
            <div class="kpi">Revenu Total : <strong>${reportData.revenue_split.total} $</strong></div>
          </div>

          <h3>Détails par Type de Chambre</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th><th>Nuitées</th><th>ADR ($)</th><th>RevPAR ($)</th><th>Total ($)</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.details.map(d => `
                <tr>
                  <td>${d.type}</td><td>${d.nuitees}</td><td>${d.adr}</td><td>${d.revpar}</td><td>${d.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Calcul du pourcentage pour les barres de revenus
  const getPercent = (val) => {
    if (reportData.revenue_split.total === 0) return 0;
    return (val / reportData.revenue_split.total) * 100;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Sélecteur de Période et Export */}
      <div className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
            {['Jour', 'Semaine', 'Mois', 'Année'].map((period) => (
              <button 
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-6 py-2 text-xs font-black rounded-lg transition-all ${
                  activePeriod === period ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-bold">
            <span className="material-icons-round text-sm">calendar_today</span>
            Personnalisé
          </button>
        </div>

        <button 
          onClick={handleExportPDF}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all"
        >
          <span className="material-icons-round text-sm">description</span>
          EXPORTER LE RAPPORT (PDF)
        </button>
      </div>

      {/* 2. Vue d'ensemble Analytique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons-round text-blue-500">analytics</span>
              Taux d'Occupation (%)
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Moyenne: {reportData.occupancy_rate}%</span>
          </div>
          
          <div className="h-64 w-full flex items-end justify-around pb-2 px-4 relative">
             {/* Graphique simple en barres (Simulation) */}
             {[40, 65, 80, reportData.occupancy_rate, 55, 70, 90].map((h, i) => (
                <div key={i} className="w-8 bg-blue-600/20 hover:bg-blue-600 rounded-t-lg transition-all duration-500 relative group" style={{height: `${h}%`}}>
                   <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">{h}%</span>
                </div>
             ))}
             <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none border-b border-l border-white/20">
                {[1,2,3,4].map(l => <div key={l} className="border-t border-white w-full"></div>)}
             </div>
          </div>
        </div>

        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-icons-round text-emerald-500">pie_chart</span>
            Répartition Revenus
          </h3>
          <div className="space-y-6">
            <MethodBar label="Chambres Standard" val={reportData.revenue_split.standard} percent={getPercent(reportData.revenue_split.standard)} />
            <MethodBar label="Suites VIP" val={reportData.revenue_split.vip} percent={getPercent(reportData.revenue_split.vip)} />
            <MethodBar label="Services / Extras" val={reportData.revenue_split.extras} percent={getPercent(reportData.revenue_split.extras)} />
          </div>
          <div className="mt-10 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
            <p className="text-[10px] text-blue-400 font-black uppercase mb-1">Total {activePeriod}</p>
            <p className="text-2xl font-black text-white">{reportData.revenue_split.total} $</p>
          </div>
        </div>
      </div>

      {/* 3. Tableau Récapitulatif */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-icons-round text-amber-500">table_chart</span>
            Détails par Type de Chambre
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Type de Chambre</th>
                <th className="px-8 py-5 text-center">Nuitées</th>
                <th className="px-8 py-5 text-center">Prix Moyen (ADR)</th>
                <th className="px-8 py-5 text-center">RevPAR</th>
                <th className="px-8 py-5 text-right">Revenu Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reportData.details.length > 0 ? reportData.details.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 text-xs font-bold text-white uppercase">{item.type}</td>
                  <td className="px-8 py-5 text-center text-xs text-slate-300 font-bold">{item.nuitees}</td>
                  <td className="px-8 py-5 text-center text-xs text-slate-300 font-bold">{item.adr} $</td>
                  <td className="px-8 py-5 text-center text-xs text-emerald-400 font-black">{item.revpar} $</td>
                  <td className="px-8 py-5 text-right text-xs font-black text-white">{item.total} $</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <span className="text-slate-600 text-sm italic font-medium uppercase tracking-[0.2em]">Aucune donnée sur cette période</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MethodBar = ({ label, val, percent }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-bold uppercase">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{val} $</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${percent}%`}}></div>
    </div>
  </div>
);

export default Rapports;