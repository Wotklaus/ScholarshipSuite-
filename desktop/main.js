const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });

  // 👇 USA TU FRONT REAL (NO API)
  win.loadURL('http://scholarshipsuite-qa-alb-735703852.us-east-1.elb.amazonaws.com/');
}

app.whenReady().then(createWindow);
