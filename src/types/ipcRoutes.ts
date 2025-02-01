import {
  type BrowserWindowConstructorOptions,
  type IpcRendererEvent,
} from 'electron';
import './ipcRoutes.d';

export type PublicWindowConfig = Omit<
  BrowserWindowConstructorOptions,
  'webPreferences'
>;

export type IPCRoutesHandlers = {
  multiWindowManger_openWindow: (arg: {
    id: string;
    windowConfig?: PublicWindowConfig;
  }) => unknown;
  multiWindowManger_closeWindow: (id: string) => unknown;
  multiWindowManger_windowIdListener: (
    listener: (event: IpcRendererEvent, id: string) => unknown
  ) => unknown;
  multiWindowManger_setWindowConfigFromRenderer: (arg: {
    id: string;
    windowConfig: PublicWindowConfig;
  }) => unknown;
};

type IPCRoutes = {
  [K in keyof IPCRoutesHandlers]: K;
};

export const IPC_ROUTES: IPCRoutes = {
  multiWindowManger_openWindow: 'multiWindowManger_openWindow',
  multiWindowManger_closeWindow: 'multiWindowManger_closeWindow',
  multiWindowManger_setWindowConfigFromRenderer:
    'multiWindowManger_setWindowConfigFromRenderer',
  multiWindowManger_windowIdListener: 'multiWindowManger_windowIdListener',
};
