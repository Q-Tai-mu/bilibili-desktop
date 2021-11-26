// main.js

// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const {session} = require('electron');
app.commandLine.appendSwitch('disable-web-security');
function createWindow() {
  Menu.setApplicationMenu(null)
  const mainWindow = new BrowserWindow({
    width: 1110,
    height: 740,
    frame: false,
    webPreferences: {
      webSecurity: false,
      // preload: path.join(__dirname, "preload.ts"),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  const isDev = process.env.NODE_ENV === "development";
  const xxx_filter = {
    urls: ["*://*/*"]
  }
  session.defaultSession.webRequest.onBeforeSendHeaders(xxx_filter, (details, callback)=> {
    details.requestHeaders['orgin'] = "https://www.bilibili.com"
    details.requestHeaders['referer'] = "https://www.bilibili.com"
    // details.requestHeaders['user-agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    callback({requestHeaders: details.requestHeaders});
  })
  // mainWindow.webContents.session.setProxy({proxyRules: 'https://www.bilibili.com'})
  // if (isDev) {
    mainWindow.loadURL("http://localhost:3000/");
  // } else {
    // mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    // console.log(path.join(__dirname, "../dist/index.html"));
    
  // }
  ipcMain.on('handleWindow', (e,type) => {
    if (type === 'minWindow' ) {
      mainWindow.minimize();
    } else if (type === 'maxWindow') {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    } else {
      mainWindow.destroy()
    }
  })
  mainWindow.webContents.openDevTools();
}
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});