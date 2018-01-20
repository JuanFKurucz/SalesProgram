/*function isDate(d){
  if(Date.parse(d)==NaN){
    return false;
  } else {
    return true;
  }
}*/

function saveTable(){
  try{
    var dataTable=document.querySelector("#dataDiv");


    var datesArray=[];
    var dates=document.querySelector("#numbersAndDatesTitles").getElementsByTagName("th");
    for(var d=1;d<dates.length;d++){
      datesArray.push(dates[d].getElementsByTagName("input")[0].value);
      /*if(isDate(key)==false){
        throw new Error("Invalid date on date number "+d);
      }*/
      /*allData[key]="";
      for(var a=2;a<allTrs.length;a++){
        var allTds=allTrs[a].getElementsByTagName("td");
        allData[key]+=allTds[0].getElementsByTagName("input")[0].value+","+allTds[d].getElementsByTagName("input")[0].value;
        if(a!=allTrs.length-1){
          allData[key]+="\n";
        }
      }*/
    }
    var valuesDic={};
    var numbersArray=[];
    var allTrs=dataTable.getElementsByTagName("tr");
    for(var tr=2;tr<allTrs.length;tr++){
      var actualNumber=allTrs[tr].getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
      numbersArray.push(actualNumber);

      for(var td=1;td<allTrs[tr].getElementsByTagName("td").length;td++){
        if(allTrs[tr].getElementsByTagName("td")[td].getElementsByTagName("input")[0].value!=""){
          valuesDic[allTrs[1].getElementsByTagName("th")[td].getElementsByTagName("input")[0].value+","+actualNumber]=allTrs[tr].getElementsByTagName("td")[td].getElementsByTagName("input")[0].value;
        }
      }
    }

    /*for(var dicKey in allData){
      if(dicKey.split("-").length!=3){
        throw new Error("Invalid format date on date "+dicKey);
      }
    }*/



    var allData={
      "dates":datesArray,
      "numbers":numbersArray,
      "values":valuesDic
    };
    saveTableToJson(
      document.querySelector("#profileTitle").textContent,
      allData
    );
  } catch(e){
    throwMessage('error',"Error while saving",e.message)
  }
}

exports = module.exports = {
	saveTable
};
