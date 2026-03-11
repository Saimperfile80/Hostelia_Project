import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ModesPaiement = () => {
  const [channels, setChannels] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/payment-channels');
      const data = await res.json();
      setChannels(data);
    } catch (err) { console.error("Erreur chargement canaux:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleChannel = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Activé' ? 'Désactivé' : 'Activé';
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, status: newStatus } : ch));

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/settings/payment-channels/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });
        if (!response.ok) throw new Error();
        
        Swal.fire({
          toast: true, position: 'top-end', timer: 2000, showConfirmButton: false,
          icon: 'success', title: `Canal ${newStatus}`, 
          background: newStatus === 'Activé' ? '#10b981' : '#f43f5e', color: '#fff'
        });
    } catch (err) {
        setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, status: currentStatus } : ch));
        Swal.fire('Erreur', 'Sauvegarde échouée', 'error');
    }
  };

  return (
    <div className="p-8 text-white space-y-6">
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">account_balance_wallet</span>
                Gestion des Modes de Paiement
            </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((method) => (
            <div key={method.id} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${method.status === 'Activé' ? 'bg-black/20 border-white/10' : 'bg-transparent border-dashed border-white/5 opacity-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${method.status === 'Activé' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
                  <span className="material-symbols-outlined text-2xl">{method.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider">{method.label}</p>
                  <p className={`text-[9px] font-bold italic ${method.status === 'Activé' ? 'text-emerald-500' : 'text-slate-500'}`}>{method.status}</p>
                </div>
              </div>
              <div onClick={() => toggleChannel(method.id, method.status)}
                className={`w-14 h-7 rounded-full relative transition-all cursor-pointer p-1 ${method.status === 'Activé' ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-all transform ${method.status === 'Activé' ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ModesPaiement;