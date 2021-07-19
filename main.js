const { app, Menu, BrowserWindow, Tray, nativeTheme } = require("electron");
const path = require("path");

const assetsDirectory = path.join(__dirname, "images", "tray-icon");
const iconName = "icon.png";

// let appIcon = null;
let tray = undefined;
let window = undefined;

const createTray = () => {
  let imgFilePath;
  let isDarkTheme = false;

  imgFilePath = path.join(assetsDirectory, "black", iconName);
  if (nativeTheme.shouldUseDarkColors === true) {
    isDarkTheme = true;
    imgFilePath = path.join(assetsDirectory, "white", iconName);
  }

  tray = new Tray(imgFilePath);
  tray.on("click", function (event) {
    toggleWindow();
  });
};
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 3);

  return { x: x, y: y };
};

app.on("window-all-closed", () => {
  app.quit();
});

app.dock.hide();

const createWindow = () => {
  window = new BrowserWindow({
    width: 1000,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: `${__dirname}/preload/preload.js`,
    },
  });
  window.loadURL("file://" + __dirname + "/dist/index.html");
  window.on("blur", () => {
    // if (!window.webContents.isDevToolsOpened()) {
    window.hide();
    // }
  });
  window.webContents.openDevTools();
};

app.whenReady().then(() => {
  createTray();
  createWindow();
});
