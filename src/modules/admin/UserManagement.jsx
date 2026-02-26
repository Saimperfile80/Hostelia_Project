import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Logique édition
  const [currentId, setCurrentId] = useState(null); // Logique édition
  const [searchTerm, setSearchTerm] = useState(""); // Logique recherche
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    username: '', email: '', phone: '', department: 'Reception', role: 'Staff', password: ''
  });

  // Injection correcte pour que les icônes s'affichent
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- FONCTION PDF CORRIGÉE (Génère un vrai fichier liste) ---
  const exportTableToPDF = () => {
    const header = "RAPPORT DES UTILISATEURS - HOSTELIA\n";
    const separator = "--------------------------------------------------\n";
    const rows = filteredUsers.map(u => `${u.username.padEnd(20)} | ${u.email.padEnd(25)} | ${u.department.padEnd(15)} | ${u.role}`).join('\n');
    const content = header + separator + "NOM                  | EMAIL                     | DEPARTEMENT     | ROLE\n" + separator + rows;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_hostelia.txt`; // Export propre en format liste
    a.click();
  };

  // --- LOGIQUE ÉDITION ---
  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      department: user.department,
      role: user.role,
      password: '' 
    });
    setShowModal(true);
  };

  // --- LOGIQUE SUPPRESSION ---
  const deleteUser = async (id) => {
    if(window.confirm("Supprimer cet utilisateur ?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/delete/${id}`, { method: 'DELETE' });
        if(response.ok) {
          setNotification({ show: true, message: 'Utilisateur supprimé !', type: 'success' });
          setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
          refreshUsers();
        }
      } catch (e) { console.error(e); }
    }
  };

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-10);
    setFormData({ ...formData, password: pass });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `http://127.0.0.1:8000/users/update/${currentId}` : 'http://127.0.0.1:8000/users/add';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setIsEditing(false);
        setFormData({ username: '', email: '', phone: '', department: 'Reception', role: 'Staff', password: '' });
        setNotification({ show: true, message: isEditing ? 'Mis à jour !' : 'Utilisateur ajouté !', type: 'success' });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
        refreshUsers();
      }
    } catch (error) { console.error("Erreur"); }
  };

  // --- FILTRE RECHERCHE ---
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rolesCount = [...new Set(users.map(u => u.role))].length;

  return (
    <div className="flex-1 bg-[#0B1120] text-slate-100 min-h-screen p-8 lg:p-12 relative font-['Inter']">
      
      {/* NOTIFICATION BLEU ROYAL */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase text-white">Utilisateurs & Rôles</h1>
          <p className="text-slate-400 mt-1 text-sm">Gestion réelle de votre base de données Hostelia.</p>
        </div>
        <div className="flex gap-3">
          {/* BOUTON PDF AJOUTÉ ICI */}
          <button 
            onClick={exportTableToPDF}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-bold transition-all border border-slate-700"
          >
            <span className="material-symbols-outlined">description</span>
            Export Liste
          </button>
          <button 
            onClick={() => { setIsEditing(false); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <span className="material-symbols-outlined">person_add</span>
            Ajouter un utilisateur
          </button>
        </div>
      </header>

      {/* STATS RÉELLES (Bleu Royal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Utilisateurs</span>
            <span className="material-symbols-outlined text-blue-500">groups</span>
          </div>
          <div className="text-4xl font-bold">{users.length}</div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase">Sessions Actives</span>
            <span className="material-symbols-outlined text-blue-400">sensors</span>
          </div>
          <div className="text-4xl font-bold">{users.length}</div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-bold uppercase">Rôles Configurés</span>
            <span className="material-symbols-outlined text-amber-500">verified_user</span>
          </div>
          <div className="text-4xl font-bold">{rolesCount}</div>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="bg-[#1E293B]/50 rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-[#1E293B] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-500">list_alt</span>
              <span className="font-bold text-sm uppercase tracking-widest">Liste des Collaborateurs</span>
           </div>
           <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0B1120] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" 
                placeholder="Rechercher..." 
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0B1120]/50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                <th className="px-8 py-5">Collaborateur</th>
                <th className="px-8 py-5">Département</th>
                <th className="px-8 py-5">Rôle</th>
                <th className="px-8 py-5">Statut</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-600/5 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 font-bold uppercase">
                        {user.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user.username}</p>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-400 uppercase">{user.department}</td>
                  <td className="px-8 py-5">
                     <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-blue-400 uppercase">{user.role}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> En ligne
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => deleteUser(user.id)} className="material-symbols-outlined text-slate-600 hover:text-red-500 transition-colors">delete</button>
                       <button onClick={() => handleEdit(user)} className="material-symbols-outlined text-slate-500 hover:text-blue-500 transition-colors">settings_account_box</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FORMULAIRE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{isEditing ? "Edit User Profile" : "Add New System User"}</h2>
                <p className="text-slate-400 text-xs">Configure profile details and assign permissions.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="material-symbols-outlined text-slate-500 hover:text-white">close</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none" placeholder="j.dupont@hostelia.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none">
                    <option>Reception</option><option>IT Support</option><option>Finance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none">
                    <option>Staff</option><option>Admin</option><option>Manager</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temporary Password</label>
                <div className="flex gap-2">
                  <input type="password" required={!isEditing} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="flex-1 bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none" placeholder="••••••••" />
                  <button type="button" onClick={generatePassword} className="bg-blue-600/10 text-blue-500 border border-blue-500/30 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">key</span> Generate
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-bold text-xs uppercase hover:bg-slate-700 transition-all">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                  {isEditing ? "Update User" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;