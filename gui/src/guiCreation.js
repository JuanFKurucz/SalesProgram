const {getcalcBeforeload} = require(appDir+'\\gui\\src\\containers.js');

function elementCreator(type,parent,classes="left"){
  var element = document.createElement(type);
  element.setAttribute("class",classes)
  parent.appendChild(element);
  return element;
}

function formatDate(date,value=false){
  var dateSeparated;
  if(date.indexOf("-")==-1){
    dateSeparated=date.split("/");
  } else {
    dateSeparated=date.split("-");
  }
  for(var d=0;d<dateSeparated.length;d++){
    if(dateSeparated[d].length==1){
      dateSeparated[d]="0"+dateSeparated[d];
    }
  }
  if(value==false){
    if(dateSeparated[0].length==4){
      dateSeparated.reverse();
    }
    dateSeparated=dateSeparated.join("/");
  } else if(value==true){
    if(dateSeparated[0].length!=4){
      dateSeparated.reverse();
    }
    dateSeparated=dateSeparated.join("-");
  }
  return dateSeparated;
}

function getElementIndex(node) {
    var index = 0;
    while ( (node = node.previousElementSibling) ) {
        index++;
    }
    return index;
}

function newDateColumn(key,data,col){
  try{
    var index=col;
    col+=1;
    var ndate = new Date(parseInt(key));
    var stringDate=ndate.getDate()+"-"+ndate.getMonth()+"-"+ndate.getFullYear();
    thDate = document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th")[index];

    var optiond=document.createElement("option");
    optiond.value=formatDate(stringDate,true);
    optiond.textContent=formatDate(stringDate);
    document.querySelector("#deleteSelect").querySelector("optgroup[label='Dates']").appendChild(optiond);

    var newInputDate = thDate.getElementsByTagName("input")[0];
    newInputDate.onchange=function(){
      detectDupliactedDate(this,optiond);
    }
    newInputDate.value=formatDate(stringDate,true);

    var nclone = document.querySelector("#calcDates").getElementsByTagName("td")[index];
    nclone.textContent=formatDate(stringDate);

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
      newNumberTr.getElementsByTagName("input")[index].value=data[key][subKey];
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
    var index=document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th").length;
    datesCount++;
    var thDate = elementCreator("th",document.querySelector("#numbersAndDatesTitles"));
    var newInputDate = elementCreator("input",thDate,"center line");
    newInputDate.setAttribute("type","date");
    newInputDate.onchange=function(){
      document.querySelector("#calcDates").children[this.parentElement.parentElement.children.indexOf(this.parentElement)].textContent=formatDate(this.value);
    }
    var nclone = elementCreator("td",document.querySelector("#calcDates"),"center bold line");
    nclone.textContent=newInputDate.value;

    for(var subKey in data[key]){
      numbers[subKey]=true;
    }
    elementCreator("td",totalSales);
    elementCreator("td",calcTable.querySelector("tr[title='Recharges']"));
    elementCreator("td",calcTable.querySelector("tr[title='TransferCharge']"));
  }
  var num=0;
  for(var n in numbers){
    num++;
    var newNumberTr=elementCreator("tr",document.querySelector("#dataTable"));
    newNumberTr.setAttribute("number",n);
    var tdE=elementCreator("td",newNumberTr,"center");
    elementCreator("span",tdE,"numberLine").textContent=num + ".|";
    elementCreator("input",tdE).setAttribute("type","number");
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
  var table = elementCreator("table",document.querySelector("#dataDiv"));
  table.style="width:100%";
  table.id="dataTable";

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

function createMenuProfile(name){
  var newLi = document.createElement("li");
  newLi.innerHTML="<a href='#'>"+name+"</a>";
  newLi.setAttribute("alt",name);
  newLi.onclick=function(){
    //newLi.setAttribute("class",newLi.getAttribute("class")+" selected");
    document.querySelector("#dataDiv").innerHTML="";
    document.querySelector("#calcTable").innerHTML=getcalcBeforeload();
    document.querySelector("#profileTitle").textContent=this.textContent;
    loadData(this.textContent,function(data){
      createTables(data);
    })
  }
  document.querySelector("#profiles").insertBefore(newLi,document.querySelector("#profiles").children[document.querySelector("#profiles").children.length-1]);

}

function createMenu(){
  forEachDirectory(appDir+"data",function(file){
    createMenuProfile(file);
  })
}

function createButtons(){
  document.querySelector("#importNumbersButton").onchange=function(){
    importNumbers(this.files[0].path,function(lines){
      for(var l=0;l<lines.length;l++){
        addNumberFunction(lines[l]);
      }
    });
  }

  var addNumberButton = elementCreator("input",document.querySelector("#buttons"));
  addNumberButton.id="addNumberButton";
  addNumberButton.setAttribute("type","submit");
  addNumberButton.value="Add Number";
  addNumberButton.addEventListener("click",addNumberFunction);

  var addNewDate = elementCreator("input",document.querySelector("#buttons"));
  addNewDate.id="addNewDate";
  addNewDate.setAttribute("type","submit");
  addNewDate.value="Add New Date";
  addNewDate.addEventListener("click",addNewDateFunction);

  var saveButton = elementCreator("input",document.querySelector("#buttons"));
  saveButton.id="saveButton";
  saveButton.setAttribute("type","submit");
  saveButton.value="Save Everything";
  saveButton.addEventListener("click",saveTable);

  elementCreator("br",document.querySelector("#buttons"));

  var deleteSelect = elementCreator("select",document.querySelector("#buttons"));
  deleteSelect.id="deleteSelect";

  var optGroupDates = elementCreator("optgroup",deleteSelect);
  optGroupDates.setAttribute("label","Dates");

  var optGroupNumbers = elementCreator("optgroup",deleteSelect);
  optGroupNumbers.setAttribute("label","Numbers");

  var deleteButton = elementCreator("input",document.querySelector("#buttons"));
  deleteButton.id="deleteSelect";
  deleteButton.setAttribute("type","submit");
  deleteButton.value="Delete";
  deleteButton.addEventListener("click",deleteStuff);
}

function loadProfiles(callback){
  loadFile(appDir+"data\\profiles.json",function(fdata){
    var object = JSON.parse(fdata);
    callback(object);
  })
}

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

function addNumberFunction(fill=""){
  var newNumberTr=elementCreator("tr",document.querySelector("#dataTable"));
  var option=elementCreator("option",document.querySelector("#deleteSelect optgroup[label='Numbers']"));

  var numberTd=elementCreator("td",newNumberTr,"center");
  var newInput=elementCreator("input",numberTd);
  newInput.setAttribute("type","number");
  newInput.onchange=function(){
    detectDupliactedNumber(this,option);
  }

  if(fill!=""){
    newInput.value=parseInt(fill);
  }

  for(var i=1;i<document.querySelectorAll("#numbersAndDatesTitles th").length;i++){
    var newInput=elementCreator("input",elementCreator("td",newNumberTr));
    newInput.setAttribute("type","number");
    newInput.onchange=function(){
      makeCalculations();
    }
  }
  newInput.onchange();
}

function detectDupliactedDate(ele,option){
  try{
    if(document.querySelector("#numbersAndDatesTitles").querySelectorAll("input[date='"+ele.value+"']").length==1){
      throw new Error("This date already exists")
    }
    option.textContent=formatDate(ele.value);
    option.value=ele.value;
    document.querySelector("#calcDates").children[
      getElementIndex(ele.parentElement)
    ].textContent=formatDate(ele.value);
  } catch(e){
    throwMessage('error',"Error while naming a date",e.message)
  }
}

function addNewDateFunction(){
  var table=document.querySelector("#dataTable");
  var subTr=document.querySelector("#numbersAndDatesTitles");
  var newTh = document.createElement("th");
  newTh.setAttribute("class","center bold");

  //subTr.insertBefore(newTh,subTr.getElementsByTagName("th")[1]);
  subTr.appendChild(newTh);

  var option=document.createElement("option");
  document.querySelector("#deleteSelect optgroup[label='Dates']").appendChild(option);

  var newInputDate=elementCreator("input",newTh);
  newInputDate.setAttribute("type","date");
  newInputDate.onchange=function(){
    detectDupliactedDate(this,option);
  }

  var nclone = document.createElement("td");
  nclone.setAttribute("class","center bold");

  //document.querySelector("#calcDates").insertBefore(nclone,document.querySelector("#calcDates").getElementsByTagName("td")[1]);
  document.querySelector("#calcDates").appendChild(nclone);

  nclone.textContent=newInputDate.value;

  var trSales=document.querySelector("#calcTable tr[title='Recharges']");
  var newTd1=document.createElement("td");

  //trTransferCharge.insertBefore(newTd1,trTransferCharge.getElementsByTagName("td")[1]);
  trSales.appendChild(newTd1);

  var trTransferCharge=document.querySelector("#calcTable tr[title='TransferCharge']");
  var newTd1=document.createElement("td");

  //trTransferCharge.insertBefore(newTd1,trTransferCharge.getElementsByTagName("td")[1]);
  trTransferCharge.appendChild(newTd1);

  var trTotalSales=document.querySelector("#calcTable tr[title='TotalSales']");
  var newTd1=document.createElement("td");

  //trTotalSales.insertBefore(newTd1,trTotalSales.getElementsByTagName("td")[1]);
  trTotalSales.appendChild(newTd1);

  for(var i=2;i<table.getElementsByTagName("tr").length;i++){
    var newTd=document.createElement("td");

    //table.getElementsByTagName("tr")[i].insertBefore(newTd,table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1]);
    table.getElementsByTagName("tr")[i].appendChild(newTd);

    var newInput=elementCreator("input",newTd);
    newInput.setAttribute("type","number");
    newInput.onchange=function(){
      makeCalculations();
    }
  }
}

function removeDomElement(node){
  node.parentElement.removeChild(node);
}

function deleteStuff(){
  var selectElement = document.querySelector("#deleteSelect");
  var selectedOption = selectElement.getElementsByTagName("option")[selectElement.selectedIndex];

  switch(selectedOption.parentElement.getAttribute("label")){
    case "Dates":
      var index=-1;
      var ths=document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th");
      for(var th=1;th<ths.length;th++){
        if(ths[th].getElementsByTagName("input")[0].value==selectElement.value){
          index=th;
          break;
        }
      }
      if(index!=-1){
        removeDomElement(ths[index]);
        var trs=document.querySelector("#dataTable").getElementsByTagName("tr");
        for(var tr=2;tr<trs.length;tr++){
          removeDomElement(trs[tr].getElementsByTagName("td")[index])
        }
        removeDomElement(document.querySelectorAll("#calcDates td")[index]);
        removeDomElement(document.querySelector("tr[title='Recharges']").getElementsByTagName("td")[index]);
        removeDomElement(document.querySelector("tr[title='TransferCharge']").getElementsByTagName("td")[index]);
        removeDomElement(document.querySelector("tr[title='TotalSales']").getElementsByTagName("td")[index]);
      }
      break;
    case "Numbers":
      removeDomElement(document.querySelector("#dataTable tr[number='"+selectElement.value+"']"));
      break;
  }
  makeCalculations();
  removeDomElement(selectedOption);
}

exports = module.exports = {
	createMenu,createMenu,createButtons,loadProfiles,createTables,createMenuProfile
};
