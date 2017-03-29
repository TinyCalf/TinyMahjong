"use strict";
cc._RFpush(module, 'a6d64c1Ku9NP7bJu0CmUs1s', 'App');
// app\App.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        cc.app = this;
    },

    start: function start() {
        cc.log("App started...");

        // cc.app.showPage("prefabes/login/normal",0,true,"测试",null,null,true,false);
        // cc.app.showPage("prefabes/page_login/page_login",0,false,null,null,null,true,false);
        cc.app.cleanAllLayers();
        cc.app.showPage("prefabes/page_login/page_login", 2);
    },

    init: function init() {
        cc.user = {};
    },

    /**prefab,index,showBack,name,scriptName,detail,single,store*/
    showPage: function showPage(prefab, index, showBack, name, scriptName, detail, single, store) {
        var info = {
            path: prefab,
            layerIndex: index,
            showBack: showBack,
            backName: name,
            scriptName: scriptName,
            detail: detail,
            single: single,
            store: store
        };
        var event = new cc.Event.EventCustom(cc.page.SHOW_PAGE, true);
        event.detail = info;
        this.node.dispatchEvent(event);
    },

    backPage: function backPage() {
        var event = new cc.Event.EventCustom(cc.page.BACK_PAGE, true);
        this.node.dispatchEvent(event);
    },

    removePage: function removePage(layerIndex, removeNum) {
        var info = {
            layerIndex: layerIndex,
            removeNum: removeNum
        };
        var event = new cc.Event.EventCustom(cc.page.REMOVE_PAGE, true);
        event.detail = info;
        this.node.dispatchEvent(event);
    },

    cleanAllLayers: function cleanAllLayers() {
        var event = new cc.Event.EventCustom(cc.page.CLEAN_ALL_LAYERS, true);
        this.node.dispatchEvent(event);
    }

});

cc._RFpop();