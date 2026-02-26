import React from 'react';

const PlanningMenage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Sélecteur de Date & Filtres d'Équipe */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">Quotidien</button>
            <button className="px-6 py-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Hebdomadaire</button>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400">
              <span className="material-icons-round">chevron_left</span>
            </button>
            <span className="text-sm font-black uppercase tracking-widest text-white">Aujourd'hui</span>
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400">
              <span className="material-icons-round">chevron_right</span>
            </button>
          </div>
        </div>
        
        <button className="flex items-center gap-3 px-8 py-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all">
          <span className="material-icons-round text-sm">person_add</span> Assigner une tâche
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. Liste des Agents (Sidebar Gauche du Planning) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-4">Équipes Disponibles</h3>
          <div className="bg-[#151c2c] rounded-[2rem] border border-white/5 p-6 min-h-[400px] flex flex-col items-center justify-center text-center opacity-40">
            <span className="material-icons-round text-4xl mb-4 text-slate-600">group_off</span>
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Aucun agent enregistré<br/>pour cette zone</p>
          </div>
        </div>

        {/* 3. Vue Chronologique du Planning */}
        <div className="lg:col-span-3 bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
              <span className="material-icons-round text-emerald-500">schedule</span>
              Répartition horaire
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase bg-black/40 px-4 py-1.5 rounded-full border border-white/5">
              09:00 — 18:00
            </span>
          </div>

          <div className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center mb-6">
               <span className="material-icons-round text-3xl text-slate-700 animate-pulse">event_busy</span>
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Planning vide</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">
              Commencez par assigner des agents aux chambres sales pour générer le planning.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Barre de progression globale */}
      <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-8 shadow-xl">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-black uppercase mb-3 tracking-widest">
            <span className="text-slate-500">Progression globale du ménage</span>
            <span className="text-emerald-500">0%</span>
          </div>
          <div className="h-3 bg-black/40 rounded-full border border-white/5 overflow-hidden">
            <div className="h-full bg-emerald-500 w-0 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
          </div>
        </div>
        <div className="flex gap-4 border-l border-white/10 pl-8">
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-600 uppercase">Heures Planifiées</p>
              <p className="text-xl font-black text-white">0h</p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default PlanningMenage;