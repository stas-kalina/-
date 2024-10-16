const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    const template = [
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'Open Camera',
                    click: () => {
                        mainWindow.webContents.send('open-camera');
                    },
                },
                {
                    role: 'quit',
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// ×èòàííÿ ³ çàïèñ CSV
ipcMain.handle('read-csv', (event) => {
    const results = [];
    fs.createReadStream('data.csv')
        .pipe(require('csv-parser')())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            event.sender.send('csv-data', results);
        });
});

ipcMain.handle('write-csv', (event, data) => {
    const csvWriter = require('csv-writer').createObjectCsvWriter({
        path: 'data.csv',
        header: [{ id: 'name', title: 'Name' }, { id: 'email', title: 'Email' }],
    });

    csvWriter.writeRecords(data).then(() => {
        event.sender.send('csv-saved');
    });
});
