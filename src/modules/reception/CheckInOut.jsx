import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Mixin pour les petites notifications de succès
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#151c2c',
  color: '#fff',
  iconColor: '#10b981'
});

const CheckInOut = () => {
  const [data, setData] = useState({
    reservations: [],
    rooms: [],
    stats: { arrivals: 0, departures: 0, ready: 0, cleaning: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionModal, setShowActionModal] = useState(null); 

  const fetchMovementData = async () => {
    try {
      const [resRes, roomsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/reservations'),
        fetch('http://127.0.0.1:8000/api/rooms')
      ]);
      const reservations = await resRes.json();
      const roomsObj = await roomsRes.json();
      const rooms = roomsObj.rooms || [];
      
      setData({
        reservations,
        rooms,
        stats: {
          arrivals: reservations.filter(r => r.status === 'Confirmée' || !r.status).length,
          departures: reservations.filter(r => r.status === 'Occupée').length,
          ready: rooms.filter(r => r.status === 'Disponible').length,
          cleaning: rooms.filter(r => r.status === 'À nettoyer').length
        }
      });
    } catch (err) { 
      console.error("Erreur de fetch"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchMovementData(); }, []);

  const handleStatusChange = async (resId, roomNumber, type) => {
    const actionText = type === 'in' ? "Confirmer l'arrivée (Check-In) ?" : "Confirmer le départ (Check-Out) ?";
    const confirmColor = type === 'in' ? '#10b981' : '#f59e0b';

    // Demande de confirmation stylée
    const result = await Swal.fire({
      title: 'Confirmation',
      text: actionText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#334155',
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler',
      background: '#151c2c',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        // 1. Update de la réservation
        const resToUpdate = data.reservations.find(r => r.id === resId);
        const nextResStatus = type === 'in' ? 'Occupée' : 'Terminé';

        await fetch(`http://127.0.0.1:8000/api/reservations/update/${resId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...resToUpdate, status: nextResStatus })
        });

        // 2. Update de la chambre
        const nextRoomStatus = type === 'in' ? 'Occupée' : 'À nettoyer';
        await fetch(`http://127.0.0.1:8000/api/rooms/update_status`, {
        method: 'PUT', // Ou POST selon ce que tu as mis dans main.py
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_number: roomNumber, status: nextRoomStatus })
      });
        setShowActionModal(null);
        fetchMovementData();
        
        Toast.fire({
          icon: 'success',
          title: type === 'in' ? 'Client installé en chambre' : 'Check-out effectué'
        });

      } catch (err) { 
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La mise à jour a échoué',
          background: '#151c2c',
          color: '#fff'
        });
      }
    }
  };

  const filteredMovements = data.reservations.filter(res => 
    res.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) || res.room_number.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Recherche et Actions */}
      <div className="bg-[#151c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-2 relative group">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input type="text" placeholder="Rechercher un client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none text-white focus:border-blue-500/50 transition-all" />
          </div>
          <div className="flex gap-4 lg:col-span-2">
            <button onClick={() => setShowActionModal('in')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20">
              <span className="material-icons-round">login</span> CHECK-IN
            </button>
            <button onClick={() => setShowActionModal('out')} className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-900/20">
              <span className="material-icons-round">logout</span> CHECK-OUT
            </button>
          </div>
        </div>
      </div>

      {/* MODAL D'ACTION */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151c2c] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-black uppercase tracking-widest text-xs">
                {showActionModal === 'in' ? 'Arrivées (Check-In)' : 'Départs (Check-Out)'}
              </h2>
              <button onClick={() => setShowActionModal(null)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.reservations
                .filter(r => showActionModal === 'in' ? (r.status === 'Confirmée' || !r.status) : r.status === 'Occupée')
                .map(res => (
                  <button key={res.id} onClick={() => handleStatusChange(res.id, res.room_number, showActionModal)}
                    className="w-full bg-white/5 hover:bg-blue-600 p-5 rounded-[1.5rem] text-left transition-all group flex justify-between items-center">
                    <div>
                        <p className="text-white font-bold text-sm group-hover:text-white transition-colors">{res.guest_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black group-hover:text-blue-100 transition-colors">Chambre {res.room_number}</p>
                    </div>
                    <span className="material-icons-round text-white/10 group-hover:text-white transition-colors">arrow_forward</span>
                  </button>
                ))}
              {data.reservations.filter(r => showActionModal === 'in' ? (r.status === 'Confirmée' || !r.status) : r.status === 'Occupée').length === 0 && (
                  <div className="text-center py-10">
                    <span className="material-icons-round text-4xl text-white/5 mb-2">event_busy</span>
                    <p className="text-slate-500 text-xs font-bold uppercase italic">Aucune opération disponible</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Cartes Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Arrivées" value={data.stats.arrivals} color="blue" />
        <StatCard label="Départs" value={data.stats.departures} color="orange" />
        <StatCard label="Chambres Prêtes" value={data.stats.ready} color="emerald" />
        <StatCard label="À Nettoyer" value={data.stats.cleaning} color="rose" />
      </div>

      {/* 3. Tableau */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-widest text-sm">Derniers Mouvements</h3>
          <button onClick={fetchMovementData} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-all active:rotate-180">
            <span className="material-icons-round text-sm">refresh</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Chambre</th>
                <th className="px-8 py-5">Statut Actuel</th>
                <th className="px-8 py-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMovements.map((res) => (
                <tr key={res.id} className="text-white hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5 font-bold text-sm">{res.guest_name}</td>
                  <td className="px-8 py-5 text-xs text-slate-400 font-black italic">#{res.room_number}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                      res.status === 'Occupée' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      res.status === 'Terminé' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {res.status || 'En attente'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-blue-400">{res.total_price}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour les cartes de statistiques
const StatCard = ({ label, value, color }) => (
  <div className={`bg-${color}-600/5 border-l-4 border-${color}-600 p-6 rounded-2xl shadow-xl`}>
    <span className={`text-[10px] font-black uppercase text-${color}-400 tracking-widest`}>{label}</span>
    <p className="text-4xl font-black text-white mt-1">{value}</p>
  </div>
);

export default CheckInOut;