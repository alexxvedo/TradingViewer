const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Account management
  getAccounts: () => ipcRenderer.invoke("get-accounts"),
  addAccount: (accountData) => ipcRenderer.invoke("add-account", accountData),
  removeAccount: (platform, login) =>
    ipcRenderer.invoke("remove-account", platform, login),
  startAccount: (platform, login) =>
    ipcRenderer.invoke("start-account", platform, login),
  stopAccount: (platform, login) =>
    ipcRenderer.invoke("stop-account", platform, login),

  // Listen for MT data
  onMTData: (callback) => {
    ipcRenderer.on("mt-data", (event, data) => callback(data));
  },

  // Remove listener
  removeMTDataListener: () => {
    ipcRenderer.removeAllListeners("mt-data");
  },
});

// Types for TypeScript
window.electronAPI = {
  getAccounts: () => Promise.resolve([]),
  addAccount: (accountData) => Promise.resolve([]),
  removeAccount: (platform, login) => Promise.resolve([]),
  startAccount: (platform, login) => Promise.resolve(false),
  stopAccount: (platform, login) => Promise.resolve(false),
  onMTData: (callback) => {},
  removeMTDataListener: () => {},
};
