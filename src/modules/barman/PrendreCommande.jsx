import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const PrendreCommande = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]); // Nouveau: Liste des tables
  const [selectedTable, setSelectedTable] = useState(''); // Nouveau: Table choisie
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Tous', icon: 'apps' },
    { id: 2, name: 'Entrée', icon: 'set_meal' },
    { id: 3, name: 'Consistant', icon: 'restaurant' },
    { id: 4, name: 'Bierre', icon: 'local_bar' },
    { id: 5, name: 'Dessert', icon: 'icecream' },
  ];

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchMenuItems = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/fb/menu');
    const data = await res.json();
    setMenuItems(data.filter(item => item.is_visible !== 0));
  };

  const fetchTables = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/fb/tables');
    const data = await res.json();
    setTables(data);
  };

  // --- LOGIQUE DU PANIER ---
  const addToCart = (item) => {
    if (item.stock_qty <= 0) {
        return Swal.fire({ icon: 'error', title: 'Stock épuisé', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    }
    const exist = cart.find((x) => x.id === item.id);
    if (exist) {
      setCart(cart.map((x) => x.id === item.id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    const exist = cart.find((x) => x.id === item.id);
    if (exist.qty === 1) {
      setCart(cart.filter((x) => x.id !== item.id));
    } else {
      setCart(cart.map((x) => x.id === item.id ? { ...exist, qty: exist.qty - 1 } : x));
    }
  };

  const subTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const tva = subTotal * 0.16;
  const total = subTotal + tva;

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    if (!selectedTable) {
        return Swal.fire({ icon: 'warning', title: 'Sélectionnez une table', background: '#151c2c', color: '#fff' });
    }
    
    const orderData = {
        table_number: selectedTable, // Dynamique !
        items: JSON.stringify(cart),
        total_amount: total,
        status: 'En attente'
    };

    try {
        const res = await fetch('http://127.0.0.1:8000/api/fb/orders/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Commande envoyée !', background: '#151c2c', color: '#fff' });
            setCart([]);
            setSelectedTable(''); // Reset table
            fetchMenuItems();
        }
    } catch (err) { console.error(err); }
  };

  const filteredItems = menuItems.filter(item => {
    const matchCat = selectedCategory === 'Tous' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex gap-8 h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* SECTION GAUCHE */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-6 bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5">
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 text-white outline-none focus:border-orange-500 transition-all"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${selectedCategory === cat.name ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                <span className="material-icons-round text-sm">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => addToCart(item)} className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 hover:border-orange-500/50 cursor-pointer transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{item.category}</span>
                    <span className="text-sm font-black text-white">{item.price} $</span>
                </div>
                <h4 className="text-white font-black uppercase italic text-sm group-hover:text-orange-500 transition-colors">{item.name}</h4>
                <p className="text-[10px] text-slate-500 mt-2">Stock: {item.stock_qty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION DROITE (Panier) */}
      <div className="w-[400px] flex flex-col gap-6">
        <div className="flex-1 bg-[#151c2c] rounded-[2.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-sm uppercase text-white tracking-widest">Commande Actuelle</h3>
            </div>
            {/* SELECTEUR DE TABLE DYNAMIQUE */}
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-black text-orange-500 uppercase outline-none focus:border-orange-500 transition-all"
            >
              <option value="">Sélectionner une table</option>
              {tables.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
             {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <span className="material-icons-round text-4xl mb-2">shopping_basket</span>
                    <p className="text-[10px] font-black uppercase text-center">Le panier est vide</p>
                 </div>
             ) : cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div>
                        <p className="text-[10px] font-black text-white uppercase">{item.name}</p>
                        <p className="text-[9px] text-orange-500 font-bold">{item.price * item.qty} $</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(item)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white">-</button>
                        <span className="text-xs font-black text-white">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white">+</button>
                    </div>
                 </div>
             ))}
          </div>

          <div className="p-8 bg-black/20 space-y-4 border-t border-white/5">
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-white">Total</span>
              <span className="text-3xl font-black text-orange-500">{total.toFixed(2)} $</span>
            </div>

            <button onClick={handleSendOrder} disabled={cart.length === 0} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${cart.length > 0 ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/20' : 'bg-white/5 text-slate-600'}`}>
              <span className="material-icons-round text-sm">print</span> ENVOYER EN CUISINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrendreCommande;