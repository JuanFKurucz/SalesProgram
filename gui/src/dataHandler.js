const fs = require("fs");
const path = require("path");
const {app} = require('electron').remote;

var appData=path.normalize(app.getPath("userData")+"\\data");

var datesCount;
function numberAs(a,b) {
  return a-b;
}

function loadData(profile="default",callback){
  var dataFolder=appData+"\\"+profile+".json";
  var data={};
  if (fs.existsSync(dataFolder)) {
    fs.readFile(dataFolder, "utf8", function (err, fdata) {
      if (err) { throw err; }
      var object = JSON.parse(fdata);
      callback(object);
    });
  } else {
    if(profile=="default"){
      createDir("default.json");
    } else {
      alert("Data folder not found");
    }
  }
}

function writeFiles(dataFolder,allData){
  fs.writeFile(dataFolder,JSON.stringify(allData),'utf8',function(err) {
      if(err) {
          return console.log(err);
      }
  });
}

function forEachDirectory(callback){
  fs.readdir(appData, function (err, files) {
    files.forEach(function (file) {
      if (file!="config_profiles.json") { // recurse
        callback(file.replace(".json",""));
      }
    });
  });
}

function loadFile(path,callback,encoding="utf8"){
  fs.readFile(appData+"\\"+path,encoding, function (err, data) {
    if (err) {
        throw err;
    }
    callback(data);
  });
}

function createDir(path){
  if (!fs.existsSync(appData+"\\"+path)){
    var emptyFile={
      "numbers":[],
      "dates":[],
      "valies":{}
    }
    fs.writeFile(appData+"\\"+path,JSON.stringify(emptyFile),'utf8',function(err) {
        if(err) {
            return console.log(err);
        }
    });
  }
}

function saveTableToJson(sourcePath,allData){
  if (fs.existsSync(appData+"\\"+sourcePath+".json")) {
    writeFiles(appData+"\\"+sourcePath+".json",allData);
  }
}

function importNumbers(pathFile,callback){
  fs.readFile(pathFile, "utf8", function (err, text) {
    var lines=text.split("\n");
    callback(lines);
  });
}

function CheckDataFolder(callback){
  if (!fs.existsSync(appData)) {
      fs.mkdirSync(appData);
      createDir("default.json");
      fs.writeFile(appData+"\\config_profiles.json",JSON.stringify({"_defaultProfileOnLaunch":"default"}),'utf8',function(err) {
          if(err) {
              return console.log(err);
          }
          callback();
      });
  } else {
    callback();
  }
}

exports = module.exports = {
	saveTableToJson,loadFile,forEachDirectory,createDir,loadData,importNumbers,CheckDataFolder
};
