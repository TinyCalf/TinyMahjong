"use strict";
cc._RFpush(module, '4cfa97rxm9MrYHwNxG+yt+z', 'page_notice_script');
// resources\prefabes\page_notice\page_notice_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        listContent: cc.Node,
        listItem: cc.Prefab,
        msg: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.clearContent();
        this.getNotice();
    },

    getNotice: function getNotice() {
        var data = {
            token: cc.userdata.token
        };
        cc.http.sendRequest("/get_notice", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);
        if (ret.errcode) {
            if (ret.errcode == 12580) {
                cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                    this.node.dispatchEvent("exitLogin");
                });
                return;
            } else {
                cc.alert.show("查询代理", "服务器异常，请稍后再试！", 1);
                return;
            }
        } else {
            this.showResult(ret);
        }
    },

    showResult: function showResult(ret) {

        this.clearContent();
        if (!ret) return;
        if (ret.length == 0) {
            this.msg.node.active = true;
            return;
        }
        this.msg.node.active = false;
        var pre;
        ret.forEach(function (element) {
            pre = cc.instantiate(this.listItem);
            pre.getComponent("notice_item_script").showInfo(element);
            pre.parent = this.listContent;
        }, this);
    },

    clearContent: function clearContent() {
        this.listContent.removeAllChildren();
    }

});

cc._RFpop();