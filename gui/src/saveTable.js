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

    saveTableToJson(
      appDir+"data\\"+document.querySelector("#profileTitle").textContent,
      allData
    );
  } catch(e){
    throwMessage('error',"Error while saving",e.message)
  }
}

exports = module.exports = {
	saveTable
};
