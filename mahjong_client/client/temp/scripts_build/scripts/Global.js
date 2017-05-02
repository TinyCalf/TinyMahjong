"use strict";
cc._RFpush(module, '24e30ZJLgdH3rs1R1CvqN8U', 'Global');
// scripts\Global.js

var Global = cc.Class({
    "extends": cc.Component,
    statics: {
        isstarted: false,
        netinited: false,
        userguid: 0,
        nickname: "",
        money: 0,
        lv: 0,
        roomId: 0
    }
});

cc._RFpop();