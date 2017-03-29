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