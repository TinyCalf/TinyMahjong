exports.isQingYiSe = (gameSeatData,hun) => {
  if(hun)
  gameSeatData.holds.find( pai => {
    //return pai != hun
    return pai > 6
  })

  console.log(gameSeatData.holds)

  // var type = getMJType(gameSeatData.holds[0]);
  // if(!isSameType(type,gameSeatData.holds)){
  //     return false;
  // }
  // if(!isSameType(type,gameSeatData.angangs)){
  //     return false;
  // }
  // if(!isSameType(type,gameSeatData.wangangs)){
  //     return false;
  // }
  // if(!isSameType(type,gameSeatData.diangangs)){
  //     return false;
  // }
  // if(!isSameType(type,gameSeatData.pengs)){
  //     return false;
  // }
  // return true;
}

var data = {
  holds:[0,1,2,3,4,5,6,7,8,9,10,11,12,12]
}

this.isQingYiSe(data,11)
