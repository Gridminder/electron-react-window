import { memo, PropsWithChildren } from 'react';
import { useIsActiveWindow } from './useIsActiveWindow';
import { PublicWindowConfig } from '../types/ipcRoutes';
import useDeepCompareEffect from 'use-deep-compare-effect';
type WindowRendererProps =
  | (PublicWindowConfig & {
      id: string;
      isMain?: false;
    })
  | {
      id?: undefined;
      isMain: true;
    };

function WindowRendererComponent({
  children,
  id,
  isMain,
  ...rest
}: PropsWithChildren<WindowRendererProps>) {
  const actualId = isMain ? '____main-window____' : id;
  const isActiveWindow = useIsActiveWindow(actualId);
  useDeepCompareEffect(() => {
    if (isMain) return;
    window.multiWindowManagerIpcRoutes.multiWindowManger_setWindowConfigFromRenderer(
      {
        id,
        windowConfig: rest,
      }
    );
  }, [rest]);
  if (!isActiveWindow) return null;
  return children;
}

export const WindowRenderer = memo(WindowRendererComponent);
