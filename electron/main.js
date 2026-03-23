const { app, BrowserWindow, ipcMain, screen, protocol } = require('electron');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

app.whenReady().then(() => {
    protocol.interceptFileProtocol('file', (request, callback) => {
        let filePath = decodeURIComponent(request.url.replace('file://', ''));

        // If the file exists at the absolute path, use it as-is
        if (fs.existsSync(filePath)) {
            callback({ path: filePath });
        } else {
            // Otherwise assume it's a Next.js asset and map it to out/
            callback({ path: path.join(__dirname, '../out', filePath) });
        }
    });
});

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
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

ipcMain.on('close-window', () => app.quit());

ipcMain.on('launch-app', (_event, payload) => {
    if (payload.cmd) {
        const [bin, ...args] = payload.cmd.split(' ');
        spawn(bin, args, { detached: true, stdio: 'ignore' }).unref();
    } else if (payload.path) {
        spawn(payload.path, [], { detached: true, stdio: 'ignore' }).unref();
    }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
