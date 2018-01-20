const fs = require("fs");
const path = require("path");
var datesCount;
function numberAs(a,b) {
  return a-b;
}
function sortOnKeys(dict) {
    var sorted = [];
    for(var key in dict) {
      sorted[sorted.length] = key;
    }
    sorted.sort(numberAs);
    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }
    return tempDict;
}

function loadData(profile="default",callback){
  var dataFolder=appDir+"data\\"+profile;
  var data={};
  if (fs.existsSync(dataFolder)) {
    var i=0;
    fs.readdir(dataFolder, function (err, files) {
      datesCount=files.length;
      if(datesCount==0){
        callback(sortOnKeys(data));
      } else {
        files.forEach(function (file) {
          var curPath = dataFolder + "\\" + file;
          if (!fs.lstatSync(curPath).isDirectory()) { // recurse
            fs.readFile(curPath, "utf8", function (err, fdata) {
              i++;
              if (err) {
                  throw err;
              }
              var object = JSON.parse(fdata);
              var values=file.replace(".json","").split("-");
              var time = new Date(values[0],values[1],values[2])
              data[time.getTime()]=object;
              if(i==files.length){
                callback(sortOnKeys(data));
              }
            });
          }
        });
      }
    });
  } else {
    if(profile=="default"){
      fs.mkdirSync(dataFolder);
      loadData(profile,callback);
      location.reload();
    } else {
      alert("Data folder not found");
    }
  }
}

function writeFiles(dataFolder,allData){
  for(var dicKey in allData){
    var JSONo = JSON.stringify(allData[dicKey]);
    fs.writeFile(dataFolder+"\\"+dicKey+".json",JSONo,'utf8',function(err) {
        if(err) {
            return console.log(err);
        }
    });
  }
}

function forEachDirectory(path,callback){
  fs.readdir(path, function (err, files) {
    files.forEach(function (file) {
      if (fs.lstatSync(path+"\\"+file).isDirectory()) { // recurse
        callback(file);
      }
    });
  });
}

function loadFile(path,callback,encoding="utf8"){
  fs.readFile(path,encoding, function (err, data) {
    if (err) {
        throw err;
    }
    callback(data);
  });
}

function createDir(path){
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
}

function saveTableToJson(sourcePath,allData){
  var len=0;
  fs.readdir(sourcePath, (err, files) => {
    if (err) throw err;
    if(files.length==0){
      writeFiles(sourcePath,allData);
    } else {
      for (const file of files) {
        fs.unlink(path.join(sourcePath, file), err => {
          if (err) throw err;
          len++;
          if(len==files.length){
            writeFiles(sourcePath,allData);
          }
        });
      }
    }
  });
}

function importNumbers(pathFile,callback){
  fs.readFile(pathFile, "utf8", function (err, text) {
    var lines=text.split("\n");
    callback(lines);
  });
}

exports = module.exports = {
	saveTableToJson,loadFile,forEachDirectory,createDir,loadData,importNumbers
};
