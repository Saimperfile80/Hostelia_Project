import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Mixin pour les succès rapides
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

const Inventory = () => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ dispo: 0, occupee: 0, nettoyer: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filterFloor, setFilterFloor] = useState('TOUS');
  
  const [roomData, setRoomData] = useState({ 
    room_number: '', type: 'Standard', price: 100, floor: 'Niv 1' 
  });

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/rooms');
      const data = await res.json();
      setRooms(data.rooms || []);
      setStats(data.stats);
    } catch (err) { 
      console.error("Erreur de connexion"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingRoom 
      ? `http://127.0.0.1:8000/api/rooms/update/${editingRoom.id}`
      : 'http://127.0.0.1:8000/api/rooms/add';
    
    const method = editingRoom ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
      
      if (res.ok) {
        setShowAddForm(false);
        setEditingRoom(null);
        setRoomData({ room_number: '', type: 'Standard', price: 100, floor: 'Niv 1' });
        fetchRooms();
        
        Toast.fire({
          icon: 'success',
          title: editingRoom ? 'Chambre mise à jour' : 'Chambre ajoutée à l\'inventaire'
        });
      }
    } catch (err) { 
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le serveur ne répond pas',
        background: '#151c2c',
        color: '#fff'
      });
    }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setRoomData({ room_number: room.room_number, type: room.type, price: room.price, floor: room.floor });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredRooms = filterFloor === 'TOUS' 
    ? rooms 
    : rooms.filter(r => r.floor === filterFloor);

  const getStatusColor = (status) => {
    if (status === 'Disponible') return 'bg-emerald-500';
    if (status === 'Occupée') return 'bg-rose-500';
    if (status === 'À nettoyer') return 'bg-amber-500';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Barre d'entête avec Stats et Filtres */}
      <div className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-8">
           <p className="text-white font-black italic text-xl">INVENTAIRE</p>
           {/* Indicateurs de disponibilité */}
           <div className="flex items-center gap-6 border-l border-white/10 pl-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase">Dispo: {stats.dispo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase">Occupé: {stats.occupee}</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
          {['TOUS', 'Niv 1', 'Niv 2', 'Niv 3'].map((floor) => (
            <button key={floor} onClick={() => setFilterFloor(floor)}
              className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${filterFloor === floor ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-[#151c2c] p-6 rounded-[2rem] border border-blue-500/30 animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-black uppercase text-xs tracking-widest">
              {editingRoom ? `Modifier Chambre ${editingRoom.room_number}` : 'Nouvelle Chambre'}
            </h2>
            <button onClick={() => {setShowAddForm(false); setEditingRoom(null);}} className="text-slate-500 hover:text-white">
              <span className="material-icons-round">close</span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <input placeholder="Numéro" className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white text-xs" value={roomData.room_number} onChange={e => setRoomData({...roomData, room_number: e.target.value})} required />
            <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white text-xs" value={roomData.type} onChange={e => setRoomData({...roomData, type: e.target.value})}>
                <option>Standard</option><option>Deluxe</option><option>Suite</option>
            </select>
            <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white text-xs" value={roomData.floor} onChange={e => setRoomData({...roomData, floor: e.target.value})}>
                <option>Niv 1</option><option>Niv 2</option><option>Niv 3</option>
            </select>
            <input type="number" className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white text-xs" value={roomData.price} onChange={e => setRoomData({...roomData, price: e.target.value})} required />
            <button className="bg-blue-600 py-2.5 rounded-xl text-white text-[10px] font-black uppercase">
              {editingRoom ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </form>
        </div>
      )}

      {/* Grille des chambres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {!loading && filteredRooms.map((room) => (
          <div key={room.id} className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl group relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <span className="text-2xl font-black text-white italic">#{room.room_number}</span>
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase text-white ${getStatusColor(room.status)}`}>{room.status}</span>
             </div>
             <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
               <span>{room.type}</span>
               <span className="text-blue-500">{room.floor}</span>
             </div>
             <div className="mt-6 flex justify-between items-end">
                <p className="text-lg font-black text-white">{room.price}$</p>
                <button onClick={() => startEdit(room)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <span className="material-icons-round text-sm">edit</span>
                </button>
             </div>
          </div>
        ))}
      </div>

      <button onClick={() => {setEditingRoom(null); setShowAddForm(true);}} className="bg-[#151c2c] p-6 rounded-3xl border border-dashed border-white/10 flex items-center gap-4 text-slate-500 hover:text-blue-500 transition-all group">
          <span className="material-icons-round group-hover:scale-110 transition-transform">add_circle</span>
          <span className="text-[10px] font-black uppercase">Ajouter une Chambre</span>
      </button>
    </div>
  );
};

export default Inventory;