"use strict";
cc._RFpush(module, 'fbcea+Puj1FJ4vY92NyxLzP', 'page_shop_log_script');
// resources\prefabes\page_shop_log\page_shop_log_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        options: cc.Node,
        prePage: cc.Node,
        nextPage: cc.Node,
        listContent: cc.Node,
        listItem: cc.Prefab,
        msg: cc.Label,
        maxRows: 10,
        _curIdx: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.clearList();
        this.hidePageBtn();
        this.searchLogs();
    },

    /**================================================================================================ */
    searchAllLog: function searchAllLog(start) {

        var data = {
            token: cc.userdata.token,
            start: start,
            rows: this.maxRows
        };
        cc.http.sendRequest("/get_buy_goods_log", data, this.searchAllBack.bind(this));
    },

    searchAllBack: function searchAllBack(ret) {
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
            // cc.alert.show("查询","查询成功")
            this.showResult(ret);
        }
    },

    showResult: function showResult(ret) {
        if (!ret) return;

        this.showPageBtn(this._curIdx, ret.length);
        this.clearList();

        this.msg.node.active = false;
        if (ret.length == 0) {
            this.msg.node.active = true;
        }

        var pre;
        ret.forEach(function (element) {
            pre = cc.instantiate(this.listItem);
            pre.getComponent("shop_log_item_script").showInfo(element);
            pre.parent = this.listContent;
        }, this);
    },

    searchLogs: function searchLogs() {
        this._curIdx = 0;
        this.searchAllLog(0);
    },

    onSearchPerClick: function onSearchPerClick() {
        this._curIdx -= this.maxRows;
        if (this._curIdx < 0) this._curIdx = 0;

        this.searchAllLog(this._curIdx);
    },

    onSearchNextClick: function onSearchNextClick() {
        this._curIdx += this.maxRows;
        if (this._curIdx < 0) this._curIdx = 0;
        this.searchAllLog(this._curIdx);
    },
    /**================================================================================ */
    showPageBtn: function showPageBtn(start, curRows) {
        this.hidePageBtn();
        if (start >= this.maxRows) {
            this.prePage.active = true;
        }

        if (curRows >= this.maxRows) {
            this.nextPage.active = true;
        }
    },

    hidePageBtn: function hidePageBtn() {
        this.prePage.active = false;
        this.nextPage.active = false;
    },

    clearList: function clearList() {
        this.listContent.removeAllChildren();
    }

});

cc._RFpop();