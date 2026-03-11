import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

const Encaissement = () => {
  const [amount, setAmount] = useState('0');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [received, setReceived] = useState('0');
  const [change, setChange] = useState(0);
  const [paymentCurrency, setPaymentCurrency] = useState('USD'); 
  const [availableMethods, setAvailableMethods] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const resMethods = await fetch('http://127.0.0.1:8000/api/settings/payment-channels');
      const methods = await resMethods.json();
      const activeOnly = methods.filter(m => String(m.status).trim() === 'Activé');
      setAvailableMethods(activeOnly);
      setSelectedMethod(prev => prev && activeOnly.find(m => m.id === prev.id) ? prev : null);
    } catch (err) { console.error("Erreur synchro:", err); }
  }, []);

  useEffect(() => {
    fetchData();
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  useEffect(() => {
    const a = parseFloat(amount) || 0;
    const r = parseFloat(received) || 0;
    setChange(r > a ? r - a : 0);
  }, [amount, received]);

  const handleNumpad = (v) => {
    if (!selectedMethod) return;
    const label = selectedMethod.label; // Pas de toLowerCase pour être sûr du match
    
    // RECONNAISSANCE DES 4 MODES SPÉCIFIQUES
    if (label === 'Espèces') {
        setReceived(prev => prev === '0' ? String(v) : prev + String(v));
    } else {
        // Pour "Virement bancaire", "Mobile money", "Carte Visa"
        setAmount(prev => prev === '0' ? String(v) : prev + String(v));
    }
  };

  const handleValidation = async () => {
    const finalAmount = parseFloat(amount) > 0 ? parseFloat(amount) : parseFloat(received);
    const payload = {
      amount: finalAmount,
      currency: paymentCurrency,
      method: selectedMethod.label, 
      guest_name: "Client Passant",
      invoice_ref: `INV-${Date.now()}`,
      status: "paid"
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/invoices/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Payé !', text: `Mode: ${selectedMethod.label}`, background: '#151c2c', color: '#fff' });
        setAmount('0'); setReceived('0'); setSelectedMethod(null);
      }
    } catch (error) { Swal.fire('Erreur', 'Serveur injoignable', 'error'); }
  };

  return (
    <div className="space-y-6 text-white p-4">
      <div className="flex justify-between items-center bg-[#151c2c] p-6 rounded-[2rem] border border-white/5">
        <h2 className="text-lg font-black uppercase italic">Caisse</h2>
        <div className="flex bg-black/40 p-1 rounded-xl">
            {['USD', 'CDF'].map((curr) => (
                <button key={curr} onClick={() => { setPaymentCurrency(curr); setAmount('0'); setReceived('0'); }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${paymentCurrency === curr ? 'bg-emerald-600' : 'text-slate-500'}`}>
                    {curr}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total ({paymentCurrency})</p>
            <div className="text-7xl font-black text-emerald-500">{amount !== '0' ? amount : received}</div>
          </div>

          <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5">
            <div className="grid grid-cols-2 gap-4">
              {availableMethods.map((m) => (
                <button key={m.id} onClick={() => {setSelectedMethod(m); setAmount('0'); setReceived('0');}}
                  className={`flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all ${selectedMethod?.id === m.id ? 'bg-emerald-600 border-emerald-400' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-rounded">{m.icon}</span>
                  <span className="text-[10px] font-black uppercase">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/40 p-5 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase">Reçu</p>
              <p className="text-2xl font-black">{received}</p>
            </div>
            <div className="bg-emerald-500/10 p-5 rounded-2xl">
              <p className="text-[9px] font-black text-emerald-500 uppercase">Rendu</p>
              <p className="text-2xl font-black text-emerald-500">{change.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '00', 0].map((num) => (
              <button key={num} onClick={() => handleNumpad(num)} className="h-16 bg-white/5 hover:bg-white/10 rounded-2xl text-xl font-black transition-all active:scale-95">{num}</button>
            ))}
            <button onClick={() => {setAmount('0'); setReceived('0');}} className="bg-rose-500/10 text-rose-500 rounded-2xl font-black text-xs uppercase">Effacer</button>
          </div>
          <button onClick={handleValidation} disabled={!selectedMethod || (amount === '0' && received === '0')}
            className={`w-full mt-6 py-6 rounded-[1.5rem] font-black uppercase tracking-widest transition-all ${selectedMethod && (amount !== '0' || received !== '0') ? 'bg-emerald-600' : 'bg-white/5 text-slate-600 opacity-40'}`}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};
export default Encaissement;