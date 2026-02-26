const { app, BrowserWindow, ipcMain } = require('electron');
const Database = require('better-sqlite3');
const path = require('path');

// --- CONNEXION BDD (III.5.2) ---
const db = new Database(path.join(__dirname, '../database/hostelia.db'), { verbose: console.log });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#0b1120'
  });

  win.loadURL('http://localhost:5173'); 
}

// =========================================================
// --- ACTIONS IPC D'ÉCRITURE (BOUTONS INTERFACE) ---
// =========================================================

// 1. AJOUTER UNE CHAMBRE
ipcMain.handle('add-room', async (event, roomData) => {
  const { room_number, type, price_per_night } = roomData;
  const stmt = db.prepare('INSERT INTO Rooms (room_number, type, price_per_night, status) VALUES (?, ?, ?, ?)');
  return stmt.run(room_number, type, price_per_night, 'available');
});

// 2. CONFIRMER LE CHECK-IN (CORRIGÉ)
ipcMain.handle('perform-checkin', async (event, data) => {
  const { guest_name, room_id, check_in, check_out } = data;
  
  const executeCheckin = db.transaction(() => {
    // Insertion du booking
    db.prepare('INSERT INTO Bookings (guest_name, room_id, check_in, check_out) VALUES (?, ?, ?, ?)')
      .run(guest_name, room_id, check_in, check_out);
    
    // MISE À JOUR DU STATUT - CORRECTION ICI : Utilisation de 'occupied' avec simples quotes
    db.prepare("UPDATE Rooms SET status = 'occupied' WHERE id = ?")
      .run(room_id);
  });

  try {
    executeCheckin();
    return { success: true };
  } catch (err) {
    console.error("Erreur lors du Check-in:", err);
    throw err;
  }
});

// 3. IMPUTER COMMANDE BAR/RESTO
ipcMain.handle('place-order', async (event, orderData) => {
  const { booking_id, product_id, quantity } = orderData;
  const stmt = db.prepare('INSERT INTO Orders (booking_id, product_id, quantity) VALUES (?, ?, ?)');
  return stmt.run(booking_id, product_id, quantity);
});

// =========================================================
// --- RÉCUPÉRATION DES DONNÉES (LECTURE) ---
// =========================================================

ipcMain.handle('get-rooms', async () => {
  return db.prepare('SELECT * FROM Rooms').all();
});

ipcMain.handle('get-products', async () => {
  return db.prepare('SELECT * FROM Products').all();
});

ipcMain.handle('get-active-bookings', async () => {
  // Cette requête ne renverra rien si le statut n'est pas exactement 'occupied'
  return db.prepare(`
    SELECT Bookings.id, Bookings.guest_name, Rooms.room_number 
    FROM Bookings 
    JOIN Rooms ON Bookings.room_id = Rooms.id 
    WHERE Rooms.status = 'occupied'
  `).all();
});

ipcMain.handle('get-final-bill', async (event, bookingId) => {
  return db.prepare(`
    SELECT b.*, r.price_per_night, 
    (SELECT SUM(p.price * o.quantity) FROM Orders o JOIN Products p ON o.product_id = p.id WHERE o.booking_id = b.id) as total_bar
    FROM Bookings b 
    JOIN Rooms r ON b.room_id = r.id 
    WHERE b.id = ?
  `).get(bookingId);
});

ipcMain.handle('get-reception-stats', async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    arrivals: db.prepare("SELECT COUNT(*) as count FROM Bookings WHERE check_in = ?").get(today).count,
    departures: db.prepare("SELECT COUNT(*) as count FROM Bookings WHERE check_out = ?").get(today).count,
    available: db.prepare("SELECT COUNT(*) as count FROM Rooms WHERE status = 'available' AND cleaning_status = 'clean'").get().count,
    dirty: db.prepare("SELECT COUNT(*) as count FROM Rooms WHERE cleaning_status = 'dirty'").get().count
  };
  return stats;
});

// --- DÉMARRAGE ---
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});