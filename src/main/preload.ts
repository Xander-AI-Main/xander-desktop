// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'run-python-func';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke<T = unknown>(channel: Channels, ...args: unknown[]): Promise<T> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

// Expose everything under `electron`
contextBridge.exposeInMainWorld('electron', electronHandler);

// Expose `callPythonFunc` specifically under `electronAPI`
contextBridge.exposeInMainWorld('electronAPI', {
  callPythonFunc: (payload: { function: string; args: unknown[] }) =>
    ipcRenderer.invoke('run-python-func', payload),
});


export type ElectronHandler = typeof electronHandler;
