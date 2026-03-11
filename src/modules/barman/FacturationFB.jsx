import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const FacturationFB = () => {
  const [pendingBills, setPendingBills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resPending, resTrans] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/fb/pending_bills'),
        fetch('http://127.0.0.1:8000/api/fb/transactions/today')
      ]);
      setPendingBills(await resPending.json());
      setTransactions(await resTrans.json());
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- LOGIQUE RÉPARÉE POUR LES BOUTONS D'IMPRESSION ---
  const handlePrintAction = async (type) => {
    try {
      Swal.fire({
        title: 'Impression...',
        text: `Génération du ${type}`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: '#151c2c',
        color: '#fff'
      });

      const res = await fetch(`http://127.0.0.1:8000/api/fb/print`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: type })
      });

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Imprimé !', text: `${type} envoyé à l'imprimante.`, timer: 2000, showConfirmButton: false });
      } else {
        throw new Error();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Imprimante non détectée ou serveur hors ligne.', background: '#151c2c' });
    }
  };

  // --- LOGIQUE SPÉCIFIQUE POUR LA CLÔTURE (Z) ---
  const handleClotureZ = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/fb/report_z');
      const data = await res.json();

      if (!data.details || data.details.length === 0) {
        return Swal.fire({ icon: 'info', title: 'Caisse vide', text: 'Aucune transaction aujourd\'hui.', background: '#151c2c', color: '#fff' });
      }

      const listHtml = data.details.map(d => 
        `<div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px;">
          <span>${d.payment_mode}:</span>
          <span style="font-weight:bold; color:#ea580c">${d.total.toFixed(2)} $</span>
        </div>`
      ).join('');

      const { isConfirmed } = await Swal.fire({
        title: 'Bilan de Clôture (Z)',
        html: `
          <div style="text-align:left; font-family:monospace; padding:15px; background:rgba(255,255,255,0.05); border-radius:15px; border:1px solid rgba(255,255,255,0.1)">
            <p style="font-size:10px; opacity:0.6; margin-bottom:15px;">DATE: ${data.date}</p>
            ${listHtml}
            <hr style="border:0; border-top:1px dashed rgba(255,255,255,0.2); margin:15px 0;">
            <div style="font-size:18px; font-weight:900; display:flex; justify-content:space-between; color:#fff;">
              <span>TOTAL:</span>
              <span>${data.grand_total.toFixed(2)} $</span>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Imprimer & Clôturer',
        confirmButtonColor: '#ea580c',
        background: '#151c2c',
        color: '#fff'
      });

      if (isConfirmed) {
        handlePrintAction('Rapport Z / Clôture');
      }
    } catch (err) {
      Swal.fire('Erreur', 'Serveur injoignable', 'error');
    }
  };

  const handlePayment = async (bill) => {
    const { value: mode } = await Swal.fire({
      title: `Paiement ${bill.table_number}`,
      text: `Montant à percevoir : ${bill.total_amount.toFixed(2)} $`,
      input: 'select',
      inputOptions: { 
        'Espèces': 'Espèces', 
        'Carte': 'Carte', 
        'Chambre': 'Sur la chambre' 
      },
      inputPlaceholder: 'Choisir le mode',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      background: '#151c2c',
      color: '#fff'
    });

    if (mode) {
      if (mode === 'Chambre') {
        try {
          const resRooms = await fetch('http://127.0.0.1:8000/api/rooms');
          const data = await resRooms.json();
          const activeRooms = data.rooms.filter(room => room.status === 'Occupée');

          if (activeRooms.length === 0) {
            return Swal.fire({ icon: 'error', title: 'Erreur', text: 'Aucune chambre occupée.', background: '#151c2c', color: '#fff' });
          }

          const roomOptions = {};
          activeRooms.forEach(room => { roomOptions[room.room_number] = `Chambre ${room.room_number}`; });

          const { value: roomNum } = await Swal.fire({
            title: 'Facturation sur Chambre',
            input: 'select',
            inputOptions: roomOptions,
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            background: '#151c2c',
            color: '#fff'
          });

          if (roomNum) {
            const res = await fetch('http://127.0.0.1:8000/api/fb/pay_to_room', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: bill.id,
                table_number: bill.table_number,
                amount: bill.total_amount,
                room_number: roomNum
              })
            });
            const result = await res.json();
            if (result.status === 'success') {
              Swal.fire({ icon: 'success', title: 'Transféré à la Réception', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
              fetchData();
            }
          }
        } catch (err) { Swal.fire('Erreur', 'Serveur indisponible', 'error'); }
      } 
      else {
        const res = await fetch('http://127.0.0.1:8000/api/fb/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: bill.id,
            table_number: bill.table_number,
            amount: bill.total_amount,
            payment_mode: mode
          })
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Facture clôturée', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
          fetchData();
        }
      }
    }
  };

  const totalEncaisse = transactions.reduce((acc, t) => acc + t.amount, 0);
  const moyenneCouvert = transactions.length > 0 ? (totalEncaisse / transactions.length).toFixed(2) : "--";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-orange-500">point_of_sale</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Encaissé (Jour)</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">{totalEncaisse.toFixed(2)} $</h3>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Factures en Attente</p>
          <h3 className="text-3xl font-black text-orange-500 tracking-tighter">{pendingBills.length}</h3>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Moyenne / Couvert</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">{moyenneCouvert} $</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#151c2c] rounded-[2.5rem] border border-orange-500/20 shadow-2xl overflow-hidden">
             <div className="p-6 bg-orange-500/5 border-b border-white/5">
                <h3 className="text-xs font-black uppercase text-orange-500 flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">hourglass_empty</span> Factures prêtes pour encaissement
                </h3>
             </div>
             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingBills.map(bill => (
                   <div key={bill.id} onClick={() => handlePayment(bill)} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-orange-500 cursor-pointer transition-all flex justify-between items-center group">
                      <div>
                        <p className="text-white font-black text-sm group-hover:text-orange-500 transition-colors">{bill.table_number}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{new Date(bill.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white">{bill.total_amount.toFixed(2)} $</p>
                        <span className="text-[8px] font-bold text-orange-500/50 uppercase">Cliquer pour payer</span>
                      </div>
                   </div>
                ))}
                {pendingBills.length === 0 && <p className="col-span-full text-center py-6 text-[10px] text-slate-600 uppercase font-black">Tout est encaissé !</p>}
             </div>
          </div>

          <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
              <h3 className="font-black text-sm uppercase tracking-widest text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500">history_edu</span>
                Historique des Paiements
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                    <th className="px-8 py-5">N°</th>
                    <th className="px-8 py-5">Table</th>
                    <th className="px-8 py-5">Mode</th>
                    <th className="px-8 py-5 text-right">Montant</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map(t => (
                    <tr key={t.id} className="text-[11px] font-bold">
                      <td className="px-8 py-4 text-slate-500">#FB-{t.id}</td>
                      <td className="px-8 py-4 text-white uppercase">{t.table_number}</td>
                      <td className="px-8 py-4 text-slate-400">{t.payment_mode}</td>
                      <td className="px-8 py-4 text-right text-emerald-500">{t.amount.toFixed(2)} $</td>
                      <td className="px-8 py-4 text-center">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[8px] uppercase">Complété</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-orange-600 rounded-[2.5rem] p-8 shadow-2xl shadow-orange-900/20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-6">Action Rapide</h4>
              <p className="text-xl font-black leading-tight mb-8 italic">Prêt pour la clôture de caisse ?</p>
              <button 
                onClick={() => handlePrintAction('Rapport X')}
                className="w-full bg-black/20 hover:bg-black/40 backdrop-blur-md py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10"
              >
                Imprimer le rapport X
              </button>
              <button 
                onClick={handleClotureZ} 
                className="w-full mt-3 bg-white text-orange-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
              >
                Clôture de Caisse (Z)
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[12rem] opacity-10 rotate-12">payments</span>
          </section>

          <section className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
             <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">print</span> Options d'impression
             </h4>
             <div className="space-y-3">
               <button 
                 onClick={() => handlePrintAction('Dernier Ticket')}
                 className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all group"
               >
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Réimprimer dernier ticket</span>
                 <span className="material-symbols-outlined text-sm text-slate-600">chevron_right</span>
               </button>
               <button 
                 onClick={() => handlePrintAction('Facture A4')}
                 className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all group"
               >
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Générer facture A4</span>
                 <span className="material-symbols-outlined text-sm text-slate-600">chevron_right</span>
               </button>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FacturationFB;