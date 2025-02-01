import { useMemo, useState } from 'react';

export function useIsActiveWindow(windowId: string) {
  const [id, setId] = useState<string | null>(null);
  useMemo(
    () =>
      window.multiWindowManagerIpcRoutes.multiWindowManger_windowIdListener(
        (_e, id) => setId(id)
      ),
    []
  );
  return id === windowId;
}
