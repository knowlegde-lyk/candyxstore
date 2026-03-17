const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runScript: (scriptPath, injectedInput) => ipcRenderer.invoke('run-script', scriptPath, injectedInput),
    onScriptOutput: (callback) => ipcRenderer.on('script-output', (_event, value) => callback(value)),
    getBaseDir: () => ipcRenderer.invoke('get-base-dir'),
    getScripts: () => ipcRenderer.invoke('get-scripts'),
    offScriptOutput: () => ipcRenderer.removeAllListeners('script-output'),
    saveLicenseKey: (key) => ipcRenderer.invoke('save-license-key', key),
    onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_event, data) => callback(data)),
    installUpdate: () => ipcRenderer.send('install-update')
});
