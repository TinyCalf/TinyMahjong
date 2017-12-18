
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
    case 30: pei = 28; break;

    case 31: pei = 32; break;
    case 32: pei = 33; break;
    case 33: pei = 31; break;
  }
  return [ban,pei]
}

//console.log(this.getBanZiAndPeiZi())
