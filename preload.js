const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiIMC', {
  guardarIMC: (registro) => ipcRenderer.invoke('guardar-imc', registro),
  leerHistorial: () => ipcRenderer.invoke('leer-historial')
});