"use strict";
cc._RFpush(module, 'c9a06NuyO9KtoF2OrPNriZ+', 'kpi_item_script');
// resources\prefabes\page_kpi\kpi_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        month: cc.Label,
        gems: cc.Label,
        score: cc.Label,
        subs: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.cleanInfo();
    },

    showInfo: function showInfo(data) {
        this.month.string = "" + (data.month + 1);
        this.gems.string = data.gems;
        this.score.string = data.score;
        this.subs.string = data.subs;
    },

    cleanInfo: function cleanInfo() {
        this.month.string = "";
        this.gems.string = "";
        this.score.string = "";
        this.subs.string = "";
    }

});

cc._RFpop();