const fs = require("fs");
const path = require("path");

const electron = require('electron');
const {app} = require('electron');
const {appUpdater} = require('./autoupdater');
let mainWindow;

/* Handling squirrel.windows events on windows
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
	app.quit();
}

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}


function init(){
	mainWindow = new electron.BrowserWindow(
		{
			title:"Sales Program",
			width: 940,
			height: 640,
			frame:false
		}
	)
	mainWindow.loadURL(path.normalize(__dirname+"\\gui\\index.html"));
/*	const page = mainWindow.webContents;

	page.once('did-frame-finish-load', () => {
		const checkOS = isWindowsOrmacOS();
		if (checkOS) {
			appUpdater();
		}});*/
}

electron.app.on('ready', function(){
	init();
})
electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    electron.app.quit()
  }
})
electron.app.on('activate', function () {
  if (mainWindow === null) {
		init();
  }
})
