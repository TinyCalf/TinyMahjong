//判斷邊
function isBian (seatData) {
    console.log("開始判斷邊");
    console.log(seatData.holds);
    //去掉 胡的牌 以及 胡的牌的邊牌任然能胡，則為邊
    var holds = seatData.holds;
    var hupai = holds[holds.length-1];
    if(hupai != 2
        &&hupai != 11
        &&hupai != 20
        &&hupai != 6
        &&hupai != 15
        &&hupai != 24) {
        console.log(hupai);
        return false;
    }

    var pailist = [];
    pailist.push(hupai);
    if(hupai == 2)  { pailist.push(0,1)}
    if(hupai == 11) { pailist.push(10,9)}
    if(hupai == 20) { pailist.push(19,18)}
    if(hupai == 6)  { pailist.push(7,8)}
    if(hupai == 15) { pailist.push(16,17)}
    if(hupai == 24) { pailist.push(25,26)}

    for (n=0;n<3;n++){
        if(seatData.countMap[pailist[n]] < 1 || seatData.countMap[pailist[n]] == null) {
            console.log(seatData.countMap[pailist[n]]);
            return false;
        }
    }
    return true;
    // //克隆對象的低級方法
    // var sd = {};
    // sd.countMap = JSON.parse(JSON.stringify(seatData.countMap));
    // sd.holds = [].concat(seatData.holds);
    // //去掉三張牌
    // for ( var n = 0 ; n < sd.holds.length ; n++ ) {
    //     if(sd.holds[n] == pailist[0]
    //         || sd.holds[n] == pailist[1]
    //         ||sd.holds[n] == pailist[2] ) {
    //         sd.holds.splice(n,1);
    //     }
    // }
    // sd.countMap[pailist[0]] --;
    // sd.countMap[pailist[1]] --;
    // sd.countMap[pailist[2]] --;
    // //判斷剩下的牌能否胡
    // console.log(sd.holds);
    // console.log(sd.countMap);
    // var flag = mjutils.canHu(sd);
    // console.log(flag);
    // return flag;
}

var seatData = {};
seatData.holds = [ 9, 25, 9, 26, 24 ];
seatData.countMap = {};
seatData.countMap[9] = 2;
seatData.countMap[25] = 1;
seatData.countMap[26] = 1;
seatData.countMap[24] = 1;
console.log(isBian(seatData));
