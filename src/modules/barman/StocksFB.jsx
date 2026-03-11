import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const StocksFB = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ rupture: 0, alerte: 0, valeur: 0 });
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);

  const fetchStockData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/fb/stock/list');
      const data = await res.json();
      setItems(data.items);
      setStats(data.stats);
      setLoading(false);

      // --- SYSTÈME DE NOTIFICATION D'ALERTE ---
      const productsInAlert = data.items.filter(i => i.current_stock <= i.alert_threshold && i.current_stock > 0);
      if (productsInAlert.length > 0) {
        Swal.fire({
          title: 'Alerte Stock Bas !',
          text: `${productsInAlert.length} produit(s) ont atteint le seuil d'alerte.`,
          icon: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          background: '#1e293b',
          color: '#fff'
        });
      }
    } catch (err) { console.error("Erreur Stock:", err); }
  };

  useEffect(() => { fetchStockData(); }, []);

  const handleAddArticle = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nouvel Article Magasin',
      background: '#151c2c',
      color: '#fff',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nom de l'article" style="background:#0f172a; color:white;">
        <select id="swal-cat" class="swal2-input" style="background:#0f172a; color:white;">
          <option value="Bar">Bar (Boissons)</option>
          <option value="Cuisine">Cuisine (Ingrédients)</option>
        </select>
        <input id="swal-qty" type="number" class="swal2-input" placeholder="Stock Initial">
        <input id="swal-unit" class="swal2-input" placeholder="Unité (Kg, Bouteille, etc.)">
        <input id="swal-alert" type="number" class="swal2-input" placeholder="Seuil d'Alerte (ex: 5)">
        <input id="swal-price" type="number" class="swal2-input" placeholder="Prix d'achat unitaire">
      `,
      confirmButtonColor: '#ea580c',
      preConfirm: () => ({
        name: document.getElementById('swal-name').value,
        category: document.getElementById('swal-cat').value,
        current_stock: document.getElementById('swal-qty').value,
        unit: document.getElementById('swal-unit').value,
        alert_threshold: document.getElementById('swal-alert').value,
        unit_price: document.getElementById('swal-price').value
      })
    });

    if (formValues) {
      await fetch('http://127.0.0.1:8000/api/fb/stock/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      fetchStockData();
    }
  };

  const handleAjustement = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: `Mouvement : ${item.name}`,
      background: '#151c2c',
      color: '#fff',
      html: `
        <select id="adj-type" class="swal2-input" style="background:#0f172a; color:white;">
          <option value="Entrée">Livraison / Achat</option>
          <option value="Sortie">Perte / Consommation</option>
        </select>
        <input id="adj-qty" type="number" class="swal2-input" placeholder="Quantité">
        <input id="adj-reason" class="swal2-input" placeholder="Motif">
      `,
      confirmButtonColor: '#ea580c',
      preConfirm: () => ({
        id: item.id,
        quantity: document.getElementById('adj-qty').value,
        type: document.getElementById('adj-type').value,
        reason: document.getElementById('adj-reason').value
      })
    });

    if (formValues) {
      await fetch('http://127.0.0.1:8000/api/fb/stock/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      fetchStockData();
    }
  };

  const filteredItems = filter === 'Tous' ? items : items.filter(i => i.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "En Rupture", value: stats.rupture, icon: "error", color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Alertes Seuil", value: stats.alerte, icon: "warning", color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Valeur Magasin", value: `${stats.valeur.toFixed(2)} $`, icon: "payments", color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-xl">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <span className={`material-icons-round ${stat.color} text-xl`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">{stat.label}</p>
              <h3 className="text-xl font-black text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Inventaire Table */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black text-sm uppercase tracking-widest text-white">Gestion Magasin Central</h3>
          <div className="flex gap-4">
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                {['Tous', 'Bar', 'Cuisine'].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filter === cat ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-white'}`}>{cat}</button>
                ))}
            </div>
            <button onClick={handleAddArticle} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
              <span className="material-icons-round text-sm">add</span> Nouvel Article
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[9px] font-black">
                <th className="px-8 py-5">Article</th>
                <th className="px-8 py-5">Stock Magasin</th>
                <th className="px-8 py-5">Seuil Alerte</th>
                <th className="px-8 py-5">Statut</th>
                <th className="px-8 py-5 text-right">Mouvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-4">
                    <p className="text-[11px] font-black text-white uppercase">{item.name}</p>
                    <p className="text-[8px] text-slate-500 uppercase">{item.category} • {item.unit}</p>
                  </td>
                  <td className="px-8 py-4 font-black text-white">{item.current_stock}</td>
                  <td className="px-8 py-4 text-slate-500 font-bold">{item.alert_threshold}</td>
                  <td className="px-8 py-4">
                    {item.current_stock <= 0 ? (
                      <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-2 py-1 rounded">Rupture</span>
                    ) : item.current_stock <= item.alert_threshold ? (
                      <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black px-2 py-1 rounded">Alerte</span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-1 rounded">Optimal</span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => handleAjustement(item)} className="p-2 hover:bg-orange-600/20 text-orange-500 rounded-lg transition-all">
                      <span className="material-icons-round text-sm">swap_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StocksFB;