import { contextBridge, ipcRenderer } from 'electron';
import { IPC_ROUTES, IPCRoutesHandlers } from '../types/ipcRoutes';

export const multiWindowManagerRoutes: IPCRoutesHandlers = {
  multiWindowManger_closeWindow: (id) =>
    ipcRenderer.send(IPC_ROUTES.multiWindowManger_closeWindow, id),
  multiWindowManger_openWindow: (arg) =>
    ipcRenderer.send(IPC_ROUTES.multiWindowManger_openWindow, arg),
  multiWindowManger_windowIdListener: (callback) =>
    ipcRenderer.on(IPC_ROUTES.multiWindowManger_windowIdListener, callback),
  multiWindowManger_setWindowConfigFromRenderer: (arg) =>
    ipcRenderer.send(
      IPC_ROUTES.multiWindowManger_setWindowConfigFromRenderer,
      arg
    ),
};

export function preloadMultiWindowManger() {
  contextBridge.exposeInMainWorld(
    'multiWindowManagerIpcRoutes',
    multiWindowManagerRoutes
  );
}
