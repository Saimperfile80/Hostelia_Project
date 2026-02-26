import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Encaissement = () => {
  const [amount, setAmount] = useState('0');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [received, setReceived] = useState('0');
  const [change, setChange] = useState(0);
  const [guestName, setGuestName] = useState('Client Passant');
  const [fondDeCaisse, setFondDeCaisse] = useState(0);

  const paymentMethods = [
    { id: 'cash', label: 'Espèces', icon: 'payments' },
    { id: 'card', label: 'Carte Bancaire', icon: 'credit_card' },
    { id: 'mobile', label: 'Mobile Money', icon: 'smartphone' },
    { id: 'transfer', label: 'Virement', icon: 'account_balance' },
  ];

  // 1. Charger le fonds de caisse depuis l'API (Option A : Session)
  const fetchFond = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/caisse/session');
      const data = await res.json();
      setFondDeCaisse(data.opening_balance);
    } catch (err) {
      console.error("Erreur chargement fonds:", err);
    }
  };

  useEffect(() => {
    fetchFond();
  }, []);

  // 2. Calcul automatique de la monnaie
  useEffect(() => {
    const a = parseFloat(amount) || 0;
    const r = parseFloat(received) || 0;
    setChange(r > a ? r - a : 0);
  }, [amount, received]);

  // 3. Recherche de client en chambre
  const handleSearchGuest = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reservations');
      const guests = await res.json();
      
      const { value: selectedGuest } = await Swal.fire({
        title: 'Sélectionner un client',
        input: 'select',
        inputOptions: guests.reduce((acc, g) => {
          acc[g.guest_name] = `${g.guest_name} (Chambre ${g.room_number})`;
          return acc;
        }, {}),
        background: '#151c2c',
        color: '#1B5E20',
        confirmButtonColor: '#10b981',
        showCancelButton: true
      });

      if (selectedGuest) {
        setGuestName(selectedGuest);
      }
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de joindre le serveur', 'error');
    }
  };

  // 4. Validation et envoi au backend
  const handleValidation = async () => {
    if (!selectedMethod || amount === '0') return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/invoices/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: selectedMethod,
          guest_name: guestName,
          invoice_ref: `INV-${Date.now()}`
        }),
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Encaissé !',
          text: `Paiement de ${amount}$ reçu via ${selectedMethod}`,
          background: '#151c2c',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
        setAmount('0');
        setReceived('0');
        setSelectedMethod(null);
        setGuestName('Client Passant');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Échec de la transaction', 'error');
    }
  };

  const handleNumpad = (value) => {
    if (selectedMethod === 'cash') {
      // Si espèces, le numpad remplit ce que le client donne
      setReceived(prev => prev === '0' ? String(value) : prev + String(value));
    } else {
      // Sinon il remplit le montant de la facture
      setAmount(prev => prev === '0' ? String(value) : prev + String(value));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER AVEC FOND DE CAISSE DYNAMIQUE */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Encaissement / Paiements</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Contrôle des flux financiers</p>
        </div>
        <div className="text-right bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-[10px] font-black text-emerald-500 uppercase italic">Fonds de caisse actuel</p>
          <p className="text-2xl font-black text-white">{fondDeCaisse.toFixed(2)} $</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Saisie du montant */}
          <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <label className="text-[10px] font-black uppercase text-slate-500 mb-4 block">Montant à encaisser</label>
            <div className="relative">
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-black/20 border-2 border-emerald-500/20 rounded-3xl py-8 px-8 text-5xl font-black text-white text-right outline-none focus:border-emerald-500 transition-all" />
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-500">$</span>
            </div>
          </div>

          {/* Modes de paiement (Sélection obligatoire) */}
          <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase text-slate-500 mb-6">Mode de paiement</h3>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((m) => (
                <button 
                  key={m.id} 
                  onClick={() => setSelectedMethod(m.id)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border transition-all ${selectedMethod === m.id ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-900/20' : 'border-white/5 bg-white/[0.02] text-slate-500'}`}
                >
                  <span className="material-icons-round text-3xl">{m.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-[2rem] p-6 flex items-center gap-4">
             <span className="material-icons-round text-emerald-500">person_add</span>
             <div className="flex-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{guestName}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Imputation séjour</p>
             </div>
             <button onClick={handleSearchGuest} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-white uppercase transition-all border border-white/10">Chercher</button>
          </div>
        </div>

        {/* Numpad et Rendu Monnaie */}
        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5 mb-8">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase">Monnaie à rendre :</p>
              <p className="text-3xl font-black text-emerald-500">{change.toFixed(2)} $</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-500 uppercase italic">Reçu (Espèces) :</p>
               <p className="text-xl font-bold text-white">{received} $</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '00', 0].map((num) => (
              <button key={num} onClick={() => handleNumpad(num)} className="h-20 bg-white/5 hover:bg-white/10 rounded-[1.5rem] text-2xl font-black text-white border border-white/5 transition-all active:scale-95">{num}</button>
            ))}
            <button onClick={() => {setAmount('0'); setReceived('0');}} className="h-20 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center border border-red-500/20 transition-all active:scale-95">
              <span className="material-icons-round text-red-500">backspace</span>
            </button>
          </div>

          <button 
            onClick={handleValidation}
            disabled={amount === '0' || !selectedMethod}
            className={`w-full mt-8 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${amount !== '0' && selectedMethod ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}
          >
            <span className="material-icons-round">check_circle</span>
            Valider l'encaissement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Encaissement;