import React, { useState } from 'react';

const PrendreCommande = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = [
    { id: 1, name: 'Tous', icon: 'apps' },
    { id: 2, name: 'Entrées', icon: 'set_meal' },
    { id: 3, name: 'Plats', icon: 'restaurant' },
    { id: 4, name: 'Boissons', icon: 'local_bar' },
    { id: 5, name: 'Desserts', icon: 'icecream' },
  ];

  return (
    <div className="flex gap-8 h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* SECTION GAUCHE : CATALOGUE DES PLATS */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Barre de Recherche et Catégories */}
        <div className="flex flex-col gap-6 bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5">
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input 
              type="text" 
              placeholder="Rechercher un plat ou une boisson..." 
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-orange-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat.name 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <span className="material-icons-round text-sm">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Plats (Version Premium) */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Bouton AJOUTER NOUVEAU PLAT (Interface d'insertion) */}
            <button className="aspect-square bg-orange-600/5 border-2 border-dashed border-orange-500/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:bg-orange-600/10 hover:border-orange-500/40 transition-all">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-3xl">add_a_photo</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-white">Nouveau Plat</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Définir prix & quantité</p>
              </div>
            </button>

            {/* État vide du catalogue */}
            <div className="col-span-full py-20 text-center opacity-20">
               <span className="material-icons-round text-6xl mb-4 text-slate-500">menu_book</span>
               <p className="text-xl font-black uppercase tracking-[0.3em]">Aucun plat dans cette catégorie</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION DROITE : PANIER & RÉSUMÉ (Checkout) */}
      <div className="w-[400px] flex flex-col gap-6">
        <div className="flex-1 bg-[#151c2c] rounded-[2.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-black text-sm uppercase tracking-widest text-white">Commande Actuelle</h3>
              <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Table --</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Client: --</p>
          </div>

          {/* Liste des articles dans le panier */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center italic text-slate-600">
             <span className="material-icons-round text-4xl mb-2 opacity-20">shopping_basket</span>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-20 text-center leading-loose">
               Le panier est vide.<br/>Sélectionnez des articles à gauche.
             </p>
          </div>

          {/* Totaux */}
          <div className="p-8 bg-black/20 space-y-4 border-t border-white/5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                <span>Sous-total</span>
                <span>0.00 $</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                <span>TVA (10%)</span>
                <span>0.00 $</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-white">Total</span>
              <span className="text-3xl font-black text-orange-500 tracking-tighter">0.00 $</span>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-900/20 transition-all active:scale-95 flex items-center justify-center gap-3">
              <span className="material-icons-round text-sm">print</span>
              ENVOYER EN CUISINE
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrendreCommande;