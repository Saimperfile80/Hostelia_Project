import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState("--/--/----");

  const loadBackups = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/backup/list');
      const data = await res.json();
      setBackups(data);
      if (data.length > 0) setLastBackup(data[0].date);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadBackups(); }, []);

 // 1. D'abord, on définit le mixin Toast (à mettre en haut de ton fichier ou du composant)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#151c2c',
  color: '#fff',
  iconColor: '#10b981', // Couleur émeraude pour le succès
});

// 2. Ta fonction transformée
const handleBackup = async () => {
  setLoading(true);
  try {
    const res = await fetch('http://127.0.0.1:8000/api/backup/create', { method: 'POST' });
    if (res.ok) {
      // Notification de succès stylée
      Toast.fire({
        icon: 'success',
        title: 'Sauvegarde système réussie'
      });
      loadBackups();
    } else {
      throw new Error();
    }
  } catch (e) {
    // Notification d'erreur stylée
    Swal.fire({
      title: 'Échec du Backup',
      text: 'Le serveur n\'a pas pu créer le point de restauration.',
      icon: 'error',
      background: '#151c2c',
      color: '#fff',
      confirmButtonColor: '#ef4444'
    });
  }
  setLoading(false);
};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <span className="material-icons-round text-4xl">cloud_done</span>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Sauvegarde Locale</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Dernière réussite : {lastBackup}</p>
            </div>
          </div>
          <button 
            onClick={handleBackup}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg group flex items-center gap-3 disabled:opacity-50"
          >
            <span className={`material-icons-round text-sm ${loading ? 'animate-spin' : ''}`}>sync</span>
            {loading ? 'Traitement...' : 'Lancer un Backup'}
          </button>
        </div>
        
        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col justify-center text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Backups</p>
          <p className="text-2xl font-black text-white tracking-tighter">{backups.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121721] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/[0.01]">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
              <span className="material-icons-round text-blue-500">history</span> Historique
            </h3>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[400px]">
            {backups.length > 0 ? (
              backups.map((b, i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-xl border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-[10px] font-black text-white">{b.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{b.size}</p>
                  </div>
                  <button className="text-blue-500 text-[9px] font-black uppercase">Restaurer</button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30">
                <span className="material-icons-round text-5xl mb-4">settings_backup_restore</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Aucune sauvegarde disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white mb-8">
             <span className="material-icons-round text-blue-500">event_repeat</span> Automatisation
          </h3>
          <div className="space-y-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
               <p className="text-[10px] font-black text-white uppercase">Tâche CRON Automatique</p>
               <div className="w-12 h-6 bg-slate-800 rounded-full"></div>
            </div>
            <p className="text-[9px] text-slate-600 uppercase font-bold italic text-center">Module disponible en version Cloud uniquement</p>
          </div>
        </div>
      </div>
      {/* Zone de Danger (inchangée) */}
    </div>
  );
};

export default BackupRestore;