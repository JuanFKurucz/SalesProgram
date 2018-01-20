var calcBeforeload;
function getcalcBeforeload(){
  return calcBeforeload;
}

function savecalcBeforeload(a){
  calcBeforeload=a;
}


exports = module.exports = {
	savecalcBeforeload,getcalcBeforeload
};
