const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreenable: true,
    title: 'Dark Zone Assault',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);
  win.webContents.openDevTools({ mode: 'detach' });

  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.error('Load failed:', code, desc);
  });

  win.webContents.on('render-process-gone', (e, details) => {
    console.error('Renderer crashed:', details);
  });

  win.webContents.on('console-message', (e, level, message, line, sourceId) => {
    try {
      const levels = ['verbose', 'info', 'warning', 'error'];
      const prefix = `[Renderer ${levels[level] || level}]`;
      if (level >= 2) console.error(`${prefix} ${message} (${sourceId}:${line})`);
      else console.log(`${prefix} ${message} (${sourceId}:${line})`);
    } catch(err) { /* ignore EPIPE */ }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
