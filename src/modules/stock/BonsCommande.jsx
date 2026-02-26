import React from 'react';

const BonsCommande = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Résumé des flux de commande (Mini KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "En attente", value: "0", color: "text-amber-500", icon: "hourglass_top" },
          { label: "Approuvés", value: "0", color: "text-blue-500", icon: "verified" },
          { label: "Envoyés", value: "0", color: "text-purple-500", icon: "outbound" },
          { label: "Annulés", value: "0", color: "text-red-500", icon: "cancel" }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
              <span className="material-icons-outlined">{item.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Filtres & Création */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-900/20 transition-all">Tous</button>
          <button className="px-6 py-2.5 bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">À Valider</button>
          <button className="px-6 py-2.5 bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Archives</button>
        </div>
        
        <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-3">
          <span className="material-icons-outlined text-sm">add_shopping_cart</span>
          Créer un Bon de Commande
        </button>
      </div>

      {/* 3. Liste des Bons de Commande */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-white">
            <span className="material-icons-outlined text-purple-500">description</span>
            Registre des commandes
          </h3>
          <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Budget Engagé :</span>
             <span className="text-xs font-black text-white">0 FCFA</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-6">N° Bon</th>
                <th className="px-8 py-6">Fournisseur</th>
                <th className="px-8 py-6">Date Émission</th>
                <th className="px-8 py-6">Montant Total</th>
                <th className="px-8 py-6 text-center">Statut</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* État vide des commandes */}
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <span className="material-icons-outlined text-6xl mb-4 text-slate-500">history_edu</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun bon de commande</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase">Générez votre première commande fournisseur ci-dessus</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Tips Logistique */}
      <div className="p-6 rounded-[2rem] bg-purple-500/5 border border-purple-500/10 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
           <span className="material-icons-outlined">info</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium uppercase leading-relaxed">
           <strong className="text-white">Note :</strong> Les bons de commande approuvés sont automatiquement transmis au module <span className="text-purple-400">Réception Stocks</span> pour faciliter le contrôle à la livraison.
        </p>
      </div>

    </div>
  );
};

export default BonsCommande;