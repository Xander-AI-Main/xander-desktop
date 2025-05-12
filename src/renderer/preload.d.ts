// import { ElectronHandler } from '../main/preload';

// declare global {
//   // eslint-disable-next-line no-unused-vars
//   interface Window {
//     electron: ElectronHandler;
//     electronAPI: {
//       callPythonFunc: (payload: { function: string; args: unknown[], module: string }) => Promise<any>;
//     };
//   }
// }

// export {};


export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, ...args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): () => void;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    electronAPI: {
      callPythonFunc: (payload: { function: string; args?: unknown[]; module: string }) => Promise<any>;
      saveFileBuffer: (file: { name: string; buffer: number[] }) => Promise<string>;
      trainPythonFunc: (payload: any) => Promise<any>;
      onTrainLog: (callback: (data: string) => void) => void;
      removeTrainLogListener: () => void;
    };
  }
}
