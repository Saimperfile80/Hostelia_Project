import React, { useState, useEffect } from 'react';

const Demandes = () => {
  const [data, setData] = useState({ requests: [], stats: { pending: 0, inprogress: 0, done: 0, urgent: 0 } });

  const fetchRequests = () => {
    fetch('http://127.0.0.1:8000/api/requests')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error("Erreur:", err));
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Auto-refresh toutes les 10s pour simuler l'app client
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id, status) => {
    fetch(`http://127.0.0.1:8000/api/requests/update_status?request_id=${id}&new_status=${status}`, { method: 'POST' })
      .then(() => fetchRequests());
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Cartes de résumé dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="En Attente" val={data.stats.pending} color="blue" icon="pending_actions" />
        <StatCard label="En Cours" val={data.stats.inprogress} color="amber" icon="running_with_errors" />
        <StatCard label="Terminées" val={data.stats.done} color="emerald" icon="task_alt" />
        <StatCard label="Urgent" val={data.stats.urgent} color="rose" icon="priority_high" />
      </div>

      {/* 2. Barre de Recherche */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input type="text" placeholder="Rechercher une demande..." className="w-full bg-black/20 border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all">
          <span className="material-icons-round text-sm">add</span> NOUVELLE DEMANDE
        </button>
      </div>

      {/* 3. Tableau des Demandes */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Chambre</th>
                <th className="px-8 py-5">Client / Détails</th>
                <th className="px-8 py-5 text-center">Priorité</th>
                <th className="px-8 py-5 text-center">Statut</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.requests.length > 0 ? data.requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg font-black text-xs">CH {req.room_number}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-white text-xs font-bold uppercase">{req.guest_name}</p>
                    <p className="text-slate-500 text-[10px] mt-1">{req.request_type} : {req.details}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[9px] font-black px-2 py-1 rounded ${req.priority === 'Haute' ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-500/20 text-slate-400'}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <select 
                      value={req.status} 
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      className="bg-black/40 border-none text-[9px] font-black uppercase text-white rounded px-2 py-1 outline-none"
                    >
                      <option value="En Attente">En Attente</option>
                      <option value="En Cours">En Cours</option>
                      <option value="Terminée">Terminée</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <span className="material-icons-round text-sm">more_vert</span>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <span className="material-icons-round text-6xl mb-4">notifications_none</span>
                      <p className="text-xl font-bold uppercase tracking-[0.3em] text-slate-400">Aucune demande active</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, val, color, icon }) => (
  <div className={`bg-${color}-600/10 border border-${color}-500/20 p-6 rounded-[2rem] flex items-center justify-between shadow-xl`}>
    <div>
      <p className={`text-[10px] font-black uppercase tracking-widest text-${color}-400 mb-1`}>{label}</p>
      <h3 className="text-3xl font-black text-white">{val}</h3>
    </div>
    <span className={`material-icons-round text-${color}-500 opacity-40 text-4xl`}>{icon}</span>
  </div>
);

export default Demandes;