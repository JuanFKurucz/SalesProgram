const fs = require("fs");
const path = require("path");
var appDir = path.normalize(path.dirname(require.main.filename)+"\\..\\");

var datesCount;

function sortOnKeys(dict) {
    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();
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
    alert("Data folder not found");
  }
}

function createTables(data){
  //main table
  var table = document.createElement("table");
  table.style="width:100%";
  table.id="dataTable";
  document.querySelector("#dataDiv").appendChild(table);
  //headers
    //Date title
  var col=1;
  var highTr = document.createElement("tr");
  table.appendChild(highTr);
  var thDates = document.createElement("th");
  thDates.style="text-align:center;";
  thDates.setAttribute("colspan",col);
  thDates.textContent="Dates";
  highTr.appendChild(thDates);
    //Buttons
    var midTr = document.createElement("tr");
    table.appendChild(midTr);
    var thButtons = document.createElement("th");
    thButtons.style="text-align:center;";
    thButtons.setAttribute("colspan",col);

    var addNumberButton = document.createElement("input");
    addNumberButton.setAttribute("type","submit");
    addNumberButton.value="Add Number";
    thButtons.appendChild(addNumberButton);

    var addNewDate = document.createElement("input");
    addNewDate.setAttribute("type","submit");
    addNewDate.value="Add New Date";
    thButtons.appendChild(addNewDate);

    var saveButton = document.createElement("input");
    saveButton.setAttribute("type","submit");
    saveButton.value="Save Everything";
    thButtons.appendChild(saveButton);

    midTr.appendChild(thButtons);
    //Numbers and Dates
  var subTr = document.createElement("tr");
  table.appendChild(subTr);
  var thNumbres = document.createElement("th");
  thNumbres.textContent="Numbers";
  thNumbres.setAttribute("class","center line");
  subTr.appendChild(thNumbres);
  //data
  /*
  data{
    17-01-2018{
      12345:1265
    }
  }
  */
  var thDate=null;
  var rows={};
  for(var key in data){
    col+=1;
    console.log(col);
    thDates.setAttribute("colspan",col);
    thButtons.setAttribute("colspan",col);

    thDate = document.createElement("th");
    var ndate = new Date(parseInt(key));
    subTr.appendChild(thDate);
    var newInputDate=document.createElement("input");
    newInputDate.setAttribute("type","text");
    newInputDate.setAttribute("date",ndate.getDate()+"-"+ndate.getMonth()+"-"+ndate.getFullYear());
    newInputDate.value=ndate.getDate()+"-"+ndate.getMonth()+"-"+ndate.getFullYear();
    newInputDate.setAttribute("class","center line");
    newInputDate.onchange=function(){
      document.querySelectorAll("th[date='"+this.getAttribute("date")+"']")[0].textContent=this.value;
    }
    thDate.appendChild(newInputDate);

    var nclone=createTd(document.querySelector("#calcDates"),"center bold line");
    nclone.textContent=newInputDate.value;
    nclone.setAttribute("date",newInputDate.getAttribute("date"));

    for(var subKey in data[key]){
      var newNumberTr=rows[subKey];
      if(newNumberTr==undefined){
        newNumberTr=document.createElement("tr");
        table.appendChild(newNumberTr);
        var newInput=document.createElement("input");
        newInput.setAttribute("type","number");
        newInput.value=subKey;
        createTd(newNumberTr,"center").appendChild(newInput);
        for(var i=0;i<datesCount;i++){
          var newInput=document.createElement("input");
          newInput.setAttribute("type","number");
          createTd(newNumberTr).appendChild(newInput);
        }
        rows[subKey]=newNumberTr;
      }
      newNumberTr.getElementsByTagName("input")[col-1].value=data[key][subKey];
    }
  }

  addNumberButton.addEventListener("click",function(){
    var newNumberTr=document.createElement("tr");
    table.appendChild(newNumberTr);
    var numberTd=document.createElement("td");
    numberTd.setAttribute("class","center");
    newNumberTr.appendChild(numberTd);
    var newInput=document.createElement("input");
    newInput.setAttribute("type","number");
    numberTd.appendChild(newInput);
    for(var i=1;i<document.querySelector("#dataTable").getElementsByTagName("tr")[2].getElementsByTagName("th").length;i++){
      var dataTd=document.createElement("td");
      newNumberTr.appendChild(dataTd);
      var newInput=document.createElement("input");
      newInput.setAttribute("type","number");
      dataTd.appendChild(newInput);
    }
  });

  addNewDate.addEventListener("click",function(){
    var newInputDate=document.createElement("input");
    newInputDate.setAttribute("type","text");
    newInputDate.setAttribute("date","newDate"+document.querySelectorAll("th[date").length);
    newInputDate.onchange=function(){
      document.querySelectorAll("th[date='"+this.getAttribute("date")+"']")[0].textContent=this.value;
    }
    createTd(subTr,"center bold","th").appendChild(newInputDate);

    var nclone=document.createElement("th");
    nclone.textContent=newInputDate.value;
    nclone.setAttribute("date",newInputDate.getAttribute("date"));
    document.querySelector("#calcDates").appendChild(nclone);

    for(var i=3;i<table.getElementsByTagName("tr").length;i++){
      var newTd = createTd(table.getElementsByTagName("tr")[i]);
      var newInput=document.createElement("input");
      newInput.setAttribute("type","number");
      newTd.appendChild(newInput);
    }
  });

  saveButton.addEventListener("click",saveTable);

  var calcTable=document.querySelector("#calcTable");
  var totalSales=calcTable.querySelector("tr[title='TotalSales']");
  var sales=0;
  var total=0;
  for(var y=1;y<col;y++){
    sales=0;
    for(var i=3;i<table.getElementsByTagName("tr").length;i++){
      try{
        var num=0;
        if(!isNaN(parseInt(table.getElementsByTagName("tr")[i].getElementsByTagName('td')[y].children[0].value))){
          num=parseInt(table.getElementsByTagName("tr")[i].getElementsByTagName('td')[y].children[0].value);
        }
        sales+=num;
      }catch(e){
        console.log(e);
      }
    }
    createTd(totalSales).textContent=sales;
    total+=sales;
    createTd(calcTable.querySelector("tr[title='TransferCharge']")).textContent=parseFloat(sales*0.05);
  }

  createTd(calcTable.querySelector("tr[title='AllSales']")).textContent=parseFloat(total);
  createTd(calcTable.querySelector("tr[title='70']")).textContent=parseFloat(total*0.7);
  createTd(calcTable.querySelector("tr[title='Share']")).textContent=parseFloat(total-parseFloat(total*0.7));
}

