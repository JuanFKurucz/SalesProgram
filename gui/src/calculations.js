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

    calcTable.querySelector("tr[title='Recharges']").getElementsByTagName("td")[y].textContent=sales;
    totalSales.getElementsByTagName("td")[y].textContent=sales-parseFloat(sales*0.05);
    calcTable.querySelector("tr[title='TransferCharge']").getElementsByTagName("td")[y].textContent=parseFloat(sales*0.05);
    total+=sales-parseFloat(sales*0.05);
  }
  calcTable.querySelector("tr[title='AllSales']").getElementsByTagName("td")[1].textContent=parseFloat(total);
  calcTable.querySelector("tr[title='70']").getElementsByTagName("td")[1].textContent=parseFloat(total*0.7);
  calcTable.querySelector("tr[title='Share']").getElementsByTagName("td")[1].textContent=parseFloat(total*0.7)/2;
}

exports = module.exports = {
	makeCalculations
};
