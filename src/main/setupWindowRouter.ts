import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
} from 'electron';
import {
  IPC_ROUTES,
  IPCRoutesHandlers,
  PublicWindowConfig,
} from '../types/ipcRoutes';

type Windows = Record<
  string,
  {
    constructorOptions?: BrowserWindowConstructorOptions;
    extraWindowHooks?: (browserWindow: BrowserWindow) => unknown;
  }
>;

export function setupWindowRouter({
  preload,
  mainWindow,
  windows,
  setupWindowHooks,
}: {
  preload: string;
  mainWindow: BrowserWindow;
  windows?: Windows;
  setupWindowHooks?: (browserWindow: BrowserWindow) => unknown;
}) {
  const windowMap = new Map<string, BrowserWindow>();
  const windowConfigsFromRenderer = new Map<string, PublicWindowConfig>();
  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send(
      IPC_ROUTES.multiWindowManger_windowIdListener,
      '____main-window____'
    );
  });
  ipcMain.on(
    IPC_ROUTES.multiWindowManger_openWindow,
    (
      _e,
      arg: Parameters<IPCRoutesHandlers['multiWindowManger_openWindow']>[0]
    ) => {
      if (windowMap.has(arg.id)) return;
      const windowConfig = windows?.[arg.id];
      const { constructorOptions } = windowConfig ?? {};
      const windowConfigFromArg = arg.windowConfig ?? {};
      const windowConfigFromRenderer =
        windowConfigsFromRenderer.get(arg.id) ?? {};
      const newWindow = new BrowserWindow({
        parent: mainWindow,
        ...constructorOptions,
        ...windowConfigFromRenderer,
        ...windowConfigFromArg,
        webPreferences: {
          preload,
          sandbox: false,
          ...constructorOptions?.webPreferences,
        },
      });
      setupWindowHooks?.(newWindow);
      windowConfig?.extraWindowHooks?.(newWindow);
      newWindow.on('ready-to-show', () => {
        newWindow.webContents.send(
          IPC_ROUTES.multiWindowManger_windowIdListener,
          arg.id
        );
        newWindow.show();
      });
      windowMap.set(arg.id, newWindow);
      newWindow.on('close', () => {
        windowMap.delete(arg.id);
      });
    }
  );
  ipcMain.on(
    IPC_ROUTES.multiWindowManger_closeWindow,
    (
      _e,
      id: Parameters<IPCRoutesHandlers['multiWindowManger_closeWindow']>[0]
    ) => {
      windowMap.get(id)?.close();
      windowMap.delete(id);
    }
  );
  ipcMain.on(
    IPC_ROUTES.multiWindowManger_setWindowConfigFromRenderer,
    (
      _e,
      {
        id,
        windowConfig,
      }: Parameters<
        IPCRoutesHandlers['multiWindowManger_setWindowConfigFromRenderer']
      >[0]
    ) => {
      windowConfigsFromRenderer.set(id, windowConfig);
    }
  );
}