function saveTable(){
  var dataTable=document.querySelector("#dataDiv");
  var allTrs=dataTable.getElementsByTagName("tr");
  var dates=allTrs[2].getElementsByTagName("th");
  var allData={};
  for(var d=1;d<dates.length;d++){
    var key=dates[d].getElementsByTagName("input")[0].value;
    allData[key]={};
    for(var a=3;a<allTrs.length;a++){
      var allTds=allTrs[a].getElementsByTagName("td");
      allData[key][allTds[0].getElementsByTagName("input")[0].value]=allTds[d].getElementsByTagName("input")[0].value;
    }
  }

  for(var dicKey in allData){
    var reverseDicKey=dicKey.split("-")[2]+"-"+dicKey.split("-")[1]+"-"+dicKey.split("-")[0];
    var JSONo = JSON.stringify(allData[dicKey]);

    var dataFolder=appDir+"data\\"+document.querySelector("#profileTitle").textContent+"\\";
    fs.writeFile(dataFolder+reverseDicKey+".json",JSONo,'utf8',function(err) {
        if(err) {
            return console.log(err);
        }
    });
  }
}

function createTd(parent,classes="left",th="td"){
  var newTd=document.createElement(th);
  newTd.setAttribute("class",classes);
  parent.appendChild(newTd);
  return newTd;
}

function createMenuProfile(name){
  var newLi = document.createElement("li");
  newLi.innerHTML="<a href='#'>"+name+"</a>";
  newLi.setAttribute("alt",name);
  newLi.onclick=function(){
    //newLi.setAttribute("class",newLi.getAttribute("class")+" selected");
    document.querySelector("#dataDiv").innerHTML="";
    document.querySelector("#calcTable").innerHTML=calcBeforeload;
    document.querySelector("#profileTitle").textContent=this.textContent;
    loadData(this.textContent,function(data){
      createTables(data);
    })
  }
  document.querySelector("#profiles").insertBefore(newLi,document.querySelector("#profiles").children[document.querySelector("#profiles").children.length-1]);

}

function createMenu(profiles){
  var dataFolder=appDir+"data";
  fs.readdir(dataFolder, function (err, files) {
    files.forEach(function (file) {
      if (fs.lstatSync(dataFolder+"\\"+file).isDirectory()) { // recurse
        createMenuProfile(file);
      }
    });
  });
}


function loadProfiles(callback){
  fs.readFile(appDir+"data\\profiles.json", "utf8", function (err, fdata) {
    if (err) {
        throw err;
    }
    var object = JSON.parse(fdata);
    callback(object);
  });
}

var calcBeforeload;

function init(){
  calcBeforeload=document.querySelector("#calcTable").innerHTML;
  loadProfiles(function(defaultProfile){
    document.querySelector("#newProfile").addEventListener("click",function(){
      var dataFolder=appDir+"data\\"+document.getElementsByClassName("newProfile")[0].getElementsByTagName("input")[0].value;
      if (!fs.existsSync(dataFolder)){
        fs.mkdirSync(dataFolder);
      }
      createMenuProfile(document.getElementsByClassName("newProfile")[0].getElementsByTagName("input")[0].value)
    })
    createMenu();
    loadData(defaultProfile["_defaultProfileOnLaunch"],function(data){
      createTables(data);
    })
    document.querySelector("#profileTitle").textContent=defaultProfile["_defaultProfileOnLaunch"];
  })
}
