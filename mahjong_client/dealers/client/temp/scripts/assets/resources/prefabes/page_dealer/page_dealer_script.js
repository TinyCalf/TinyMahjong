"use strict";
cc._RFpush(module, '505d4VYUJNAiZbqRGHvKYOw', 'page_dealer_script');
// resources\prefabes\page_dealer\page_dealer_script.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {},

    onSearchDealer: function onSearchDealer() {
        cc.app.showPage("prefabes/page_dealer/page_search_dealer", 0, true, "代理");
    },

    onCreateDealer: function onCreateDealer() {
        cc.app.showPage("prefabes/page_dealer/page_create_dealer", 0, true, "代理"); //"page_charge_user_script",{account:cc.user.account,target:123456}
    }

});

cc._RFpop();