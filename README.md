# electron-react-window

**electron-react-window** allows you to open and manage multiple Electron windows while using a single `renderer/index.html`. This keeps your project maintainable and makes creating new windows simple.

🔹 **Key Benefits**:

- Uses a **single renderer** for multiple windows.
- Simplifies **window management**.
- Currently supports **React**.

---

## Installation

```sh
npm install @gridminder/electron-react-window
```

---

## Quick Start

### 1️⃣ Renderer Process (React UI)

The `WindowRenderer` component manages multiple Electron windows.

```jsx
import {
  WindowRenderer,
  openWindow,
  closeWindow,
} from '@gridminder/electron-react-window/renderer';

function App() {
  return (
    <SomeProviders>
      <WindowRenderer isMain>
        <h1>Main Window</h1>
        <button
          onClick={() =>
            openWindow('settings', { width: 200, height: 300, x: 20, y: 10 })
          }
        >
          Open Settings
        </button>
      </WindowRenderer>

      <WindowRenderer id="settings">
        <h1>Config Window</h1>
        <button onClick={() => closeWindow('settings')}>Close</button>
      </WindowRenderer>
    </SomeProviders>
  );
}
```

---

### 2️⃣ Preload Script

The preload script helps bridge the main and renderer processes.

```js
import { preloadMultiWindowManger } from '@gridminder/electron-react-window/preload';

preloadMultiWindowManger();
```

---

### 3️⃣ Main Process (Electron Backend)

The `setupWindowRouter` function initializes window management.

```js
import { app, BrowserWindow, shell } from 'electron';
import { setupWindowRouter } from '@gridminder/electron-react-window/main';
import { join } from 'path';

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  });

  setupWindowRouter({
    preload: join(__dirname, '../preload/index.js'),
    mainWindow,
    setupWindowHooks: (browserWindow, context) => {
      browserWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
      });

      console.log(context); // To get the window config and id

      if (process.env['ELECTRON_RENDERER_URL']) {
        browserWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
      } else {
        browserWindow.loadFile(join(__dirname, '../renderer/index.html'));
      }
    },
  });
});
```

---

## API

### 🔹 `WindowRenderer`

A React component for managing windows.

| Prop     | Type      | Description                       |
| -------- | --------- | --------------------------------- |
| `isMain` | `boolean` | Defines the main Electron window. |
| `id`     | `string`  | Unique identifier for the window. |

---

### 🔹 `openWindow(id: string, config: BrowserWindowConstructorOptions)`

Opens a new window with the specified `id`.

```js
openWindow('settings', { width: 100, height: 200, x: 100, y: 50 });
```

---

### 🔹 `closeWindow(id: string)`

Closes the window with the given `id`.

```js
closeWindow('settings');
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

MIT License.
