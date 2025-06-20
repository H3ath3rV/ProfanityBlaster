const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Allow local file access
    },
    titleBarStyle: 'hiddenInset', // macOS style title bar
    show: false,
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createApplicationMenu();
}

function createApplicationMenu() {
  const template = [
    {
      label: 'Profanity Blaster',
      submenu: [
        {
          label: 'About Profanity Blaster',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Profanity Blaster',
              message: 'Profanity Blaster v1.0.0',
              detail: 'Clean Audio & Video Filter\nRemove Profanity & Blasphemy from your media files.',
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => {
            // Add preferences window later if needed
          }
        },
        { type: 'separator' },
        {
          label: 'Hide Profanity Blaster',
          accelerator: 'Cmd+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Cmd+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Media File...',
          accelerator: 'Cmd+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              title: 'Select Media File',
              filters: [
                { name: 'Media Files', extensions: ['mp4', 'avi', 'mov', 'mp3', 'wav', 'flv', 'mkv', 'm4a', 'aac'] },
                { name: 'Video Files', extensions: ['mp4', 'avi', 'mov', 'flv', 'mkv'] },
                { name: 'Audio Files', extensions: ['mp3', 'wav', 'm4a', 'aac'] },
                { name: 'All Files', extensions: ['*'] }
              ],
              properties: ['openFile']
            });

            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('file-selected', result.filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Export Cleaned File...',
          accelerator: 'Cmd+S',
          enabled: false,
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              title: 'Save Cleaned File',
              defaultPath: 'cleaned_media_file',
              filters: [
                { name: 'Media Files', extensions: ['mp4', 'mp3', 'wav'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });

            if (!result.canceled) {
              mainWindow.webContents.send('export-file', result.filePath);
            }
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Cmd+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+Cmd+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Cmd+X', role: 'cut' },
        { label: 'Copy', accelerator: 'Cmd+C', role: 'copy' },
        { label: 'Paste', accelerator: 'Cmd+V', role: 'paste' },
        { label: 'Select All', accelerator: 'Cmd+A', role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Cmd+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'Cmd+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'Cmd+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'Cmd+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'Cmd+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'Ctrl+Cmd+F', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Cmd+M', role: 'minimize' },
        { label: 'Close', accelerator: 'Cmd+W', role: 'close' },
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            require('electron').shell.openExternal('https://github.com');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            require('electron').shell.openExternal('https://github.com');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle file processing status updates
ipcMain.on('processing-status', (event, enabled) => {
  const menu = Menu.getApplicationMenu();
  const fileMenu = menu.items.find(item => item.label === 'File');
  const exportItem = fileMenu.submenu.items.find(item => item.label === 'Export Cleaned File...');
  if (exportItem) {
    exportItem.enabled = enabled;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app updates and notifications
app.on('ready', () => {
  // Check for updates, set up notifications, etc.
});

app.setAboutPanelOptions({
  applicationName: 'Profanity Blaster',
  applicationVersion: '1.0.0',
  version: '1.0.0',
  credits: 'Built with Electron',
  authors: ['Your Name'],
  website: 'https://yourwebsite.com',
  iconPath: path.join(__dirname, 'assets/icon.png')
});