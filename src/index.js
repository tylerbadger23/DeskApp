const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
let loadPage = "register.html";
let Datastore = require("nedb");

AppUser = new Datastore("appUsr.db");
AppUser.loadDatabase();
//cnstant timer for all startupos
//should be waiting for promise returned aftyer checking pries
let startupTimer = 4000;
userAccountExists(AppUser);
if (require('electron-squirrel-startup')) {
  app.quit(); //
}

const createWindow = () => {

  const bootWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    resizable: false,
    show: false,
    autoHideMenuBar: true,
    width: 800,
    height: 430,
    frame: false
  });

  const updateWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    resizable: true,
    show: false,
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    frame: true
  });

  const mainWindow = new BrowserWindow({
    webPreferences :{
      nodeIntegration: true
    },
    show: false,
    resizable: true,
    autoHideMenuBar: true,
    width: 1450,
    height: 850,
    frame: true
  });


  bootWindow.loadFile(path.join(__dirname, '/pages/splash.html'));
  bootWindow.once('ready-to-show', () => {
    bootWindow.show()
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });


  setTimeout(() => {
    mainWindow.loadFile(path.join(__dirname, `/pages/${loadPage}`));
    bootWindow.close();
    updateWindow.loadFile(path.join(__dirname, '/pages/update.html'));
  }, startupTimer);


  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  //updateWindow.webContents.openDevTools();


  mainWindow.frame = false;
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


async function userAccountExists(AppUser) {
  await AppUser.find({}, (err, data) => {
    if(data.length == 1) {
      loadPage = "landing.html";
    } else {
      loadPage = "register.html";
    }
  });
}
