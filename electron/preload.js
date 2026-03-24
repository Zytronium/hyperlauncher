const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    closeWindow: () => ipcRenderer.send('close-window'),
    hideWindow: () => ipcRenderer.send('hide-window'),
    launch: (payload) => ipcRenderer.send("launch-app", payload),
    getApps: () => ipcRenderer.invoke('get-apps'),
});
