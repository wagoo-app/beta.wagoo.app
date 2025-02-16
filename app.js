const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

let mainWindow;

function createWindow(url = 'wagoo://') {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            sandbox: true
        }
    });

    // Charger une URL en fonction du protocole personnalisé
    if (url.startsWith('wagoo://')) {
        const page = url.replace('wagoo://', '');
        mainWindow.loadURL(`https://wagoo.local/${page}`); // Remplace par ton URL
    } else {
        mainWindow.loadURL('https://wagoo.local');
    }

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Enregistrer le protocole personnalisé
app.setAsDefaultProtocolClient('wagoo');

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Gérer l'ouverture de l'application via le protocole personnalisé
app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow) {
        mainWindow.loadURL(url);
    } else {
        createWindow(url);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
