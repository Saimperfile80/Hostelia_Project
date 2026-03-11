import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import OuvertureCaisse from './OuvertureCaisse';

const DashboardCaisse = () => {
  const [data, setData] = useState({
    usd: { solde: 0, cash: 0, digital: 0 },
    loc: { solde: 0, cash: 0, digital: 0 },
    rate: 2800,
    transactions: []
  });
  
  const [session, setSession] = useState({ opening_balance: 0, details: { usd: 0, loc: 0 } });
  const [config, setConfig] = useState({ currency: 'USD', secondary_currency: 'CDF' });
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchCaisseData = async () => {
    try {
      const [resStats, resFond, resConfig] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/caisse/stats'),
        fetch('http://127.0.0.1:8000/api/caisse/session'),
        fetch('http://127.0.0.1:8000/api/settings')
      ]);
      
      const stats = await resStats.json();
      const sessionData = await resFond.json();
      const settings = await resConfig.json();

      setData(stats);
      setSession(sessionData);
      setConfig(settings);
      setIsLoaded(true);
    } catch (err) { 
      console.error("Erreur récupération caisse:", err); 
    }
  };

  useEffect(() => {
    fetchCaisseData();
    const interval = setInterval(fetchCaisseData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- FONCTION IMPRESSION TICKET ---
  const imprimerTicketCloture = (d) => {
    const f = new Intl.NumberFormat('fr-FR');
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Z-CLOTURE-${new Date().getTime()}</title>
          <style>
            body { font-family: 'Courier New', monospace; width: 80mm; padding: 5px; font-size: 12px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .border-top { border-top: 1px dashed #000; margin-top: 8px; padding-top: 8px; }
            .flex { display: flex; justify-content: space-between; margin: 2px 0; }
            .header { font-size: 14px; text-transform: uppercase; }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="center header bold">Hostelia Resort</div>
          <div class="center">Rapport de Clôture</div>
          <div class="center">${new Date().toLocaleString()}</div>
          
          <div class="border-top">
            <div class="flex"><span>Taux:</span><span class="bold">1$ = ${d.taux} FC</span></div>
          </div>

          <div class="border-top bold">THEORIQUE (LOGICIEL)</div>
          <div class="flex"><span>Fond Initial:</span><span>${f.format(d.fondInitial)} $</span></div>
          <div class="flex"><span>Ventes USD:</span><span>${f.format(d.ventesUsd)} $</span></div>
          <div class="flex"><span>Ventes CDF:</span><span>${f.format(d.ventesLoc)} FC</span></div>
          
          <div class="border-top bold">PHYSIQUE (TIROIR)</div>
          <div class="flex"><span>Espèces USD:</span><span>${f.format(d.physiqueUsd)} $</span></div>
          <div class="flex"><span>Espèces CDF:</span><span>${f.format(d.physiqueLoc)} FC</span></div>

          <div class="border-top bold">ECARTS</div>
          <div class="flex"><span>Ecart USD:</span><span style="${d.gapUsd < 0 ? 'color:red' : ''}">${d.gapUsd.toFixed(2)} $</span></div>
          <div class="flex"><span>Ecart CDF:</span><span style="${d.gapLoc < 0 ? 'color:red' : ''}">${f.format(d.gapLoc)} FC</span></div>

          <div class="border-top center" style="margin-top: 20px;">
            <p>Signature Caissier<br><br><br>_________________</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };

  // --- LOGIQUE DE CLÔTURE ---
  const handleCloture = () => {
    const secSymbol = config?.secondary_currency?.split(' ')[0] || 'CDF';
    
    Swal.fire({
      title: 'Clôture Bimonétaire',
      background: '#151c2c',
      color: '#fff',
      html: `
        <div style="text-align: left; padding: 10px;">
          <label style="font-size: 10px; color: #10b981; font-weight: bold; text-transform: uppercase;">1. Espèces réelles en main (USD)</label>
          <input id="swal-usd" class="swal2-input" placeholder="0.00" type="number" style="background: #000; color: #fff; border: 1px solid #333; margin-bottom: 20px;">
          
          <label style="font-size: 10px; color: #3b82f6; font-weight: bold; text-transform: uppercase;">2. Espèces réelles en main (${secSymbol})</label>
          <input id="swal-loc" class="swal2-input" placeholder="0" type="number" style="background: #000; color: #fff; border: 1px solid #333;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Valider l\'inventaire',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const u = document.getElementById('swal-usd').value;
        const l = document.getElementById('swal-loc').value;
        if (!u && !l) {
            Swal.showValidationMessage('Veuillez saisir au moins un montant');
            return false;
        }
        return { usd: parseFloat(u) || 0, loc: parseFloat(l) || 0 };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const expectedUsd = session.details.usd + data.usd.cash;
        const expectedLoc = session.details.loc + data.loc.cash;
        const gapUsd = result.value.usd - expectedUsd;
        const gapLoc = result.value.loc - expectedLoc;

        try {
          const response = await fetch('http://127.0.0.1:8000/api/caisse/close', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              opening_balance: session.opening_balance,
              sales_usd: data.usd.solde,
              sales_loc: data.loc.solde,
              physical_usd: result.value.usd,
              physical_loc: result.value.loc,
              gap_usd: gapUsd,
              gap_loc: gapLoc
            })
          });

          if (response.ok) {
            Swal.fire({
              icon: 'success', 
              title: 'Session Close', 
              text: 'Voulez-vous imprimer le ticket de clôture ?',
              showCancelButton: true,
              confirmButtonText: 'Imprimer',
              cancelButtonText: 'Non, quitter',
              background: '#151c2c', color: '#fff'
            }).then((res) => {
              if (res.isConfirmed) {
                imprimerTicketCloture({
                  fondInitial: session.opening_balance,
                  ventesUsd: data.usd.solde,
                  ventesLoc: data.loc.solde,
                  physiqueUsd: result.value.usd,
                  physiqueLoc: result.value.loc,
                  gapUsd: gapUsd,
                  gapLoc: gapLoc,
                  taux: data.rate
                });
              }
              window.location.reload();
            });
          }
        } catch (err) {
          Swal.fire('Erreur', 'Echec de communication serveur', 'error');
        }
      }
    });
  };

  const handleDepot = () => {
    Swal.fire({
      title: 'Dépôt Rapide',
      input: 'number',
      inputLabel: 'Montant en USD à ajouter au tiroir',
      background: '#151c2c', color: '#fff',
      confirmButtonColor: '#10b981', showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Succès', 'Fonds ajoutés', 'success');
      }
    });
  };

  if (isLoaded && session.opening_balance === 0) {
    return <div className="min-h-[70vh] flex items-center justify-center"><OuvertureCaisse onSessionOpened={fetchCaisseData} /></div>;
  }

  const renderKPICard = (label, valUsd, valLoc, icon, colorClass, bgClass) => (
    <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-emerald-500/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
          <span className="material-symbols-rounded text-xl">{icon}</span>
        </div>
        <span className="text-[9px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded">LIVE</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
      <div className="space-y-1">
        <p className={`text-2xl font-black ${colorClass}`}>{valUsd.toLocaleString()} $</p>
        <p className="text-xs font-bold text-slate-400">{valLoc.toLocaleString()} {config?.secondary_currency?.split(' ')[0] || 'CDF'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-white font-black uppercase tracking-tighter text-2xl">Dashboard Caisse</h2>
          <p className="text-emerald-500 text-[10px] font-bold uppercase italic">Taux : 1 USD = {data.rate} {config?.secondary_currency?.split(' ')[0] || 'CDF'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderKPICard("Fond Initial", session.opening_balance, session.opening_balance * data.rate, "lock", "text-amber-500", "bg-amber-500/10")}
        {renderKPICard("Ventes Totales", data.usd.solde, data.loc.solde, "account_balance_wallet", "text-emerald-500", "bg-emerald-500/10")}
        {renderKPICard("Cash Entré", data.usd.cash, data.loc.cash, "payments", "text-blue-400", "bg-blue-400/10")}
        {renderKPICard("Digital / Carte", data.usd.digital, data.loc.digital, "credit_card", "text-purple-400", "bg-purple-400/10")}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-symbols-rounded text-emerald-500">history</span>
              Journal de la Session
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black">
                  <th className="px-8 py-5">Référence</th>
                  <th className="px-8 py-5 text-right">USD ($)</th>
                  <th className="px-8 py-5 text-right">{config?.secondary_currency?.split(' ')[0] || 'CDF'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {data.transactions.length > 0 ? data.transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4 text-xs font-bold">{tx.invoice_ref} <br/><span className="text-[9px] opacity-40 uppercase">{tx.method}</span></td>
                    <td className="px-8 py-4 text-right font-black text-emerald-400">{tx.amount.toFixed(2)} $</td>
                    <td className="px-8 py-4 text-right font-bold text-slate-500">{(tx.amount * data.rate).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-600 text-[10px] font-black uppercase">Session vide</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
            <h4 className="text-[10px] font-black uppercase opacity-60 mb-2">Attendu en Coffre</h4>
            <div className="mb-10">
               <p className="text-5xl font-black italic">{(session.opening_balance + data.usd.solde).toLocaleString()} $</p>
               <p className="text-sm font-bold opacity-80 mt-1">≈ {((session.opening_balance + data.usd.solde) * data.rate).toLocaleString()} {config?.secondary_currency?.split(' ')[0] || 'CDF'}</p>
            </div>
            
            <div className="grid gap-4">
              <button onClick={handleDepot} className="w-full bg-black/20 hover:bg-black/40 py-5 rounded-2xl font-black text-[10px] uppercase border border-white/10 flex items-center justify-center gap-3 transition-all">
                 <span className="material-symbols-rounded text-sm">add_circle</span> Dépôt Espèces
              </button>
              <button onClick={handleCloture} className="w-full bg-white text-emerald-900 py-5 rounded-2xl font-black text-[10px] uppercase shadow-xl flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all active:scale-95">
                 <span className="material-symbols-rounded text-sm">check_circle</span> Clôture de Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCaisse;