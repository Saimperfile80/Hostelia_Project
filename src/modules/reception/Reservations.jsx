import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Configuration globale des notifications "Toast"
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

const Reservations = () => {
  // --- ÉTATS (STATES) ---
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tout');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    guest_name: '', room_number: '', check_in: '', check_out: '', total_price: ''
  });

  // --- CHARGEMENT DES DONNÉES ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, roomsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/reservations'),
        fetch('http://127.0.0.1:8000/api/rooms')
      ]);
      const dataRes = await resRes.json();
      const dataRooms = await roomsRes.json();
      
      setReservations(dataRes);
      setRooms(dataRooms.rooms || []);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- ACTIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://127.0.0.1:8000/api/reservations/update/${editingId}`
      : 'http://127.0.0.1:8000/api/reservations/add';
    
    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        closeModal();
        fetchData();
        Toast.fire({
          icon: 'success',
          title: editingId ? 'Réservation mise à jour' : 'Réservation enregistrée'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de traiter la demande',
        background: '#151c2c',
        color: '#fff'
      });
    }
  };

  const deleteRes = async (id) => {
    Swal.fire({
      title: 'Supprimer ?',
      text: "Voulez-vous vraiment retirer cette réservation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: '#151c2c',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/reservations/delete/${id}`, { method: 'DELETE' });
          if (res.ok) {
            fetchData();
            Toast.fire({ icon: 'success', title: 'Réservation supprimée' });
          }
        } catch (err) {
          Toast.fire({ icon: 'error', title: 'Erreur lors de la suppression' });
        }
      }
    });
  };

  // --- GESTION MODALE ---
  const openEdit = (res) => {
    setEditingId(res.id);
    setFormData({
      guest_name: res.guest_name,
      room_number: res.room_number,
      check_in: res.check_in,
      check_out: res.check_out,
      total_price: res.total_price
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ guest_name: '', room_number: '', check_in: '', check_out: '', total_price: '' });
  };

  // --- FILTRES ET STYLES ---
  const filteredRes = activeTab === 'Tout' ? reservations : reservations.filter(r => r.status === activeTab);

  const getStatusStyle = (status) => {
    if (status === 'Confirmée') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (status === 'Annulé') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* 1. Barre d'outils */}
      <div className="bg-[#151c2c] p-6 rounded-[2rem] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
          {['Tout', 'Confirmée', 'En attente', 'Annulé'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
          <span className="material-icons-round">add</span> NOUVELLE RÉSERVATION
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151c2c] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-white font-black italic text-xl uppercase tracking-tighter">{editingId ? 'Modifier' : 'Nouvelle'} Réservation</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-white"><span className="material-icons-round">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nom du Client</label>
                <input required className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600" 
                  value={formData.guest_name} onChange={e => setFormData({...formData, guest_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Chambre</label>
                  <select required className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white text-sm outline-none"
                    value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})}>
                    <option value="">Sélectionner</option>
                    {rooms.map(room => <option key={room.id} value={room.room_number}>#{room.room_number} - {room.type}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Prix ($)</label>
                  <input required type="number" className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white text-sm outline-none"
                    value={formData.total_price} onChange={e => setFormData({...formData, total_price: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Arrivée</label>
                    <input required type="date" className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white text-sm outline-none" value={formData.check_in} onChange={e => setFormData({...formData, check_in: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Départ</label>
                    <input required type="date" className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white text-sm outline-none" value={formData.check_out} onChange={e => setFormData({...formData, check_out: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] mt-6 shadow-xl active:scale-95 transition-all">
                {editingId ? 'Mettre à jour' : 'Confirmer la réservation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Tableau */}
      <div className="bg-[#151c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/5">
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6">Chambre</th>
                <th className="px-8 py-6">Séjour</th>
                <th className="px-8 py-6">Statut</th>
                <th className="px-8 py-6">Montant</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!loading && filteredRes.map((res) => (
                <tr key={res.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-white">{res.guest_name}</td>
                  <td className="px-8 py-5 text-xs font-black text-slate-400 italic">#{res.room_number}</td>
                  <td className="px-8 py-5 text-[10px] font-bold text-slate-400">{res.check_in} → {res.check_out}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusStyle(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-white">{res.total_price}$</td>
                  <td className="px-8 py-5 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(res)} className="p-2 text-slate-500 hover:text-blue-500 transition-colors">
                      <span className="material-icons-round text-sm">edit</span>
                    </button>
                    <button onClick={() => deleteRes(res.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                      <span className="material-icons-round text-sm">delete</span>
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

export default Reservations;