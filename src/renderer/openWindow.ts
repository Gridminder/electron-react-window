import { PublicWindowConfig } from '../types/ipcRoutes';

export function openWindow(id: string, windowConfig?: PublicWindowConfig) {
  window.multiWindowManagerIpcRoutes.multiWindowManger_openWindow({
    id,
    windowConfig,
  });
}
