"use strict";
cc._RFpush(module, 'ec62aKxG+ZC2ZoOIMbZ5pvG', 'notice_item_script');
// resources\prefabes\page_notice\notice_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        title: cc.Label,
        content: cc.RichText,
        time: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showInfo: function showInfo(info) {
        if (!info) return;
        this.title.string = info.title;
        this.content.string = info.content;

        var t = new Date();
        t.setTime(info.act_time);
        this.time.string = t.toLocaleString();
    }
});

cc._RFpop();