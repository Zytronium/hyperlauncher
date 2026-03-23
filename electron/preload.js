const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    closeWindow: () => ipcRenderer.send('close-window'),
    launch: (payload) => ipcRenderer.send("launch-app", payload),
});
