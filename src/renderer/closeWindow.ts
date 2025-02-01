export function closeWindow(id: string) {
  window.multiWindowManagerIpcRoutes.multiWindowManger_closeWindow(id);
}
