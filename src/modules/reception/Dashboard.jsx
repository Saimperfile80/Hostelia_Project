import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState({
    arrivals: 0, departures: 0, available: 0, dirty: 0,
    revenue_data: [], alerts: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    fetch('http://127.0.0.1:8000/api/dashboard/stats')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => console.error("Erreur stats:", err));
  };

  useEffect(() => { fetchStats(); }, []);

  // --- ACTIONS DES BOUTONS ---
  const handleQuickAction = (action) => {
    console.log("Action déclenchée:", action);
    // Ici on pourra ajouter la navigation vers les pages spécifiques (Facturation, etc.)
    alert(`Ouverture du module : ${action}`);
  };

  return (
    <div className="p-8 overflow-y-auto flex-1 animate-in fade-in duration-500 bg-transparent">
      
      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatBadge label="Arrivées Jour" val={data.arrivals} color="blue" />
        <StatBadge label="Départs Jour" val={data.departures} color="orange" />
        <StatBadge label="Disponibles" val={data.available} color="emerald" />
        <StatBadge label="À Nettoyer" val={data.dirty} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Graphique des Revenus (Provenant de la Facturation) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              CA Facturation (7 derniers jours)
            </h3>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full uppercase">Source: Finance</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue_data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff'}} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Alertes (Fonctionnelle) */}
        <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center space-x-2 mb-8">
            <span className="material-icons-outlined text-amber-500 animate-bounce">notifications_active</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">Alertes</h3>
          </div>
          
          {data.alerts.length > 0 ? (
            <div className="space-y-4">
              {data.alerts.map(alert => (
                <div key={alert.id} className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <span className="material-icons-outlined text-amber-500 text-sm">warning</span>
                  <p className="text-white text-xs font-bold">{alert.msg}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons-outlined text-slate-400 dark:text-slate-500 text-2xl">info</span>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium italic">
                Aucune alerte opérationnelle.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Raccourcis d'actions rapides (Fonctionnels) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction 
          color="blue" icon="add_circle" title="Nouvelle Réservation" desc="Enregistrer un client" 
          onClick={() => handleQuickAction('Réservation')} 
        />
        <QuickAction 
          color="emerald" icon="login" title="Arrivée Express" desc="Check-in rapide" 
          onClick={() => handleQuickAction('Check-in')}
        />
        <QuickAction 
          color="rose" icon="logout" title="Départ Client" desc="Facturation & Clôture" 
          onClick={() => handleQuickAction('Facturation')}
        />
      </div>
    </div>
  );
};

const StatBadge = ({ label, val, color }) => (
  <div className={`bg-white dark:bg-slate-900/50 border-l-4 border-${color}-600 p-6 rounded-2xl shadow-sm hover:translate-y-[-4px] transition-all duration-300`}>
    <span className={`text-[10px] font-bold uppercase tracking-wider text-${color}-600 mb-1 block`}>{label}</span>
    <span className="text-5xl font-extrabold text-slate-800 dark:text-white">{val}</span>
  </div>
);

const QuickAction = ({ color, icon, title, desc, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-${color}-600/5 dark:bg-${color}-600/10 border border-${color}-600/20 p-5 rounded-[1.5rem] flex items-center space-x-4 cursor-pointer hover:bg-${color}-600/20 transition-all group`}
  >
    <div className={`bg-${color}-600 p-3 rounded-xl text-white shadow-lg shadow-${color}-600/20`}>
      <span className="material-icons-outlined">{icon}</span>
    </div>
    <div>
      <p className="font-bold text-slate-800 dark:text-white text-sm">{title}</p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black">{desc}</p>
    </div>
  </div>
);

export default Dashboard;