import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  // --- ÉTATS ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Initialisation propre pour éviter l'erreur "value should not be null"
  const initialFormState = {
    username: '', 
    email: '', 
    phone: '', 
    department: 'Reception', 
    role: 'Staff', 
    password: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // --- EFFETS ---
  useEffect(() => {
    // Injection des icônes Google
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    refreshUsers();
  }, []);

  // --- ACTIONS API ---
  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erreur API lors de la récupération:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Correction 404 : Ajout du préfixe /api/
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/users/update/${currentId}` 
      : `http://127.0.0.1:8000/api/users/add`;
    
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
        setFormData(initialFormState); // Reset sans null
        setNotification({ 
          show: true, 
          message: isEditing ? 'Profil mis à jour !' : 'Utilisateur ajouté au système !', 
          type: 'success' 
        });
        setTimeout(() => setNotification({ ...notification, show: false }), 3000);
        refreshUsers();
      } else {
        const errData = await response.json();
        alert("Erreur : " + errData.detail);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  const deleteUser = async (id) => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer ce collaborateur ?")) {
      try {
        // Correction 404 : Ajout de /api/
        const response = await fetch(`http://127.0.0.1:8000/api/users/delete/${id}`, { method: 'DELETE' });
        if(response.ok) {
          setNotification({ show: true, message: 'Utilisateur révoqué avec succès !', type: 'success' });
          setTimeout(() => setNotification({ ...notification, show: false }), 3000);
          refreshUsers();
        }
      } catch (e) {
        console.error("Erreur lors de la suppression:", e);
      }
    }
  };

  // --- UTILITAIRES ---
  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || 'Reception',
      role: user.role || 'Staff',
      password: '' // On laisse vide pour la sécurité
    });
    setShowModal(true);
  };

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-10).toUpperCase();
    setFormData({ ...formData, password: pass });
  };

  const exportTableToPDF = () => {
    const header = "RAPPORT DES UTILISATEURS - HOSTELIA\n";
    const separator = "--------------------------------------------------\n";
    const rows = filteredUsers.map(u => `${u.username.padEnd(20)} | ${u.email.padEnd(25)} | ${u.department.padEnd(15)} | ${u.role}`).join('\n');
    const content = header + separator + "NOM                  | EMAIL                     | DEPARTEMENT     | ROLE\n" + separator + rows;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_hostelia.txt`;
    a.click();
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rolesCount = [...new Set(users.map(u => u.role))].length;

  return (
    <div className="flex-1 bg-[#0B1120] text-slate-100 min-h-screen p-8 lg:p-12 relative font-['Inter']">
      
      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right duration-300">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400/30">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-bold text-sm tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase text-white italic">Utilisateurs & Rôles</h1>
          <p className="text-slate-500 mt-1 text-xs font-medium uppercase tracking-widest">Contrôle d'accès à la plateforme Hostelia</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportTableToPDF}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-bold transition-all border border-slate-700 text-xs uppercase"
          >
            <span className="material-symbols-outlined text-sm">description</span>
            Export Liste
          </button>
          <button 
            onClick={() => { setIsEditing(false); setFormData(initialFormState); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-xs uppercase"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Nouveau Compte
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
            { label: "Total Utilisateurs", val: users.length, icon: "groups", col: "text-blue-500" },
            { label: "Actifs / En ligne", val: users.length, icon: "sensors", col: "text-emerald-500" },
            { label: "Rôles Hiérarchiques", val: rolesCount, icon: "verified_user", col: "text-amber-500" }
        ].map((s, i) => (
            <div key={i} className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50 shadow-sm group hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                    <span className={`material-symbols-outlined ${s.col}`}>{s.icon}</span>
                </div>
                <div className="text-4xl font-black text-white">{s.val}</div>
            </div>
        ))}
      </div>

      {/* TABLEAU */}
      <div className="bg-[#1E293B]/50 rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-[#1E293B] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-500">admin_panel_settings</span>
              <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white">Registre des Accès</span>
           </div>
           <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0B1120] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-[10px] text-white outline-none focus:ring-1 focus:ring-blue-500 w-64" 
                placeholder="RECHERCHER UN NOM OU EMAIL..." 
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0B1120]/50 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Collaborateur</th>
                <th className="px-8 py-5 text-center">Département</th>
                <th className="px-8 py-5 text-center">Rôle Système</th>
                <th className="px-8 py-5 text-center">Statut</th>
                <th className="px-8 py-5 text-right">Gestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-600/[0.03] transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 font-black text-sm uppercase">
                        {user.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase text-white tracking-wide">{user.username}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.department}</td>
                  <td className="px-8 py-5 text-center">
                     <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-widest">{user.role}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Actif
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                       <button onClick={() => deleteUser(user.id)} className="material-symbols-outlined text-slate-600 hover:text-red-500 transition-colors text-xl">delete</button>
                       <button onClick={() => handleEdit(user)} className="material-symbols-outlined text-slate-500 hover:text-blue-500 transition-colors text-xl">settings_suggest</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORMULAIRE */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest italic">{isEditing ? "Modifier le Profil" : "Nouvelle Accréditation"}</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Configuration des permissions et accès de sécurité.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Identifiant Complet</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700" placeholder="Ex: Mbuyi Kazadi" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Adresse Email Professionnelle</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700" placeholder="nom@hostelia.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Affectation Département</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                    <option>Reception</option><option>IT Support</option><option>Finance</option><option>Management</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Niveau d'Autorité</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                    <option>Staff</option><option>Admin</option><option>Manager</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Clé d'Accès Temporaire</label>
                <div className="flex gap-3">
                  <input type="password" required={!isEditing} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="flex-1 bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="••••••••" />
                  <button type="button" onClick={generatePassword} className="bg-blue-600 text-white px-6 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">key</span> Générer
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">Annuler</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all">
                  {isEditing ? "Mettre à jour" : "Confirmer l'ajout"}
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