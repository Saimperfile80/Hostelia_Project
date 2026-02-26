const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getRooms: () => ipcRenderer.invoke('get-rooms'),
  getProducts: () => ipcRenderer.invoke('get-products'),
  getActiveBookings: () => ipcRenderer.invoke('get-active-bookings'),
  getAISuggestion: () => ipcRenderer.invoke('get-ai-suggestion'),
  
  // Fonctions d'écriture (III.5.3)
  addRoom: (data) => ipcRenderer.invoke('add-room', data),
  performCheckin: (data) => ipcRenderer.invoke('perform-checkin', data),
  placeOrder: (data) => ipcRenderer.invoke('place-order', data),

  getAISuggestion: async () => {
    const response = await fetch('http://127.0.0.1:8000/ai/suggestions');
    return await response.json();
  }
});