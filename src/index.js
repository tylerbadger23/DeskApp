const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
let Datastore = require("nedb");

//cnstant timer for all startupos
//should be waiting for promise returned aftyer checking pries
let startupTimer = 7500;

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  
  const bootWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    resizable: false,
    autoHideMenuBar: true,
    width: 800,
    height: 430,
    frame: false
  });

  const updateWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    resizable: false,
    autoHideMenuBar: true,
    width: 8,
    height: 8,
    frame: false
  });

  const mainWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    resizable: true,
    autoHideMenuBar: true,
    width: 1200,
    height: 800,
    frame: true
  }); 


  if(process.platform == "win32") {
    mainWindow.setSize(1400, 940)
  }
  mainWindow.hide();
  updateWindow.loadFile(path.join(__dirname, '/pages/update.html'));
  updateWindow.webContents.openDevTools();
  updateWindow.hide();
  setTimeout(() => {
    // Create the browser window.
    bootWindow.close();
    mainWindow.loadFile(path.join(__dirname, '/pages/landing.html'));
    mainWindow.show();
    
  }, startupTimer);

  bootWindow.loadFile(path.join(__dirname, '/pages/splash.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

    // Create the main menu
    var template = [{
      label: "Application",
      submenu: [
          { label: "About", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



