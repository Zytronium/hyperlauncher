// eslint-disable-next-line @typescript-eslint/no-require-imports
const { app, BrowserWindow, ipcMain, screen, protocol, globalShortcut } = require('electron');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { scanApps } = require('./appScanner');

let win;

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width,
        height,
        x: 0,
        y: 0,
        resizable: false,
        movable: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.maximize();

    if (process.env.ELECTRON_START_URL) {
        win.loadURL(process.env.ELECTRON_START_URL);
    } else {
        win.loadFile(path.join(__dirname, '../out/index.html'));
    }
}

app.whenReady().then(() => {
    protocol.interceptFileProtocol('file', (request, callback) => {
        let filePath = decodeURIComponent(request.url.replace('file://', ''));
        if (fs.existsSync(filePath)) {
            callback({ path: filePath });
        } else {
            callback({ path: path.join(__dirname, '../out', filePath) });
        }
    });

    process.on('SIGUSR1', () => {
        if (win) {
            if (win.isVisible()) {
                win.hide();
            } else {
                win.show();
                win.focus();
            }
        }
    });

    ipcMain.handle('get-apps', async () => {
        return scanApps();
    });

    createWindow();
});

ipcMain.on('close-window', () => app.quit());

ipcMain.on('hide-window', () => {
    if (win) win.hide();
});

ipcMain.on('launch-app', (_event, payload) => {
    if (payload.cmd) {
        const [bin, ...args] = payload.cmd.split(' ');
        spawn(bin, args, { detached: true, stdio: 'ignore' }).unref();
    } else if (payload.path) {
        spawn(payload.path, [], { detached: true, stdio: 'ignore' }).unref();
    }
});

app.on('window-all-closed', () => app.quit());
app.on('will-quit', () => globalShortcut.unregisterAll());
