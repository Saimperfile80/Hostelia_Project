import React from 'react';

const RHPersonnel = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Statistiques Effectifs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Employés", value: "--", icon: "groups", color: "text-white" },
          { label: "Présents", value: "--", icon: "person_check", color: "text-emerald-500" },
          { label: "En Congés", value: "--", icon: "event_busy", color: "text-amber-500" },
          { label: "Absences", value: "--", icon: "warning", color: "text-red-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
            <span className={`material-icons text-3xl opacity-20 ${stat.color}`}>{stat.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Liste du Personnel */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons text-red-500">badge</span>
              Répertoire des Employés
            </h3>
            <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20">
              Ajouter un membre
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-8 py-5">Employé</th>
                  <th className="px-8 py-5">Poste / Service</th>
                  <th className="px-8 py-5">Contrat</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <span className="material-icons text-6xl mb-4">person_search</span>
                      <p className="text-xl font-black uppercase tracking-[0.3em] text-slate-400">Aucun employé enregistré</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Sidebar : Validations & Calendrier RH */}
        <div className="space-y-6">
          
          {/* Demandes de congés */}
          <div className="bg-[#151c2c] border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="font-black mb-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons text-amber-500">pending_actions</span>
                Demandes de Congés
              </div>
              <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px]">0</span>
            </h3>
            
            <div className="space-y-4">
              <div className="p-6 border-2 border-dashed border-white/5 rounded-2xl text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
                  Aucune demande en attente de validation pour le moment.
                </p>
              </div>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-white/5">
                Consulter le calendrier
              </button>
            </div>
          </div>

          {/* Rappels RH */}
          <div className="bg-red-600/5 border border-red-500/20 rounded-[2rem] p-6">
            <h4 className="text-red-500 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-icons text-sm">notifications_active</span>
              Alertes RH
            </h4>
            <div className="space-y-3">
               <p className="text-[10px] text-slate-500 italic">Vérifiez les contrats arrivant à échéance ce mois-ci.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RHPersonnel;