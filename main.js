const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    waitForServer(() => {
        mainWindow.loadURL('http://localhost:3000');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startServer() {
    serverProcess = spawn('npm', ['start'], {
        shell: true
    });
}

function waitForServer(callback) {
    const checkServer = () => {
        http.get('http://localhost:3000', (res) => {
            if (res.statusCode === 200) {
                callback();
            } else {
                setTimeout(checkServer, 1000);
            }
        }).on('error', () => {
            setTimeout(checkServer, 1000);
        });
    };

    checkServer();
}

app.whenReady().then(() => {
    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
    app.quit();
}); 