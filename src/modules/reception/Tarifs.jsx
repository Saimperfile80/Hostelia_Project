import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Configuration du Toast pour les succès
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#151c2c',
  color: '#fff',
  iconColor: '#3b82f6'
});

const Tarifs = () => {
  const [rules, setRules] = useState({ low: 0, high: 0, weekend: 0 });
  const [roomRates, setRoomRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les règles
        const rulesRes = await fetch('http://127.0.0.1:8000/api/pricing/rules');
        const rulesData = await rulesRes.json();
        setRules({ 
          low: rulesData.low_season_rate, 
          high: rulesData.high_season_rate, 
          weekend: rulesData.weekend_rate 
        });

        // Charger les types de chambres
        const roomsRes = await fetch('http://127.0.0.1:8000/api/rooms');
        const roomsData = await roomsRes.json();
        
        const uniqueTypes = [...new Set(roomsData.rooms.map(r => r.type))];
        const rates = uniqueTypes.map(type => {
            const room = roomsData.rooms.find(r => r.type === type);
            return { type: type, base: room.price, extra: 25, breakfast: 15 };
        });
        setRoomRates(rates);
      } catch (err) {
        console.error("Erreur de chargement des tarifs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/pricing/rules/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules)
      });

      if (res.ok) {
        Toast.fire({
          icon: 'success',
          title: 'Stratégie tarifaire mise à jour'
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'enregistrer les modifications',
        background: '#151c2c',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Configuration de la Saisonnalité */}
      <div className="bg-[#151c2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Stratégie Tarifaire</h3>
            <p className="text-xs text-slate-500 font-medium">Ajustement dynamique des prix</p>
          </div>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95">
            <span className="material-icons-round text-sm">save</span>
            ENREGISTRER
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingInput label="Saison Basse" icon="ac_unit" color="blue" value={rules.low} 
            onChange={(v) => setRules({...rules, low: v})} suffix="(Réduction %)" />
          
          <PricingInput label="Saison Haute" icon="wb_sunny" color="emerald" value={rules.high} 
            onChange={(v) => setRules({...rules, high: v})} suffix="(Majoration %)" />
          
          <PricingInput label="Week-end" icon="event_repeat" color="amber" value={rules.weekend} 
            onChange={(v) => setRules({...rules, weekend: v})} suffix="(Ajustement %)" />
        </div>
      </div>

      {/* 2. Tableau des Tarifs */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-icons-round text-blue-500">grid_view</span>
            Grille Tarifaire Active
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Catégorie</th>
                <th className="px-8 py-5 text-center">Base / Nuit</th>
                <th className="px-8 py-5 text-center">Pers. Suppl.</th>
                <th className="px-8 py-5 text-center">Petit Déj.</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {roomRates.map((rate, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-white uppercase text-xs">{rate.type}</td>
                  <td className="px-8 py-5 text-center text-blue-400 font-black">{rate.base} $</td>
                  <td className="px-8 py-5 text-center text-slate-400 text-xs">{rate.extra} $</td>
                  <td className="px-8 py-5 text-center text-slate-400 text-xs">{rate.breakfast} $</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-white/20 hover:text-white"><span className="material-icons-round text-sm">edit</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Promotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-slate-600 group hover:border-blue-500/20 transition-all cursor-pointer">
              <span className="material-icons-round text-3xl mb-2 opacity-20">add_circle_outline</span>
              <p className="text-xs font-bold uppercase tracking-widest">Nouvelle Offre</p>
           </div>
           <div className="p-8 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-slate-600 group hover:border-emerald-500/20 transition-all cursor-pointer">
              <span className="material-icons-round text-3xl mb-2 opacity-20">loyalty</span>
              <p className="text-xs font-bold uppercase tracking-widest">Code Promo</p>
           </div>
      </div>
    </div>
  );
};

// Sous-composant pour les inputs de prix
const PricingInput = ({ label, icon, color, value, onChange, suffix }) => (
  <div className={`bg-${color}-600/5 border border-${color}-500/20 p-6 rounded-3xl`}>
    <span className={`material-icons-round text-${color}-400 mb-4`}>{icon}</span>
    <p className={`text-[10px] font-black text-${color}-400 uppercase tracking-widest`}>{label}</p>
    <div className="flex items-center gap-2 mt-1">
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-2xl font-black text-white w-20 outline-none border-b border-white/10 focus:border-white transition-all"
      />
      <span className="text-xs text-slate-500 font-medium">{suffix}</span>
    </div>
  </div>
);

export default Tarifs;