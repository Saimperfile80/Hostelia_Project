import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const DashboardFB = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [consumption, setConsumption] = useState([]); // AJOUT : Pour l'analyse des ingrédients
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resOrders, resMenu, resTables, resTrans, resCons] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/fb/orders'),
        fetch('http://127.0.0.1:8000/api/fb/menu'),
        fetch('http://127.0.0.1:8000/api/fb/tables'),
        fetch('http://127.0.0.1:8000/api/fb/transactions/today'),
        fetch('http://127.0.0.1:8000/api/fb/stock/movements') // Récupère l'historique des sorties
      ]);

      setOrders(await resOrders.json() || []);
      setMenuItems(await resMenu.json() || []);
      setTables(await resTables.json() || []);
      setTransactions(await resTrans.json() || []);
      
      // Logique pour filtrer les consommations du jour (Sorties/Ventes)
      const movements = await resCons.json() || [];
      setConsumption(movements.filter(m => m.type === 'Sortie').slice(0, 5));
      
      setLoading(false);
    } catch (err) { 
      console.error("Erreur Dashboard:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- KPI ---
  const dailyRev = transactions.reduce((acc, t) => acc + t.amount, 0);
  const occupiedTablesCount = tables.filter(t => t.status === 'Occupée').length;
  const activeOrdersList = orders.filter(o => o.status !== 'Servi');
  
  // Utilise le stock calculé (portions) ou le stock brut
  const criticalStocks = menuItems.filter(item => item.stock_qty <= 5);

  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'En attente' ? 'En préparation' : 'Servi';
    try {
      await fetch(`http://127.0.0.1:8000/api/fb/orders/status/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handlePrintOrder = async (order) => {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/fb/print', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: `COMMANDE TABLE ${order.table_number}`, data: order })
        });
        if(res.ok) Swal.fire({title: 'Imprimé', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false});
    } catch (err) { window.print(); }
  };

  if (loading) return <div className="p-10 text-orange-500 font-black animate-pulse uppercase tracking-widest text-center">Chargement Hostelia...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* KPIs Dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Commandes Actives", value: activeOrdersList.length, color: "text-orange-500", icon: "restaurant" },
          { label: "Ventes Encaissées", value: `${dailyRev.toFixed(2)} $`, color: "text-emerald-500", icon: "payments" },
          { label: "Alertes Stocks", value: criticalStocks.length, color: "text-rose-500", icon: "inventory_2" },
          { label: "Occupation Salles", value: `${occupiedTablesCount}/${tables.length}`, color: "text-blue-400", icon: "table_restaurant" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</p>
              <span className="material-icons-outlined text-slate-600 text-sm">{kpi.icon}</span>
            </div>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flux des Commandes */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
                <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white mb-10">
                    <span className="material-icons-outlined text-orange-500">pending_actions</span>
                    Cuisine & Bar
                </h3>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {activeOrdersList.length > 0 ? activeOrdersList.map((order) => {
                    const items = JSON.parse(order.items);
                    return (
                        <div key={order.id} className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 flex justify-between items-center hover:border-orange-500/30 transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-white font-black text-sm">{order.table_number}</span>
                                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${order.status === 'En attente' ? 'bg-rose-500/20 text-rose-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {items.map((it, i) => (
                                    <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                                        {it.qty}x {it.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button title="Suivant" onClick={() => updateStatus(order.id, order.status)} className="p-3 bg-white/5 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all">
                                <span className="material-icons-round text-sm">check_circle</span>
                            </button>
                            <button title="Imprimer" onClick={() => handlePrintOrder(order)} className="p-3 bg-white/5 hover:bg-orange-500/20 text-orange-500 rounded-xl transition-all">
                                <span className="material-icons-round text-sm">print</span>
                            </button>
                        </div>
                        </div>
                    );
                    }) : (
                    <p className="text-center text-slate-600 uppercase text-[10px] font-black py-20">Repos ! Aucune commande</p>
                    )}
                </div>
            </div>

            {/* AJOUT : Bloc Analyse Consommation Ingrédients */}
            <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
                <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white mb-6">
                    <span className="material-icons-outlined text-blue-400">trending_down</span>
                    Dernières Sorties Ingrédients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {consumption.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-[10px] font-black text-white uppercase">{c.item_name}</p>
                                <p className="text-[8px] text-slate-500 uppercase">{c.reason}</p>
                            </div>
                            <span className="text-xs font-black text-orange-500">-{c.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Colonne Droite : Stocks Critiques */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl h-fit">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white mb-8">
            <span className="material-icons-outlined text-rose-500">inventory_2</span>
            Alerte Stocks
          </h3>
          <div className="space-y-3">
            {criticalStocks.length > 0 ? criticalStocks.map((item) => (
              <div key={item.id} className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 flex justify-between items-center group hover:bg-rose-500/10 transition-all">
                <div>
                    <p className="text-[10px] font-black text-white uppercase">{item.name}</p>
                    <p className="text-[8px] text-slate-500 uppercase">{item.category}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-black text-rose-500 block">{item.stock_qty}</span>
                    <span className="text-[7px] font-bold text-rose-500/50 uppercase italic">Réapprovisionner</span>
                </div>
              </div>
            )) : (
                <div className="text-center py-10 opacity-20">
                    <span className="material-icons-round text-4xl mb-2">task_alt</span>
                    <p className="text-[9px] font-black uppercase">Stocks optimaux</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFB;