const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readCSV: () => ipcRenderer.invoke('read-csv'),
    writeCSV: (data) => ipcRenderer.invoke('write-csv', data),
    onCSVData: (callback) => ipcRenderer.on('csv-data', callback),
    onOpenCamera: (callback) => ipcRenderer.on('open-camera', callback),
});
