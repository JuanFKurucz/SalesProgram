const {app,BrowserWindow} = require('electron');

let mainWindow;

if (require('electron-squirrel-startup')) {
	app.quit();
}

function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}


function init(){
	mainWindow = new BrowserWindow(
		{
			title:"Sales Program",
			width: 940,
			height: 640,
			frame:false
		}
	)
	mainWindow.loadURL(require("path").normalize(__dirname+"\\gui\\index.html"));
}

app.on('ready', function(){
	init();
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (mainWindow === null) {
		init();
  }
})
