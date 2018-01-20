const path = require("path");

const electron = require('electron');
const {app} = require('electron');
//const {appUpdater} = require('./autoupdater');
//const updater = require('electron-simple-updater');


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



	/*try{
	const page = mainWindow.webContents;

	page.once('did-frame-finish-load', () => {
		const checkOS = isWindowsOrmacOS();
		if (checkOS) {
			appUpdater();
		}});

	}catch(e){

	}*/
}

function update(){
	init();
	/*console.log(updater.init({
		checkUpdateOnStart:true,
		url:'https://raw.githubusercontent.com/JuanFKurucz/SalesProgram/master/updates.json
		https://raw.githubusercontent.com/megahertz/electron-simple-updater/master/example/updates.json'
	}).meta);*/
	//console.log(updater.checkForUpdates());
}

electron.app.on('ready', function(){
	update();
})
electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    electron.app.quit()
  }
})
electron.app.on('activate', function () {
  if (mainWindow === null) {
		update();
  }
})
