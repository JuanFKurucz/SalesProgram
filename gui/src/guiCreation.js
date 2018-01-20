const {getcalcBeforeload} = require(appDir+'\\gui\\src\\containers.js');

function elementCreator(type,parent,classes="left"){
  var element = document.createElement(type);
  element.setAttribute("class",classes)
  parent.appendChild(element);
  return element;
}

function formatDate(date,value=false){
  var dateSeparated=date.split("-");
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

function findInput(val,container){
  var cont = container;
  for(var th=1;th<cont.length;th++){
    if(cont[th].getElementsByTagName("input")[0].value==val){
      return th;
    }
  }
  return -1;
}

function createDeleteOption(type,val){
  var option=document.createElement("option");
  if(type=="Dates"){
    option.value=formatDate(val,true);
    option.textContent=formatDate(val);
  } else if(type=="Numbers"){
    option.value=val;
    option.textContent=val;
  }
  document.querySelector("#deleteSelect").querySelector("optgroup[label="+type+"]").appendChild(option);
}

function generateRowsColumns(data){
  var calcTable = document.querySelector("#calcTable");
  var dataTable = document.querySelector("#dataTable");
  var numbers=data["numbers"];
  var dates=data["dates"];
  var numbersData=data["values"];
  dates.sort();
  for(var d=0;d<dates.length;d++){
    var thDate = elementCreator("th",document.querySelector("#numbersAndDatesTitles"));
    var newInputDate = elementCreator("input",thDate,"center line");
    newInputDate.setAttribute("type","date");
    newInputDate.value=dates[d];
    var nclone = elementCreator("td",document.querySelector("#calcDates"),"center bold line");
    nclone.textContent=formatDate(newInputDate.value);
    elementCreator("td",calcTable.querySelector("tr[title='TotalSales']"));
    elementCreator("td",calcTable.querySelector("tr[title='Recharges']"));
    elementCreator("td",calcTable.querySelector("tr[title='TransferCharge']"));

    elementCreator("td",calcTable.querySelector("tr[title='70Daily']"));
    elementCreator("td",calcTable.querySelector("tr[title='ShareDaily']"),"bold");
    createDeleteOption("Dates",dates[d]);
  }

  for(var n=0;n<numbers.length;n++){
    var newNumberTr=elementCreator("tr",dataTable);
    newNumberTr.setAttribute("number",numbers[n]);
    var tdE=elementCreator("td",newNumberTr,"center");
    elementCreator("span",tdE,"numberLine").textContent=n+1 + ".|";
    var int=elementCreator("input",tdE);
    int.setAttribute("type","number");
    int.value=numbers[n];
    createDeleteOption("Numbers",numbers[n]);
    for(var i=0;i<Object.keys(dates).length;i++){
      var na=elementCreator("input",elementCreator("td",newNumberTr));
      na.setAttribute("type","number");
      na.onchange=function(){
        makeCalculations();
      }
    }
  }

  for(var key in numbersData){
    var x=findInput(key.split(",")[0],document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th"));
    var y=findInput(key.split(",")[1],dataTable.getElementsByTagName("tr"));
    if(x!=-1 && y!=-1){
      dataTable.getElementsByTagName("tr")[y].getElementsByTagName("td")[x].getElementsByTagName("input")[0].value=numbersData[key];
    }
  }

  elementCreator("td",calcTable.querySelector("tr[title='AllSales']"));
  elementCreator("td",calcTable.querySelector("tr[title='70']"));
  elementCreator("td",calcTable.querySelector("tr[title='Share']"),"bold");
}

function createTables(data){
  var table = elementCreator("table",document.querySelector("#dataDiv"));
  table.style="width:100%";
  table.id="dataTable";

  var col=data["dates"].length;
  var highTr = elementCreator("tr",table);
  var thDates = elementCreator("th",highTr,"center");
  thDates.setAttribute("colspan",col);
  thDates.textContent="Dates";

  var subTr = elementCreator("tr",table);
  subTr.id="numbersAndDatesTitles";
  var thNumbres = elementCreator("th",subTr,"center line");
  thNumbres.textContent="Numbers";

  generateRowsColumns(data);

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
  forEachDirectory(function(file){
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
  var buttonList=document.querySelector("#buttons");
  var saveButton =  elementCreator("a",elementCreator("li",document.querySelector("#buttons"),""),"");
  saveButton.id="saveButton";
  saveButton.textContent="Save Everything";
  saveButton.addEventListener("click",saveTable);
elementCreator("br",buttonList)
  var labelHref=elementCreator("a",elementCreator("li",buttonList,""),"");
  var labelImport = elementCreator("label",labelHref,"");
  labelImport.setAttribute("for","importNumbersButton");
  labelImport.textContent="Import numbers";
elementCreator("br",buttonList)
  var addNumberButton = elementCreator("a",elementCreator("li",buttonList,""),"");
  addNumberButton.id="addNumberButton";
  addNumberButton.textContent="Add Number";
  addNumberButton.addEventListener("click",addNumberFunction);

  var addNewDate = elementCreator("a",elementCreator("li",buttonList,""),"");
  addNewDate.id="addNewDate";
  addNewDate.textContent="Add New Date";
  addNewDate.addEventListener("click",addNewDateFunction);

  var deleteField=elementCreator("a",elementCreator("li",buttonList,""),"");
  deleteField.textContent="Delete something:";
  var deleteSelect = elementCreator("select",deleteField);
  deleteSelect.id="deleteSelect";

  var optGroupDates = elementCreator("optgroup",deleteSelect);
  optGroupDates.setAttribute("label","Dates");

  var optGroupNumbers = elementCreator("optgroup",deleteSelect);
  optGroupNumbers.setAttribute("label","Numbers");

  var deleteButton = elementCreator("input",deleteField);
  deleteButton.id="deleteSelect";
  deleteButton.setAttribute("type","submit");
  deleteButton.value="Delete";
  deleteButton.addEventListener("click",deleteStuff);

  var addProfile = elementCreator("a",elementCreator("li",buttonList,""),"");
  addProfile.textContent="Add Profile:";
  addProfile.parentElement.setAttribute("class","newProfile");
  elementCreator("br",addProfile)
  var addProfileInputName = elementCreator("input",addProfile);
  addProfileInputName.setAttribute("type","text");
  addProfileInputName.setAttribute("placeholder","porfile name here");
  addProfileInputName.style.width="60%";
  var addProfileInputSubmit = elementCreator("input",addProfile);
  addProfileInputSubmit.setAttribute("type","submit");
  addProfileInputSubmit.value="Add";
  addProfileInputSubmit.id="newProfile";


  var hideMenuButton = elementCreator("a",elementCreator("li",buttonList,""),"");
  hideMenuButton.textContent="Hide Menu";
  hideMenuButton.addEventListener("click",function(){
    var sub=this.parentElement.parentElement.getElementsByTagName("li");
    for(var i=0;i<sub.length;i++){
      if(this.textContent=="Hide Menu"){
        if(sub[i].textContent!="Save Everything" &&
            sub[i].textContent!="Hide Menu"){
          sub[i].style.display="none";
        } else if(sub[i].textContent=="Save Everything"){
          sub[i].getElementsByTagName("a")[0].textContent="Save";
        }
      } else {
        if(sub[i].textContent=="Save"){
          sub[i].getElementsByTagName("a")[0].textContent="Save Everything";
        }
        sub[i].style.display="";
      }
    }
    if(this.textContent=="Hide Menu"){
      document.querySelector("#programContainer").style.width="95%";
      document.querySelector("#menuRight").style.right="8px";
      document.querySelector("#menuRight").style.width="5%";
      this.textContent=">";
    } else {
      document.querySelector("#menuRight").style.right="0px";
      document.querySelector("#programContainer").style.width="85%";
      document.querySelector("#menuRight").style.width="15%";
      this.textContent="Hide Menu";
    }

  });
}

function loadProfiles(callback){
  loadFile("config_profiles.json",function(fdata){
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
  elementCreator("span",numberTd,"numberLine").textContent=getElementIndex(newNumberTr)-1 + ".|";
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
    var count=0;
    for(var i=0;i<document.querySelectorAll("#numbersAndDatesTitles input").length;i++){
      if(document.querySelectorAll("#numbersAndDatesTitles input")[i].value==ele.value){
        count++;
        if(count>1){
          throw new Error("This date already exists");
        }
      }
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
  document.querySelector("#calcDates").appendChild(nclone);
  nclone.textContent=newInputDate.value;

  var trSales=document.querySelector("#calcTable tr[title='Recharges']");
  var newTd1=document.createElement("td");
  trSales.appendChild(newTd1);

  var trTransferCharge=document.querySelector("#calcTable tr[title='TransferCharge']");
  var newTd1=document.createElement("td");
  trTransferCharge.appendChild(newTd1);

  var trTotalSales=document.querySelector("#calcTable tr[title='TotalSales']");
  var newTd1=document.createElement("td");
  trTotalSales.appendChild(newTd1);

  for(var i=2;i<table.getElementsByTagName("tr").length;i++){
    var newTd=document.createElement("td");
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
