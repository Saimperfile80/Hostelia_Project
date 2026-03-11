import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const GestionTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // On récupère directement l'état des tables depuis le backend
      const resTables = await fetch('http://127.0.0.1:8000/api/fb/tables');
      const dataTables = await resTables.json();
      
      // On s'assure que dataTables est bien un tableau
      setTables(Array.isArray(dataTables) ? dataTables : []);
      setLoading(false);
    } catch (err) { 
      console.error("Erreur tables:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Rafraîchissement automatique toutes le 10 secondes pour voir les changements de statut
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTable = async () => {
    const { value: tableName } = await Swal.fire({
      title: 'Nouvelle Table',
      input: 'text',
      inputPlaceholder: 'Ex: Table 05 ou VIP 01',
      background: '#151c2c',
      color: '#fff',
      confirmButtonColor: '#ea580c',
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    });

    if (tableName) {
      try {
        await fetch('http://127.0.0.1:8000/api/fb/tables/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: tableName, status: 'Disponible' }) // On l'ajoute comme libre par défaut
        });
        fetchData();
      } catch (err) {
        Swal.fire('Erreur', 'Impossible d\'ajouter la table', 'error');
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-orange-500 font-black uppercase tracking-widest">Mise à jour du plan de salle...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-xl font-black uppercase tracking-tighter text-white">Plan de Salle</h3>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gestion de l'occupation en temps réel</p>
        </div>
        <button onClick={handleAddTable} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 transition-all shadow-lg shadow-orange-900/20">
          <span className="material-icons-round text-sm">add_circle</span> Ajouter une table
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {tables.map((table) => {
          // LOGIQUE SIMPLE ET ROBUSTE : On lit le statut venant de la DB
          const isOccupied = table.status === 'Occupée';
          
          return (
            <div key={table.id} className={`aspect-square rounded-[3rem] border flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-xl ${isOccupied ? 'bg-orange-600/10 border-orange-500/50 shadow-orange-900/10' : 'bg-[#151c2c] border-white/5 hover:border-emerald-500/50 shadow-black/40'}`}>
              <div className={`p-4 rounded-full ${isOccupied ? 'bg-orange-500/20' : 'bg-emerald-500/10'}`}>
                <span className={`material-icons-round text-3xl ${isOccupied ? 'text-orange-500' : 'text-emerald-500'}`}>
                  {isOccupied ? 'restaurant' : 'check_circle'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-[12px] font-black uppercase text-white tracking-tight">{table.name}</p>
                <div className="flex items-center gap-1 justify-center mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOccupied ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                    <p className={`text-[8px] font-black uppercase tracking-tighter ${isOccupied ? 'text-orange-500' : 'text-emerald-500'}`}>
                      {isOccupied ? 'Occupée' : 'Disponible'}
                    </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GestionTables;