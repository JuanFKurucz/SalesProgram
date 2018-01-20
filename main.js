const electron = require('electron');

electron.app.on('ready',function(){
	let mainWindow = new electron.BrowserWindow({frame:false});
	mainWindow.loadURL(__dirname+"\\gui\\index.html");
})
