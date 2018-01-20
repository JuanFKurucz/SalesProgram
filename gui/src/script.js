const path = require("path");
var appDir = path.normalize(path.dirname(require.main.filename)+"\\..\\");
const {remote} = require('electron')
const {dialog} = require('electron').remote;
const {forEachDirectory,loadFile,createDir,saveTableToJson,loadData,importNumbers} = require(appDir+'\\gui\\src\\dataHandler.js');
const {makeCalculations} = require(appDir+'\\gui\\src\\calculations.js');
const {saveTable} = require(appDir+'\\gui\\src\\saveTable.js');
const {createMenuProfile,createTables,createButtons,loadProfiles,createMenu} = require(appDir+'\\gui\\src\\guiCreation.js');
const {savecalcBeforeload} = require(appDir+'\\gui\\src\\containers.js');

function init(){
  createButtons();
  document.querySelector("#MinimizeProgram").onclick=function(){
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
  document.querySelector("#CloseProgram").onclick=function(){
    remote.BrowserWindow.getFocusedWindow().close();
  }

  savecalcBeforeload(document.querySelector("#calcTable").innerHTML);

  loadProfiles(function(defaultProfile){
    document.querySelector("#newProfile").addEventListener("click",function(){
      var dataFolder=appDir+"data\\"+document.getElementsByClassName("newProfile")[0].getElementsByTagName("input")[0].value;
      createDir(dataFolder);
      createMenuProfile(document.getElementsByClassName("newProfile")[0].getElementsByTagName("input")[0].value)
    })
    createMenu();
    loadData(defaultProfile["_defaultProfileOnLaunch"],function(data){
      createTables(data);
    })
    document.querySelector("#profileTitle").textContent=defaultProfile["_defaultProfileOnLaunch"];
  })
}



function throwMessage(type,message,detail="",buttons=["Ok"]){
  dialog.showMessageBox({
    type: type,
    buttons:buttons,
    message:message,
    detail:detail
  });
}
