var checkHu = require("./checkHu")


console.log("ABC XX")
var seatData1 = {
  countMap:{
    0:1,
    1:1,
    2:1,
    3:2,
  },
  holds:[0,1,2,3,3],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData1,5)
console.log(ret)
var ret = checkHu.checkCanHu(seatData1)
console.log(ret)


console.log("AAA XX")
var seatData1 = {
  countMap:{
    0:3,
    3:2,
  },
  holds:[0,0,0,3,3],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData1,5)
console.log(ret)
var ret = checkHu.checkCanHu(seatData1)
console.log(ret)




console.log("AAA XH")
var seatData = {
  countMap:{
    0:3,
    3:1,
    5:1
  },
  holds:[0,0,0,3,5],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)



console.log("AAH XH")
var seatData = {
  countMap:{
    0:2,
    3:1,
    5:2
  },
  holds:[0,0,5,3,5],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)



console.log("AAH XX")
var seatData = {
  countMap:{
    0:2,
    3:2,
    5:1
  },
  holds:[0,0,3,3,5],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)



console.log("AH A-1 XX")
var seatData = {
  countMap:{
    0:1,
    1:1,
    3:2,
    5:1
  },
  holds:[0,1,3,3,5],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)

console.log("AH A-2 XX")
var seatData = {
  countMap:{
    0:1,
    2:1,
    3:2,
    5:1
  },
  holds:[0,2,3,3,5],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)



console.log("AH A-2 XX")
var seatData = {
  countMap:{
    0:1,
    2:1,
    3:2,
    5:1
  },
  holds:[0,2,3,3,5],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)


console.log("A A+1 A+2 XX")
var seatData = {
  countMap:{
    0:1,
    1:1,
    2:1,
    3:2
  },
  holds:[0,1,2,3,3],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)


console.log("A A+1 A+2 XX")
var seatData = {
  countMap:{
    0:1,
    1:1,
    2:1,
    3:2
  },
  holds:[0,1,2,3,3],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)

console.log("A A+1 A+2 XX")
var seatData = {
  countMap:{
    0:2,
    1:2,
    2:2,
    3:2
  },
  holds:[0,0,1,1,2,2,3,3],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)


console.log("A A+1 A+2 XX")
var seatData = {
  countMap:{
    3:1,
    5:2,
    9:1,
    10:1,
    11:2,
    12:1,
  },
  holds:[9,10,11,11,12,5,5,3],
  kanzi:[],
}
var ret = checkHu.checkCanHu(seatData,5)
console.log(ret)
