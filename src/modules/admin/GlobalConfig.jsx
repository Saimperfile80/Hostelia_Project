import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Mixin pour les confirmations de sauvegarde
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

const GlobalConfig = () => {
  const [config, setConfig] = useState({
    hotel_name: '', currency: '', timezone: '',
    smtp_server: '', smtp_user: '', smtp_port: '', smtp_pass: '',
    maintenance_mode: 0, debug_logs: 1, last_updated: '--/--/----'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/settings')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erreur chargement config"));
  }, []);

  const handleSave = async () => {
    // Affichage d'un indicateur de chargement
    Swal.fire({
      title: 'Mise à jour...',
      text: 'Enregistrement des paramètres système',
      allowOutsideClick: false,
      showConfirmButton: false,
      background: '#151c2c',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        const result = await res.json();
        setConfig({...config, last_updated: result.updated_at});
        
        Swal.close(); // Ferme le chargement
        Toast.fire({
          icon: 'success',
          title: 'Configuration système mise à jour'
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Échec de sauvegarde',
        text: 'Vérifiez la connexion avec le serveur API',
        background: '#151c2c',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. État de la Configuration */}
      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
            <span className="material-icons-outlined text-3xl">settings_suggest</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Paramètres Maîtres</h3>
            <p className="text-[10px] text-blue-400 uppercase font-bold mt-1 italic">Dernière modification : {config.last_updated}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
        >
          Enregistrer les changements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Paramètres Régionaux & Identité */}
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="material-icons-outlined text-blue-500">public</span>
            Localisation & Identité
          </h4>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Nom de l'Hôtel</label>
                <input 
                    type="text" 
                    value={config.hotel_name || ''} // Le "|| ''" règle l'erreur React
                    onChange={(e) => setConfig({...config, hotel_name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
                    placeholder="..." 
                  />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Devise Système</label>
                <select 
                    value={config.currency || ''} 
                    onChange={(e) => setConfig({...config, currency: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase"
                  >
                  <option value="">Sélectionner...</option>
                  <option>FCFA (XAF)</option>
                  <option>EUR (€)</option>
                  <option>USD ($)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Fuseau Horaire (GMT)</label>
              <input 
                type="text" 
                value={config.hotel_name || ''} // Le "|| ''" règle l'erreur React
                onChange={(e) => setConfig({...config, hotel_name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
                placeholder="..." 
              />
            </div>
          </div>
        </div>

        {/* 3. Configuration Serveur SMTP */}
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="material-icons-outlined text-blue-500">alternate_email</span>
            Passerelle Email (SMTP)
          </h4>
          
          <div className="space-y-4">
            <input 
                type="text" 
                value={config.hotel_name || ''} // Le "|| ''" règle l'erreur React
                onChange={(e) => setConfig({...config, hotel_name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
                placeholder="..." 
              />
            <div className="grid grid-cols-3 gap-4">
              <input 
                type="text" 
                value={config.hotel_name || ''} // Le "|| ''" règle l'erreur React
                onChange={(e) => setConfig({...config, hotel_name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
                placeholder="..." 
              />
              <input 
                type="text" 
                value={config.hotel_name || ''} // Le "|| ''" règle l'erreur React
                onChange={(e) => setConfig({...config, hotel_name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold uppercase" 
                placeholder="..." 
              />
            </div>
            <input 
              type="password" 
              value={config.smtp_pass}
              onChange={(e) => setConfig({...config, smtp_pass: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-[10px] text-white focus:border-blue-500 outline-none font-bold" 
              placeholder="Mot de passe sécurisé" 
            />
          </div>
        </div>

        {/* 4. Maintenance & Debug */}
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-sm">construction</span> Sécurité Système
              </h4>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] font-black text-white uppercase">Mode Maintenance</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Bloque l'accès aux utilisateurs non-admin</p>
                </div>
                <div 
                  onClick={() => setConfig({...config, maintenance_mode: config.maintenance_mode === 1 ? 0 : 1})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer group transition-colors ${config.maintenance_mode === 1 ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.maintenance_mode === 1 ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-sm">bug_report</span> Logs de Débogage
              </h4>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] font-black text-white uppercase">Journalisation Étendue</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Capture les erreurs API détaillées</p>
                </div>
                <div 
                  onClick={() => setConfig({...config, debug_logs: config.debug_logs === 1 ? 0 : 1})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer border border-blue-500/50 transition-colors ${config.debug_logs === 1 ? 'bg-blue-600/30' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-blue-500 rounded-full transition-all ${config.debug_logs === 1 ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GlobalConfig;