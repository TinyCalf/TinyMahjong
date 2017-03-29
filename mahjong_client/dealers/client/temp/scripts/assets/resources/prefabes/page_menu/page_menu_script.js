"use strict";
cc._RFpush(module, '7e288XplJpEoIGXy3F2zwP7', 'page_menu_script');
// resources\prefabes\page_menu\page_menu_script.js

var MENU_ITEM = require("menu_item_script");
cc.Class({
    "extends": cc.Component,

    properties: {
        menus: {
            "default": [],
            type: MENU_ITEM
        },
        _curState: -1
    },

    onLoad: function onLoad() {
        this.menus.forEach(function (element) {
            element.isOn = false;
            element.node.on("change", this.onSelectChange.bind(this));
        }, this);
        this._curState = -1;
        // this.setSeletMenu(_curState);
    },

    start: function start() {
        this.setSeletMenu(0);
    },

    onSelectChange: function onSelectChange(event) {

        var olds = this.menus[this._curState];
        olds.isOn = false;

        var targ = event.target;
        var indx = this.menus.indexOf(targ.getComponent("menu_item_script"));
        this.setSeletMenu(indx);
    },

    setSeletMenu: function setSeletMenu(index) {
        if (this._curState == index || index < 0 || index >= this.menus.length) return;

        this._curState = index;
        this._updateState();
        cc.app.removePage(0, 0);
        /**prefab,index,showBack,name,scriptName,detail,single,store*/
        switch (this._curState) {
            case 0:
                cc.app.showPage("prefabes/page_index/page_index", 0, false, null, null, null, true);
                break;
            case 1:
                cc.app.showPage("prefabes/page_shop/page_shop", 0, false, null, null, null, true);
                break;
            case 2:
                cc.app.showPage("prefabes/page_sell/page_sell", 0, false, null, null, null, true);
                break;
            case 3:
                cc.app.showPage("prefabes/page_dealer/page_dealer", 0, false, null, null, null, true);
                break;
            case 4:
                cc.app.showPage("prefabes/page_mine/page_mine", 0, false, null, "page_mine_script", cc.userdata.account, null, true);
                break;
        }
    },

    _updateState: function _updateState() {
        if (this._curState < 0 || this._curState >= this.menus.length) return;

        for (var index = 0; index < this.menus.length; index++) {

            if (index == this._curState) {
                this.menus[index].isOn = true;
                continue;
            }
            this.menus[index].isOn = false;
        }
    }

});

cc._RFpop();