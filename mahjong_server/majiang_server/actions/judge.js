function isSameType(type,arr){
    for(var i = 0; i < arr.length; ++i){
        var t = getMJType(arr[i]);
        if(type != -1 && type != t){
            return false;
        }
        type = t;
    }
    return true;
}

function getMJType(id){
    if(id >= 0 && id < 9){
        //筒
        return 0;
    }
    else if(id >= 9 && id < 18){
        //条
        return 1;
    }
    else if(id >= 18 && id < 27){
        //万
        return 2;
    }else{
        return 3;
    }
}

Array.prototype.remove = function(val) {
  for(var i=0 ; i < this.length ; i++) {
    if(this[i] == val){
      this.splice(i, 1)
      i--;
    }
  }
}

/*
判断对对胡
每个坎子去掉混以后都是一种类型
*/
exports.isDuiDuiHu = (gameSeatData,hun) => {
  var kanzi = gameSeatData.kanzi
  for(var i=0 ; i < kanzi.length ; i++) {
    var thiskan = [].concat(kanzi[i])
    if(hun) thiskan.remove(hun)
    if( thiskan[1] &&  thiskan[1] != thiskan[0] )
      return false
  }
  return true
}

/*
判断清一色
带混去混，其余为同一花色即为清一色
*/
exports.isQingYiSe = (gameSeatData,hun) => {
  var pais = []
    .concat(gameSeatData.holds)
    .concat(gameSeatData.angangs)
    .concat(gameSeatData.wangangs)
    .concat(gameSeatData.diangangs)
    .concat(gameSeatData.pengs)
  if(hun) pais.remove(hun)
  if( isSameType(getMJType(pais[0]),pais) )
    return true
  return false
}

/*
判断混一色
带混去混
其余为同一花色 + 风向中发白
则为混一色
*/
exports.isHunYiSe = (gameSeatData,hun) => {
  var pais = []
    .concat(gameSeatData.holds)
    .concat(gameSeatData.angangs)
    .concat(gameSeatData.wangangs)
    .concat(gameSeatData.diangangs)
    .concat(gameSeatData.pengs)
  if(hun) pais.remove(hun)
  var types = [ [],[],[],[] ];
  for (var i = 0 ; i < pais.length ; i ++ ){
    types[getMJType(pais[i])].push(pais[i])
  }
  if(types[3].length > 0 ){
    if(types[0].length > 0
      && types[1].length == 0
      && types[2].length == 0 ) return true;
    if(types[1].length > 0
      && types[0].length == 0
      && types[2].length == 0 ) return true;
    if(types[2].length > 0
      && types[1].length == 0
      && types[0].length == 0 ) return true;
  }
  return false
}

/*
一条龙
有1-9的牌 ， 包括hun
*/
exports.isLong = (gameSeatData,hun) => {
  var pais = []
    .concat(gameSeatData.holds)
    .concat(gameSeatData.angangs)
    .concat(gameSeatData.wangangs)
    .concat(gameSeatData.diangangs)
    .concat(gameSeatData.pengs)
  //提取混的数量
  var numOfHun = 0
  if(hun){
    for(var i=0 ; i<pais.length ; i ++) {
      if(pais[i] == hun ) numOfHun++
    }
  }
  if(hun) pais.remove(hun)
  //分类
  var types = [ [],[],[],[] ];
  for (var i = 0 ; i < pais.length ; i ++ ){
    var thistype = getMJType(pais[i])
    var ifHas = false
    for(var j=0 ; j < types[thistype].length ; j++) {
      if(types[thistype][j] == pais[i]) ifHas = true
    }
    if(!ifHas)
    types[getMJType(pais[i])].push(pais[i])
  }
  if(numOfHun + types[0].length >= 9) return true
  if(numOfHun + types[1].length >= 9) return true
  if(numOfHun + types[2].length >= 9) return true
  return false
}

// var data = {
//   holds:[0,0,0,1,2,3,4,5,6,7,8],
//   angangs:[],
//   wangangs:[],
//   diangangs:[],
//   pengs:[32],
// }
//
// console.log(this.isLong(data))


/*
风清，只有风
*/
exports.isFengQing = (gameSeatData,hun) => {
  var pais = []
    .concat(gameSeatData.holds)
    .concat(gameSeatData.angangs)
    .concat(gameSeatData.wangangs)
    .concat(gameSeatData.diangangs)
    .concat(gameSeatData.pengs)
  if(hun) pais.remove(hun)
  var types = [ [],[],[],[] ];
  for (var i = 0 ; i < pais.length ; i ++ ){
    if(pais[i]>=31) return false
    types[getMJType(pais[i])].push(pais[i])
  }
  if(types[3].length > 0
    && types[0].length ==0
    && types[1].length ==0
    && types[2].length ==0
  ){
    return true
  }
  return false
}


/*
判断炸7对 7对本身由胡法来判定 该算法基于7对的基础上使用
*/
exports.isZha7dui = (gameSeatData,hun) => {
  var pais = []
    .concat(gameSeatData.holds)
  //提取混的数量
  var numOfHun = 0
  if(hun){
    for(var i=0 ; i<pais.length ; i ++) {
      if(pais[i] == hun ) numOfHun++
    }
  }
  if(hun) pais.remove(hun)
  //分类
  var hds = {}
  for(var i = 0 ; i < pais.length; i++) {
    if(hds[pais[i]]) hds[pais[i]]++
    else hds[pais[i]] = 1
  }
  var max = 0;
  for(key in hds) {
    if(hds[key] > max) max = hds[key]
  }
  var totalcount = max + numOfHun
  if(totalcount >=4) return true
  return false
}
