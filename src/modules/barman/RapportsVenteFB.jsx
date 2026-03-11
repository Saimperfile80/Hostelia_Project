import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RapportsVenteFB = () => {
  const [period, setPeriod] = useState('Jour');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- RÉCUPÉRATION DES DONNÉES DEPUIS L'API ---
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/fb/reports/stats?period=${period}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erreur rapports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  // --- LOGIQUE D'EXPORTATION PDF ---
  const exportPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    // Header stylisé
    doc.setFillColor(21, 28, 44); // Couleur sombre #151c2c
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("RAPPORT DE VENTES - RESTO & BAR", 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Période : ${period}`, 14, 30);
    doc.text(`Date de génération : ${dateStr}`, 140, 30);

    // Section KPIs
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Résumé de Performance", 14, 55);
    
    const kpiData = [
      ["Ventes Totales", `${stats.total_sales.toFixed(2)} $`],
      ["Nombre de Couverts", stats.total_covers.toString()],
      ["Panier Moyen", `${stats.average_basket.toFixed(2)} $`],
      ["Total Commandes", stats.order_count.toString()]
    ];

    doc.autoTable({
      startY: 60,
      head: [['Indicateur', 'Valeur']],
      body: kpiData,
      theme: 'striped',
      headStyles: { fillColor: [234, 88, 12] } // Orange #ea580c
    });

    // Section Top Articles
    doc.setFontSize(14);
    doc.text("Top 5 des Articles les plus vendus", 14, doc.lastAutoTable.finalY + 15);
    
    const topItemsData = stats.top_items.map(item => [item.name, item.qty]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Nom de l\'article', 'Quantité Vendue']],
      body: topItemsData.length > 0 ? topItemsData : [["Aucune donnée", "0"]],
      theme: 'grid'
    });

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Propulsé par BuildInCode - Système de Gestion Intégré", 14, 285);

    doc.save(`Rapport_${period}_${dateStr}.pdf`);
  };

  const kpis = [
    { label: "Ventes Totales", value: `${stats?.total_sales.toFixed(2) || "0.00"} $`, icon: "query_stats", color: "text-orange-500" },
    { label: "Nombre de Couverts", value: stats?.total_covers || "0", icon: "groups", color: "text-blue-400" },
    { label: "Panier Moyen", value: `${stats?.average_basket.toFixed(2) || "0.00"} $`, icon: "shopping_cart", color: "text-emerald-500" },
    { label: "Annulations / Pertes", value: "0.00 $", icon: "block", color: "text-red-500" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Filtres & Export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
        <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {['Jour', 'Semaine', 'Mois', 'Année'].map((p) => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === p ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={exportPDF} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-orange-600/10 border border-orange-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">download</span> 
            {loading ? 'Traitement...' : 'Exporter PDF'}
          </button>
        </div>
      </div>

      {/* 2. KPIs de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <span className={`material-symbols-outlined ${kpi.color} text-xl mb-4 block`}>{kpi.icon}</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-black text-white ${loading ? 'animate-pulse' : ''}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Courbe des Revenus (Visualisation) */}
        <div className="lg:col-span-2 bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl min-h-[400px]">
          <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white mb-10">
            <span className="material-symbols-outlined text-orange-500">show_chart</span>
            Analyse des Revenus
          </h3>
          <div className="h-64 flex items-end gap-2 px-4 border-l border-b border-white/5">
             {[35, 60, 45, 85, 55, 95, 70].map((h, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-gradient-to-t from-orange-600/20 to-orange-500 rounded-t-lg transition-all duration-500 hover:brightness-125" 
                 style={{height: `${loading ? 10 : h}%`}}
               ></div>
             ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
          </div>
        </div>

        {/* 4. Top Performance */}
        <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h3 className="font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-sm text-white">
            <span className="material-symbols-outlined text-amber-500">star</span>
            Top Performance
          </h3>
          <div className="space-y-4">
            {stats?.top_items && stats.top_items.length > 0 ? (
              stats.top_items.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">{item.name}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Article populaire</span>
                  </div>
                  <span className="bg-orange-600/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black">{item.qty} Ventes</span>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportsVenteFB;