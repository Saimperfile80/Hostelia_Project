import React, { useState } from 'react';
import Swal from 'sweetalert2';

const OuvertureCaisse = ({ onSessionOpened }) => {
  const [openingAmount, setOpeningAmount] = useState('');

  const handleOpenSession = async () => {
    if (!openingAmount || parseFloat(openingAmount) < 0) {
      Swal.fire('Attention', 'Veuillez saisir un montant valide', 'warning');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/caisse/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(openingAmount) }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Caisse Ouverte',
          text: `Session démarrée avec ${openingAmount} $`,
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
    <div className="bg-[#151c2c] p-10 rounded-[3rem] border-2 border-emerald-500/20 shadow-2xl max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-icons-round text-4xl text-emerald-500">lock_open</span>
      </div>
      
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Ouverture de Session</h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Déclarez le montant initial du tiroir</p>

      <div className="relative mb-8">
        <input 
          type="number"
          value={openingAmount}
          onChange={(e) => setOpeningAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-black/40 border-b-2 border-emerald-500 py-4 text-4xl font-black text-white text-center outline-none"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-emerald-500/50">$</span>
      </div>

      <button 
        onClick={handleOpenSession}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20"
      >
        Démarrer la journée
      </button>
    </div>
  );
};

export default OuvertureCaisse;