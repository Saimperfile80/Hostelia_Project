import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#151c2c',
  color: '#fff',
  iconColor: '#3b82f6'
});

// Dictionnaire de configuration par pays
const COUNTRY_DEFAULTS = {
  "RDC": { primary: "USD ($)", secondary: "FC (CDF)", dual: true, rate: 2800 },
  "France": { primary: "EUR (€)", secondary: null, dual: false, rate: 1 },
  "Sénégal": { primary: "FCFA (XOF)", secondary: null, dual: false, rate: 1 },
  "Gabon": { primary: "FCFA (XAF)", secondary: null, dual: false, rate: 1 },
  "USA": { primary: "USD ($)", secondary: null, dual: false, rate: 1 }
};

const GlobalConfig = () => {
  const [config, setConfig] = useState({
    hotel_name: '', country: 'RDC', currency: 'USD ($)', secondary_currency: 'FC (CDF)',
    is_dual_currency: 1, exchange_rate: 2800, timezone: 'GMT+1',
    smtp_server: '', smtp_user: '', smtp_port: '', smtp_pass: '',
    maintenance_mode: 0, debug_logs: 1, last_updated: '--/--/----'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/settings')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erreur chargement config"));
  }, []);

  // Action quand on change de pays
  const handleCountryChange = (countryKey) => {
    const defaults = COUNTRY_DEFAULTS[countryKey];
    if (defaults) {
      setConfig({
        ...config,
        country: countryKey,
        currency: defaults.primary,
        secondary_currency: defaults.secondary || '',
        is_dual_currency: defaults.dual ? 1 : 0,
        exchange_rate: defaults.rate
      });
    }
  };

  const handleSave = async () => {
    Swal.fire({
      title: 'Mise à jour...',
      text: 'Synchronisation des paramètres bimonétaires',
      allowOutsideClick: false,
      showConfirmButton: false,
      background: '#151c2c',
      color: '#fff',
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        const result = await res.json();
        setConfig(prev => ({...prev, last_updated: result.updated_at}));
        Swal.close();
        Toast.fire({ icon: 'success', title: 'Configuration système mise à jour' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Connexion API perdue', background: '#151c2c', color: '#fff' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header avec bouton Sauvegarde */}
      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
            <span className="material-icons-outlined text-3xl">public</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Configuration Régionale</h3>
            <p className="text-[10px] text-blue-400 uppercase font-bold mt-1 italic">Dernière mise à jour : {config.last_updated}</p>
          </div>
        </div>
        <button onClick={handleSave} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
          Appliquer les changements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Identité et Pays */}
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="material-icons-outlined text-blue-500">hotel</span> Identité & Pays
          </h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Nom de l'établissement</label>
              <input 
                  type="text" 
                  value={config.hotel_name || ''} 
                  onChange={(e) => setConfig({...config, hotel_name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Pays d'opération</label>
                <select 
                    value={config.country || ''} 
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase"
                  >
                  <option value="RDC">Congo (RDC)</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Gabon">Gabon</option>
                  <option value="USA">USA</option>
                  <option value="France">France</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Fuseau Horaire</label>
                <input 
                  type="text" 
                  value={config.timezone || ''}
                  onChange={(e) => setConfig({...config, timezone: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration de la Monnaie (Dual Currency) */}
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="material-icons-outlined text-emerald-500">payments</span> Gestion Monétaire
          </h4>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 opacity-60">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Devise Principale</label>
                <div className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-[10px] text-white font-black uppercase italic">{config.currency}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Devise Secondaire</label>
                <div className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-[10px] text-blue-400 font-black uppercase italic">{config.secondary_currency || 'Aucune'}</div>
              </div>
            </div>

            {config.is_dual_currency === 1 && (
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in zoom-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">Taux de Change Opérationnel</p>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase mt-1">1 {config?.secondary_currency?.split(' ')[0] || '...'}</p>
                  </div>
                  <input 
                    type="number" 
                    value={config.exchange_rate}
                    onChange={(e) => setConfig({...config, exchange_rate: e.target.value})}
                    className="w-32 bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-2 text-sm text-center text-emerald-500 font-black outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SMTP - Simplifié pour la lisibilité */}
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl lg:col-span-2">
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
             <span className="material-icons-outlined text-blue-500">alternate_email</span> Passerelle SMTP
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <input type="text" placeholder="Serveur" value={config.smtp_server} onChange={e=>setConfig({...config, smtp_server:e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white outline-none focus:border-blue-500" />
             <input type="text" placeholder="Utilisateur" value={config.smtp_user} onChange={e=>setConfig({...config, smtp_user:e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white outline-none focus:border-blue-500" />
             <input type="text" placeholder="Port" value={config.smtp_port} onChange={e=>setConfig({...config, smtp_port:e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white outline-none focus:border-blue-500" />
             <input type="password" placeholder="Pass" value={config.smtp_pass} onChange={e=>setConfig({...config, smtp_pass:e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfig;