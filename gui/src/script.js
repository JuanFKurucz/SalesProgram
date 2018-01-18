const fs = require("fs");
const path = require("path");
var appDir = path.normalize(path.dirname(require.main.filename)+"\\..\\");
const { remote } = require('electron')
const {dialog} = require('electron').remote;
var datesCount;

function sortOnKeys(dict) {
    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort(function(a, b){return b-a});
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

function elementCreator(type,parent,classes="left"){
  var element = document.createElement(type);
  element.setAttribute("class",classes)
  parent.appendChild(element);
  return element;
}
function newDateColumn(key,data,col){
  try{
    col+=1;
    var ndate = new Date(parseInt(key));
    var stringDate=ndate.getDate()+"-"+ndate.getMonth()+"-"+ndate.getFullYear();
    thDate = document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th")[col-1];

    var optiond=document.createElement("option");
    optiond.value=stringDate;
    optiond.textContent=stringDate;
    document.querySelector("#deleteSelect").querySelector("optgroup[label='Dates']").appendChild(optiond);

    var newInputDate = thDate.getElementsByTagName("input")[0];
    newInputDate.onchange=function(){
      detectDupliactedDate(this,optiond);

      optiond.textContent=this.value;
      optiond.value=this.value;
    }
    newInputDate.setAttribute("date",stringDate);
    newInputDate.value=stringDate;

    var nclone = document.querySelector("#calcDates").getElementsByTagName("td")[col-1];
    nclone.textContent=newInputDate.value;
    nclone.setAttribute("date",newInputDate.getAttribute("date"));

    for(var subKey in data[key]){
      newNumberTr=document.querySelector("#dataTable").querySelector("tr[number='"+subKey+"']");
      if(newNumberTr.getElementsByTagName("input")[0].value==""){
        newNumberTr.getElementsByTagName("input")[0].value=subKey;
        newNumberTr.getElementsByTagName("input")[0].onchange=function(){
          detectDupliactedNumber(this,option);
        }
        var option=document.createElement("option");
        option.value=subKey;
        option.textContent=subKey;
        document.querySelector("#deleteSelect").querySelector("optgroup[label='Numbers']").appendChild(option);
      }
      newNumberTr.getElementsByTagName("input")[col-1].value=data[key][subKey];
    }

    var tempData=data;
    delete tempData[key];
    var ndata;
    for(var k in tempData){
      ndata=k;
      break;
    }
    if(Object.keys(tempData).length>0){
      return newDateColumn(ndata,tempData,col);
    } else {
      return col;
    }
  } catch(e){

  }
}

function generateRowsColumns(data){
  var calcTable=document.querySelector("#calcTable");
  var totalSales=calcTable.querySelector("tr[title='TotalSales']");
  var numbers={};
  var datesCount=0;
  for(var key in data){
    datesCount++;
    var thDate = document.createElement("th");
    document.querySelector("#numbersAndDatesTitles").appendChild(thDate);
    var newInputDate = elementCreator("input",thDate,"center line");
    newInputDate.setAttribute("type","text");
    newInputDate.setAttribute("date","");
    newInputDate.onchange=function(){
      document.querySelectorAll("th[date='"+this.getAttribute("date")+"']")[0].textContent=this.value;
    }
    var nclone = elementCreator("td",document.querySelector("#calcDates"),"center bold line");
    nclone.textContent=newInputDate.value;
    nclone.setAttribute("date",newInputDate.getAttribute("date"));

    for(var subKey in data[key]){
      numbers[subKey]=true;
    }
    elementCreator("td",totalSales);
    elementCreator("td",calcTable.querySelector("tr[title='TransferCharge']"));
  }
  for(var n in numbers){
    var newNumberTr=elementCreator("tr",document.querySelector("#dataTable"));
    newNumberTr.setAttribute("number",n);
    var newInput=elementCreator("input",elementCreator("td",newNumberTr,"center"));
    newInput.setAttribute("type","number");

    for(var i=0;i<datesCount;i++){
      var n=elementCreator("input",elementCreator("td",newNumberTr));
      n.setAttribute("type","number");
      n.onchange=function(){
        makeCalculations();
      }
    }
  }

  elementCreator("td",calcTable.querySelector("tr[title='AllSales']"));
  elementCreator("td",calcTable.querySelector("tr[title='70']"));
  elementCreator("td",calcTable.querySelector("tr[title='Share']"));
}

function createTables(data){
  //main table
  var table = elementCreator("table",document.querySelector("#dataDiv"));
  table.style="width:100%";
  table.id="dataTable";
  //headers
    //Date title
  var col=1;
  var highTr = elementCreator("tr",table);
  var thDates = elementCreator("th",highTr,"center");
  thDates.setAttribute("colspan",col);
  thDates.textContent="Dates";

  var subTr = elementCreator("tr",table);
  subTr.id="numbersAndDatesTitles";
  var thNumbres = elementCreator("th",subTr,"center line");
  thNumbres.textContent="Numbers";


  generateRowsColumns(data);
  if(Object.keys(data).length>0){
    var thDate=null;
    var tempData=data;

    var ndata;
    for(var k in tempData){
      ndata=k;
      break;
    }


    col=newDateColumn(ndata,tempData,col);
  }
  document.querySelector("#profileTitle").setAttribute("colspan",col);
  thDates.setAttribute("colspan",col);

  makeCalculations();
}

function makeCalculations(){
  var table=document.querySelector("#dataTable");
  var calcTable=document.querySelector("#calcTable");
  var totalSales=calcTable.querySelector("tr[title='TotalSales']");
  var sales=0;
  var total=0;
  for(var y=1;y<table.getElementsByTagName("tr")[1].getElementsByTagName("th").length;y++){
    sales=0;
    for(var i=2;i<table.getElementsByTagName("tr").length;i++){
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
    total+=sales;
    totalSales.getElementsByTagName("td")[y].textContent=sales;
    calcTable.querySelector("tr[title='TransferCharge']").getElementsByTagName("td")[y].textContent=parseFloat(sales*0.05);
  }
  calcTable.querySelector("tr[title='AllSales']").getElementsByTagName("td")[1].textContent=parseFloat(total);
  calcTable.querySelector("tr[title='70']").getElementsByTagName("td")[1].textContent=parseFloat(total*0.7);
  calcTable.querySelector("tr[title='Share']").getElementsByTagName("td")[1].textContent=parseFloat(total-parseFloat(total*0.7));
}

function isDate(d){
  if(Date.parse(d)==NaN){
    return false;
  } else {
    return true;
  }
}

function saveTable(){
  try{
    var dataTable=document.querySelector("#dataDiv");
    var allTrs=dataTable.getElementsByTagName("tr");
    var dates=document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th");
    var allData={};
    for(var d=1;d<dates.length;d++){
      var key=dates[d].getElementsByTagName("input")[0].value;
      if(isDate(key)==false){
        throw new Error("Invalid date on date number "+d);
      }
      allData[key]={};
      for(var a=2;a<allTrs.length;a++){
        var allTds=allTrs[a].getElementsByTagName("td");
        allData[key][allTds[0].getElementsByTagName("input")[0].value]=allTds[d].getElementsByTagName("input")[0].value;
      }
    }

    for(var dicKey in allData){
      if(dicKey.split("-").length!=3){
        throw new Error("Invalid format date on date "+dicKey);
      }
    }
    var dataFolder=appDir+"data\\"+document.querySelector("#profileTitle").textContent;
    var len=0;
    fs.readdir(dataFolder, (err, files) => {
      if (err) throw err;
      if(files.length==0){
        writeFiles(dataFolder,allData);
      } else {
        for (const file of files) {
          fs.unlink(path.join(dataFolder, file), err => {
            if (err) throw err;
            len++;
            if(len==files.length){
              writeFiles(dataFolder,allData);
            }
          });
        }
      }
    });

  } catch(e){
    throwMessage('error',"Error while saving",e.message)
  }
}

function writeFiles(dataFolder,allData){
  for(var dicKey in allData){
    var reverseDicKey=dicKey.split("-")[2]+"-"+dicKey.split("-")[1]+"-"+dicKey.split("-")[0];
    var JSONo = JSON.stringify(allData[dicKey]);
    fs.writeFile(dataFolder+"\\"+reverseDicKey+".json",JSONo,'utf8',function(err) {
        if(err) {
            return console.log(err);
        }
    });
  }
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

function detectDupliactedNumber(ele,option){
  try{
    ele.parentElement.parentElement.setAttribute("number",ele.value);
    if(document.querySelector("#dataTable").querySelectorAll("tr[number='"+ele.value+"']").length>1){
      throw new Error("This number already exists")
    }
    option.value=ele.value;
    option.textContent=ele.value;
  } catch(e){
    throwMessage('error',"Error while naming a number",e.message)
  }
}

function addNumberFunction(){
  var table=document.querySelector("#dataTable");
  var newNumberTr=document.createElement("tr");
  table.appendChild(newNumberTr);

  var option=document.createElement("option");
  document.querySelector("#deleteSelect").querySelector("optgroup[label='Numbers']").appendChild(option);
  var numberTd=document.createElement("td");
  numberTd.setAttribute("class","center");
  newNumberTr.appendChild(numberTd);
  var newInput=document.createElement("input");
  newInput.setAttribute("type","number");
  newInput.onchange=function(){
    detectDupliactedNumber(this,option);
  }
  numberTd.appendChild(newInput);

  for(var i=1;i<document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th").length;i++){
    var dataTd=document.createElement("td");
    newNumberTr.appendChild(dataTd);
    var newInput=document.createElement("input");
    newInput.setAttribute("type","number");
    newInput.onchange=function(){
      makeCalculations();
    }
    dataTd.appendChild(newInput);
  }
}

function detectDupliactedDate(ele,option){
  try{
    ele.setAttribute("date",ele.value);
    if(document.querySelector("#numbersAndDatesTitles").querySelectorAll("input[date='"+ele.value+"']").length>1){
      throw new Error("This date already exists")
    }
    option.textContent=ele.value;
    document.querySelectorAll("td[date='"+option.value+"']")[0].textContent=ele.value;
  } catch(e){
    throwMessage('error',"Error while naming a date",e.message)
  }
}

function addNewDateFunction(){
  var table=document.querySelector("#dataTable");
  var subTr=document.querySelector("#numbersAndDatesTitles");
  var newTh = document.createElement("th");
  newTh.setAttribute("class","center bold");
  subTr.insertBefore(newTh,subTr.getElementsByTagName("th")[1]);

  var option=document.createElement("option");
  option.value="newDate"+document.querySelectorAll("th[date]").length;
  document.querySelector("#deleteSelect").querySelector("optgroup[label='Dates']").appendChild(option);

  var newInputDate=elementCreator("input",newTh);
  newInputDate.setAttribute("type","text");
  newInputDate.setAttribute("date","newDate"+document.querySelectorAll("th[date]").length);
  newInputDate.onchange=function(){
    detectDupliactedDate(this,option);
  }

  var nclone = document.createElement("td");
  nclone.setAttribute("class","center bold");
  document.querySelector("#calcDates").insertBefore(nclone,document.querySelector("#calcDates").getElementsByTagName("td")[1]);
  nclone.textContent=newInputDate.value;
  nclone.setAttribute("date",newInputDate.getAttribute("date"));

  var trTransferCharge=document.querySelector("#calcTable").querySelector("tr[title='TransferCharge']");
  var newTd1=document.createElement("td");
  trTransferCharge.insertBefore(newTd1,trTransferCharge.getElementsByTagName("td")[1]);

  var trTotalSales=document.querySelector("#calcTable").querySelector("tr[title='TotalSales']");
  var newTd1=document.createElement("td");
  trTotalSales.insertBefore(newTd1,trTotalSales.getElementsByTagName("td")[1]);

  for(var i=2;i<table.getElementsByTagName("tr").length;i++){
    var newTd=document.createElement("td");
    table.getElementsByTagName("tr")[i].insertBefore(newTd,table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1]);
    var newInput=elementCreator("input",newTd);
    newInput.setAttribute("type","number");
    newInput.onchange=function(){
      makeCalculations();
    }
  }
}

function deleteStuff(){
  var selectElement=document.querySelector("#deleteSelect");
  var selectedOption=selectElement.getElementsByTagName("option")[selectElement.selectedIndex];
  var label = selectedOption.parentElement.getAttribute("label");

  switch(label){
    case "Dates":
      var ths=document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th");
      var index=-1;
      for(var t=1;t<ths.length;t++){
        if(ths[t].getElementsByTagName("input")[0].getAttribute("date")==selectElement.value){
          index=t;
          ths[t].parentElement.removeChild(ths[t]);
          break;
        }
      }
      var trs=document.querySelector("#dataTable").getElementsByTagName("tr");
      for(var tr=2;tr<trs.length;tr++){
        trs[tr].getElementsByTagName("td")[index].parentElement.removeChild(trs[tr].getElementsByTagName("td")[index]);
      }

      var calcElement=document.querySelector("#calcDates").querySelector("td[date='"+selectElement.value+"']");
      var calcIndex=-1;
      for(var i=0;i<calcElement.parentElement.children.length;i++){
        if(calcElement.parentElement.children[i]==calcElement){
          calcIndex=i;
          break;
        }
      }
      calcElement.parentElement.removeChild(calcElement);
      document.querySelector("tr[title='TransferCharge']").removeChild(document.querySelector("tr[title='TransferCharge']").getElementsByTagName("td")[calcIndex]);
      document.querySelector("tr[title='TotalSales']").removeChild(document.querySelector("tr[title='TotalSales']").getElementsByTagName("td")[calcIndex]);
      break;
    case "Numbers":
      document.querySelector("#dataTable").removeChild(document.querySelector("#dataTable").querySelector("tr[number='"+selectElement.value+"']"));
      break;
  }
  makeCalculations();
  selectedOption.parentElement.removeChild(selectedOption);
}

function createButtons(){
  var addNumberButton = document.createElement("input");
  addNumberButton.id="addNumberButton";
  addNumberButton.setAttribute("type","submit");
  addNumberButton.value="Add Number";
  addNumberButton.addEventListener("click",addNumberFunction);
  document.querySelector("#buttons").appendChild(addNumberButton);

  var addNewDate = document.createElement("input");
  addNewDate.id="addNewDate";
  addNewDate.setAttribute("type","submit");
  addNewDate.value="Add New Date";
  addNewDate.addEventListener("click",addNewDateFunction);
  document.querySelector("#buttons").appendChild(addNewDate);

  var saveButton = document.createElement("input");
  saveButton.id="saveButton";
  saveButton.setAttribute("type","submit");
  saveButton.value="Save Everything";
  saveButton.addEventListener("click",saveTable);
  document.querySelector("#buttons").appendChild(saveButton);

  var br=document.createElement("br");
  document.querySelector("#buttons").appendChild(br);
  var br=document.createElement("br");
  document.querySelector("#buttons").appendChild(br);

  var deleteSelect = document.createElement("select");
  deleteSelect.id="deleteSelect";
  document.querySelector("#buttons").appendChild(deleteSelect);

  var optGroupDates = document.createElement("optgroup");
  optGroupDates.setAttribute("label","Dates");
  deleteSelect.appendChild(optGroupDates);
  var optGroupNumbers = document.createElement("optgroup");
  optGroupNumbers.setAttribute("label","Numbers");
  deleteSelect.appendChild(optGroupNumbers);

  var deleteButton = document.createElement("input");
  deleteButton.id="deleteSelect";
  deleteButton.setAttribute("type","submit");
  deleteButton.value="Delete";
  deleteButton.addEventListener("click",deleteStuff);
  document.querySelector("#buttons").appendChild(deleteButton);
}

function init(){
  createButtons();
  document.querySelector("#MinimizeProgram").onclick=function(){
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
  document.querySelector("#CloseProgram").onclick=function(){
    remote.BrowserWindow.getFocusedWindow().close();
  }

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

function throwMessage(type,message,detail="",buttons=["Ok"]){
  dialog.showMessageBox({
    type: type,
    buttons:buttons,
    message:message,
    detail:detail
  });
}
