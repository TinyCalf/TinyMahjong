var checkHu = require("./checkHu")

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

remove = function(arr, val) {
  for(var i=0 ; i < arr.length ; i++) {
    if(arr[i] == val){
      arr.splice(i, 1)
      i--;
    }
  }
}

removeOne = function(arr,val) {
  for(var i=0 ; i < arr.length ; i++) {
    if(arr[i] == val){
      arr.splice(i, 1)
      i--;
      return true
    }
  }
  return false
}

/*
判断对对胡
每个坎子去掉混以后都是一种类型
*/
exports.isDuiDuiHu = (gameSeatData,hun) => {
  var kanzi = gameSeatData.kanzi
  for(var i=0 ; i < kanzi.length ; i++) {
    var thiskan = [].concat(kanzi[i])
    if(hun) remove(thiskan,hun)
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
  if(hun) remove(pais,hun)
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
  if(hun) remove(pais,hun)
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
    // .concat(gameSeatData.angangs)
    // .concat(gameSeatData.wangangs)
    // .concat(gameSeatData.diangangs)
    // .concat(gameSeatData.pengs)
  //提取混的数量
  var numOfHun = 0
  if(hun){
    for(var i=0 ; i<pais.length ; i ++) {
      if(pais[i] == hun ) numOfHun++
    }
  }
  //if(hun) remove(pais,hun)
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
  var longtype = -1;
  if(numOfHun + types[0].length >= 9) longtype = 0
  if(numOfHun + types[1].length >= 9) longtype = 1
  if(numOfHun + types[2].length >= 9) longtype = 2
  if(longtype==-1) return false
  var sd = {};
  sd.holds = [].concat(gameSeatData.holds)
  // for(var i=0;i<3;i++){
  //   if(gameSeatData.angangs) sd.holds = sd.holds.concat(gameSeatData.angangs)
  //   if(gameSeatData.wangangs) sd.holds = sd.holds.concat(gameSeatData.wangangs)
  //   if(gameSeatData.diangangs) sd.holds = sd.holds.concat(gameSeatData.diangangs)
  //   if(gameSeatData.pengs) sd.holds = sd.holds.concat(gameSeatData.pengs)
  // }
  sd.countMap = {}
  for(i in sd.holds) {
    if(!sd.countMap[sd.holds[i]]){
      sd.countMap[sd.holds[i]] = 1;
    }else{
      sd.countMap[sd.holds[i]] ++
    }
  }
  console.log(sd)
  if(longtype==0){
    for(var i = 0 ; i < 9 ; i++) {
      if(!removeOne(sd.holds,i)) {removeOne(sd.holds,hun); sd.countMap[hun] --;}
      if(sd.countMap[i]>0) sd.countMap[i] --
    }
  }
  if(longtype==1){
    for(var i = 9 ; i < 18 ; i++) {
      if(!removeOne(sd.holds,i)) {removeOne(sd.holds,hun); sd.countMap[hun] --;}
      if(sd.countMap[i]>0) sd.countMap[i] --
    }
  }
  if(longtype==2){
    for(var i = 18 ; i < 27 ; i++) {
      if(!removeOne(sd.holds,i)) {removeOne(sd.holds,hun); sd.countMap[hun] --;}
      if(sd.countMap[i]>0) sd.countMap[i] --
    }
  }
  console.log(sd)
  if(checkHu.checkCanHu(sd,hun)) {
    return true
  }
  return false;
}

// var data = {
//   holds:[9,10,11,30,31,31,0,1,2,4,5,6,7,8],
//   angangs:[],
//   wangangs:[],
//   diangangs:[],
//   pengs:[],
// }
//
// console.log(this.isLong(data,31))


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
  if(hun) remove(pais, hun)
  console.log(pais)
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

// var data = {
//   holds:[27,27,27,2,2],
//   angangs:[],
//   wangangs:[],
//   diangangs:[],
//   pengs:[],
// }
//
// console.log(this.isFengQing(data,2))

/*
判断炸7对 7对本身由胡法来判定 该算法基于7对的基础上使用
混子数量 - 落单牌的数量 >= 2 才是混
或者有四张一样的排
*/
exports.isZha7dui = (gameSeatData,hun) => {
  //提取混的数量
  var numOfHun = 0
  if(hun){
    for(var i=0 ; i<gameSeatData.holds.length ; i ++) {
      if(gameSeatData.holds[i] == hun ) numOfHun++
    }
    for(var key in gameSeatData.countMap){
      if(key!=hun && gameSeatData.countMap[key]==1) numOfHun--
    }
  }
  for(var key in gameSeatData.countMap){
    if( gameSeatData.countMap[key]==4) return true;
    if( gameSeatData.countMap[key]==3 && numOfHun>=1) return true;
    if( gameSeatData.countMap[key]==2 && numOfHun>=2) return true;
    if( gameSeatData.countMap[key]==1 && numOfHun>=3) return true;
  }
  return false
}


// var data = {
//   holds:[5,5,8,8,11,11,13,13,14,14,17,17,31,31],
//   angangs:[],
//   wangangs:[],
//   diangangs:[],
//   pengs:[],
//   countMap:{
//     5:2,
//     8:2,
//     11:2,
//     13:2,
//     14:2,
//     17:2,
//     31:2,
//   }
// }
//
// console.log(this.isZha7dui(data,5))
