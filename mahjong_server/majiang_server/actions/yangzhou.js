
//获取搬子和混
exports.getBanZiAndPeiZi = () => {
  var ban = parseInt(Math.random()*33)
  var pei = -1
  switch(ban){
    case 0: pei = 1; break;
    case 1: pei = 2; break;
    case 2: pei = 3; break;
    case 3: pei = 4; break;
    case 4: pei = 5; break;
    case 5: pei = 6; break;
    case 6: pei = 7; break;
    case 7: pei = 8; break;
    case 8: pei = 0; break;

    case 9: pei = 10; break;
    case 10: pei = 11; break;
    case 11: pei = 12; break;
    case 12: pei = 13; break;
    case 13: pei = 14; break;
    case 14: pei = 15; break;
    case 15: pei = 16; break;
    case 16: pei = 17; break;
    case 17: pei = 9; break;

    case 18: pei = 19; break;
    case 19: pei = 20; break;
    case 20: pei = 21; break;
    case 21: pei = 22; break;
    case 22: pei = 23; break;
    case 23: pei = 24; break;
    case 24: pei = 25; break;
    case 25: pei = 26; break;
    case 26: pei = 18; break;

    case 27: pei = 28; break;
    case 28: pei = 29; break;
    case 29: pei = 30; break;
    case 30: pei = 27; break;

    case 31: pei = 32; break;
    case 32: pei = 33; break;
    case 33: pei = 31; break;
  }
  return [ban,pei]
}

//console.log(this.getBanZiAndPeiZi())


//计算是否符合底分2人条件(结束时)
exports.isEndofDifen = (difentype, scores) => {
  var poorguynum = 0
  if(difentype == 0) {
    for(var i=0;i<4;i++){
      if(scores[i]<=-20) poorguynum++
    }
  }
  if(difentype == 1) {
    for(var i=0;i<4;i++){
      if(scores[i]<=-30) poorguynum++
    }
  }
  if(difentype == 2) {
    for(var i=0;i<4;i++){
      if(scores[i]<=-50) poorguynum++
    }
  }
  if(poorguynum>=2) return true;
  return false;
}

//计算是否符合底分2人条件(中途)
exports.isEndofDifen0 = (game) => {
  var poorguynum = 0
  var difentype = game.conf.difen
  if(difentype == 0) {
    for(var i=0;i<4;i++){
      if(game.seats[i].totalscore<=-20) poorguynum++
    }
  }
  if(difentype == 1) {
    for(var i=0;i<4;i++){
      if(game.seats[i].totalscore<=-30) poorguynum++
    }
  }
  if(difentype == 2) {
    for(var i=0;i<4;i++){
      if(game.seats[i].totalscore<=-50) poorguynum++
    }
  }
  if(poorguynum>=2) return true;
  return false;
}

//有底分情况下的扣分
exports.koufen = (game, addindex, reduceindex, score) => {
  var difen = -20;
  if(game.conf.difen==1) difen=-30;
  if(game.conf.difen==2) difen=-40;
  var add = game.seats[addindex];
  var reduce = game.seats[reduceindex];
  //扣分的人的分数与底分之间的差距
  var distance = reduce.totalscore - difen
  if(distance < score){
    add.totalscore += distance
    reduce.totalscore -= distance
    add.score += distance
    reduce.score -= distance
  }else{
    add.totalscore += score
    reduce.totalscore -= score
    add.score += score
    reduce.score -= score
  }

}
