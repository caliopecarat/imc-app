const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const rutaDatos = path.join(__dirname, 'datos_imc.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  if (!fs.existsSync(rutaDatos)) {
    fs.writeFileSync(rutaDatos, '[]', 'utf-8');
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('leer-historial', () => {
  try {
    const datos = fs.readFileSync(rutaDatos, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    return [];
  }
});

ipcMain.handle('guardar-imc', (event, nuevoRegistro) => {
  try {
    const datos = fs.readFileSync(rutaDatos, 'utf-8');
    const historial = JSON.parse(datos);

    historial.push(nuevoRegistro);

    fs.writeFileSync(rutaDatos, JSON.stringify(historial, null, 2), 'utf-8');

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});