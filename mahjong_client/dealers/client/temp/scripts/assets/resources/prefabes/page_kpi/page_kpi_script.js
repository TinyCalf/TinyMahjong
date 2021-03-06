"use strict";
cc._RFpush(module, '27eacosj21ETb/hIaohTPV1', 'page_kpi_script');
// resources\prefabes\page_kpi\page_kpi_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        title: cc.Label,
        year: cc.Label,
        listContent: cc.Node,
        listItem: cc.Prefab,
        msg: cc.Label,
        _curAccount: null,
        _curYear: null,
        _curData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.showMsg();
        this.title.string = "KPI";
        this._curYear = new Date().getFullYear();
        this.year.string = this._curYear;
    },
    /**=============================================================================================================== */
    onPreClick: function onPreClick() {
        this._curYear--;
        this.year.string = this._curYear;
        this.searchInfo();
    },

    onNextClick: function onNextClick() {
        this._curYear++;
        this.year.string = this._curYear;
        this.searchInfo();
    },

    /**=============================================================================================================== */
    init: function init(account) {
        this._curAccount = account;
        this.searchInfo(account);
    },

    searchInfo: function searchInfo() {
        if (!this._curAccount) {
            this.showMsg("查询数据错误");
            return;
        } else {
            this.title.String = "KPI:" + this._curAccount;
        }

        this.cleanList();

        this._targetData = null;
        var data = {
            token: cc.userdata.token,
            account: this._curAccount,
            year: this._curYear
        };
        cc.http.sendRequest("/search_dealer_kpi", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);

        if (!ret.errcode || ret.errcode == 0) {
            if (ret.length == 0) {
                this.showMsg("暂无数据");
                return;
            }
            var pre;
            ret.forEach(function (element) {
                pre = cc.instantiate(this.listItem);
                pre.getComponent("kpi_item_script").showInfo(element);
                pre.parent = this.listContent;
            }, this);
        } else if (ret.errcode == 12580) {
            cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                this.node.dispatchEvent("exitLogin");
            });
        } else {
            this.showMsg("查询数据错误");
        }
    },

    /**=============================================================================================================== */
    showMsg: function showMsg(value) {
        this.msg.node.active = false;
        this.msg.string = "";
        if (value && value != "") {
            this.msg.string = value;
            this.msg.node.active = true;
        }
    },

    cleanList: function cleanList() {
        this.listContent.removeAllChildren();
    }
});

cc._RFpop();