import React from 'react';

const MenuCarte = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Configuration de la Carte</h3>
          <p className="text-xs text-slate-500 font-medium">Gérez la visibilité et les stocks en temps réel</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-900/20 flex items-center gap-3">
          <span className="material-icons-round text-sm">add_circle</span>
          Ajouter un nouveau plat
        </button>
      </div>

      {/* Grille de Gestion des Menus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* EXEMPLE DE STRUCTURE DE CARTE (PLAT VIDE) */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-orange-500/30 transition-all">
          {/* Zone Image */}
          <div className="h-48 bg-black/40 relative overflow-hidden flex items-center justify-center">
            <span className="material-icons-round text-5xl text-white/5">image</span>
            
            {/* Badge de Statut (Automatique selon quantité) */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                {/* Condition visuelle : Vert si Qty > 0, Gris si Qty = 0 */}
                <div className="w-2 h-2 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.5)]"></div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Inactif</span>
              </div>
            </div>

            {/* Check Vert (Indicateur visuel de disponibilité) */}
            <div className="absolute top-4 right-4">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 opacity-50">
                  <span className="material-icons-round text-white text-sm">check</span>
               </div>
            </div>
          </div>

          {/* Détails du Plat */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Catégorie</p>
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">Nom du Plat</h4>
              </div>
              <span className="text-xl font-black text-white">-- $</span>
            </div>

            {/* Gestion de la Quantité (La clé du système) */}
            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase">Quantité disponible</span>
                <span className="text-sm font-black text-white">0</span>
              </div>
              {/* Barre de progression du stock */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 w-0 transition-all duration-1000"></div>
              </div>
            </div>

            {/* Actions Administratives */}
            <div className="flex gap-2 pt-2">
               <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition-all">
                 <span className="material-icons-round text-slate-400 text-sm">edit</span>
               </button>
               <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition-all">
                 <span className="material-icons-round text-slate-400 text-sm">visibility_off</span>
               </button>
               <button className="flex-1 bg-red-600/10 hover:bg-red-600/20 py-3 rounded-xl transition-all">
                 <span className="material-icons-round text-red-500 text-sm">delete</span>
               </button>
            </div>
          </div>
        </div>

        {/* Placeholder si aucun menu */}
        <div className="col-span-full border-2 border-dashed border-white/5 rounded-[3rem] py-32 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-round text-4xl text-orange-500">restaurant_menu</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">La carte est vide</h3>
            <p className="text-xs text-slate-500 font-medium mt-2">Commencez par ajouter les plats préparés en cuisine aujourd'hui.</p>
        </div>

      </div>

      {/* Note d'administration (Comme sur ton idée) */}
      <div className="bg-orange-600/5 border border-orange-500/20 rounded-[2rem] p-8 flex items-start gap-4">
        <span className="material-icons-round text-orange-500">info</span>
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Logique de synchronisation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Le système désactive automatiquement (décochage) un plat dès que sa quantité atteint 0. 
            Cela garantit que les serveurs et les futurs clients sur tablette ne commandent que ce qui est réellement prêt.
          </p>
        </div>
      </div>

    </div>
  );
};

export default MenuCarte;