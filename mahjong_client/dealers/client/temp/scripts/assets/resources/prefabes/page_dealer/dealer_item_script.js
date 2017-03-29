"use strict";
cc._RFpush(module, '5ee95dYpiFPM7vsmB5l156o', 'dealer_item_script');
// resources\prefabes\page_dealer\dealer_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        account: cc.Label,
        dealerName: cc.Label,
        curGems: cc.Label,
        curSubs: cc.Label,
        _curInfo: null
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showInfo: function showInfo(infovalue) {
        if (!infovalue) {
            return;
        }

        this._curInfo = infovalue;
        this.account.string = infovalue.account;
        this.dealerName.string = infovalue.name;
        this.curGems.string = infovalue.gems;
        this.curSubs.string = infovalue.all_subs;
    },

    onEnterInto: function onEnterInto() {
        if (this._curInfo) this.node.emit("showDealerDetail", this._curInfo.account);
    }
});

cc._RFpop();