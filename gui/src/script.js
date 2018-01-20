const path = require("path");
var appDir = path.normalize(path.dirname(require.main.filename)+"\\..\\");
const {remote} = require('electron')

const {dialog} = require('electron').remote;
const {forEachDirectory,loadFile,createDir,saveTableToJson,loadData,importNumbers,CheckDataFolder} = require(appDir+'\\gui\\src\\dataHandler.js');
const {makeCalculations} = require(appDir+'\\gui\\src\\calculations.js');
const {saveTable} = require(appDir+'\\gui\\src\\saveTable.js');
const {createMenuProfile,createTables,createButtons,loadProfiles,createMenu} = require(appDir+'\\gui\\src\\guiCreation.js');
const {savecalcBeforeload} = require(appDir+'\\gui\\src\\containers.js');

function init(){
  CheckDataFolder(function(){
    createButtons();
    document.querySelector("#MinimizeProgram").onclick=function(){
      remote.BrowserWindow.getFocusedWindow().minimize();
    }
    document.querySelector("#FullScreenProgram").onclick=function(){
      if(remote.BrowserWindow.getFocusedWindow().isFullScreen()){
        remote.BrowserWindow.getFocusedWindow().setFullScreen(false);
      } else {
        remote.BrowserWindow.getFocusedWindow().setFullScreen(true);
      }
    }
    document.querySelector("#CloseProgram").onclick=function(){
      remote.BrowserWindow.getFocusedWindow().close();
    }

    savecalcBeforeload(document.querySelector("#calcTable").innerHTML);

    loadProfiles(function(defaultProfile){
      document.querySelector("#newProfile").addEventListener("click",function(){
        var val=document.getElementsByClassName("newProfile")[0].getElementsByTagName("input")[0].value;
        if(val!="config_profiles"){
          createDir(val+".json");
          createMenuProfile(val)
        } else {
          alert("Can't create a profile with that name");
        }
      })
      createMenu();
      loadData(defaultProfile["_defaultProfileOnLaunch"],function(data){
        createTables(data);
      })
      document.querySelector("#profileTitle").textContent=defaultProfile["_defaultProfileOnLaunch"];
    })
  });
}



function throwMessage(type,message,detail="",buttons=["Ok"]){
  dialog.showMessageBox({
    type: type,
    buttons:buttons,
    message:message,
    detail:detail
  });
}
