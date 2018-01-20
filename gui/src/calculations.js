function roundNumbers(number){
  var text="";
  var ish="";
  if(number.toString().split(".").length>1&&number.toString().split(".")[1].length>2){
    ish=" *(."+number.toString().split(".")[1].substr(0,2)+")";
    number=Math.round(number);
    text = number + ish;
  } else {
    text = number;
  }
  return text;
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

    calcTable.querySelector("tr[title='Recharges']").getElementsByTagName("td")[y].textContent=roundNumbers(sales);
    var totalSalest=(sales-parseFloat(sales*0.05));
    totalSales.getElementsByTagName("td")[y].textContent=roundNumbers(totalSalest);
    calcTable.querySelector("tr[title='TransferCharge']").getElementsByTagName("td")[y].textContent=roundNumbers(parseFloat(sales*0.05));

    calcTable.querySelector("tr[title='70Daily']").getElementsByTagName("td")[y].textContent=roundNumbers(totalSalest*0.7);
    calcTable.querySelector("tr[title='ShareDaily']").getElementsByTagName("td")[y].textContent=roundNumbers((totalSalest*0.7)/2);

    total+=sales-parseFloat(sales*0.05);
  }
  calcTable.querySelector("tr[title='AllSales']").getElementsByTagName("td")[1].textContent=roundNumbers(parseFloat(total));


  calcTable.querySelector("tr[title='70']").getElementsByTagName("td")[1].textContent=roundNumbers((total*0.7));

  calcTable.querySelector("tr[title='Share']").getElementsByTagName("td")[1].textContent=roundNumbers((total*0.7)/2);
}

exports = module.exports = {
	makeCalculations
};
