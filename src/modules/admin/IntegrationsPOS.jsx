import React from 'react';

const IntegrationsPOS = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Header & API Status */}
      <div className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span className="material-icons-outlined text-3xl">hub</span>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Hub d'Intégration</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Gestion des flux de données externes</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/30 px-6 py-3 rounded-2xl border border-white/5">
          <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passerelle API : Inactive</span>
        </div>
      </div>

      {/* 2. Catégories d'Intégrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Paiements (POS)", icon: "credit_card", desc: "Terminaux de paiement et passerelles bancaires" },
          { title: "Réservations (OTA)", icon: "sync_alt", desc: "Synchro avec Booking, Expedia, etc." },
          { title: "Contrôle d'Accès", icon: "vpn_key", desc: "Serrures connectées et domotique" },
          { title: "Restauration", icon: "restaurant", desc: "Logiciels de caisse et gestion cuisine" },
          { title: "Comptabilité", icon: "account_balance", desc: "Export automatique vers ERP tiers" },
          { title: "Webhooks", icon: "webhook", desc: "Notifications d'événements en temps réel" }
        ].map((integ, idx) => (
          <div key={idx} className="bg-[#121721] p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                <span className="material-icons-outlined text-2xl">{integ.icon}</span>
              </div>
              <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline">
                Configurer
              </button>
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">{integ.title}</h4>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">{integ.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. État des Terminaux (Empty State) */}
      <div className="bg-[#121721] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons-outlined text-blue-500">devices</span>
            Périphériques & Terminaux Actifs
          </h3>
        </div>

        <div className="p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-slate-700">
            <span className="material-icons-outlined text-4xl">sensors_off</span>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 max-w-sm">
            Aucun terminal (POS) ou service tiers n'est actuellement jumelé à Hostelia.
          </p>
          <button className="mt-8 px-6 py-3 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all">
            Lancer un scan réseau
          </button>
        </div>
      </div>

      {/* 4. Alerte de Sécurité API */}
      <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
          <span className="material-icons-outlined text-3xl">lock</span>
        </div>
        <div>
          <h4 className="font-black text-white uppercase tracking-widest text-sm mb-1">Clés API & Sécurité</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">
            Ne partagez jamais vos clés secrètes. Toutes les communications externes passent par un tunnel sécurisé SSL/TLS 1.3 avec authentification par jeton.
          </p>
        </div>
      </div>

    </div>
  );
};

export default IntegrationsPOS;