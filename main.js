const electron = require("electron");
const fs = require("fs");
const path = require("path");
let mainWindow;

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
