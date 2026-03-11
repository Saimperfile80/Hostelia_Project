import React, { useState, useEffect } from 'react';

const SecurityAudit = () => {
  // Initialisation ultra-sécurisée
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ success: 0, fails: 0 });

 useEffect(() => {
  const fetchAuditData = async () => {
    try {
      // 1. Récupérer les logs
      const resLogs = await fetch('http://127.0.0.1:8000/api/audit/logs');
      const dataLogs = await resLogs.json();
      setLogs(dataLogs || []); // Ici on passe directement dataLogs car c'est une liste

      // 2. Récupérer les stats (il faut appeler la route stats)
      const resStats = await fetch('http://127.0.0.1:8000/api/security/stats');
      const dataStats = await resStats.json();
      setStats({
        success: dataStats.authorized_access || 0,
        fails: dataStats.auth_failures || 0
      });
    } catch (err) {
      console.error("Erreur de connexion à l'API Audit");
    }
  };
  fetchAuditData();
}, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Dashboard de Vigilance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Accès Autorisés", value: stats.success, sub: "Dernières 24h", color: "text-emerald-500", icon: "verified_user" },
          { label: "Échecs d'Auth", value: stats.fails, sub: "Alertes critiques", color: "text-red-500", icon: "gpp_maybe" },
          { label: "Modifications Data", value: logs?.length || 0, sub: "Logs d'intégrité", color: "text-blue-500", icon: "edit_note" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#121721] p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${kpi.color}`}>
                <span className="material-icons-outlined text-2xl">{kpi.icon}</span>
              </div>
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Hostelia Sec</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{kpi.label}</p>
            <p className="text-3xl font-black text-white">{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 2. Journal d'Audit */}
      <div className="bg-[#121721] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons-outlined text-blue-500">security</span>
            Journal des activités système
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">Horodatage</th>
                <th className="px-8 py-6">Utilisateur</th>
                <th className="px-8 py-6">Action</th>
                <th className="px-8 py-6 text-center">Niveau</th>
                <th className="px-8 py-6 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs && logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 text-[10px] font-bold text-slate-400">{log.timestamp}</td>
                    <td className="px-8 py-5 text-[10px] font-black text-white uppercase">{log.user_agent}</td>
                    <td className="px-8 py-5 text-[10px] font-bold text-slate-300">{log.action}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${log.level === 'Critique' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right text-[9px] text-slate-500 italic">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <span className="material-icons-outlined text-6xl mb-4 text-slate-500">policy</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun événement enregistré</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Politique de Sécurité (Ton design original) */}
      <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <span className="material-icons-outlined text-3xl">shield</span>
           </div>
           <div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm mb-1 italic">Protection Brute-Force</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase">
                Le système verrouille automatiquement toute adresse IP après 5 tentatives infructueuses.
              </p>
           </div>
        </div>
        <span className="px-4 py-2 bg-red-500/20 text-red-400 text-[10px] font-black rounded-lg uppercase tracking-widest">
           Mode Strict Actif
        </span>
      </div>
    </div>
  );
};

export default SecurityAudit;