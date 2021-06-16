// Dependencies - Modules
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const os = require("os");
const lineReader = require('line-reader');

// Functions
function createWindow() {

    const win = new BrowserWindow({
        title: "Set Rebalance Tool",
        width: 1200,
        height: 700,
        autoHideMenuBar: true,
        titleBarStyle: "default",
        frame: true,

        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        }
    });

    win.loadFile('views/index.html');
    //win.webContents.openDevTools();
};

// Listeners
// App listeners
app.whenReady().then(() => {
    createWindow()
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

// IPC listeners
ipcMain.on('synchronous-message', (event, arg) => {

    // Treat each message as its own seperate payload and typify within the object
    var payload = JSON.parse(arg);
    var returnPayload = {type: "STARTUP", payload: {}};

    // Check payload type otherwise return the empty payload stringified
    switch(payload.type) {
        case "PUT":
          console.log("PUT IPC requested");
          break;
        case "GET":
          console.log("GET IPC requested");
          break;
        case "DELETE":
          break;
        case "GETMULT":
          break;
        case "INFO":
            console.log("INFO IPC sent\n");
            event.returnValue = JSON.stringify(payload);
            break;
        default:
          console.log("EMPTY or STARTUP IPC sent\n");
          returnPayload = JSON.stringify(returnPayload);
          event.returnValue = JSON.stringify(returnPayload);
      }
  });

