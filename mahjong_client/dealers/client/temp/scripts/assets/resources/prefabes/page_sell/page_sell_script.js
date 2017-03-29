"use strict";
cc._RFpush(module, '0a31bTvKepA26uPhncelFP8', 'page_sell_script');
// resources\prefabes\page_sell\page_sell_script.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    /**prefab,index,showBack,name,scriptName,detail,single,store*/
    onChargeUser: function onChargeUser() {
        cc.app.showPage("prefabes/page_sell/page_charge_user", 0, true, "售卡");
    },

    onChargeDealer: function onChargeDealer() {
        cc.app.showPage("prefabes/page_sell/page_charge_dealer", 0, true, "售卡"); //"page_charge_user_script",{account:cc.user.account,target:123456}
    },

    onFreshInfo: function onFreshInfo() {}

});

cc._RFpop();