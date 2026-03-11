import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const MenuCarte = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);

  const categories = [
    'Tous', 'Cocktail', 'Bierre', 'Jus', 'Vin', 'Champagne', 'Wisky', 
    'Entrée', 'Sortie', 'Consistant', 'Dessert'
  ];

  const fetchMenu = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/fb/menu');
      const data = await res.json();
      setMenuItems(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur menu:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  // --- LOGIQUE DE VÉRIFICATION ET DÉDUCTION ---
  const handleAddItem = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nouveau Produit / Boisson',
      background: '#151c2c',
      color: '#fff',
      html:
        `<div style="text-align:left; font-size:10px; color:#64748b; margin-bottom:5px;">NOM (Doit correspondre au stock pour les boissons) :</div>` +
        `<input id="swal-name" class="swal2-input" placeholder="Ex: Coca-Cola" style="background:#0f172a; color:white; border:1px solid #334155">` +
        `<select id="swal-cat" class="swal2-input" style="background:#0f172a; color:white; border:1px solid #334155">
            ${categories.filter(c => c !== 'Tous').map(c => `<option value="${c}">${c}</option>`).join('')}
         </select>` +
        `<input id="swal-price" type="number" class="swal2-input" placeholder="Prix de vente ($)" style="background:#0f172a; color:white; border:1px solid #334155">` +
        `<input id="swal-stock" type="number" class="swal2-input" placeholder="Qté à prélever du Stock" style="background:#0f172a; color:white; border:1px solid #334155">`,
      confirmButtonColor: '#ea580c',
      preConfirm: () => ({
        name: document.getElementById('swal-name').value,
        category: document.getElementById('swal-cat').value,
        price: parseFloat(document.getElementById('swal-price').value), // Convertir en nombre
        stock_qty: parseFloat(document.getElementById('swal-stock').value) // Convertir en nombre
      })
    });

    if (formValues) {
      const res = await fetch('http://127.0.0.1:8000/api/fb/menu/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      
      const result = await res.json();

      if (result.status === "error") {
        Swal.fire({
          icon: 'error',
          title: 'Stock Insuffisant',
          text: result.message,
          background: '#151c2c',
          color: '#fff'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Produit ajouté et stock déduit',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
        fetchMenu();
      }
    }
  };

  const handleManageRecipe = async (item) => {
    try {
      const ingredientsRes = await fetch('http://127.0.0.1:8000/api/fb/stock/list');
      const ingredientsData = await ingredientsRes.json();
      
      const { value: formValues } = await Swal.fire({
        title: `Fiche Technique : ${item.name}`,
        background: '#151c2c',
        color: '#fff',
        html: `
          <select id="swal-ing" class="swal2-input" style="background:#0f172a; color:white; border:1px solid #334155;">
            ${ingredientsData.items.map(ing => `<option value="${ing.id}">${ing.name} (${ing.unit})</option>`).join('')}
          </select>
          <input id="swal-qty" type="number" step="0.01" class="swal2-input" placeholder="Quantité nécessaire">
        `,
        confirmButtonColor: '#ea580c',
        showCancelButton: true,
        preConfirm: () => ({
          menu_item_id: item.id,
          ingredient_id: document.getElementById('swal-ing').value,
          quantity_needed: parseFloat(document.getElementById('swal-qty').value)
        })
      });

      if (formValues) {
        await fetch('http://127.0.0.1:8000/api/fb/recipes/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        Swal.fire('Succès', 'Ingrédient lié', 'success');
        fetchMenu();
      }
    } catch (err) { console.error(err); }
  };

  const handleEditItem = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: 'Modifier le produit',
      background: '#151c2c',
      color: '#fff',
      html:
        `<input id="swal-name" class="swal2-input" value="${item.name}" style="background:#0f172a; color:white; border:1px solid #334155">` +
        `<select id="swal-cat" class="swal2-input" style="background:#0f172a; color:white; border:1px solid #334155">
            ${categories.filter(c => c !== 'Tous').map(c => `<option value="${c}" ${c === item.category ? 'selected' : ''}>${c}</option>`).join('')}
         </select>` +
        `<input id="swal-price" type="number" class="swal2-input" value="${item.price}" style="background:#0f172a; color:white; border:1px solid #334155">` +
        `<input id="swal-stock" type="number" class="swal2-input" value="${item.stock_qty}" style="background:#0f172a; color:white; border:1px solid #334155">`,
      confirmButtonColor: '#ea580c',
      preConfirm: () => ({
        name: document.getElementById('swal-name').value,
        category: document.getElementById('swal-cat').value,
        price: document.getElementById('swal-price').value,
        stock_qty: document.getElementById('swal-stock').value
      })
    });

    if (formValues) {
      await fetch(`http://127.0.0.1:8000/api/fb/menu/update/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      fetchMenu();
    }
  };

  const toggleVisibility = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/fb/menu/toggle-visibility/${id}`, { method: 'PUT' });
    fetchMenu();
  };

  const deleteItem = async (id) => {
    const res = await Swal.fire({ title: 'Supprimer ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (res.isConfirmed) {
      await fetch(`http://127.0.0.1:8000/api/fb/menu/delete/${id}`, { method: 'DELETE' });
      fetchMenu();
    }
  };

  const filteredItems = filter === 'Tous' ? menuItems : menuItems.filter(i => i.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Configuration de la Carte</h3>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleAddItem} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-3 self-start">
          <span className="material-icons-round text-sm">add_circle</span>
          Nouveau Plat / Boisson
        </button>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className={`bg-[#151c2c] rounded-[2.5rem] border border-white/5 overflow-hidden group transition-all ${item.is_visible === 0 ? 'opacity-40 grayscale' : 'hover:border-orange-500/30'}`}>
            <div className="h-48 bg-black/40 relative flex items-center justify-center">
              <span className="material-icons-round text-5xl text-white/5">restaurant</span>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.stock_qty > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <span className="text-[9px] font-black text-white uppercase">{item.stock_qty > 0 ? 'Disponible' : 'Épuisé'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{item.category}</p>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{item.name}</h4>
                </div>
                <span className="text-xl font-black text-white">{item.price} $</span>
              </div>

              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[10px] font-black text-slate-500 uppercase">Quantité à vendre : {item.stock_qty}</span>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${Math.min(item.stock_qty * 5, 100)}%` }}></div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                 <button onClick={() => handleEditItem(item)} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition-all">
                   <span className="material-icons-round text-slate-400 text-sm">edit</span>
                 </button>
                 <button onClick={() => handleManageRecipe(item)} className="flex-1 bg-orange-600/10 hover:bg-orange-600/20 py-3 rounded-xl transition-all">
                   <span className="material-icons-round text-orange-500 text-sm">receipt_long</span>
                 </button>
                 <button onClick={() => toggleVisibility(item.id)} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition-all">
                   <span className="material-icons-round text-slate-400 text-sm">{item.is_visible ? 'visibility_off' : 'visibility'}</span>
                 </button>
                 <button onClick={() => deleteItem(item.id)} className="flex-1 bg-red-600/10 hover:bg-red-600/20 py-3 rounded-xl transition-all">
                   <span className="material-icons-round text-red-500 text-sm">delete</span>
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCarte;