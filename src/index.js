const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
let Datastore = require("nedb");


let startupTimer = 8000;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    resizable: false,
    autoHideMenuBar: true,
    width: 1300,
    height: 880,
    frame: true
  });
  
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


  mainWindow.loadFile(path.join(__dirname, '/pages/landing.html'));
  mainWindow.hide();
  setTimeout(() => {
    bootWindow.close();
    mainWindow.show();
  }, startupTimer);

  
  // and load the index.html of the app.
  bootWindow.loadFile(path.join(__dirname, '/pages/splash.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

    // Create the Application's main menu
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


