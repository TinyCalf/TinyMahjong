"use strict";
cc._RFpush(module, 'a7188emCMVCY7C3PDIM++Og', 'page_search_dealer_script');
// resources\prefabes\page_dealer\page_search_dealer_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        inputAccount: cc.EditBox,
        listItem: cc.Prefab,

        listContent: cc.Node,
        msg: cc.Label,
        prePage: cc.Node,
        nextPage: cc.Node,
        maxRows: 10,
        _curIdx: 0
    },

    onLoad: function onLoad() {
        this.msg.node.active = false;
        this.clearList();
        this.hidePageBtn();
    },

    /**================================================================================================ */
    searchAllDealer: function searchAllDealer(start) {

        var data = {
            token: cc.userdata.token,
            start: start,
            rows: this.maxRows
        };
        cc.http.sendRequest("/search_sub_dealers", data, this.searchAllBack.bind(this));
    },

    searchAllBack: function searchAllBack(ret) {
        console.log(ret);
        if (ret.errcode) {
            this.msg.node.active = true;
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
            this.msg.node.active = false;
            this.showResult(ret);
        }
    },

    searchDealer: function searchDealer(account) {
        if (!account || account == "") {
            return;
        }
        var data = {
            token: cc.userdata.token,
            account: account
        };
        cc.http.sendRequest("/get_sub_dealer_by_account", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);
        this.clearList();
        if (ret.errcode) {
            this.msg.node.active = true;
            if (ret.errcode == 12580) {
                cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                    this.node.dispatchEvent("exitLogin");
                });
            }
        } else {
            this.msg.node.active = false;
            this.showResult([ret]);
        }
    },

    showResult: function showResult(ret) {
        if (!ret) return;

        this.showPageBtn(this._curIdx, ret.length);
        this.clearList();
        var pre;
        ret.forEach(function (element) {
            pre = cc.instantiate(this.listItem);
            pre.getComponent("dealer_item_script").showInfo(element);
            pre.on("showDealerDetail", this.showDetail.bind(this));
            pre.parent = this.listContent;
        }, this);
    },

    showDetail: function showDetail(event) {
        if (event && event.detail) {
            cc.app.showPage("prefabes/page_detail/page_detail", 0, true, "查询代理", "page_detail_script", event.detail);
        }
        cc.log("show dealer detail");
    },

    /**================================================================================================ */
    onSearchOneClick: function onSearchOneClick() {
        var account = this.inputAccount.string;
        if (!account || account == "") {
            cc.alert.show("精准查询", "请输入代理ID。", 1);
        } else {
            this._curIdx = 0;
            this.hidePageBtn();
            this.searchDealer(account);
        }
    },

    onSearchPerClick: function onSearchPerClick() {
        this._curIdx -= this.maxRows;
        if (this._curIdx < 0) this._curIdx = 0;

        this.searchAllDealer(this._curIdx);
    },

    onSearchNextClick: function onSearchNextClick() {
        this._curIdx += this.maxRows;
        if (this._curIdx < 0) this._curIdx = 0;
        this.searchAllDealer(this._curIdx);
    },

    onSearchAllClick: function onSearchAllClick() {
        this._curIdx = 0;
        this.searchAllDealer(0);
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