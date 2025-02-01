import { type IPCRoutesHandlers } from './ipcRoutes';

declare global {
  interface Window {
    multiWindowManagerIpcRoutes: IPCRoutesHandlers;
  }
}
