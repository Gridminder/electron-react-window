import { WindowRenderer, openWindow, closeWindow } from '@gridminder/electron-react-window/renderer'

function App(): JSX.Element {
  return (
    <>
      <WindowRenderer isMain>
        <button onClick={() => openWindow('settings', { width: 200, height: 300, x: 20, y: 10 })}>
          Open Settings
        </button>
      </WindowRenderer>

      <WindowRenderer id="settings">
        <h1>Config Window</h1>
        <button onClick={() => closeWindow('settings')}>Close</button>
      </WindowRenderer>
    </>
  )
}

export default App
