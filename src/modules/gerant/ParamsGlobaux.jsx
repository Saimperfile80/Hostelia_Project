import React from 'react';

const ParamsGlobaux = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Informations de l'Établissement */}
      <section className="bg-[#161B22] rounded-[2.5rem] border border-[#21262D] p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
            <span className="material-icons-round text-red-600">domain</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Profil Établissement</h3>
            <p className="text-xs text-slate-500 font-medium">Identité et coordonnées de l'hôtel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nom de l'hôtel</label>
            <input type="text" placeholder="--" className="w-full bg-black/20 border border-[#21262D] rounded-2xl px-6 py-4 text-sm text-white focus:border-red-600 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Devise Principale</label>
            <select className="w-full bg-black/20 border border-[#21262D] rounded-2xl px-6 py-4 text-sm text-white focus:border-red-600 outline-none transition-all appearance-none">
              <option>Dollar Américain ($)</option>
              <option>Euro (€)</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Adresse Physique</label>
            <input type="text" placeholder="--" className="w-full bg-black/20 border border-[#21262D] rounded-2xl px-6 py-4 text-sm text-white focus:border-red-600 outline-none transition-all" />
          </div>
        </div>
      </section>

      {/* 2. Configuration Système & Taxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-[#161B22] rounded-[2.5rem] border border-[#21262D] p-8 shadow-2xl">
          <h3 className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3">
            <span className="material-icons-round text-red-600 text-sm">settings_suggest</span>
            Paramètres Fiscaux
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-[#21262D]">
                <span className="text-xs font-bold text-slate-400 uppercase">TVA Appliquée (%)</span>
                <span className="text-white font-black">-- %</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-[#21262D]">
                <span className="text-xs font-bold text-slate-400 uppercase">Taxe de séjour</span>
                <span className="text-white font-black">-- / nuit</span>
             </div>
          </div>
        </section>

        <section className="bg-[#161B22] rounded-[2.5rem] border border-[#21262D] p-8 shadow-2xl">
          <h3 className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3">
            <span className="material-icons-round text-red-600 text-sm">security</span>
            Accès & Sécurité
          </h3>
          <div className="space-y-3">
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 border border-dashed border-white/10">
              Gérer les permissions rôles
            </button>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 border border-dashed border-white/10">
              Journal de connexion (Logs)
            </button>
          </div>
        </section>
      </div>

      {/* 3. Zone Critique */}
      <section className="bg-red-600/5 border border-red-600/20 rounded-[2.5rem] p-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-icons-round text-red-600">warning</span>
          <h2 className="text-lg font-black text-red-600 uppercase tracking-tighter">Zone Critique</h2>
        </div>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Ces actions peuvent avoir des conséquences irréversibles sur les données de votre établissement. 
          Veuillez manipuler ces réglages avec une extrême prudence.
        </p>
        <div className="space-y-4">
          <button className="w-full flex justify-between items-center px-8 py-5 rounded-2xl border border-red-500/30 hover:bg-red-500/10 transition-all group">
            <span className="text-xs font-black text-white uppercase tracking-widest">Réinitialiser tous les tarifs</span>
            <span className="material-icons-round text-sm text-red-500 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          <button className="w-full flex justify-between items-center px-8 py-5 rounded-2xl bg-red-600 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 group">
            <span className="text-xs font-black text-white uppercase tracking-widest">Archiver l'Établissement</span>
            <span className="material-icons-round text-sm group-hover:rotate-12 transition-transform">archive</span>
          </button>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="flex justify-end gap-4 pt-4">
        <button className="px-10 py-4 rounded-2xl border border-[#21262D] font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all">
          Annuler
        </button>
        <button className="px-12 py-4 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-900/40 hover:scale-105 transition-all">
          Sauvegarder les réglages
        </button>
      </footer>
    </div>
  );
};

export default ParamsGlobaux;