require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"App":[function(require,module,exports){
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
},{}],"HTTP":[function(require,module,exports){
"use strict";
cc._RFpush(module, '32c0b6pdkRFp7IZx8EoySFA', 'HTTP');
// core\HTTP.js

var URL = "http://127.0.0.1:12580";
//var URL = "http://120.24.59.70:12580";

var HTTP = cc.Class({
    "extends": cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendRequest: function sendRequest(path, data, handler, extraUrl) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for (var k in data) {
                if (str != "?") {
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            if (extraUrl == null) {
                extraUrl = HTTP.url;
            }
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            xhr.open("GET", requestURL, true);
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if (handler !== null) {
                            handler(ret);
                        } /* code */
                    } catch (e) {
                        console.log(e);
                    } finally {
                        if (cc.vv && cc.vv.wc) {
                            //       cc.vv.wc.hide();   
                        }
                    }
                }
            };
            if (cc.vv && cc.vv.wc) {
                //cc.vv.wc.show();
            }
            xhr.send();
        }
    }
});

cc._RFpop();
},{}],"core":[function(require,module,exports){
"use strict";
cc._RFpush(module, '801ccCg1qJHGo8NVrPS1Krf', 'core');
// core\core.js

cc.Class({
    "extends": cc.Component,

    // 页面名称，显示层级，是否显示回退，回退名称，
    // 点击回退则删除当前层级的最后一个子对象。
    // 层级 ：回退名称
    properties: {
        layers: {
            "default": [],
            type: cc.Node
        },
        back: cc.Button,
        backName: cc.Label,
        _backInfo: [],
        _curInfoIdx: 0,
        _loading: false
    },

    // use this for initialization
    onLoad: function onLoad() {

        cc.http = require("HTTP");

        cc.page = {
            SHOW_PAGE: "show_page",
            BACK_PAGE: "back_page",
            REMOVE_PAGE: "remove_page",
            CLEAN_ALL_LAYERS: "clean_all_layers"
        };

        this.initEventListener();
    },

    start: function start() {
        cc.log("框架初始完毕。。。");
    },

    initEventListener: function initEventListener() {
        this.node.on(cc.page.SHOW_PAGE, this.onShowPage.bind(this));
        this.node.on(cc.page.BACK_PAGE, this.onBackPage.bind(this));
        this.node.on(cc.page.REMOVE_PAGE, this.onRemovePage.bind(this));
        this.node.on(cc.page.CLEAN_ALL_LAYERS, this.cleanAllLayers.bind(this));
    },

    /** path, layerIndex,showBack,backName,single,store*/
    onShowPage: function onShowPage(info) {
        if (!info || !info.detail || this._loading) return;
        info = info.detail;

        var pageidx = info.layerIndex;
        if (pageidx < 0 || pageidx >= this.layers.length) return;

        this._backInfo.push(info);
        this._curInfoIdx = this._backInfo.length - 1;
        this._curPath = info.path;
        //加载prefab
        cc.loader.loadRes(info.path, (function (err, prefab) {
            if (prefab) {
                this._prefabLoaded(prefab);
            }
            if (err) {
                this._loading = false;
                cc.log(err);
            }
        }).bind(this));
        this._loading = true;
    },

    _prefabLoaded: function _prefabLoaded(prefab) {
        if (prefab) {
            this._loading = false;
            var curInfo = this._backInfo[this._curInfoIdx];

            var newNode = cc.instantiate(prefab);
            newNode.name = "page" + this._backInfo.length;

            var parent = this.layers[curInfo.layerIndex];
            if (curInfo.single) {
                parent.removeAllChildren();
            }
            parent.addChild(newNode);

            this.back.node.active = false;
            if (curInfo.showBack) {
                this.back.node.active = true;
                this.backName.string = curInfo.backName;
            }

            if (curInfo.scriptName && curInfo.scriptName != "") {
                newNode.getComponent(curInfo.scriptName).init(curInfo.detail);
            }
        }
    },

    onBackPage: function onBackPage(event) {
        var last = this._backInfo.pop();

        var parent = this.layers[last.layerIndex];
        parent.removeChild(parent.getChildByName("page" + (this._backInfo.length + 1)), true);

        //config pre
        this.back.node.active = false;
        last = this._backInfo[this._backInfo.length - 1];
        if (last) {
            if (last.showBack) {
                this.back.node.active = true;
                this.backName.string = last.backName;
            }
        }
    },

    /**删除某一层 的 N 个界面 */
    onRemovePage: function onRemovePage(event) {
        var info = event.detail;
        if (!info && info.layerIndex > this.layers.length) {
            return;
        }

        var cont = this.layers[info.layerIndex];
        if (info.removeNum < 1) {
            cont.removeAllChildren();
            return;
        }

        while (info.removeNum >= 1) {
            cont.removeChild(cont.children[cont.children.length - 1]);
            info.removeNum -= 1;
        }
    },

    cleanAllLayers: function cleanAllLayers() {
        this._curInfoIdx = 0;
        this._backInfo = [];
        this._loading = false;
        this.layers.forEach(function (element) {
            element.removeAllChildren();
        }, this);
    }

    // onCleanAlert: function (info) {

    // },

    // onRestart: function (info) {

    // },

});

cc._RFpop();
},{"HTTP":"HTTP"}],"dealer_item_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5ee95dYpiFPM7vsmB5l156o', 'dealer_item_script');
// resources\prefabes\page_dealer\dealer_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        account: cc.Label,
        dealerName: cc.Label,
        curGems: cc.Label,
        curSubs: cc.Label,
        _curInfo: null
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showInfo: function showInfo(infovalue) {
        if (!infovalue) {
            return;
        }

        this._curInfo = infovalue;
        this.account.string = infovalue.account;
        this.dealerName.string = infovalue.name;
        this.curGems.string = infovalue.gems;
        this.curSubs.string = infovalue.all_subs;
    },

    onEnterInto: function onEnterInto() {
        if (this._curInfo) this.node.emit("showDealerDetail", this._curInfo.account);
    }
});

cc._RFpop();
},{}],"goods_item_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9bd14Q8ijJB165lKJvzOuf3', 'goods_item_script');
// resources\prefabes\page_shop\goods_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        icon: cc.Sprite,
        title: cc.Label,
        info: cc.Label,
        price: cc.Label,
        _curItem: null
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showInfo: function showInfo(item) {
        if (!item) {
            this._curItem = null;
            return;
        }
        this._curItem = item;

        //icon

        this.title.string = item.goods_name;
        if (item.goods_type == 1) {
            this.info.string = item.goods_num + " 房卡";
        } else if (item.goods_type == 2) {
            this.info.string = item.goods_num + " 金币";
        }

        if (item.price_type == 1) {
            this.price.string = item.goods_price + " 积分";
        } else if (item.price_type == 2) {
            this.price.string = item.goods_price + " 房卡";
        }
    },

    onBuyClick: function onBuyClick() {
        if (this._curItem) {
            this.node.emit("buyGoods", this._curItem);
        }
    }

});

cc._RFpop();
},{}],"kpi_item_script":[function(require,module,exports){
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
},{}],"menu_item_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '29f311ChOFEmKSMI5yiYqHD', 'menu_item_script');
// resources\prefabes\page_menu\menu_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        on: cc.Node,
        off: cc.Node,
        label: cc.Label,
        onColor: cc.Color,
        offColor: cc.Color,
        _isOn: false,
        isOn: {
            set: function set(value) {
                if (this._isOn != value) {
                    this._isOn = value;
                    this.updateState();
                }
            },
            get: function get() {
                return this._isOn;
            }
        }
    },

    onLoad: function onLoad() {
        this.updateState();
    },

    updateState: function updateState() {
        this.on.active = false;
        this.off.active = false;
        if (this.isOn) {
            this.on.active = true;
            this.label.node.color = this.onColor;
        } else {
            this.off.active = true;
            this.label.node.color = this.offColor;
        }
    },

    onClick: function onClick() {
        if (!this.isOn) {
            this.isOn = !this.isOn;
            this.node.emit("change", this.isOn);
        }
    }

});

cc._RFpop();
},{}],"notice_item_script":[function(require,module,exports){
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
},{}],"option_item_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f3ccbowaylLPI3uslpMjOGT', 'option_item_script');
// resources\prefabes\page_index\option_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        icons: {
            "default": [],
            type: cc.SpriteFrame
        },
        icon: cc.Sprite,
        iname: cc.Label,
        _optionInfo: null
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showInfo: function showInfo(info) {
        this._optionInfo = info;
        this.icon.spriteFrame = this.icons[info.icon];
        this.iname.string = this._optionInfo.name;
    },

    onEnterClick: function onEnterClick() {
        cc.log("选择了。。。。");
        cc.app.showPage(this._optionInfo.prefab, this._optionInfo.layerIndx, this._optionInfo.showBack, this._optionInfo.backName, this._optionInfo.scriptName, this._optionInfo.detail, this._optionInfo.single, this._optionInfo.store);

        // cc.app.showPage("prefabes/page_dealer/page_create_dealer",0,true,"代理");//"page_charge_user_script",{account:cc.user.account,target:123456}
    }

    // name:name,icon:icon,
    // prefab:prefab,
    // layerIndx:layerIndx,
    // showBack:showBack,backName:backName,
    // scriptName:scriptName,detail:detail,
    // single:single,
    // store:store
});

cc._RFpop();
},{}],"page_charge_dealer_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd0492SCA5BGt4CZy/nhRV1+', 'page_charge_dealer_script');
// resources\prefabes\page_sell\page_charge_dealer_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        inputUserID: cc.EditBox,
        msg: cc.Label,
        //search res
        searchResult: cc.Node,
        resUserID: cc.Label,
        resUserName: cc.Label,
        resUserGems: cc.Label,
        inputGems: cc.EditBox,
        //charge res
        mkChargeState: cc.Label,
        mkChargeTime: cc.Label,
        mkDetail: cc.Node,
        mkResult: cc.Node,
        mkUserID: cc.Label,
        mkUserName: cc.Label,
        mkUserGems: cc.Label,

        //
        _targetData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.searchResult.active = false;
        this.mkResult.active = false;
        this._targetData = null;
    },
    /**=========================================================================================== */

    onChargeUser: function onChargeUser() {
        if (!this._targetData) {
            return;
        }

        var num = this.inputGems.string;
        if (!num || num == "") {
            // cc.alert.show("错误","请出入充值房卡数额。",1);           
            this.msg = "请输入充值数额";
            return;
        }
        var data = {
            token: cc.userdata.token,
            account: this._targetData.account,
            num: num
        };
        cc.http.sendRequest("/transfer_gems2dealer", data, this.chargeBack.bind(this));
    },

    chargeBack: function chargeBack(ret) {
        console.log(ret);

        this.mkResult.active = true;
        this.mkDetail.active = false;
        this.mkChargeTime.string = new Date().toLocaleDateString();
        if (ret.errcode == 0) {
            // cc.alert.show("代理充值","为 "+ this._targetData.userid +" 充值成功，当前房卡变更为："+ret.targetgems+"。\n自身剩余："+ ret.gems ,1);           
            this.mkChargeState.string = "充值成功。";

            this.mkDetail.active = true;
            this.mkUserID.string = this._targetData.account;
            this.mkUserName.string = this._targetData.name;
            this.mkUserGems.string = ret.targetgems;
        } else if (ret.errcode == 12580) {
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");   
            // });
            this.mkChargeState.string = "登录状态异常，需要重新登录";
        } else if (ret.errcode == 4) {
            // cc.alert.show("代理充值","自身房卡不足，充值失败！",1);           
            this.mkChargeState.string = "自身房卡不足，充值失败！";
        } else if (ret.errcode == 5) {
            // cc.alert.show("代理充值","服务器繁忙，请稍后再试！",1); 
            this.mkChargeState.string = "服务器繁忙，请稍后再试！";
        } else {
            // cc.alert.show("代理充值","服务器异常，请稍后再试！",1);
            this.mkChargeState.string = "服务器异常，请稍后再试！";
        }
    },

    /**=========================================================================================== */
    onSearch: function onSearch() {
        var searchId = this.inputUserID.string;
        if (!searchId || searchId == "") {
            return;
        }
        this.doSearchUser(searchId);
    },

    doSearchUser: function doSearchUser(searchId) {
        this._targetData = null;
        this.msg.string = "查询中。。。";
        this.searchResult.active = false;
        var data = {
            token: cc.userdata.token,
            account: searchId
        };
        cc.http.sendRequest("/get_sub_dealer_by_account", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);

        if (ret.errcode == 0) {
            this.msg.string = "查询成功";

            this.resUserID.string = ret.account;
            this.resUserName.string = ret.name, this.resUserGems.string = ret.gems;

            this.inputGems.string = "";
            this._targetData = ret;

            this.searchResult.active = true;
        } else if (ret.errcode == 12580) {
            cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                this.node.dispatchEvent("exitLogin");
            });
        } else {
            this.msg.string = "未获得相关信息，请确认代理ID";
        }
    }

});

cc._RFpop();
},{}],"page_charge_user_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '92ea4/93J1GuYXpz1Lgj/2k', 'page_charge_user_script');
// resources\prefabes\page_sell\page_charge_user_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        inputUserID: cc.EditBox,
        msg: cc.Label,
        //search res
        searchResult: cc.Node,
        resUserID: cc.Label,
        resUserName: cc.Label,
        resUserGems: cc.Label,
        inputGems: cc.EditBox,
        //charge res
        mkChargeState: cc.Label,
        mkChargeTime: cc.Label,
        mkDetail: cc.Node,
        mkResult: cc.Node,
        mkUserID: cc.Label,
        mkUserName: cc.Label,
        mkUserGems: cc.Label,

        //
        _targetData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.searchResult.active = false;
        this.mkResult.active = false;
        this._targetData = null;
    },
    /**=========================================================================================== */

    onChargeUser: function onChargeUser() {
        if (!this._targetData) {
            return;
        }

        var num = this.inputGems.string;
        if (!num || num == "") {
            // cc.alert.show("错误","请出入充值房卡数额。",1);           
            this.msg = "请输入充值数额";
            return;
        }
        var data = {
            token: cc.userdata.token,
            userid: this._targetData.userid,
            num: num
        };
        cc.http.sendRequest("/transfer_gems2user", data, this.chargeBack.bind(this));
    },

    chargeBack: function chargeBack(ret) {
        console.log(ret);

        this.mkResult.active = true;
        this.mkDetail.active = false;
        this.mkChargeTime.string = new Date().toLocaleDateString();
        if (ret.errcode == 0) {
            // cc.alert.show("玩家充值","为 "+ this._targetData.userid +" 充值成功，当前房卡变更为："+ret.targetgems+"。\n自身剩余："+ ret.gems ,1);           
            this.mkChargeState.string = "充值成功。";

            this.mkDetail.active = true;
            this.mkUserID.string = this._targetData.userid;
            this.mkUserName.string = this._targetData.name;
            this.mkUserGems.string = ret.targetgems;
        } else if (ret.errcode == 12580) {
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");   
            // });
            this.mkChargeState.string = "登录状态异常，需要重新登录";
        } else if (ret.errcode == 4) {
            // cc.alert.show("玩家充值","自身房卡不足，充值失败！",1);           
            this.mkChargeState.string = "自身房卡不足，充值失败！";
        } else if (ret.errcode == 5) {
            // cc.alert.show("玩家充值","服务器繁忙，请稍后再试！",1); 
            this.mkChargeState.string = "服务器繁忙，请稍后再试！";
        } else {
            // cc.alert.show("玩家充值","服务器异常，请稍后再试！",1);
            this.mkChargeState.string = "服务器异常，请稍后再试！";
        }
    },

    /**=========================================================================================== */
    onSearch: function onSearch() {
        var searchId = this.inputUserID.string;
        if (!searchId || searchId == "") {
            return;
        }
        this.doSearchUser(searchId);
    },

    doSearchUser: function doSearchUser(searchId) {
        this._targetData = null;
        this.msg.string = "查询中。。。";
        this.searchResult.active = false;
        var data = {
            token: cc.userdata.token,
            userid: searchId
        };
        cc.http.sendRequest("/search_user", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);

        if (ret.errcode == 0) {
            this.msg.string = "查询成功";

            this.resUserID.string = ret.userid;
            this.resUserName.string = ret.name, this.resUserGems.string = ret.gems;

            this.inputGems.string = "";
            this._targetData = ret;

            this.searchResult.active = true;
        } else if (ret.errcode == 12580) {
            cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                this.node.dispatchEvent("exitLogin");
            });
        } else {
            this.msg.string = "未获得相关信息，请确认玩家ID";
        }
    }

});

cc._RFpop();
},{}],"page_create_dealer_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9b4acwHCatOvYhweodxXrDW', 'page_create_dealer_script');
// resources\prefabes\page_dealer\page_create_dealer_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        inputAccount: cc.EditBox,
        inputName: cc.EditBox,
        inputPwd: cc.EditBox,
        msg: cc.Label,
        result: cc.Node,
        state: cc.Label,
        infos: cc.Node,
        mkId: cc.Label,
        mkName: cc.Label,
        mkPwd: cc.Label,
        _temp: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg.string = "新增代理后，此代理自动成为自身下级代理。";
        this.hideResult();
    },

    /**========================================================================================================== */
    onCreateClick: function onCreateClick() {
        var phone = this.inputAccount.string;
        var name = this.inputName.string;
        var pwd = this.inputPwd.string;

        if (!phone || phone == "" || !name || name == "" || !pwd || pwd == "") {
            // cc.alert.show("错误","信息不完整，请检查信息。",1);
            this.msg.string = "信息不完整，请检查信息。";
        } else {

            this.hideResult();

            this._temp = {
                phone: phone,
                pwd: pwd,
                name: name
            };
            // cc.alert.show("新增代理","请确认信息：\n手机号：" + phone + "\n代理名称：" +name+ "\n初始密码：" +pwd ,0,this.doCreate.bind(this));
            this.doCreate(true);
        }
    },

    doCreate: function doCreate(result) {
        if (result && this._temp) {
            this.addDealer(this._temp.phone, this._temp.name, this._temp.pwd);
        }
    },

    /**========================================================================================================== */
    addDealer: function addDealer(phone, name, pwd) {
        if (!phone || phone == "" || !name || name == "" || !pwd || pwd == "") {
            this.msg = "输入信息不合法，请检查输入。";
            return;
        }

        var data = {
            token: cc.userdata.token,
            account: phone,
            password: pwd,
            name: name
        };
        cc.http.sendRequest("/create_dealer", data, this.addNewBack.bind(this));
    },

    addNewBack: function addNewBack(ret) {
        console.log(ret);
        this.result.active = true;
        this.infos.active = false;
        if (ret.errcode == 0) {
            this.state.string = "创建成功！(请妥善保管创建信息)";
            // this.resultInfo.string = "注册成功：\n手机号：" + this._temp.phone + "\n代理名称：" +this._temp.name+ "\n初始密码：" +this._temp.pwd ;
            this.mkId.string = this._temp.phone;
            this.mkName.string = this._temp.name;
            this.mkPwd.string = this._temp.pwd;

            this.infos.active = true;
        } else if (ret.errcode == 12580) {
            this.state.string = "登录状态异常，需要重新登录";
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");   
            // });
        } else if (ret.errcode == 1) {
                this.state.string = "创建失败，请尝试更换手机号或检查输入是否正确";
            } else {
                // cc.alert.show("新增代理","服务器异常，请稍后再试！",1);
                this.state.string = "服务器异常，请稍后再试！";
            }
    },

    /**==========================================================================================================*/

    onCopyClick: function onCopyClick() {
        if (this._temp) {
            var infos = "代理账号：\n";
            infos += "代理ID:" + this._temp.phone + "\n";
            infos += "代理名称:" + this._temp.name + "\n";
            infos += "初始密码:" + this._temp.pwd + "\n";
            this.copyTxt(infos);
        }
    },

    copyTxt: function copyTxt(value) {
        var clipboardBuffer = document.createElement('textarea');
        clipboardBuffer.style.cssText = 'position:fixed; top:-10px; left:-10px; height:0; width:0; opacity:0;';
        document.body.appendChild(clipboardBuffer);

        clipboardBuffer.focus();
        clipboardBuffer.value = value;
        clipboardBuffer.setSelectionRange(0, clipboardBuffer.value.length);
        var succeeded;
        try {
            succeeded = document.execCommand('copy');
        } catch (e) {
            cc.log("拷贝错误");
        }
        if (succeeded) {
            cc.log("成功拷贝");
        }
    },

    /**==========================================================================================================*/
    hideResult: function hideResult() {
        this.result.active = false;
    }

});

cc._RFpop();
},{}],"page_dealer_script":[function(require,module,exports){
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
},{}],"page_detail_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '01659r3NzRP7qyQ8jQgYJ/V', 'page_detail_script');
// resources\prefabes\page_detail\page_detail_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        title: cc.Label,
        account: cc.Label,
        gems: cc.Label,
        score: cc.Label,
        allGems: cc.Label,
        allScore: cc.Label,
        allSubs: cc.Label,

        options: cc.Node,

        _curAccount: null,
        _targetData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.title.string = "错误";
        this.options.active = false;
        this.defaultSeting();
    },

    init: function init(account) {
        this.searchInfo(account);
    },
    /**=====================================================================================================================*/

    onKpiClick: function onKpiClick() {
        //跳转到 kpi 界面
        /**prefab,index,showBack,name,scriptName,detail,single,store*/
        cc.app.showPage("prefabes/page_kpi/page_kpi", 0, true, "代理信息", "page_kpi_script", this._curAccount);
    },

    /**================================================================================================================== */
    searchInfo: function searchInfo(account) {
        this._curAccount = account;
        if (!this._curAccount) {
            this.title.string = "数据错误！";
            return;
        }
        this._targetData = null;
        var data = {
            token: cc.userdata.token,
            account: this._curAccount
        };
        cc.http.sendRequest("/search_dealer", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);

        if (!ret.errcode || ret.errcode == 0) {

            this._targetData = ret;

            this.title.string = ret.name;
            this.account.string = ret.account;
            this.gems.string = ret.gems, this.score.string = ret.score;

            this.allGems.string = ret.all_gems;
            this.allScore.string = ret.all_score;
            this.allSubs.string = ret.all_subs;

            this.options.active = true;
        } else if (ret.errcode == 12580) {
            cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                this.node.dispatchEvent("exitLogin");
            });
        } else {
            this.title.string = "数据错误";
        }
    },

    defaultSeting: function defaultSeting() {
        this.title.string = "";
        this.account.string = "";
        this.gems.string = "", this.score.string = "";

        this.allGems.string = "";
        this.allScore.string = "";
        this.allSubs.string = "";
    }

});

cc._RFpop();
},{}],"page_index_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0c9207JoXhHWrgQfd1iumoT', 'page_index_script');
// resources\prefabes\page_index\page_index_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        listContent: cc.Node,
        listItem: cc.Prefab,
        _myOptions: {
            "default": [],
            type: Object
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.addOptions(0, "公告", 0, "prefabes/page_notice/page_notice", 0, true, "首页");
        this.addOptions(0, "代理商城", 1, "prefabes/page_shop/page_shop", 0, true, "首页");

        this.addOptions(0, "查询代理", 2, "prefabes/page_dealer/page_search_dealer", 0, true, "首页");
        this.addOptions(0, "新增代理", 3, "prefabes/page_dealer/page_create_dealer", 0, true, "首页");

        this.addOptions(0, "玩家充卡", 4, "prefabes/page_sell/page_charge_user", 0, true, "首页");
        this.addOptions(0, "代理充卡", 5, "prefabes/page_sell/page_charge_dealer", 0, true, "首页");

        this.addOptions(0, "我的信息", 6, "prefabes/page_mine/page_mine", 0, true, "首页", "page_mine_script", cc.userdata.account);

        this.showItems();
    },

    showItems: function showItems() {
        this.clearList();

        var privilege = cc.userdata.privilege_level;
        var pre = null;
        this._myOptions.forEach(function (element) {
            if (privilege >= element.privilege) {
                pre = cc.instantiate(this.listItem);
                pre.getComponent("option_item_script").showInfo(element);
                pre.parent = this.listContent;
            }
        }, this);
    },

    //prefab,index,showBack,name,scriptName,detail,single,store
    addOptions: function addOptions(privilege, name, icon, prefab, layerIndx, showBack, backName, scriptName, detail, single, store) {
        this._myOptions.push({ privilege: privilege,
            name: name, icon: icon,
            prefab: prefab,
            layerIndx: layerIndx,
            showBack: showBack, backName: backName,
            scriptName: scriptName, detail: detail,
            single: single,
            store: store
        });
    },

    clearList: function clearList() {
        this.listContent.removeAllChildren();
    }

});

cc._RFpop();
},{}],"page_kpi_script":[function(require,module,exports){
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
},{}],"page_login_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0bd9dYxSqJG9rp70bxh0AXo', 'page_login_script');
// resources\prefabes\page_login\page_login_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        txt_account: cc.EditBox,
        txt_pwd: cc.EditBox,
        label_msg: cc.Label
    },

    onLoad: function onLoad() {
        var account = cc.sys.localStorage.getItem("account");
        var pwd = cc.sys.localStorage.getItem("password");
        var lastLogin = cc.sys.localStorage.getItem("lastLogin");
        if (!lastLogin) lastLogin = 0;
        //1小时失效
        if (account && pwd && Date.now() - lastLogin < 3600000) {
            this.doLogin(account, pwd);
        } else {
            cc.sys.localStorage.removeItem("password");
            this.showLogin(account);
        }

        this.showMsg();
    },

    showLogin: function showLogin(account) {
        this.txt_account.string = account || "";
        this.txt_pwd.string = "";
    },

    onBeginEdit: function onBeginEdit() {
        this.showMsg();
    },

    doLogin: function doLogin(uid, pwd) {
        var fn = function fn(ret) {
            if (ret.errcode === 0) {
                cc.log("登陆成功" + ret.name);
                cc.sys.localStorage.setItem("lastLogin", Date.now());
                cc.userdata = ret;
                cc.app.removePage(2, 0);
                cc.app.showPage("prefabes/page_index/page_index", 0, false);
            } else {
                cc.sys.localStorage.removeItem("account");
                cc.sys.localStorage.removeItem("password");
                this.showMsg("用户名或密码不正确！");
            }
        };

        var data = {
            account: uid,
            password: pwd
        };

        cc.sys.localStorage.setItem("account", data.account);
        cc.sys.localStorage.setItem("password", data.password);
        cc.sys.localStorage.setItem("lastLogin", 0);
        cc.http.sendRequest("/login", data, fn.bind(this));
    },

    showMsg: function showMsg(msg) {
        if (msg && msg != "") {
            this.label_msg.string = msg;
            this.label_msg.node.active = true;
            return;
        }
        this.label_msg.node.active = false;
    },

    onLoginBtnClick: function onLoginBtnClick() {
        var uid = this.txt_account.string;
        var pwd = this.txt_pwd.string;
        if (!uid || uid == "") {
            this.showMsg("请输入用户名!");
            return;
        }
        if (!pwd || pwd == "") {
            this.showMsg("请输入密码！");
            return;
        }
        this.doLogin(uid, pwd);
    }
});

cc._RFpop();
},{}],"page_menu_script":[function(require,module,exports){
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
},{"menu_item_script":"menu_item_script"}],"page_mine_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9fa15BnH/RBIKo6k3pmWhCw', 'page_mine_script');
// resources\prefabes\page_mine\page_mine_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        title: cc.Label,
        account: cc.Label,
        gems: cc.Label,
        score: cc.Label,
        allGems: cc.Label,
        allScore: cc.Label,
        allSubs: cc.Label,

        options: cc.Node,

        _curAccount: null,
        _targetData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.title.string = "错误";
        this.options.active = false;
        this.defaultSeting();
    },

    init: function init(account) {
        this.searchInfo(account);
    },
    /**=====================================================================================================================*/

    onKpiClick: function onKpiClick() {
        //跳转到 kpi 界面
        /**prefab,index,showBack,name,scriptName,detail,single,store*/
        cc.app.showPage("prefabes/page_kpi/page_kpi", 0, true, "我的信息", "page_kpi_script", this._curAccount);
    },

    onChangePwdClick: function onChangePwdClick() {
        cc.app.showPage("prefabes/page_pwd/page_pwd", 0, true, "我的信息");
    },

    onExitLoginClick: function onExitLoginClick() {
        cc.sys.localStorage.removeItem("account");
        cc.sys.localStorage.removeItem("password");
        cc.app.cleanAllLayers();
        cc.app.showPage("prefabes/page_login/page_login", 2);
    },

    /**================================================================================================================== */
    searchInfo: function searchInfo(account) {
        this._curAccount = account;
        if (!this._curAccount) {
            this.title.string = "数据错误！";
            return;
        }
        this._targetData = null;
        var data = {
            token: cc.userdata.token,
            account: this._curAccount
        };
        cc.http.sendRequest("/search_dealer", data, this.searchBack.bind(this));
    },

    searchBack: function searchBack(ret) {
        console.log(ret);

        if (!ret.errcode || ret.errcode == 0) {

            this._targetData = ret;

            this.title.string = ret.name;
            this.account.string = ret.account;
            this.gems.string = ret.gems, this.score.string = ret.score;

            this.allGems.string = ret.all_gems;
            this.allScore.string = ret.all_score;
            this.allSubs.string = ret.all_subs;

            this.options.active = true;
        } else if (ret.errcode == 12580) {
            cc.alert.show("提示", "登录状态异常，需要重新登录!", function () {
                this.node.dispatchEvent("exitLogin");
            });
        } else {
            this.title.string = "数据错误";
        }
    },

    defaultSeting: function defaultSeting() {
        this.title.string = "";
        this.account.string = "";
        this.gems.string = "", this.score.string = "";

        this.allGems.string = "";
        this.allScore.string = "";
        this.allSubs.string = "";
    }

});

cc._RFpop();
},{}],"page_notice_script":[function(require,module,exports){
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
},{}],"page_pwd_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f03d7oYg31Ar5XGrl+hlD7s', 'page_pwd_script');
// resources\prefabes\page_pwd\page_pwd_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        inputOld: cc.EditBox,
        inputNew: cc.EditBox,
        inputRenew: cc.EditBox,
        msg: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onChangeClick: function onChangeClick() {
        var old = this.inputOld.string;
        var newpwd = this.inputNew.string;
        var renew = this.inputRenew.string;

        if (!old || old == "" || !newpwd || newpwd == "" || !renew || renew == "") {
            this.msg.string = "数据不完整，请检查输入！";
            retrun;
        }

        if (newpwd != renew) {
            this.inputNew.string = "";
            this.inputRenew.string = "";
            this.msg.string = "两次新密码输入不同，请重新输入！";
            return;
        }
        this.cleanInput();
        this.doChange(old, newpwd);
    },

    doChange: function doChange(oldpwd, newpwd) {
        if (!oldpwd || oldpwd == "" || !newpwd || newpwd == "") {
            return;
        }
        var data = {
            token: cc.userdata.token,
            account: cc.userdata.account,
            oldpwd: oldpwd,
            newpwd: newpwd
        };
        cc.http.sendRequest("/change_own_pwd", data, this.changeBack.bind(this));
    },

    changeBack: function changeBack(ret) {
        console.log(ret);
        if (ret.errcode == 0) {
            this.msg.string = "修改成功！(请妥善保管密码信息)";
            //重新登录
            cc.sys.localStorage.removeItem("account");
            cc.sys.localStorage.removeItem("password");
            cc.app.cleanAllLayers();
            cc.app.showPage("prefabes/page_login/page_login", 2);
        } else if (ret.errcode == 12580) {
            this.msg.string = "登录状态异常，需要重新登录";
            // cc.alert.show("提示","登录状态异常，需要重新登录!",function(){
            //     this.node.dispatchEvent("exitLogin");   
            // });
        } else if (ret.errcode == 1) {
                this.msg.string = "修改失败！请检查原密码是否正确";
            } else {
                // cc.alert.show("新增代理","服务器异常，请稍后再试！",1);
                this.msg.string = "服务器异常，请稍后再试！";
            }
    },

    cleanInput: function cleanInput() {
        this.inputOld.string = "";
        this.inputNew.string = "";
        this.inputRenew.string = "";
    }

});

cc._RFpop();
},{}],"page_search_dealer_script":[function(require,module,exports){
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
},{}],"page_sell_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0a31bTvKepA26uPhncelFP8', 'page_sell_script');
// resources\prefabes\page_sell\page_sell_script.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    /**prefab,index,showBack,name,scriptName,detail,single,store*/
    onChargeUser: function onChargeUser() {
        cc.app.showPage("prefabes/page_sell/page_charge_user", 0, true, "售卡");
    },

    onChargeDealer: function onChargeDealer() {
        cc.app.showPage("prefabes/page_sell/page_charge_dealer", 0, true, "售卡"); //"page_charge_user_script",{account:cc.user.account,target:123456}
    },

    onFreshInfo: function onFreshInfo() {}

});

cc._RFpop();
},{}],"page_shop_log_script":[function(require,module,exports){
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
},{}],"page_shop_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'baaa1kTFRJJg6jcGWPfbqi4', 'page_shop_script');
// resources\prefabes\page_shop\page_shop_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        listContent: cc.Node,
        listItem: cc.Prefab,
        msg: cc.Label,
        _curAccount: null,
        _targetData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg.string = "";
        this.clearList();
        this.searchGoods();
    },

    /**================================================================================================================*/

    searchGoods: function searchGoods() {
        var data = {
            token: cc.userdata.token
        };
        cc.http.sendRequest("/get_goods", data, this.searchGoodsBack.bind(this));
    },

    searchGoodsBack: function searchGoodsBack(ret) {
        if (!ret) return;

        this.clearList();
        var pre;
        ret.forEach(function (element) {
            pre = cc.instantiate(this.listItem);
            pre.getComponent("goods_item_script").showInfo(element);
            pre.on("buyGoods", this.onBuyGoods.bind(this));
            pre.parent = this.listContent;
        }, this);
    },

    onBuyGoods: function onBuyGoods(event) {
        var det = event.detail;
        if (!det) return;
        cc.log("buy goods" + det);
        var data = {
            token: cc.userdata.token,
            id: det.id
        };
        cc.http.sendRequest("/buy_goods", data, this.buyBack.bind(this));
    },

    buyBack: function buyBack(ret) {
        if (!ret) return;
        if (ret.errcode == 0) {
            if (ret.goods_type == 1) {
                this.msg.string = "购买成功！获得：" + ret.goods_num + "房卡";
            } else if (ret.goods_type == 2) {
                this.msg.string = "购买成功！获得：" + ret.goods_num + "金币";
            }
        } else if (ret.errcode == 1) {
            this.msg.string = "数据错误，请稍后再试";
        } else if (ret.errcode == 2) {
            this.msg.string = "货币不足，购买失败！";
        } else if (ret.errcode == 3) {
            this.msg.string = "系统繁忙，请稍后再试。";
        } else if (ret.errcode == 4) {
            this.msg.string = "系统错误，请联系客服人员！";
        } else if (ret.errcode == 5) {
            this.msg.string = "系统繁忙，请稍后再试。";
        }
    },

    /**===================================================================================================== */
    onBuyRecords: function onBuyRecords() {
        cc.app.showPage("prefabes/page_shop_log/page_shop_log", 0, true, "商城");
    },

    /**===================================================================================================== */
    clearList: function clearList() {
        this.listContent.removeAllChildren();
    }
});

cc._RFpop();
},{}],"shop_log_item_script":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e8aa7oSLUZOJogeWpdPrAES', 'shop_log_item_script');
// resources\prefabes\page_shop_log\shop_log_item_script.js

cc.Class({
    "extends": cc.Component,

    properties: {
        time: cc.Label,
        goods: cc.Label,
        price: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showInfo: function showInfo(item) {
        if (!item) return;
        var t = new Date();
        t.setTime(item.time);
        this.time.string = t.toLocaleString();

        if (item.goods_type == 1) {
            this.goods.string = "+ " + item.goods_num + "房卡";
        } else if (item.goods_type == 2) {
            this.goods.string = "+ " + item.goods_num + "金币";
        }

        if (item.price_type == 1) {
            this.price.string = "- " + item.goods_price + "积分";
        } else if (item.goods_type == 2) {
            this.price.string = "- " + item.goods_price + "房卡";
        }
    }
});

cc._RFpop();
},{}]},{},["page_detail_script","page_login_script","page_sell_script","page_index_script","page_kpi_script","menu_item_script","HTTP","page_notice_script","page_dealer_script","dealer_item_script","page_menu_script","core","page_charge_user_script","page_create_dealer_script","goods_item_script","page_mine_script","App","page_search_dealer_script","page_shop_script","kpi_item_script","page_charge_dealer_script","shop_log_item_script","notice_item_script","page_pwd_script","option_item_script","page_shop_log_script"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9hcHAvQXBwLmpzIiwiYXNzZXRzL2NvcmUvSFRUUC5qcyIsImFzc2V0cy9jb3JlL2NvcmUuanMiLCJhc3NldHMvcmVzb3VyY2VzL3ByZWZhYmVzL3BhZ2VfZGVhbGVyL2RlYWxlcl9pdGVtX3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9zaG9wL2dvb2RzX2l0ZW1fc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX2twaS9rcGlfaXRlbV9zY3JpcHQuanMiLCJhc3NldHMvcmVzb3VyY2VzL3ByZWZhYmVzL3BhZ2VfbWVudS9tZW51X2l0ZW1fc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX25vdGljZS9ub3RpY2VfaXRlbV9zY3JpcHQuanMiLCJhc3NldHMvcmVzb3VyY2VzL3ByZWZhYmVzL3BhZ2VfaW5kZXgvb3B0aW9uX2l0ZW1fc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX3NlbGwvcGFnZV9jaGFyZ2VfZGVhbGVyX3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9zZWxsL3BhZ2VfY2hhcmdlX3VzZXJfc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX2RlYWxlci9wYWdlX2NyZWF0ZV9kZWFsZXJfc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX2RlYWxlci9wYWdlX2RlYWxlcl9zY3JpcHQuanMiLCJhc3NldHMvcmVzb3VyY2VzL3ByZWZhYmVzL3BhZ2VfZGV0YWlsL3BhZ2VfZGV0YWlsX3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9pbmRleC9wYWdlX2luZGV4X3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9rcGkvcGFnZV9rcGlfc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX2xvZ2luL3BhZ2VfbG9naW5fc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX21lbnUvcGFnZV9tZW51X3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9taW5lL3BhZ2VfbWluZV9zY3JpcHQuanMiLCJhc3NldHMvcmVzb3VyY2VzL3ByZWZhYmVzL3BhZ2Vfbm90aWNlL3BhZ2Vfbm90aWNlX3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9wd2QvcGFnZV9wd2Rfc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX2RlYWxlci9wYWdlX3NlYXJjaF9kZWFsZXJfc2NyaXB0LmpzIiwiYXNzZXRzL3Jlc291cmNlcy9wcmVmYWJlcy9wYWdlX3NlbGwvcGFnZV9zZWxsX3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9zaG9wX2xvZy9wYWdlX3Nob3BfbG9nX3NjcmlwdC5qcyIsImFzc2V0cy9yZXNvdXJjZXMvcHJlZmFiZXMvcGFnZV9zaG9wL3BhZ2Vfc2hvcF9zY3JpcHQuanMiLCJhc3NldHMvcmVzb3VyY2VzL3ByZWZhYmVzL3BhZ2Vfc2hvcF9sb2cvc2hvcF9sb2dfaXRlbV9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E2ZDY0YzFLdTlOUDdiSnUwQ21VczFzJywgJ0FwcCcpO1xuLy8gYXBwXFxBcHAuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBjYy5hcHAgPSB0aGlzO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGNjLmxvZyhcIkFwcCBzdGFydGVkLi4uXCIpO1xuXG4gICAgICAgIC8vIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL2xvZ2luL25vcm1hbFwiLDAsdHJ1ZSxcIua1i+ivlVwiLG51bGwsbnVsbCx0cnVlLGZhbHNlKTtcbiAgICAgICAgLy8gY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9sb2dpbi9wYWdlX2xvZ2luXCIsMCxmYWxzZSxudWxsLG51bGwsbnVsbCx0cnVlLGZhbHNlKTtcbiAgICAgICAgY2MuYXBwLmNsZWFuQWxsTGF5ZXJzKCk7XG4gICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2VfbG9naW4vcGFnZV9sb2dpblwiLCAyKTtcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgY2MudXNlciA9IHt9O1xuICAgIH0sXG5cbiAgICAvKipwcmVmYWIsaW5kZXgsc2hvd0JhY2ssbmFtZSxzY3JpcHROYW1lLGRldGFpbCxzaW5nbGUsc3RvcmUqL1xuICAgIHNob3dQYWdlOiBmdW5jdGlvbiBzaG93UGFnZShwcmVmYWIsIGluZGV4LCBzaG93QmFjaywgbmFtZSwgc2NyaXB0TmFtZSwgZGV0YWlsLCBzaW5nbGUsIHN0b3JlKSB7XG4gICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgcGF0aDogcHJlZmFiLFxuICAgICAgICAgICAgbGF5ZXJJbmRleDogaW5kZXgsXG4gICAgICAgICAgICBzaG93QmFjazogc2hvd0JhY2ssXG4gICAgICAgICAgICBiYWNrTmFtZTogbmFtZSxcbiAgICAgICAgICAgIHNjcmlwdE5hbWU6IHNjcmlwdE5hbWUsXG4gICAgICAgICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgICAgIHNpbmdsZTogc2luZ2xlLFxuICAgICAgICAgICAgc3RvcmU6IHN0b3JlXG4gICAgICAgIH07XG4gICAgICAgIHZhciBldmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbShjYy5wYWdlLlNIT1dfUEFHRSwgdHJ1ZSk7XG4gICAgICAgIGV2ZW50LmRldGFpbCA9IGluZm87XG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LFxuXG4gICAgYmFja1BhZ2U6IGZ1bmN0aW9uIGJhY2tQYWdlKCkge1xuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oY2MucGFnZS5CQUNLX1BBR0UsIHRydWUpO1xuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSxcblxuICAgIHJlbW92ZVBhZ2U6IGZ1bmN0aW9uIHJlbW92ZVBhZ2UobGF5ZXJJbmRleCwgcmVtb3ZlTnVtKSB7XG4gICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgbGF5ZXJJbmRleDogbGF5ZXJJbmRleCxcbiAgICAgICAgICAgIHJlbW92ZU51bTogcmVtb3ZlTnVtXG4gICAgICAgIH07XG4gICAgICAgIHZhciBldmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbShjYy5wYWdlLlJFTU9WRV9QQUdFLCB0cnVlKTtcbiAgICAgICAgZXZlbnQuZGV0YWlsID0gaW5mbztcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBjbGVhbkFsbExheWVyczogZnVuY3Rpb24gY2xlYW5BbGxMYXllcnMoKSB7XG4gICAgICAgIHZhciBldmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbShjYy5wYWdlLkNMRUFOX0FMTF9MQVlFUlMsIHRydWUpO1xuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzMyYzBiNnBka1JGcDdJWng4RW95U0ZBJywgJ0hUVFAnKTtcbi8vIGNvcmVcXEhUVFAuanNcblxudmFyIFVSTCA9IFwiaHR0cDovLzEyNy4wLjAuMToxMjU4MFwiO1xuLy92YXIgVVJMID0gXCJodHRwOi8vMTIwLjI0LjU5LjcwOjEyNTgwXCI7XG5cbnZhciBIVFRQID0gY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIHNlc3Npb25JZDogMCxcbiAgICAgICAgdXNlcklkOiAwLFxuICAgICAgICBtYXN0ZXJfdXJsOiBVUkwsXG4gICAgICAgIHVybDogVVJMLFxuICAgICAgICBzZW5kUmVxdWVzdDogZnVuY3Rpb24gc2VuZFJlcXVlc3QocGF0aCwgZGF0YSwgaGFuZGxlciwgZXh0cmFVcmwpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBjYy5sb2FkZXIuZ2V0WE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci50aW1lb3V0ID0gNTAwMDtcbiAgICAgICAgICAgIHZhciBzdHIgPSBcIj9cIjtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChzdHIgIT0gXCI/XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiJlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHIgKz0gayArIFwiPVwiICsgZGF0YVtrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHRyYVVybCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZXh0cmFVcmwgPSBIVFRQLnVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXF1ZXN0VVJMID0gZXh0cmFVcmwgKyBwYXRoICsgZW5jb2RlVVJJKHN0cik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RVUkw6XCIgKyByZXF1ZXN0VVJMKTtcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIHJlcXVlc3RVUkwsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0LUVuY29kaW5nXCIsIFwiZ3ppcCxkZWZsYXRlXCIsIFwidGV4dC9odG1sO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJodHRwIHJlcyhcIiArIHhoci5yZXNwb25zZVRleHQubGVuZ3RoICsgXCIpOlwiICsgeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihyZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAvKiBjb2RlICovXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnZ2ICYmIGNjLnZ2LndjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgY2MudnYud2MuaGlkZSgpOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChjYy52diAmJiBjYy52di53Yykge1xuICAgICAgICAgICAgICAgIC8vY2MudnYud2Muc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODAxY2NDZzFxSkhHbzhOVnJQUzFLcmYnLCAnY29yZScpO1xuLy8gY29yZVxcY29yZS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIC8vIOmhtemdouWQjeensO+8jOaYvuekuuWxgue6p++8jOaYr+WQpuaYvuekuuWbnumAgO+8jOWbnumAgOWQjeensO+8jFxuICAgIC8vIOeCueWHu+WbnumAgOWImeWIoOmZpOW9k+WJjeWxgue6p+eahOacgOWQjuS4gOS4quWtkOWvueixoeOAglxuICAgIC8vIOWxgue6pyDvvJrlm57pgIDlkI3np7BcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxheWVyczoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBiYWNrOiBjYy5CdXR0b24sXG4gICAgICAgIGJhY2tOYW1lOiBjYy5MYWJlbCxcbiAgICAgICAgX2JhY2tJbmZvOiBbXSxcbiAgICAgICAgX2N1ckluZm9JZHg6IDAsXG4gICAgICAgIF9sb2FkaW5nOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICBjYy5odHRwID0gcmVxdWlyZShcIkhUVFBcIik7XG5cbiAgICAgICAgY2MucGFnZSA9IHtcbiAgICAgICAgICAgIFNIT1dfUEFHRTogXCJzaG93X3BhZ2VcIixcbiAgICAgICAgICAgIEJBQ0tfUEFHRTogXCJiYWNrX3BhZ2VcIixcbiAgICAgICAgICAgIFJFTU9WRV9QQUdFOiBcInJlbW92ZV9wYWdlXCIsXG4gICAgICAgICAgICBDTEVBTl9BTExfTEFZRVJTOiBcImNsZWFuX2FsbF9sYXllcnNcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50TGlzdGVuZXIoKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBjYy5sb2coXCLmoYbmnrbliJ3lp4vlrozmr5XjgILjgILjgIJcIik7XG4gICAgfSxcblxuICAgIGluaXRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiBpbml0RXZlbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLnBhZ2UuU0hPV19QQUdFLCB0aGlzLm9uU2hvd1BhZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5wYWdlLkJBQ0tfUEFHRSwgdGhpcy5vbkJhY2tQYWdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MucGFnZS5SRU1PVkVfUEFHRSwgdGhpcy5vblJlbW92ZVBhZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5wYWdlLkNMRUFOX0FMTF9MQVlFUlMsIHRoaXMuY2xlYW5BbGxMYXllcnMuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIC8qKiBwYXRoLCBsYXllckluZGV4LHNob3dCYWNrLGJhY2tOYW1lLHNpbmdsZSxzdG9yZSovXG4gICAgb25TaG93UGFnZTogZnVuY3Rpb24gb25TaG93UGFnZShpbmZvKSB7XG4gICAgICAgIGlmICghaW5mbyB8fCAhaW5mby5kZXRhaWwgfHwgdGhpcy5fbG9hZGluZykgcmV0dXJuO1xuICAgICAgICBpbmZvID0gaW5mby5kZXRhaWw7XG5cbiAgICAgICAgdmFyIHBhZ2VpZHggPSBpbmZvLmxheWVySW5kZXg7XG4gICAgICAgIGlmIChwYWdlaWR4IDwgMCB8fCBwYWdlaWR4ID49IHRoaXMubGF5ZXJzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2JhY2tJbmZvLnB1c2goaW5mbyk7XG4gICAgICAgIHRoaXMuX2N1ckluZm9JZHggPSB0aGlzLl9iYWNrSW5mby5sZW5ndGggLSAxO1xuICAgICAgICB0aGlzLl9jdXJQYXRoID0gaW5mby5wYXRoO1xuICAgICAgICAvL+WKoOi9vXByZWZhYlxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhpbmZvLnBhdGgsIChmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIGlmIChwcmVmYWIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVmYWJMb2FkZWQocHJlZmFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY2MubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX3ByZWZhYkxvYWRlZDogZnVuY3Rpb24gX3ByZWZhYkxvYWRlZChwcmVmYWIpIHtcbiAgICAgICAgaWYgKHByZWZhYikge1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGN1ckluZm8gPSB0aGlzLl9iYWNrSW5mb1t0aGlzLl9jdXJJbmZvSWR4XTtcblxuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5uYW1lID0gXCJwYWdlXCIgKyB0aGlzLl9iYWNrSW5mby5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmxheWVyc1tjdXJJbmZvLmxheWVySW5kZXhdO1xuICAgICAgICAgICAgaWYgKGN1ckluZm8uc2luZ2xlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQobmV3Tm9kZSk7XG5cbiAgICAgICAgICAgIHRoaXMuYmFjay5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGN1ckluZm8uc2hvd0JhY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2subm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja05hbWUuc3RyaW5nID0gY3VySW5mby5iYWNrTmFtZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1ckluZm8uc2NyaXB0TmFtZSAmJiBjdXJJbmZvLnNjcmlwdE5hbWUgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KGN1ckluZm8uc2NyaXB0TmFtZSkuaW5pdChjdXJJbmZvLmRldGFpbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25CYWNrUGFnZTogZnVuY3Rpb24gb25CYWNrUGFnZShldmVudCkge1xuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuX2JhY2tJbmZvLnBvcCgpO1xuXG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmxheWVyc1tsYXN0LmxheWVySW5kZXhdO1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmdldENoaWxkQnlOYW1lKFwicGFnZVwiICsgKHRoaXMuX2JhY2tJbmZvLmxlbmd0aCArIDEpKSwgdHJ1ZSk7XG5cbiAgICAgICAgLy9jb25maWcgcHJlXG4gICAgICAgIHRoaXMuYmFjay5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBsYXN0ID0gdGhpcy5fYmFja0luZm9bdGhpcy5fYmFja0luZm8ubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICBpZiAobGFzdC5zaG93QmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFjay5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrTmFtZS5zdHJpbmcgPSBsYXN0LmJhY2tOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKuWIoOmZpOafkOS4gOWxgiDnmoQgTiDkuKrnlYzpnaIgKi9cbiAgICBvblJlbW92ZVBhZ2U6IGZ1bmN0aW9uIG9uUmVtb3ZlUGFnZShldmVudCkge1xuICAgICAgICB2YXIgaW5mbyA9IGV2ZW50LmRldGFpbDtcbiAgICAgICAgaWYgKCFpbmZvICYmIGluZm8ubGF5ZXJJbmRleCA+IHRoaXMubGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnQgPSB0aGlzLmxheWVyc1tpbmZvLmxheWVySW5kZXhdO1xuICAgICAgICBpZiAoaW5mby5yZW1vdmVOdW0gPCAxKSB7XG4gICAgICAgICAgICBjb250LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoaW5mby5yZW1vdmVOdW0gPj0gMSkge1xuICAgICAgICAgICAgY29udC5yZW1vdmVDaGlsZChjb250LmNoaWxkcmVuW2NvbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgaW5mby5yZW1vdmVOdW0gLT0gMTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhbkFsbExheWVyczogZnVuY3Rpb24gY2xlYW5BbGxMYXllcnMoKSB7XG4gICAgICAgIHRoaXMuX2N1ckluZm9JZHggPSAwO1xuICAgICAgICB0aGlzLl9iYWNrSW5mbyA9IFtdO1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgLy8gb25DbGVhbkFsZXJ0OiBmdW5jdGlvbiAoaW5mbykge1xuXG4gICAgLy8gfSxcblxuICAgIC8vIG9uUmVzdGFydDogZnVuY3Rpb24gKGluZm8pIHtcblxuICAgIC8vIH0sXG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNWVlOTVkWXBpRlBNN3ZzbUI1bDE1Nm8nLCAnZGVhbGVyX2l0ZW1fc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX2RlYWxlclxcZGVhbGVyX2l0ZW1fc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBhY2NvdW50OiBjYy5MYWJlbCxcbiAgICAgICAgZGVhbGVyTmFtZTogY2MuTGFiZWwsXG4gICAgICAgIGN1ckdlbXM6IGNjLkxhYmVsLFxuICAgICAgICBjdXJTdWJzOiBjYy5MYWJlbCxcbiAgICAgICAgX2N1ckluZm86IG51bGxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIHNob3dJbmZvOiBmdW5jdGlvbiBzaG93SW5mbyhpbmZvdmFsdWUpIHtcbiAgICAgICAgaWYgKCFpbmZvdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1ckluZm8gPSBpbmZvdmFsdWU7XG4gICAgICAgIHRoaXMuYWNjb3VudC5zdHJpbmcgPSBpbmZvdmFsdWUuYWNjb3VudDtcbiAgICAgICAgdGhpcy5kZWFsZXJOYW1lLnN0cmluZyA9IGluZm92YWx1ZS5uYW1lO1xuICAgICAgICB0aGlzLmN1ckdlbXMuc3RyaW5nID0gaW5mb3ZhbHVlLmdlbXM7XG4gICAgICAgIHRoaXMuY3VyU3Vicy5zdHJpbmcgPSBpbmZvdmFsdWUuYWxsX3N1YnM7XG4gICAgfSxcblxuICAgIG9uRW50ZXJJbnRvOiBmdW5jdGlvbiBvbkVudGVySW50bygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1ckluZm8pIHRoaXMubm9kZS5lbWl0KFwic2hvd0RlYWxlckRldGFpbFwiLCB0aGlzLl9jdXJJbmZvLmFjY291bnQpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWJkMTRROGlqSkIxNjVsS0p2ek91ZjMnLCAnZ29vZHNfaXRlbV9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2Vfc2hvcFxcZ29vZHNfaXRlbV9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGljb246IGNjLlNwcml0ZSxcbiAgICAgICAgdGl0bGU6IGNjLkxhYmVsLFxuICAgICAgICBpbmZvOiBjYy5MYWJlbCxcbiAgICAgICAgcHJpY2U6IGNjLkxhYmVsLFxuICAgICAgICBfY3VySXRlbTogbnVsbFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgc2hvd0luZm86IGZ1bmN0aW9uIHNob3dJbmZvKGl0ZW0pIHtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJJdGVtID0gaXRlbTtcblxuICAgICAgICAvL2ljb25cblxuICAgICAgICB0aGlzLnRpdGxlLnN0cmluZyA9IGl0ZW0uZ29vZHNfbmFtZTtcbiAgICAgICAgaWYgKGl0ZW0uZ29vZHNfdHlwZSA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmluZm8uc3RyaW5nID0gaXRlbS5nb29kc19udW0gKyBcIiDmiL/ljaFcIjtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtLmdvb2RzX3R5cGUgPT0gMikge1xuICAgICAgICAgICAgdGhpcy5pbmZvLnN0cmluZyA9IGl0ZW0uZ29vZHNfbnVtICsgXCIg6YeR5biBXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5wcmljZV90eXBlID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMucHJpY2Uuc3RyaW5nID0gaXRlbS5nb29kc19wcmljZSArIFwiIOenr+WIhlwiO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ucHJpY2VfdHlwZSA9PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnByaWNlLnN0cmluZyA9IGl0ZW0uZ29vZHNfcHJpY2UgKyBcIiDmiL/ljaFcIjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkJ1eUNsaWNrOiBmdW5jdGlvbiBvbkJ1eUNsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5fY3VySXRlbSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoXCJidXlHb29kc1wiLCB0aGlzLl9jdXJJdGVtKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjOWEwNk51eU85S3RvRjJPclBOcmlaKycsICdrcGlfaXRlbV9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2Vfa3BpXFxrcGlfaXRlbV9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1vbnRoOiBjYy5MYWJlbCxcbiAgICAgICAgZ2VtczogY2MuTGFiZWwsXG4gICAgICAgIHNjb3JlOiBjYy5MYWJlbCxcbiAgICAgICAgc3ViczogY2MuTGFiZWxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIHRoaXMuY2xlYW5JbmZvKCk7XG4gICAgfSxcblxuICAgIHNob3dJbmZvOiBmdW5jdGlvbiBzaG93SW5mbyhkYXRhKSB7XG4gICAgICAgIHRoaXMubW9udGguc3RyaW5nID0gXCJcIiArIChkYXRhLm1vbnRoICsgMSk7XG4gICAgICAgIHRoaXMuZ2Vtcy5zdHJpbmcgPSBkYXRhLmdlbXM7XG4gICAgICAgIHRoaXMuc2NvcmUuc3RyaW5nID0gZGF0YS5zY29yZTtcbiAgICAgICAgdGhpcy5zdWJzLnN0cmluZyA9IGRhdGEuc3VicztcbiAgICB9LFxuXG4gICAgY2xlYW5JbmZvOiBmdW5jdGlvbiBjbGVhbkluZm8oKSB7XG4gICAgICAgIHRoaXMubW9udGguc3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5nZW1zLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuc2NvcmUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5zdWJzLnN0cmluZyA9IFwiXCI7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI5ZjMxMUNoT0ZFbUtTTUk1eWlZcUhEJywgJ21lbnVfaXRlbV9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2VfbWVudVxcbWVudV9pdGVtX3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgb246IGNjLk5vZGUsXG4gICAgICAgIG9mZjogY2MuTm9kZSxcbiAgICAgICAgbGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBvbkNvbG9yOiBjYy5Db2xvcixcbiAgICAgICAgb2ZmQ29sb3I6IGNjLkNvbG9yLFxuICAgICAgICBfaXNPbjogZmFsc2UsXG4gICAgICAgIGlzT246IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzT24gIT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNPbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc09uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZVN0YXRlOiBmdW5jdGlvbiB1cGRhdGVTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5vbi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vZmYuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmlzT24pIHtcbiAgICAgICAgICAgIHRoaXMub24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwubm9kZS5jb2xvciA9IHRoaXMub25Db2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2ZmLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLm5vZGUuY29sb3IgPSB0aGlzLm9mZkNvbG9yO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09uKSB7XG4gICAgICAgICAgICB0aGlzLmlzT24gPSAhdGhpcy5pc09uO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoXCJjaGFuZ2VcIiwgdGhpcy5pc09uKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlYzYyYUt4RytaQzJab09JTWJaNXB2RycsICdub3RpY2VfaXRlbV9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2Vfbm90aWNlXFxub3RpY2VfaXRlbV9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRpdGxlOiBjYy5MYWJlbCxcbiAgICAgICAgY29udGVudDogY2MuUmljaFRleHQsXG4gICAgICAgIHRpbWU6IGNjLkxhYmVsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBzaG93SW5mbzogZnVuY3Rpb24gc2hvd0luZm8oaW5mbykge1xuICAgICAgICBpZiAoIWluZm8pIHJldHVybjtcbiAgICAgICAgdGhpcy50aXRsZS5zdHJpbmcgPSBpbmZvLnRpdGxlO1xuICAgICAgICB0aGlzLmNvbnRlbnQuc3RyaW5nID0gaW5mby5jb250ZW50O1xuXG4gICAgICAgIHZhciB0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgdC5zZXRUaW1lKGluZm8uYWN0X3RpbWUpO1xuICAgICAgICB0aGlzLnRpbWUuc3RyaW5nID0gdC50b0xvY2FsZVN0cmluZygpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjNjY2Jvd2F5bExQSTN1c2xwTWpPR1QnLCAnb3B0aW9uX2l0ZW1fc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX2luZGV4XFxvcHRpb25faXRlbV9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGljb25zOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgICAgICB9LFxuICAgICAgICBpY29uOiBjYy5TcHJpdGUsXG4gICAgICAgIGluYW1lOiBjYy5MYWJlbCxcbiAgICAgICAgX29wdGlvbkluZm86IG51bGxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIHNob3dJbmZvOiBmdW5jdGlvbiBzaG93SW5mbyhpbmZvKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbkluZm8gPSBpbmZvO1xuICAgICAgICB0aGlzLmljb24uc3ByaXRlRnJhbWUgPSB0aGlzLmljb25zW2luZm8uaWNvbl07XG4gICAgICAgIHRoaXMuaW5hbWUuc3RyaW5nID0gdGhpcy5fb3B0aW9uSW5mby5uYW1lO1xuICAgIH0sXG5cbiAgICBvbkVudGVyQ2xpY2s6IGZ1bmN0aW9uIG9uRW50ZXJDbGljaygpIHtcbiAgICAgICAgY2MubG9nKFwi6YCJ5oup5LqG44CC44CC44CC44CCXCIpO1xuICAgICAgICBjYy5hcHAuc2hvd1BhZ2UodGhpcy5fb3B0aW9uSW5mby5wcmVmYWIsIHRoaXMuX29wdGlvbkluZm8ubGF5ZXJJbmR4LCB0aGlzLl9vcHRpb25JbmZvLnNob3dCYWNrLCB0aGlzLl9vcHRpb25JbmZvLmJhY2tOYW1lLCB0aGlzLl9vcHRpb25JbmZvLnNjcmlwdE5hbWUsIHRoaXMuX29wdGlvbkluZm8uZGV0YWlsLCB0aGlzLl9vcHRpb25JbmZvLnNpbmdsZSwgdGhpcy5fb3B0aW9uSW5mby5zdG9yZSk7XG5cbiAgICAgICAgLy8gY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9kZWFsZXIvcGFnZV9jcmVhdGVfZGVhbGVyXCIsMCx0cnVlLFwi5Luj55CGXCIpOy8vXCJwYWdlX2NoYXJnZV91c2VyX3NjcmlwdFwiLHthY2NvdW50OmNjLnVzZXIuYWNjb3VudCx0YXJnZXQ6MTIzNDU2fVxuICAgIH1cblxuICAgIC8vIG5hbWU6bmFtZSxpY29uOmljb24sXG4gICAgLy8gcHJlZmFiOnByZWZhYixcbiAgICAvLyBsYXllckluZHg6bGF5ZXJJbmR4LFxuICAgIC8vIHNob3dCYWNrOnNob3dCYWNrLGJhY2tOYW1lOmJhY2tOYW1lLFxuICAgIC8vIHNjcmlwdE5hbWU6c2NyaXB0TmFtZSxkZXRhaWw6ZGV0YWlsLFxuICAgIC8vIHNpbmdsZTpzaW5nbGUsXG4gICAgLy8gc3RvcmU6c3RvcmVcbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDA0OTJTQ0E1Qkd0NENaeS9uaFJWMSsnLCAncGFnZV9jaGFyZ2VfZGVhbGVyX3NjcmlwdCcpO1xuLy8gcmVzb3VyY2VzXFxwcmVmYWJlc1xccGFnZV9zZWxsXFxwYWdlX2NoYXJnZV9kZWFsZXJfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpbnB1dFVzZXJJRDogY2MuRWRpdEJveCxcbiAgICAgICAgbXNnOiBjYy5MYWJlbCxcbiAgICAgICAgLy9zZWFyY2ggcmVzXG4gICAgICAgIHNlYXJjaFJlc3VsdDogY2MuTm9kZSxcbiAgICAgICAgcmVzVXNlcklEOiBjYy5MYWJlbCxcbiAgICAgICAgcmVzVXNlck5hbWU6IGNjLkxhYmVsLFxuICAgICAgICByZXNVc2VyR2VtczogY2MuTGFiZWwsXG4gICAgICAgIGlucHV0R2VtczogY2MuRWRpdEJveCxcbiAgICAgICAgLy9jaGFyZ2UgcmVzXG4gICAgICAgIG1rQ2hhcmdlU3RhdGU6IGNjLkxhYmVsLFxuICAgICAgICBta0NoYXJnZVRpbWU6IGNjLkxhYmVsLFxuICAgICAgICBta0RldGFpbDogY2MuTm9kZSxcbiAgICAgICAgbWtSZXN1bHQ6IGNjLk5vZGUsXG4gICAgICAgIG1rVXNlcklEOiBjYy5MYWJlbCxcbiAgICAgICAgbWtVc2VyTmFtZTogY2MuTGFiZWwsXG4gICAgICAgIG1rVXNlckdlbXM6IGNjLkxhYmVsLFxuXG4gICAgICAgIC8vXG4gICAgICAgIF90YXJnZXREYXRhOiBudWxsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ta1Jlc3VsdC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0RGF0YSA9IG51bGw7XG4gICAgfSxcbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBvbkNoYXJnZVVzZXI6IGZ1bmN0aW9uIG9uQ2hhcmdlVXNlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl90YXJnZXREYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbnVtID0gdGhpcy5pbnB1dEdlbXMuc3RyaW5nO1xuICAgICAgICBpZiAoIW51bSB8fCBudW0gPT0gXCJcIikge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIumUmeivr1wiLFwi6K+35Ye65YWl5YWF5YC85oi/5Y2h5pWw6aKd44CCXCIsMSk7ICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubXNnID0gXCLor7fovpPlhaXlhYXlgLzmlbDpop1cIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlbixcbiAgICAgICAgICAgIGFjY291bnQ6IHRoaXMuX3RhcmdldERhdGEuYWNjb3VudCxcbiAgICAgICAgICAgIG51bTogbnVtXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvdHJhbnNmZXJfZ2VtczJkZWFsZXJcIiwgZGF0YSwgdGhpcy5jaGFyZ2VCYWNrLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBjaGFyZ2VCYWNrOiBmdW5jdGlvbiBjaGFyZ2VCYWNrKHJldCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXQpO1xuXG4gICAgICAgIHRoaXMubWtSZXN1bHQuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ta0RldGFpbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ta0NoYXJnZVRpbWUuc3RyaW5nID0gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgaWYgKHJldC5lcnJjb2RlID09IDApIHtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLku6PnkIblhYXlgLxcIixcIuS4uiBcIisgdGhpcy5fdGFyZ2V0RGF0YS51c2VyaWQgK1wiIOWFheWAvOaIkOWKn++8jOW9k+WJjeaIv+WNoeWPmOabtOS4uu+8mlwiK3JldC50YXJnZXRnZW1zK1wi44CCXFxu6Ieq6Lqr5Ymp5L2Z77yaXCIrIHJldC5nZW1zICwxKTsgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5ta0NoYXJnZVN0YXRlLnN0cmluZyA9IFwi5YWF5YC85oiQ5Yqf44CCXCI7XG5cbiAgICAgICAgICAgIHRoaXMubWtEZXRhaWwuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWtVc2VySUQuc3RyaW5nID0gdGhpcy5fdGFyZ2V0RGF0YS5hY2NvdW50O1xuICAgICAgICAgICAgdGhpcy5ta1VzZXJOYW1lLnN0cmluZyA9IHRoaXMuX3RhcmdldERhdGEubmFtZTtcbiAgICAgICAgICAgIHRoaXMubWtVc2VyR2Vtcy5zdHJpbmcgPSByZXQudGFyZ2V0Z2VtcztcbiAgICAgICAgfSBlbHNlIGlmIChyZXQuZXJyY29kZSA9PSAxMjU4MCkge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIuaPkOekulwiLFwi55m75b2V54q25oCB5byC5bi477yM6ZyA6KaB6YeN5paw55m75b2VIVwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoXCJleGl0TG9naW5cIik7ICAgXG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIHRoaXMubWtDaGFyZ2VTdGF0ZS5zdHJpbmcgPSBcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHJldC5lcnJjb2RlID09IDQpIHtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLku6PnkIblhYXlgLxcIixcIuiHqui6q+aIv+WNoeS4jei2s++8jOWFheWAvOWksei0pe+8gVwiLDEpOyAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLm1rQ2hhcmdlU3RhdGUuc3RyaW5nID0gXCLoh6rouqvmiL/ljaHkuI3otrPvvIzlhYXlgLzlpLHotKXvvIFcIjtcbiAgICAgICAgfSBlbHNlIGlmIChyZXQuZXJyY29kZSA9PSA1KSB7XG4gICAgICAgICAgICAvLyBjYy5hbGVydC5zaG93KFwi5Luj55CG5YWF5YC8XCIsXCLmnI3liqHlmajnuYHlv5nvvIzor7fnqI3lkI7lho3or5XvvIFcIiwxKTsgXG4gICAgICAgICAgICB0aGlzLm1rQ2hhcmdlU3RhdGUuc3RyaW5nID0gXCLmnI3liqHlmajnuYHlv5nvvIzor7fnqI3lkI7lho3or5XvvIFcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLku6PnkIblhYXlgLxcIixcIuacjeWKoeWZqOW8guW4uO+8jOivt+eojeWQjuWGjeivle+8gVwiLDEpO1xuICAgICAgICAgICAgdGhpcy5ta0NoYXJnZVN0YXRlLnN0cmluZyA9IFwi5pyN5Yqh5Zmo5byC5bi477yM6K+356iN5ZCO5YaN6K+V77yBXCI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIG9uU2VhcmNoOiBmdW5jdGlvbiBvblNlYXJjaCgpIHtcbiAgICAgICAgdmFyIHNlYXJjaElkID0gdGhpcy5pbnB1dFVzZXJJRC5zdHJpbmc7XG4gICAgICAgIGlmICghc2VhcmNoSWQgfHwgc2VhcmNoSWQgPT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9TZWFyY2hVc2VyKHNlYXJjaElkKTtcbiAgICB9LFxuXG4gICAgZG9TZWFyY2hVc2VyOiBmdW5jdGlvbiBkb1NlYXJjaFVzZXIoc2VhcmNoSWQpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0RGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMubXNnLnN0cmluZyA9IFwi5p+l6K+i5Lit44CC44CC44CCXCI7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlbixcbiAgICAgICAgICAgIGFjY291bnQ6IHNlYXJjaElkXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvZ2V0X3N1Yl9kZWFsZXJfYnlfYWNjb3VudFwiLCBkYXRhLCB0aGlzLnNlYXJjaEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNlYXJjaEJhY2s6IGZ1bmN0aW9uIHNlYXJjaEJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG5cbiAgICAgICAgaWYgKHJldC5lcnJjb2RlID09IDApIHtcbiAgICAgICAgICAgIHRoaXMubXNnLnN0cmluZyA9IFwi5p+l6K+i5oiQ5YqfXCI7XG5cbiAgICAgICAgICAgIHRoaXMucmVzVXNlcklELnN0cmluZyA9IHJldC5hY2NvdW50O1xuICAgICAgICAgICAgdGhpcy5yZXNVc2VyTmFtZS5zdHJpbmcgPSByZXQubmFtZSwgdGhpcy5yZXNVc2VyR2Vtcy5zdHJpbmcgPSByZXQuZ2VtcztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dEdlbXMuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldERhdGEgPSByZXQ7XG5cbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMTI1ODApIHtcbiAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIiwgXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZUhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChcImV4aXRMb2dpblwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLmnKrojrflvpfnm7jlhbPkv6Hmga/vvIzor7fnoa7orqTku6PnkIZJRFwiO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkyZWE0LzkzSjFHdVlYcHoxTGdqLzJrJywgJ3BhZ2VfY2hhcmdlX3VzZXJfc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX3NlbGxcXHBhZ2VfY2hhcmdlX3VzZXJfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpbnB1dFVzZXJJRDogY2MuRWRpdEJveCxcbiAgICAgICAgbXNnOiBjYy5MYWJlbCxcbiAgICAgICAgLy9zZWFyY2ggcmVzXG4gICAgICAgIHNlYXJjaFJlc3VsdDogY2MuTm9kZSxcbiAgICAgICAgcmVzVXNlcklEOiBjYy5MYWJlbCxcbiAgICAgICAgcmVzVXNlck5hbWU6IGNjLkxhYmVsLFxuICAgICAgICByZXNVc2VyR2VtczogY2MuTGFiZWwsXG4gICAgICAgIGlucHV0R2VtczogY2MuRWRpdEJveCxcbiAgICAgICAgLy9jaGFyZ2UgcmVzXG4gICAgICAgIG1rQ2hhcmdlU3RhdGU6IGNjLkxhYmVsLFxuICAgICAgICBta0NoYXJnZVRpbWU6IGNjLkxhYmVsLFxuICAgICAgICBta0RldGFpbDogY2MuTm9kZSxcbiAgICAgICAgbWtSZXN1bHQ6IGNjLk5vZGUsXG4gICAgICAgIG1rVXNlcklEOiBjYy5MYWJlbCxcbiAgICAgICAgbWtVc2VyTmFtZTogY2MuTGFiZWwsXG4gICAgICAgIG1rVXNlckdlbXM6IGNjLkxhYmVsLFxuXG4gICAgICAgIC8vXG4gICAgICAgIF90YXJnZXREYXRhOiBudWxsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ta1Jlc3VsdC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0RGF0YSA9IG51bGw7XG4gICAgfSxcbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBvbkNoYXJnZVVzZXI6IGZ1bmN0aW9uIG9uQ2hhcmdlVXNlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl90YXJnZXREYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbnVtID0gdGhpcy5pbnB1dEdlbXMuc3RyaW5nO1xuICAgICAgICBpZiAoIW51bSB8fCBudW0gPT0gXCJcIikge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIumUmeivr1wiLFwi6K+35Ye65YWl5YWF5YC85oi/5Y2h5pWw6aKd44CCXCIsMSk7ICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubXNnID0gXCLor7fovpPlhaXlhYXlgLzmlbDpop1cIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlbixcbiAgICAgICAgICAgIHVzZXJpZDogdGhpcy5fdGFyZ2V0RGF0YS51c2VyaWQsXG4gICAgICAgICAgICBudW06IG51bVxuICAgICAgICB9O1xuICAgICAgICBjYy5odHRwLnNlbmRSZXF1ZXN0KFwiL3RyYW5zZmVyX2dlbXMydXNlclwiLCBkYXRhLCB0aGlzLmNoYXJnZUJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGNoYXJnZUJhY2s6IGZ1bmN0aW9uIGNoYXJnZUJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG5cbiAgICAgICAgdGhpcy5ta1Jlc3VsdC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1rRGV0YWlsLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1rQ2hhcmdlVGltZS5zdHJpbmcgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgICBpZiAocmV0LmVycmNvZGUgPT0gMCkge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIueOqeWutuWFheWAvFwiLFwi5Li6IFwiKyB0aGlzLl90YXJnZXREYXRhLnVzZXJpZCArXCIg5YWF5YC85oiQ5Yqf77yM5b2T5YmN5oi/5Y2h5Y+Y5pu05Li677yaXCIrcmV0LnRhcmdldGdlbXMrXCLjgIJcXG7oh6rouqvliankvZnvvJpcIisgcmV0LmdlbXMgLDEpOyAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLm1rQ2hhcmdlU3RhdGUuc3RyaW5nID0gXCLlhYXlgLzmiJDlip/jgIJcIjtcblxuICAgICAgICAgICAgdGhpcy5ta0RldGFpbC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ta1VzZXJJRC5zdHJpbmcgPSB0aGlzLl90YXJnZXREYXRhLnVzZXJpZDtcbiAgICAgICAgICAgIHRoaXMubWtVc2VyTmFtZS5zdHJpbmcgPSB0aGlzLl90YXJnZXREYXRhLm5hbWU7XG4gICAgICAgICAgICB0aGlzLm1rVXNlckdlbXMuc3RyaW5nID0gcmV0LnRhcmdldGdlbXM7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMTI1ODApIHtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIixcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lSFcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy8gICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KFwiZXhpdExvZ2luXCIpOyAgIFxuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB0aGlzLm1rQ2hhcmdlU3RhdGUuc3RyaW5nID0gXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZVcIjtcbiAgICAgICAgfSBlbHNlIGlmIChyZXQuZXJyY29kZSA9PSA0KSB7XG4gICAgICAgICAgICAvLyBjYy5hbGVydC5zaG93KFwi546p5a625YWF5YC8XCIsXCLoh6rouqvmiL/ljaHkuI3otrPvvIzlhYXlgLzlpLHotKXvvIFcIiwxKTsgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5ta0NoYXJnZVN0YXRlLnN0cmluZyA9IFwi6Ieq6Lqr5oi/5Y2h5LiN6Laz77yM5YWF5YC85aSx6LSl77yBXCI7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gNSkge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIueOqeWutuWFheWAvFwiLFwi5pyN5Yqh5Zmo57mB5b+Z77yM6K+356iN5ZCO5YaN6K+V77yBXCIsMSk7IFxuICAgICAgICAgICAgdGhpcy5ta0NoYXJnZVN0YXRlLnN0cmluZyA9IFwi5pyN5Yqh5Zmo57mB5b+Z77yM6K+356iN5ZCO5YaN6K+V77yBXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjYy5hbGVydC5zaG93KFwi546p5a625YWF5YC8XCIsXCLmnI3liqHlmajlvILluLjvvIzor7fnqI3lkI7lho3or5XvvIFcIiwxKTtcbiAgICAgICAgICAgIHRoaXMubWtDaGFyZ2VTdGF0ZS5zdHJpbmcgPSBcIuacjeWKoeWZqOW8guW4uO+8jOivt+eojeWQjuWGjeivle+8gVwiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICBvblNlYXJjaDogZnVuY3Rpb24gb25TZWFyY2goKSB7XG4gICAgICAgIHZhciBzZWFyY2hJZCA9IHRoaXMuaW5wdXRVc2VySUQuc3RyaW5nO1xuICAgICAgICBpZiAoIXNlYXJjaElkIHx8IHNlYXJjaElkID09IFwiXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRvU2VhcmNoVXNlcihzZWFyY2hJZCk7XG4gICAgfSxcblxuICAgIGRvU2VhcmNoVXNlcjogZnVuY3Rpb24gZG9TZWFyY2hVc2VyKHNlYXJjaElkKSB7XG4gICAgICAgIHRoaXMuX3RhcmdldERhdGEgPSBudWxsO1xuICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIuafpeivouS4reOAguOAguOAglwiO1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogY2MudXNlcmRhdGEudG9rZW4sXG4gICAgICAgICAgICB1c2VyaWQ6IHNlYXJjaElkXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvc2VhcmNoX3VzZXJcIiwgZGF0YSwgdGhpcy5zZWFyY2hCYWNrLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBzZWFyY2hCYWNrOiBmdW5jdGlvbiBzZWFyY2hCYWNrKHJldCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXQpO1xuXG4gICAgICAgIGlmIChyZXQuZXJyY29kZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIuafpeivouaIkOWKn1wiO1xuXG4gICAgICAgICAgICB0aGlzLnJlc1VzZXJJRC5zdHJpbmcgPSByZXQudXNlcmlkO1xuICAgICAgICAgICAgdGhpcy5yZXNVc2VyTmFtZS5zdHJpbmcgPSByZXQubmFtZSwgdGhpcy5yZXNVc2VyR2Vtcy5zdHJpbmcgPSByZXQuZ2VtcztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dEdlbXMuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldERhdGEgPSByZXQ7XG5cbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMTI1ODApIHtcbiAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIiwgXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZUhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChcImV4aXRMb2dpblwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLmnKrojrflvpfnm7jlhbPkv6Hmga/vvIzor7fnoa7orqTnjqnlrrZJRFwiO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzliNGFjd0hDYXRPdllod2VvZHhYckRXJywgJ3BhZ2VfY3JlYXRlX2RlYWxlcl9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2VfZGVhbGVyXFxwYWdlX2NyZWF0ZV9kZWFsZXJfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpbnB1dEFjY291bnQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIGlucHV0TmFtZTogY2MuRWRpdEJveCxcbiAgICAgICAgaW5wdXRQd2Q6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1zZzogY2MuTGFiZWwsXG4gICAgICAgIHJlc3VsdDogY2MuTm9kZSxcbiAgICAgICAgc3RhdGU6IGNjLkxhYmVsLFxuICAgICAgICBpbmZvczogY2MuTm9kZSxcbiAgICAgICAgbWtJZDogY2MuTGFiZWwsXG4gICAgICAgIG1rTmFtZTogY2MuTGFiZWwsXG4gICAgICAgIG1rUHdkOiBjYy5MYWJlbCxcbiAgICAgICAgX3RlbXA6IG51bGxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMubXNnLnN0cmluZyA9IFwi5paw5aKe5Luj55CG5ZCO77yM5q2k5Luj55CG6Ieq5Yqo5oiQ5Li66Ieq6Lqr5LiL57qn5Luj55CG44CCXCI7XG4gICAgICAgIHRoaXMuaGlkZVJlc3VsdCgpO1xuICAgIH0sXG5cbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgb25DcmVhdGVDbGljazogZnVuY3Rpb24gb25DcmVhdGVDbGljaygpIHtcbiAgICAgICAgdmFyIHBob25lID0gdGhpcy5pbnB1dEFjY291bnQuc3RyaW5nO1xuICAgICAgICB2YXIgbmFtZSA9IHRoaXMuaW5wdXROYW1lLnN0cmluZztcbiAgICAgICAgdmFyIHB3ZCA9IHRoaXMuaW5wdXRQd2Quc3RyaW5nO1xuXG4gICAgICAgIGlmICghcGhvbmUgfHwgcGhvbmUgPT0gXCJcIiB8fCAhbmFtZSB8fCBuYW1lID09IFwiXCIgfHwgIXB3ZCB8fCBwd2QgPT0gXCJcIikge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIumUmeivr1wiLFwi5L+h5oGv5LiN5a6M5pW077yM6K+35qOA5p+l5L+h5oGv44CCXCIsMSk7XG4gICAgICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIuS/oeaBr+S4jeWujOaVtO+8jOivt+ajgOafpeS/oeaBr+OAglwiO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLmhpZGVSZXN1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5fdGVtcCA9IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICAgICAgcHdkOiBwd2QsXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLmlrDlop7ku6PnkIZcIixcIuivt+ehruiupOS/oeaBr++8mlxcbuaJi+acuuWPt++8mlwiICsgcGhvbmUgKyBcIlxcbuS7o+eQhuWQjeensO+8mlwiICtuYW1lKyBcIlxcbuWIneWni+Wvhuegge+8mlwiICtwd2QgLDAsdGhpcy5kb0NyZWF0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuZG9DcmVhdGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9DcmVhdGU6IGZ1bmN0aW9uIGRvQ3JlYXRlKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0ICYmIHRoaXMuX3RlbXApIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRGVhbGVyKHRoaXMuX3RlbXAucGhvbmUsIHRoaXMuX3RlbXAubmFtZSwgdGhpcy5fdGVtcC5wd2QpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICBhZGREZWFsZXI6IGZ1bmN0aW9uIGFkZERlYWxlcihwaG9uZSwgbmFtZSwgcHdkKSB7XG4gICAgICAgIGlmICghcGhvbmUgfHwgcGhvbmUgPT0gXCJcIiB8fCAhbmFtZSB8fCBuYW1lID09IFwiXCIgfHwgIXB3ZCB8fCBwd2QgPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5tc2cgPSBcIui+k+WFpeS/oeaBr+S4jeWQiOazle+8jOivt+ajgOafpei+k+WFpeOAglwiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogY2MudXNlcmRhdGEudG9rZW4sXG4gICAgICAgICAgICBhY2NvdW50OiBwaG9uZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwd2QsXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvY3JlYXRlX2RlYWxlclwiLCBkYXRhLCB0aGlzLmFkZE5ld0JhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGFkZE5ld0JhY2s6IGZ1bmN0aW9uIGFkZE5ld0JhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG4gICAgICAgIHRoaXMucmVzdWx0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaW5mb3MuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGlmIChyZXQuZXJyY29kZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnN0cmluZyA9IFwi5Yib5bu65oiQ5Yqf77yBKOivt+WmpeWWhOS/neeuoeWIm+W7uuS/oeaBrylcIjtcbiAgICAgICAgICAgIC8vIHRoaXMucmVzdWx0SW5mby5zdHJpbmcgPSBcIuazqOWGjOaIkOWKn++8mlxcbuaJi+acuuWPt++8mlwiICsgdGhpcy5fdGVtcC5waG9uZSArIFwiXFxu5Luj55CG5ZCN56ew77yaXCIgK3RoaXMuX3RlbXAubmFtZSsgXCJcXG7liJ3lp4vlr4bnoIHvvJpcIiArdGhpcy5fdGVtcC5wd2QgO1xuICAgICAgICAgICAgdGhpcy5ta0lkLnN0cmluZyA9IHRoaXMuX3RlbXAucGhvbmU7XG4gICAgICAgICAgICB0aGlzLm1rTmFtZS5zdHJpbmcgPSB0aGlzLl90ZW1wLm5hbWU7XG4gICAgICAgICAgICB0aGlzLm1rUHdkLnN0cmluZyA9IHRoaXMuX3RlbXAucHdkO1xuXG4gICAgICAgICAgICB0aGlzLmluZm9zLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMTI1ODApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RyaW5nID0gXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZVcIjtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIixcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lSFcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy8gICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KFwiZXhpdExvZ2luXCIpOyAgIFxuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RyaW5nID0gXCLliJvlu7rlpLHotKXvvIzor7flsJ3or5Xmm7TmjaLmiYvmnLrlj7fmiJbmo4Dmn6XovpPlhaXmmK/lkKbmraPnoa5cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIuaWsOWinuS7o+eQhlwiLFwi5pyN5Yqh5Zmo5byC5bi477yM6K+356iN5ZCO5YaN6K+V77yBXCIsMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdHJpbmcgPSBcIuacjeWKoeWZqOW8guW4uO+8jOivt+eojeWQjuWGjeivle+8gVwiO1xuICAgICAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIG9uQ29weUNsaWNrOiBmdW5jdGlvbiBvbkNvcHlDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuX3RlbXApIHtcbiAgICAgICAgICAgIHZhciBpbmZvcyA9IFwi5Luj55CG6LSm5Y+377yaXFxuXCI7XG4gICAgICAgICAgICBpbmZvcyArPSBcIuS7o+eQhklEOlwiICsgdGhpcy5fdGVtcC5waG9uZSArIFwiXFxuXCI7XG4gICAgICAgICAgICBpbmZvcyArPSBcIuS7o+eQhuWQjeensDpcIiArIHRoaXMuX3RlbXAubmFtZSArIFwiXFxuXCI7XG4gICAgICAgICAgICBpbmZvcyArPSBcIuWIneWni+WvhueggTpcIiArIHRoaXMuX3RlbXAucHdkICsgXCJcXG5cIjtcbiAgICAgICAgICAgIHRoaXMuY29weVR4dChpbmZvcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29weVR4dDogZnVuY3Rpb24gY29weVR4dCh2YWx1ZSkge1xuICAgICAgICB2YXIgY2xpcGJvYXJkQnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgY2xpcGJvYXJkQnVmZmVyLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246Zml4ZWQ7IHRvcDotMTBweDsgbGVmdDotMTBweDsgaGVpZ2h0OjA7IHdpZHRoOjA7IG9wYWNpdHk6MDsnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsaXBib2FyZEJ1ZmZlcik7XG5cbiAgICAgICAgY2xpcGJvYXJkQnVmZmVyLmZvY3VzKCk7XG4gICAgICAgIGNsaXBib2FyZEJ1ZmZlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjbGlwYm9hcmRCdWZmZXIuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgY2xpcGJvYXJkQnVmZmVyLnZhbHVlLmxlbmd0aCk7XG4gICAgICAgIHZhciBzdWNjZWVkZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdWNjZWVkZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjYy5sb2coXCLmi7fotJ3plJnor69cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1Y2NlZWRlZCkge1xuICAgICAgICAgICAgY2MubG9nKFwi5oiQ5Yqf5ou36LSdXCIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGhpZGVSZXN1bHQ6IGZ1bmN0aW9uIGhpZGVSZXN1bHQoKSB7XG4gICAgICAgIHRoaXMucmVzdWx0LmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1MDVkNFZZVUpOQWlaYnFSR0h2S1lPdycsICdwYWdlX2RlYWxlcl9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2VfZGVhbGVyXFxwYWdlX2RlYWxlcl9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBvblNlYXJjaERlYWxlcjogZnVuY3Rpb24gb25TZWFyY2hEZWFsZXIoKSB7XG4gICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2VfZGVhbGVyL3BhZ2Vfc2VhcmNoX2RlYWxlclwiLCAwLCB0cnVlLCBcIuS7o+eQhlwiKTtcbiAgICB9LFxuXG4gICAgb25DcmVhdGVEZWFsZXI6IGZ1bmN0aW9uIG9uQ3JlYXRlRGVhbGVyKCkge1xuICAgICAgICBjYy5hcHAuc2hvd1BhZ2UoXCJwcmVmYWJlcy9wYWdlX2RlYWxlci9wYWdlX2NyZWF0ZV9kZWFsZXJcIiwgMCwgdHJ1ZSwgXCLku6PnkIZcIik7IC8vXCJwYWdlX2NoYXJnZV91c2VyX3NjcmlwdFwiLHthY2NvdW50OmNjLnVzZXIuYWNjb3VudCx0YXJnZXQ6MTIzNDU2fVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwMTY1OXIzTnpSUDdxeVE4alFnWUovVicsICdwYWdlX2RldGFpbF9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2VfZGV0YWlsXFxwYWdlX2RldGFpbF9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRpdGxlOiBjYy5MYWJlbCxcbiAgICAgICAgYWNjb3VudDogY2MuTGFiZWwsXG4gICAgICAgIGdlbXM6IGNjLkxhYmVsLFxuICAgICAgICBzY29yZTogY2MuTGFiZWwsXG4gICAgICAgIGFsbEdlbXM6IGNjLkxhYmVsLFxuICAgICAgICBhbGxTY29yZTogY2MuTGFiZWwsXG4gICAgICAgIGFsbFN1YnM6IGNjLkxhYmVsLFxuXG4gICAgICAgIG9wdGlvbnM6IGNjLk5vZGUsXG5cbiAgICAgICAgX2N1ckFjY291bnQ6IG51bGwsXG4gICAgICAgIF90YXJnZXREYXRhOiBudWxsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnRpdGxlLnN0cmluZyA9IFwi6ZSZ6K+vXCI7XG4gICAgICAgIHRoaXMub3B0aW9ucy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2V0aW5nKCk7XG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoYWNjb3VudCkge1xuICAgICAgICB0aGlzLnNlYXJjaEluZm8oYWNjb3VudCk7XG4gICAgfSxcbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgb25LcGlDbGljazogZnVuY3Rpb24gb25LcGlDbGljaygpIHtcbiAgICAgICAgLy/ot7PovazliLAga3BpIOeVjOmdolxuICAgICAgICAvKipwcmVmYWIsaW5kZXgsc2hvd0JhY2ssbmFtZSxzY3JpcHROYW1lLGRldGFpbCxzaW5nbGUsc3RvcmUqL1xuICAgICAgICBjYy5hcHAuc2hvd1BhZ2UoXCJwcmVmYWJlcy9wYWdlX2twaS9wYWdlX2twaVwiLCAwLCB0cnVlLCBcIuS7o+eQhuS/oeaBr1wiLCBcInBhZ2Vfa3BpX3NjcmlwdFwiLCB0aGlzLl9jdXJBY2NvdW50KTtcbiAgICB9LFxuXG4gICAgLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgc2VhcmNoSW5mbzogZnVuY3Rpb24gc2VhcmNoSW5mbyhhY2NvdW50KSB7XG4gICAgICAgIHRoaXMuX2N1ckFjY291bnQgPSBhY2NvdW50O1xuICAgICAgICBpZiAoIXRoaXMuX2N1ckFjY291bnQpIHtcbiAgICAgICAgICAgIHRoaXMudGl0bGUuc3RyaW5nID0gXCLmlbDmja7plJnor6/vvIFcIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90YXJnZXREYXRhID0gbnVsbDtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogY2MudXNlcmRhdGEudG9rZW4sXG4gICAgICAgICAgICBhY2NvdW50OiB0aGlzLl9jdXJBY2NvdW50XG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvc2VhcmNoX2RlYWxlclwiLCBkYXRhLCB0aGlzLnNlYXJjaEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNlYXJjaEJhY2s6IGZ1bmN0aW9uIHNlYXJjaEJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG5cbiAgICAgICAgaWYgKCFyZXQuZXJyY29kZSB8fCByZXQuZXJyY29kZSA9PSAwKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3RhcmdldERhdGEgPSByZXQ7XG5cbiAgICAgICAgICAgIHRoaXMudGl0bGUuc3RyaW5nID0gcmV0Lm5hbWU7XG4gICAgICAgICAgICB0aGlzLmFjY291bnQuc3RyaW5nID0gcmV0LmFjY291bnQ7XG4gICAgICAgICAgICB0aGlzLmdlbXMuc3RyaW5nID0gcmV0LmdlbXMsIHRoaXMuc2NvcmUuc3RyaW5nID0gcmV0LnNjb3JlO1xuXG4gICAgICAgICAgICB0aGlzLmFsbEdlbXMuc3RyaW5nID0gcmV0LmFsbF9nZW1zO1xuICAgICAgICAgICAgdGhpcy5hbGxTY29yZS5zdHJpbmcgPSByZXQuYWxsX3Njb3JlO1xuICAgICAgICAgICAgdGhpcy5hbGxTdWJzLnN0cmluZyA9IHJldC5hbGxfc3VicztcblxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMTI1ODApIHtcbiAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIiwgXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZUhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChcImV4aXRMb2dpblwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZS5zdHJpbmcgPSBcIuaVsOaNrumUmeivr1wiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlZmF1bHRTZXRpbmc6IGZ1bmN0aW9uIGRlZmF1bHRTZXRpbmcoKSB7XG4gICAgICAgIHRoaXMudGl0bGUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5hY2NvdW50LnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuZ2Vtcy5zdHJpbmcgPSBcIlwiLCB0aGlzLnNjb3JlLnN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy5hbGxHZW1zLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuYWxsU2NvcmUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5hbGxTdWJzLnN0cmluZyA9IFwiXCI7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBjOTIwN0pvWGhIV3JnUWZkMWl1bW9UJywgJ3BhZ2VfaW5kZXhfc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX2luZGV4XFxwYWdlX2luZGV4X3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGlzdENvbnRlbnQ6IGNjLk5vZGUsXG4gICAgICAgIGxpc3RJdGVtOiBjYy5QcmVmYWIsXG4gICAgICAgIF9teU9wdGlvbnM6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIHRoaXMuYWRkT3B0aW9ucygwLCBcIuWFrOWRilwiLCAwLCBcInByZWZhYmVzL3BhZ2Vfbm90aWNlL3BhZ2Vfbm90aWNlXCIsIDAsIHRydWUsIFwi6aaW6aG1XCIpO1xuICAgICAgICB0aGlzLmFkZE9wdGlvbnMoMCwgXCLku6PnkIbllYbln45cIiwgMSwgXCJwcmVmYWJlcy9wYWdlX3Nob3AvcGFnZV9zaG9wXCIsIDAsIHRydWUsIFwi6aaW6aG1XCIpO1xuXG4gICAgICAgIHRoaXMuYWRkT3B0aW9ucygwLCBcIuafpeivouS7o+eQhlwiLCAyLCBcInByZWZhYmVzL3BhZ2VfZGVhbGVyL3BhZ2Vfc2VhcmNoX2RlYWxlclwiLCAwLCB0cnVlLCBcIummlumhtVwiKTtcbiAgICAgICAgdGhpcy5hZGRPcHRpb25zKDAsIFwi5paw5aKe5Luj55CGXCIsIDMsIFwicHJlZmFiZXMvcGFnZV9kZWFsZXIvcGFnZV9jcmVhdGVfZGVhbGVyXCIsIDAsIHRydWUsIFwi6aaW6aG1XCIpO1xuXG4gICAgICAgIHRoaXMuYWRkT3B0aW9ucygwLCBcIueOqeWutuWFheWNoVwiLCA0LCBcInByZWZhYmVzL3BhZ2Vfc2VsbC9wYWdlX2NoYXJnZV91c2VyXCIsIDAsIHRydWUsIFwi6aaW6aG1XCIpO1xuICAgICAgICB0aGlzLmFkZE9wdGlvbnMoMCwgXCLku6PnkIblhYXljaFcIiwgNSwgXCJwcmVmYWJlcy9wYWdlX3NlbGwvcGFnZV9jaGFyZ2VfZGVhbGVyXCIsIDAsIHRydWUsIFwi6aaW6aG1XCIpO1xuXG4gICAgICAgIHRoaXMuYWRkT3B0aW9ucygwLCBcIuaIkeeahOS/oeaBr1wiLCA2LCBcInByZWZhYmVzL3BhZ2VfbWluZS9wYWdlX21pbmVcIiwgMCwgdHJ1ZSwgXCLpppbpobVcIiwgXCJwYWdlX21pbmVfc2NyaXB0XCIsIGNjLnVzZXJkYXRhLmFjY291bnQpO1xuXG4gICAgICAgIHRoaXMuc2hvd0l0ZW1zKCk7XG4gICAgfSxcblxuICAgIHNob3dJdGVtczogZnVuY3Rpb24gc2hvd0l0ZW1zKCkge1xuICAgICAgICB0aGlzLmNsZWFyTGlzdCgpO1xuXG4gICAgICAgIHZhciBwcml2aWxlZ2UgPSBjYy51c2VyZGF0YS5wcml2aWxlZ2VfbGV2ZWw7XG4gICAgICAgIHZhciBwcmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9teU9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHByaXZpbGVnZSA+PSBlbGVtZW50LnByaXZpbGVnZSkge1xuICAgICAgICAgICAgICAgIHByZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgIHByZS5nZXRDb21wb25lbnQoXCJvcHRpb25faXRlbV9zY3JpcHRcIikuc2hvd0luZm8oZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgcHJlLnBhcmVudCA9IHRoaXMubGlzdENvbnRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvL3ByZWZhYixpbmRleCxzaG93QmFjayxuYW1lLHNjcmlwdE5hbWUsZGV0YWlsLHNpbmdsZSxzdG9yZVxuICAgIGFkZE9wdGlvbnM6IGZ1bmN0aW9uIGFkZE9wdGlvbnMocHJpdmlsZWdlLCBuYW1lLCBpY29uLCBwcmVmYWIsIGxheWVySW5keCwgc2hvd0JhY2ssIGJhY2tOYW1lLCBzY3JpcHROYW1lLCBkZXRhaWwsIHNpbmdsZSwgc3RvcmUpIHtcbiAgICAgICAgdGhpcy5fbXlPcHRpb25zLnB1c2goeyBwcml2aWxlZ2U6IHByaXZpbGVnZSxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsIGljb246IGljb24sXG4gICAgICAgICAgICBwcmVmYWI6IHByZWZhYixcbiAgICAgICAgICAgIGxheWVySW5keDogbGF5ZXJJbmR4LFxuICAgICAgICAgICAgc2hvd0JhY2s6IHNob3dCYWNrLCBiYWNrTmFtZTogYmFja05hbWUsXG4gICAgICAgICAgICBzY3JpcHROYW1lOiBzY3JpcHROYW1lLCBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgICAgIHNpbmdsZTogc2luZ2xlLFxuICAgICAgICAgICAgc3RvcmU6IHN0b3JlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjbGVhckxpc3Q6IGZ1bmN0aW9uIGNsZWFyTGlzdCgpIHtcbiAgICAgICAgdGhpcy5saXN0Q29udGVudC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyN2VhY29zajIxRVRiL2hJYW9oVFBWMScsICdwYWdlX2twaV9zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2Vfa3BpXFxwYWdlX2twaV9zY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRpdGxlOiBjYy5MYWJlbCxcbiAgICAgICAgeWVhcjogY2MuTGFiZWwsXG4gICAgICAgIGxpc3RDb250ZW50OiBjYy5Ob2RlLFxuICAgICAgICBsaXN0SXRlbTogY2MuUHJlZmFiLFxuICAgICAgICBtc2c6IGNjLkxhYmVsLFxuICAgICAgICBfY3VyQWNjb3VudDogbnVsbCxcbiAgICAgICAgX2N1clllYXI6IG51bGwsXG4gICAgICAgIF9jdXJEYXRhOiBudWxsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnNob3dNc2coKTtcbiAgICAgICAgdGhpcy50aXRsZS5zdHJpbmcgPSBcIktQSVwiO1xuICAgICAgICB0aGlzLl9jdXJZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB0aGlzLnllYXIuc3RyaW5nID0gdGhpcy5fY3VyWWVhcjtcbiAgICB9LFxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIG9uUHJlQ2xpY2s6IGZ1bmN0aW9uIG9uUHJlQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuX2N1clllYXItLTtcbiAgICAgICAgdGhpcy55ZWFyLnN0cmluZyA9IHRoaXMuX2N1clllYXI7XG4gICAgICAgIHRoaXMuc2VhcmNoSW5mbygpO1xuICAgIH0sXG5cbiAgICBvbk5leHRDbGljazogZnVuY3Rpb24gb25OZXh0Q2xpY2soKSB7XG4gICAgICAgIHRoaXMuX2N1clllYXIrKztcbiAgICAgICAgdGhpcy55ZWFyLnN0cmluZyA9IHRoaXMuX2N1clllYXI7XG4gICAgICAgIHRoaXMuc2VhcmNoSW5mbygpO1xuICAgIH0sXG5cbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGFjY291bnQpIHtcbiAgICAgICAgdGhpcy5fY3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgICAgIHRoaXMuc2VhcmNoSW5mbyhhY2NvdW50KTtcbiAgICB9LFxuXG4gICAgc2VhcmNoSW5mbzogZnVuY3Rpb24gc2VhcmNoSW5mbygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJBY2NvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnNob3dNc2coXCLmn6Xor6LmlbDmja7plJnor69cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpdGxlLlN0cmluZyA9IFwiS1BJOlwiICsgdGhpcy5fY3VyQWNjb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xlYW5MaXN0KCk7XG5cbiAgICAgICAgdGhpcy5fdGFyZ2V0RGF0YSA9IG51bGw7XG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgdG9rZW46IGNjLnVzZXJkYXRhLnRva2VuLFxuICAgICAgICAgICAgYWNjb3VudDogdGhpcy5fY3VyQWNjb3VudCxcbiAgICAgICAgICAgIHllYXI6IHRoaXMuX2N1clllYXJcbiAgICAgICAgfTtcbiAgICAgICAgY2MuaHR0cC5zZW5kUmVxdWVzdChcIi9zZWFyY2hfZGVhbGVyX2twaVwiLCBkYXRhLCB0aGlzLnNlYXJjaEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNlYXJjaEJhY2s6IGZ1bmN0aW9uIHNlYXJjaEJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG5cbiAgICAgICAgaWYgKCFyZXQuZXJyY29kZSB8fCByZXQuZXJyY29kZSA9PSAwKSB7XG4gICAgICAgICAgICBpZiAocmV0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TXNnKFwi5pqC5peg5pWw5o2uXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcmU7XG4gICAgICAgICAgICByZXQuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHByZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgIHByZS5nZXRDb21wb25lbnQoXCJrcGlfaXRlbV9zY3JpcHRcIikuc2hvd0luZm8oZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgcHJlLnBhcmVudCA9IHRoaXMubGlzdENvbnRlbnQ7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXQuZXJyY29kZSA9PSAxMjU4MCkge1xuICAgICAgICAgICAgY2MuYWxlcnQuc2hvdyhcIuaPkOekulwiLCBcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lSFcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KFwiZXhpdExvZ2luXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dNc2coXCLmn6Xor6LmlbDmja7plJnor69cIik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgc2hvd01zZzogZnVuY3Rpb24gc2hvd01zZyh2YWx1ZSkge1xuICAgICAgICB0aGlzLm1zZy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIlwiO1xuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUgIT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1zZy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYW5MaXN0OiBmdW5jdGlvbiBjbGVhbkxpc3QoKSB7XG4gICAgICAgIHRoaXMubGlzdENvbnRlbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBiZDlkWXhTcUpHOXJwNzBieGgwQVhvJywgJ3BhZ2VfbG9naW5fc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX2xvZ2luXFxwYWdlX2xvZ2luX3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHh0X2FjY291bnQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIHR4dF9wd2Q6IGNjLkVkaXRCb3gsXG4gICAgICAgIGxhYmVsX21zZzogY2MuTGFiZWxcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBhY2NvdW50ID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFwiKTtcbiAgICAgICAgdmFyIHB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpO1xuICAgICAgICB2YXIgbGFzdExvZ2luID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibGFzdExvZ2luXCIpO1xuICAgICAgICBpZiAoIWxhc3RMb2dpbikgbGFzdExvZ2luID0gMDtcbiAgICAgICAgLy8x5bCP5pe25aSx5pWIXG4gICAgICAgIGlmIChhY2NvdW50ICYmIHB3ZCAmJiBEYXRlLm5vdygpIC0gbGFzdExvZ2luIDwgMzYwMDAwMCkge1xuICAgICAgICAgICAgdGhpcy5kb0xvZ2luKGFjY291bnQsIHB3ZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJwYXNzd29yZFwiKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0xvZ2luKGFjY291bnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93TXNnKCk7XG4gICAgfSxcblxuICAgIHNob3dMb2dpbjogZnVuY3Rpb24gc2hvd0xvZ2luKGFjY291bnQpIHtcbiAgICAgICAgdGhpcy50eHRfYWNjb3VudC5zdHJpbmcgPSBhY2NvdW50IHx8IFwiXCI7XG4gICAgICAgIHRoaXMudHh0X3B3ZC5zdHJpbmcgPSBcIlwiO1xuICAgIH0sXG5cbiAgICBvbkJlZ2luRWRpdDogZnVuY3Rpb24gb25CZWdpbkVkaXQoKSB7XG4gICAgICAgIHRoaXMuc2hvd01zZygpO1xuICAgIH0sXG5cbiAgICBkb0xvZ2luOiBmdW5jdGlvbiBkb0xvZ2luKHVpZCwgcHdkKSB7XG4gICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uIGZuKHJldCkge1xuICAgICAgICAgICAgaWYgKHJldC5lcnJjb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2MubG9nKFwi55m76ZmG5oiQ5YqfXCIgKyByZXQubmFtZSk7XG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibGFzdExvZ2luXCIsIERhdGUubm93KCkpO1xuICAgICAgICAgICAgICAgIGNjLnVzZXJkYXRhID0gcmV0O1xuICAgICAgICAgICAgICAgIGNjLmFwcC5yZW1vdmVQYWdlKDIsIDApO1xuICAgICAgICAgICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2VfaW5kZXgvcGFnZV9pbmRleFwiLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRcIik7XG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TXNnKFwi55So5oi35ZCN5oiW5a+G56CB5LiN5q2j56Gu77yBXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWNjb3VudDogdWlkLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHB3ZFxuICAgICAgICB9O1xuXG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRcIiwgZGF0YS5hY2NvdW50KTtcbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGFzc3dvcmRcIiwgZGF0YS5wYXNzd29yZCk7XG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxhc3RMb2dpblwiLCAwKTtcbiAgICAgICAgY2MuaHR0cC5zZW5kUmVxdWVzdChcIi9sb2dpblwiLCBkYXRhLCBmbi5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgc2hvd01zZzogZnVuY3Rpb24gc2hvd01zZyhtc2cpIHtcbiAgICAgICAgaWYgKG1zZyAmJiBtc2cgIT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5sYWJlbF9tc2cuc3RyaW5nID0gbXNnO1xuICAgICAgICAgICAgdGhpcy5sYWJlbF9tc2cubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWxfbXNnLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uTG9naW5CdG5DbGljazogZnVuY3Rpb24gb25Mb2dpbkJ0bkNsaWNrKCkge1xuICAgICAgICB2YXIgdWlkID0gdGhpcy50eHRfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciBwd2QgPSB0aGlzLnR4dF9wd2Quc3RyaW5nO1xuICAgICAgICBpZiAoIXVpZCB8fCB1aWQgPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5zaG93TXNnKFwi6K+36L6T5YWl55So5oi35ZCNIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXB3ZCB8fCBwd2QgPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5zaG93TXNnKFwi6K+36L6T5YWl5a+G56CB77yBXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9Mb2dpbih1aWQsIHB3ZCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3ZTI4OFhwbEpwRW9JR1h5M0YyendQNycsICdwYWdlX21lbnVfc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX21lbnVcXHBhZ2VfbWVudV9zY3JpcHQuanNcblxudmFyIE1FTlVfSVRFTSA9IHJlcXVpcmUoXCJtZW51X2l0ZW1fc2NyaXB0XCIpO1xuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1lbnVzOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBNRU5VX0lURU1cbiAgICAgICAgfSxcbiAgICAgICAgX2N1clN0YXRlOiAtMVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5tZW51cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LmlzT24gPSBmYWxzZTtcbiAgICAgICAgICAgIGVsZW1lbnQubm9kZS5vbihcImNoYW5nZVwiLCB0aGlzLm9uU2VsZWN0Q2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fY3VyU3RhdGUgPSAtMTtcbiAgICAgICAgLy8gdGhpcy5zZXRTZWxldE1lbnUoX2N1clN0YXRlKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnNldFNlbGV0TWVudSgwKTtcbiAgICB9LFxuXG4gICAgb25TZWxlY3RDaGFuZ2U6IGZ1bmN0aW9uIG9uU2VsZWN0Q2hhbmdlKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIG9sZHMgPSB0aGlzLm1lbnVzW3RoaXMuX2N1clN0YXRlXTtcbiAgICAgICAgb2xkcy5pc09uID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIHRhcmcgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIHZhciBpbmR4ID0gdGhpcy5tZW51cy5pbmRleE9mKHRhcmcuZ2V0Q29tcG9uZW50KFwibWVudV9pdGVtX3NjcmlwdFwiKSk7XG4gICAgICAgIHRoaXMuc2V0U2VsZXRNZW51KGluZHgpO1xuICAgIH0sXG5cbiAgICBzZXRTZWxldE1lbnU6IGZ1bmN0aW9uIHNldFNlbGV0TWVudShpbmRleCkge1xuICAgICAgICBpZiAodGhpcy5fY3VyU3RhdGUgPT0gaW5kZXggfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMubWVudXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fY3VyU3RhdGUgPSBpbmRleDtcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcbiAgICAgICAgY2MuYXBwLnJlbW92ZVBhZ2UoMCwgMCk7XG4gICAgICAgIC8qKnByZWZhYixpbmRleCxzaG93QmFjayxuYW1lLHNjcmlwdE5hbWUsZGV0YWlsLHNpbmdsZSxzdG9yZSovXG4gICAgICAgIHN3aXRjaCAodGhpcy5fY3VyU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBjYy5hcHAuc2hvd1BhZ2UoXCJwcmVmYWJlcy9wYWdlX2luZGV4L3BhZ2VfaW5kZXhcIiwgMCwgZmFsc2UsIG51bGwsIG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2Vfc2hvcC9wYWdlX3Nob3BcIiwgMCwgZmFsc2UsIG51bGwsIG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2Vfc2VsbC9wYWdlX3NlbGxcIiwgMCwgZmFsc2UsIG51bGwsIG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2VfZGVhbGVyL3BhZ2VfZGVhbGVyXCIsIDAsIGZhbHNlLCBudWxsLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjYy5hcHAuc2hvd1BhZ2UoXCJwcmVmYWJlcy9wYWdlX21pbmUvcGFnZV9taW5lXCIsIDAsIGZhbHNlLCBudWxsLCBcInBhZ2VfbWluZV9zY3JpcHRcIiwgY2MudXNlcmRhdGEuYWNjb3VudCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVN0YXRlOiBmdW5jdGlvbiBfdXBkYXRlU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJTdGF0ZSA8IDAgfHwgdGhpcy5fY3VyU3RhdGUgPj0gdGhpcy5tZW51cy5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZW51cy5sZW5ndGg7IGluZGV4KyspIHtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID09IHRoaXMuX2N1clN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51c1tpbmRleF0uaXNPbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1lbnVzW2luZGV4XS5pc09uID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWZhMTVCbkgvUkJJS282azNwbVdoQ3cnLCAncGFnZV9taW5lX3NjcmlwdCcpO1xuLy8gcmVzb3VyY2VzXFxwcmVmYWJlc1xccGFnZV9taW5lXFxwYWdlX21pbmVfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0aXRsZTogY2MuTGFiZWwsXG4gICAgICAgIGFjY291bnQ6IGNjLkxhYmVsLFxuICAgICAgICBnZW1zOiBjYy5MYWJlbCxcbiAgICAgICAgc2NvcmU6IGNjLkxhYmVsLFxuICAgICAgICBhbGxHZW1zOiBjYy5MYWJlbCxcbiAgICAgICAgYWxsU2NvcmU6IGNjLkxhYmVsLFxuICAgICAgICBhbGxTdWJzOiBjYy5MYWJlbCxcblxuICAgICAgICBvcHRpb25zOiBjYy5Ob2RlLFxuXG4gICAgICAgIF9jdXJBY2NvdW50OiBudWxsLFxuICAgICAgICBfdGFyZ2V0RGF0YTogbnVsbFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy50aXRsZS5zdHJpbmcgPSBcIumUmeivr1wiO1xuICAgICAgICB0aGlzLm9wdGlvbnMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGVmYXVsdFNldGluZygpO1xuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGFjY291bnQpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hJbmZvKGFjY291bnQpO1xuICAgIH0sXG4gICAgLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIG9uS3BpQ2xpY2s6IGZ1bmN0aW9uIG9uS3BpQ2xpY2soKSB7XG4gICAgICAgIC8v6Lez6L2s5YiwIGtwaSDnlYzpnaJcbiAgICAgICAgLyoqcHJlZmFiLGluZGV4LHNob3dCYWNrLG5hbWUsc2NyaXB0TmFtZSxkZXRhaWwsc2luZ2xlLHN0b3JlKi9cbiAgICAgICAgY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9rcGkvcGFnZV9rcGlcIiwgMCwgdHJ1ZSwgXCLmiJHnmoTkv6Hmga9cIiwgXCJwYWdlX2twaV9zY3JpcHRcIiwgdGhpcy5fY3VyQWNjb3VudCk7XG4gICAgfSxcblxuICAgIG9uQ2hhbmdlUHdkQ2xpY2s6IGZ1bmN0aW9uIG9uQ2hhbmdlUHdkQ2xpY2soKSB7XG4gICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2VfcHdkL3BhZ2VfcHdkXCIsIDAsIHRydWUsIFwi5oiR55qE5L+h5oGvXCIpO1xuICAgIH0sXG5cbiAgICBvbkV4aXRMb2dpbkNsaWNrOiBmdW5jdGlvbiBvbkV4aXRMb2dpbkNsaWNrKCkge1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50XCIpO1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJwYXNzd29yZFwiKTtcbiAgICAgICAgY2MuYXBwLmNsZWFuQWxsTGF5ZXJzKCk7XG4gICAgICAgIGNjLmFwcC5zaG93UGFnZShcInByZWZhYmVzL3BhZ2VfbG9naW4vcGFnZV9sb2dpblwiLCAyKTtcbiAgICB9LFxuXG4gICAgLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgc2VhcmNoSW5mbzogZnVuY3Rpb24gc2VhcmNoSW5mbyhhY2NvdW50KSB7XG4gICAgICAgIHRoaXMuX2N1ckFjY291bnQgPSBhY2NvdW50O1xuICAgICAgICBpZiAoIXRoaXMuX2N1ckFjY291bnQpIHtcbiAgICAgICAgICAgIHRoaXMudGl0bGUuc3RyaW5nID0gXCLmlbDmja7plJnor6/vvIFcIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90YXJnZXREYXRhID0gbnVsbDtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogY2MudXNlcmRhdGEudG9rZW4sXG4gICAgICAgICAgICBhY2NvdW50OiB0aGlzLl9jdXJBY2NvdW50XG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvc2VhcmNoX2RlYWxlclwiLCBkYXRhLCB0aGlzLnNlYXJjaEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNlYXJjaEJhY2s6IGZ1bmN0aW9uIHNlYXJjaEJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG5cbiAgICAgICAgaWYgKCFyZXQuZXJyY29kZSB8fCByZXQuZXJyY29kZSA9PSAwKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3RhcmdldERhdGEgPSByZXQ7XG5cbiAgICAgICAgICAgIHRoaXMudGl0bGUuc3RyaW5nID0gcmV0Lm5hbWU7XG4gICAgICAgICAgICB0aGlzLmFjY291bnQuc3RyaW5nID0gcmV0LmFjY291bnQ7XG4gICAgICAgICAgICB0aGlzLmdlbXMuc3RyaW5nID0gcmV0LmdlbXMsIHRoaXMuc2NvcmUuc3RyaW5nID0gcmV0LnNjb3JlO1xuXG4gICAgICAgICAgICB0aGlzLmFsbEdlbXMuc3RyaW5nID0gcmV0LmFsbF9nZW1zO1xuICAgICAgICAgICAgdGhpcy5hbGxTY29yZS5zdHJpbmcgPSByZXQuYWxsX3Njb3JlO1xuICAgICAgICAgICAgdGhpcy5hbGxTdWJzLnN0cmluZyA9IHJldC5hbGxfc3VicztcblxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMTI1ODApIHtcbiAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIiwgXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZUhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChcImV4aXRMb2dpblwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZS5zdHJpbmcgPSBcIuaVsOaNrumUmeivr1wiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlZmF1bHRTZXRpbmc6IGZ1bmN0aW9uIGRlZmF1bHRTZXRpbmcoKSB7XG4gICAgICAgIHRoaXMudGl0bGUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5hY2NvdW50LnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuZ2Vtcy5zdHJpbmcgPSBcIlwiLCB0aGlzLnNjb3JlLnN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy5hbGxHZW1zLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuYWxsU2NvcmUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy5hbGxTdWJzLnN0cmluZyA9IFwiXCI7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzRjZmE5N3J4bTlNcllId054Ryt5dCt6JywgJ3BhZ2Vfbm90aWNlX3NjcmlwdCcpO1xuLy8gcmVzb3VyY2VzXFxwcmVmYWJlc1xccGFnZV9ub3RpY2VcXHBhZ2Vfbm90aWNlX3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGlzdENvbnRlbnQ6IGNjLk5vZGUsXG4gICAgICAgIGxpc3RJdGVtOiBjYy5QcmVmYWIsXG4gICAgICAgIG1zZzogY2MuTGFiZWxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJDb250ZW50KCk7XG4gICAgICAgIHRoaXMuZ2V0Tm90aWNlKCk7XG4gICAgfSxcblxuICAgIGdldE5vdGljZTogZnVuY3Rpb24gZ2V0Tm90aWNlKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlblxuICAgICAgICB9O1xuICAgICAgICBjYy5odHRwLnNlbmRSZXF1ZXN0KFwiL2dldF9ub3RpY2VcIiwgZGF0YSwgdGhpcy5zZWFyY2hCYWNrLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBzZWFyY2hCYWNrOiBmdW5jdGlvbiBzZWFyY2hCYWNrKHJldCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXQpO1xuICAgICAgICBpZiAocmV0LmVycmNvZGUpIHtcbiAgICAgICAgICAgIGlmIChyZXQuZXJyY29kZSA9PSAxMjU4MCkge1xuICAgICAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIiwgXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZUhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoXCJleGl0TG9naW5cIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5hbGVydC5zaG93KFwi5p+l6K+i5Luj55CGXCIsIFwi5pyN5Yqh5Zmo5byC5bi477yM6K+356iN5ZCO5YaN6K+V77yBXCIsIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1Jlc3VsdChyZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNob3dSZXN1bHQ6IGZ1bmN0aW9uIHNob3dSZXN1bHQocmV0KSB7XG5cbiAgICAgICAgdGhpcy5jbGVhckNvbnRlbnQoKTtcbiAgICAgICAgaWYgKCFyZXQpIHJldHVybjtcbiAgICAgICAgaWYgKHJldC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2cubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubXNnLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBwcmU7XG4gICAgICAgIHJldC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBwcmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmxpc3RJdGVtKTtcbiAgICAgICAgICAgIHByZS5nZXRDb21wb25lbnQoXCJub3RpY2VfaXRlbV9zY3JpcHRcIikuc2hvd0luZm8oZWxlbWVudCk7XG4gICAgICAgICAgICBwcmUucGFyZW50ID0gdGhpcy5saXN0Q29udGVudDtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIGNsZWFyQ29udGVudDogZnVuY3Rpb24gY2xlYXJDb250ZW50KCkge1xuICAgICAgICB0aGlzLmxpc3RDb250ZW50LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2YwM2Q3b1lnMzFBcjVYR3JsK2hsRDdzJywgJ3BhZ2VfcHdkX3NjcmlwdCcpO1xuLy8gcmVzb3VyY2VzXFxwcmVmYWJlc1xccGFnZV9wd2RcXHBhZ2VfcHdkX3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaW5wdXRPbGQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIGlucHV0TmV3OiBjYy5FZGl0Qm94LFxuICAgICAgICBpbnB1dFJlbmV3OiBjYy5FZGl0Qm94LFxuICAgICAgICBtc2c6IGNjLkxhYmVsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBvbkNoYW5nZUNsaWNrOiBmdW5jdGlvbiBvbkNoYW5nZUNsaWNrKCkge1xuICAgICAgICB2YXIgb2xkID0gdGhpcy5pbnB1dE9sZC5zdHJpbmc7XG4gICAgICAgIHZhciBuZXdwd2QgPSB0aGlzLmlucHV0TmV3LnN0cmluZztcbiAgICAgICAgdmFyIHJlbmV3ID0gdGhpcy5pbnB1dFJlbmV3LnN0cmluZztcblxuICAgICAgICBpZiAoIW9sZCB8fCBvbGQgPT0gXCJcIiB8fCAhbmV3cHdkIHx8IG5ld3B3ZCA9PSBcIlwiIHx8ICFyZW5ldyB8fCByZW5ldyA9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIuaVsOaNruS4jeWujOaVtO+8jOivt+ajgOafpei+k+WFpe+8gVwiO1xuICAgICAgICAgICAgcmV0cnVuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld3B3ZCAhPSByZW5ldykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dE5ldy5zdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5pbnB1dFJlbmV3LnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIuS4pOasoeaWsOWvhueggei+k+WFpeS4jeWQjO+8jOivt+mHjeaWsOi+k+WFpe+8gVwiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYW5JbnB1dCgpO1xuICAgICAgICB0aGlzLmRvQ2hhbmdlKG9sZCwgbmV3cHdkKTtcbiAgICB9LFxuXG4gICAgZG9DaGFuZ2U6IGZ1bmN0aW9uIGRvQ2hhbmdlKG9sZHB3ZCwgbmV3cHdkKSB7XG4gICAgICAgIGlmICghb2xkcHdkIHx8IG9sZHB3ZCA9PSBcIlwiIHx8ICFuZXdwd2QgfHwgbmV3cHdkID09IFwiXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlbixcbiAgICAgICAgICAgIGFjY291bnQ6IGNjLnVzZXJkYXRhLmFjY291bnQsXG4gICAgICAgICAgICBvbGRwd2Q6IG9sZHB3ZCxcbiAgICAgICAgICAgIG5ld3B3ZDogbmV3cHdkXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvY2hhbmdlX293bl9wd2RcIiwgZGF0YSwgdGhpcy5jaGFuZ2VCYWNrLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VCYWNrOiBmdW5jdGlvbiBjaGFuZ2VCYWNrKHJldCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXQpO1xuICAgICAgICBpZiAocmV0LmVycmNvZGUgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLkv67mlLnmiJDlip/vvIEo6K+35aal5ZaE5L+d566h5a+G56CB5L+h5oGvKVwiO1xuICAgICAgICAgICAgLy/ph43mlrDnmbvlvZVcbiAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRcIik7XG4gICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJwYXNzd29yZFwiKTtcbiAgICAgICAgICAgIGNjLmFwcC5jbGVhbkFsbExheWVycygpO1xuICAgICAgICAgICAgY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9sb2dpbi9wYWdlX2xvZ2luXCIsIDIpO1xuICAgICAgICB9IGVsc2UgaWYgKHJldC5lcnJjb2RlID09IDEyNTgwKSB7XG4gICAgICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lVwiO1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIuaPkOekulwiLFwi55m75b2V54q25oCB5byC5bi477yM6ZyA6KaB6YeN5paw55m75b2VIVwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoXCJleGl0TG9naW5cIik7ICAgXG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXQuZXJyY29kZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLkv67mlLnlpLHotKXvvIHor7fmo4Dmn6Xljp/lr4bnoIHmmK/lkKbmraPnoa5cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIuaWsOWinuS7o+eQhlwiLFwi5pyN5Yqh5Zmo5byC5bi477yM6K+356iN5ZCO5YaN6K+V77yBXCIsMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLmnI3liqHlmajlvILluLjvvIzor7fnqI3lkI7lho3or5XvvIFcIjtcbiAgICAgICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYW5JbnB1dDogZnVuY3Rpb24gY2xlYW5JbnB1dCgpIHtcbiAgICAgICAgdGhpcy5pbnB1dE9sZC5zdHJpbmcgPSBcIlwiO1xuICAgICAgICB0aGlzLmlucHV0TmV3LnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuaW5wdXRSZW5ldy5zdHJpbmcgPSBcIlwiO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhNzE4OGVtQ01WQ1k3QzNQRElNKytPZycsICdwYWdlX3NlYXJjaF9kZWFsZXJfc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX2RlYWxlclxccGFnZV9zZWFyY2hfZGVhbGVyX3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaW5wdXRBY2NvdW50OiBjYy5FZGl0Qm94LFxuICAgICAgICBsaXN0SXRlbTogY2MuUHJlZmFiLFxuXG4gICAgICAgIGxpc3RDb250ZW50OiBjYy5Ob2RlLFxuICAgICAgICBtc2c6IGNjLkxhYmVsLFxuICAgICAgICBwcmVQYWdlOiBjYy5Ob2RlLFxuICAgICAgICBuZXh0UGFnZTogY2MuTm9kZSxcbiAgICAgICAgbWF4Um93czogMTAsXG4gICAgICAgIF9jdXJJZHg6IDBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMubXNnLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xlYXJMaXN0KCk7XG4gICAgICAgIHRoaXMuaGlkZVBhZ2VCdG4oKTtcbiAgICB9LFxuXG4gICAgLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgc2VhcmNoQWxsRGVhbGVyOiBmdW5jdGlvbiBzZWFyY2hBbGxEZWFsZXIoc3RhcnQpIHtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlbixcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIHJvd3M6IHRoaXMubWF4Um93c1xuICAgICAgICB9O1xuICAgICAgICBjYy5odHRwLnNlbmRSZXF1ZXN0KFwiL3NlYXJjaF9zdWJfZGVhbGVyc1wiLCBkYXRhLCB0aGlzLnNlYXJjaEFsbEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNlYXJjaEFsbEJhY2s6IGZ1bmN0aW9uIHNlYXJjaEFsbEJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG4gICAgICAgIGlmIChyZXQuZXJyY29kZSkge1xuICAgICAgICAgICAgdGhpcy5tc2cubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHJldC5lcnJjb2RlID09IDEyNTgwKSB7XG4gICAgICAgICAgICAgICAgY2MuYWxlcnQuc2hvdyhcIuaPkOekulwiLCBcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lSFcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChcImV4aXRMb2dpblwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmn6Xor6Lku6PnkIZcIiwgXCLmnI3liqHlmajlvILluLjvvIzor7fnqI3lkI7lho3or5XvvIFcIiwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2MuYWxlcnQuc2hvdyhcIuafpeivolwiLFwi5p+l6K+i5oiQ5YqfXCIpXG4gICAgICAgICAgICB0aGlzLm1zZy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zaG93UmVzdWx0KHJldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2VhcmNoRGVhbGVyOiBmdW5jdGlvbiBzZWFyY2hEZWFsZXIoYWNjb3VudCkge1xuICAgICAgICBpZiAoIWFjY291bnQgfHwgYWNjb3VudCA9PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogY2MudXNlcmRhdGEudG9rZW4sXG4gICAgICAgICAgICBhY2NvdW50OiBhY2NvdW50XG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvZ2V0X3N1Yl9kZWFsZXJfYnlfYWNjb3VudFwiLCBkYXRhLCB0aGlzLnNlYXJjaEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNlYXJjaEJhY2s6IGZ1bmN0aW9uIHNlYXJjaEJhY2socmV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJldCk7XG4gICAgICAgIHRoaXMuY2xlYXJMaXN0KCk7XG4gICAgICAgIGlmIChyZXQuZXJyY29kZSkge1xuICAgICAgICAgICAgdGhpcy5tc2cubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHJldC5lcnJjb2RlID09IDEyNTgwKSB7XG4gICAgICAgICAgICAgICAgY2MuYWxlcnQuc2hvdyhcIuaPkOekulwiLCBcIueZu+W9leeKtuaAgeW8guW4uO+8jOmcgOimgemHjeaWsOeZu+W9lSFcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChcImV4aXRMb2dpblwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXNnLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNob3dSZXN1bHQoW3JldF0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNob3dSZXN1bHQ6IGZ1bmN0aW9uIHNob3dSZXN1bHQocmV0KSB7XG4gICAgICAgIGlmICghcmV0KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5zaG93UGFnZUJ0bih0aGlzLl9jdXJJZHgsIHJldC5sZW5ndGgpO1xuICAgICAgICB0aGlzLmNsZWFyTGlzdCgpO1xuICAgICAgICB2YXIgcHJlO1xuICAgICAgICByZXQuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgcHJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5saXN0SXRlbSk7XG4gICAgICAgICAgICBwcmUuZ2V0Q29tcG9uZW50KFwiZGVhbGVyX2l0ZW1fc2NyaXB0XCIpLnNob3dJbmZvKGVsZW1lbnQpO1xuICAgICAgICAgICAgcHJlLm9uKFwic2hvd0RlYWxlckRldGFpbFwiLCB0aGlzLnNob3dEZXRhaWwuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBwcmUucGFyZW50ID0gdGhpcy5saXN0Q29udGVudDtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNob3dEZXRhaWw6IGZ1bmN0aW9uIHNob3dEZXRhaWwoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmRldGFpbCkge1xuICAgICAgICAgICAgY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9kZXRhaWwvcGFnZV9kZXRhaWxcIiwgMCwgdHJ1ZSwgXCLmn6Xor6Lku6PnkIZcIiwgXCJwYWdlX2RldGFpbF9zY3JpcHRcIiwgZXZlbnQuZGV0YWlsKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5sb2coXCJzaG93IGRlYWxlciBkZXRhaWxcIik7XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIG9uU2VhcmNoT25lQ2xpY2s6IGZ1bmN0aW9uIG9uU2VhcmNoT25lQ2xpY2soKSB7XG4gICAgICAgIHZhciBhY2NvdW50ID0gdGhpcy5pbnB1dEFjY291bnQuc3RyaW5nO1xuICAgICAgICBpZiAoIWFjY291bnQgfHwgYWNjb3VudCA9PSBcIlwiKSB7XG4gICAgICAgICAgICBjYy5hbGVydC5zaG93KFwi57K+5YeG5p+l6K+iXCIsIFwi6K+36L6T5YWl5Luj55CGSUTjgIJcIiwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJJZHggPSAwO1xuICAgICAgICAgICAgdGhpcy5oaWRlUGFnZUJ0bigpO1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hEZWFsZXIoYWNjb3VudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25TZWFyY2hQZXJDbGljazogZnVuY3Rpb24gb25TZWFyY2hQZXJDbGljaygpIHtcbiAgICAgICAgdGhpcy5fY3VySWR4IC09IHRoaXMubWF4Um93cztcbiAgICAgICAgaWYgKHRoaXMuX2N1cklkeCA8IDApIHRoaXMuX2N1cklkeCA9IDA7XG5cbiAgICAgICAgdGhpcy5zZWFyY2hBbGxEZWFsZXIodGhpcy5fY3VySWR4KTtcbiAgICB9LFxuXG4gICAgb25TZWFyY2hOZXh0Q2xpY2s6IGZ1bmN0aW9uIG9uU2VhcmNoTmV4dENsaWNrKCkge1xuICAgICAgICB0aGlzLl9jdXJJZHggKz0gdGhpcy5tYXhSb3dzO1xuICAgICAgICBpZiAodGhpcy5fY3VySWR4IDwgMCkgdGhpcy5fY3VySWR4ID0gMDtcbiAgICAgICAgdGhpcy5zZWFyY2hBbGxEZWFsZXIodGhpcy5fY3VySWR4KTtcbiAgICB9LFxuXG4gICAgb25TZWFyY2hBbGxDbGljazogZnVuY3Rpb24gb25TZWFyY2hBbGxDbGljaygpIHtcbiAgICAgICAgdGhpcy5fY3VySWR4ID0gMDtcbiAgICAgICAgdGhpcy5zZWFyY2hBbGxEZWFsZXIoMCk7XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgc2hvd1BhZ2VCdG46IGZ1bmN0aW9uIHNob3dQYWdlQnRuKHN0YXJ0LCBjdXJSb3dzKSB7XG4gICAgICAgIHRoaXMuaGlkZVBhZ2VCdG4oKTtcbiAgICAgICAgaWYgKHN0YXJ0ID49IHRoaXMubWF4Um93cykge1xuICAgICAgICAgICAgdGhpcy5wcmVQYWdlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyUm93cyA+PSB0aGlzLm1heFJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoaWRlUGFnZUJ0bjogZnVuY3Rpb24gaGlkZVBhZ2VCdG4oKSB7XG4gICAgICAgIHRoaXMucHJlUGFnZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXh0UGFnZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xlYXJMaXN0OiBmdW5jdGlvbiBjbGVhckxpc3QoKSB7XG4gICAgICAgIHRoaXMubGlzdENvbnRlbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGEzMWJUdktlcEEyNnVQaG5jZWxGUDgnLCAncGFnZV9zZWxsX3NjcmlwdCcpO1xuLy8gcmVzb3VyY2VzXFxwcmVmYWJlc1xccGFnZV9zZWxsXFxwYWdlX3NlbGxfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgLyoqcHJlZmFiLGluZGV4LHNob3dCYWNrLG5hbWUsc2NyaXB0TmFtZSxkZXRhaWwsc2luZ2xlLHN0b3JlKi9cbiAgICBvbkNoYXJnZVVzZXI6IGZ1bmN0aW9uIG9uQ2hhcmdlVXNlcigpIHtcbiAgICAgICAgY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9zZWxsL3BhZ2VfY2hhcmdlX3VzZXJcIiwgMCwgdHJ1ZSwgXCLllK7ljaFcIik7XG4gICAgfSxcblxuICAgIG9uQ2hhcmdlRGVhbGVyOiBmdW5jdGlvbiBvbkNoYXJnZURlYWxlcigpIHtcbiAgICAgICAgY2MuYXBwLnNob3dQYWdlKFwicHJlZmFiZXMvcGFnZV9zZWxsL3BhZ2VfY2hhcmdlX2RlYWxlclwiLCAwLCB0cnVlLCBcIuWUruWNoVwiKTsgLy9cInBhZ2VfY2hhcmdlX3VzZXJfc2NyaXB0XCIse2FjY291bnQ6Y2MudXNlci5hY2NvdW50LHRhcmdldDoxMjM0NTZ9XG4gICAgfSxcblxuICAgIG9uRnJlc2hJbmZvOiBmdW5jdGlvbiBvbkZyZXNoSW5mbygpIHt9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZmJjZWErUHVqMUZKNHZZOTJOeXhMelAnLCAncGFnZV9zaG9wX2xvZ19zY3JpcHQnKTtcbi8vIHJlc291cmNlc1xccHJlZmFiZXNcXHBhZ2Vfc2hvcF9sb2dcXHBhZ2Vfc2hvcF9sb2dfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBvcHRpb25zOiBjYy5Ob2RlLFxuICAgICAgICBwcmVQYWdlOiBjYy5Ob2RlLFxuICAgICAgICBuZXh0UGFnZTogY2MuTm9kZSxcbiAgICAgICAgbGlzdENvbnRlbnQ6IGNjLk5vZGUsXG4gICAgICAgIGxpc3RJdGVtOiBjYy5QcmVmYWIsXG4gICAgICAgIG1zZzogY2MuTGFiZWwsXG4gICAgICAgIG1heFJvd3M6IDEwLFxuICAgICAgICBfY3VySWR4OiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmNsZWFyTGlzdCgpO1xuICAgICAgICB0aGlzLmhpZGVQYWdlQnRuKCk7XG4gICAgICAgIHRoaXMuc2VhcmNoTG9ncygpO1xuICAgIH0sXG5cbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiAgICBzZWFyY2hBbGxMb2c6IGZ1bmN0aW9uIHNlYXJjaEFsbExvZyhzdGFydCkge1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgdG9rZW46IGNjLnVzZXJkYXRhLnRva2VuLFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgcm93czogdGhpcy5tYXhSb3dzXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvZ2V0X2J1eV9nb29kc19sb2dcIiwgZGF0YSwgdGhpcy5zZWFyY2hBbGxCYWNrLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBzZWFyY2hBbGxCYWNrOiBmdW5jdGlvbiBzZWFyY2hBbGxCYWNrKHJldCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXQpO1xuICAgICAgICBpZiAocmV0LmVycmNvZGUpIHtcbiAgICAgICAgICAgIGlmIChyZXQuZXJyY29kZSA9PSAxMjU4MCkge1xuICAgICAgICAgICAgICAgIGNjLmFsZXJ0LnNob3coXCLmj5DnpLpcIiwgXCLnmbvlvZXnirbmgIHlvILluLjvvIzpnIDopoHph43mlrDnmbvlvZUhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoXCJleGl0TG9naW5cIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5hbGVydC5zaG93KFwi5p+l6K+i5Luj55CGXCIsIFwi5pyN5Yqh5Zmo5byC5bi477yM6K+356iN5ZCO5YaN6K+V77yBXCIsIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNjLmFsZXJ0LnNob3coXCLmn6Xor6JcIixcIuafpeivouaIkOWKn1wiKVxuICAgICAgICAgICAgdGhpcy5zaG93UmVzdWx0KHJldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd1Jlc3VsdDogZnVuY3Rpb24gc2hvd1Jlc3VsdChyZXQpIHtcbiAgICAgICAgaWYgKCFyZXQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnNob3dQYWdlQnRuKHRoaXMuX2N1cklkeCwgcmV0Lmxlbmd0aCk7XG4gICAgICAgIHRoaXMuY2xlYXJMaXN0KCk7XG5cbiAgICAgICAgdGhpcy5tc2cubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHJldC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2cubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByZTtcbiAgICAgICAgcmV0LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGlzdEl0ZW0pO1xuICAgICAgICAgICAgcHJlLmdldENvbXBvbmVudChcInNob3BfbG9nX2l0ZW1fc2NyaXB0XCIpLnNob3dJbmZvKGVsZW1lbnQpO1xuICAgICAgICAgICAgcHJlLnBhcmVudCA9IHRoaXMubGlzdENvbnRlbnQ7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZWFyY2hMb2dzOiBmdW5jdGlvbiBzZWFyY2hMb2dzKCkge1xuICAgICAgICB0aGlzLl9jdXJJZHggPSAwO1xuICAgICAgICB0aGlzLnNlYXJjaEFsbExvZygwKTtcbiAgICB9LFxuXG4gICAgb25TZWFyY2hQZXJDbGljazogZnVuY3Rpb24gb25TZWFyY2hQZXJDbGljaygpIHtcbiAgICAgICAgdGhpcy5fY3VySWR4IC09IHRoaXMubWF4Um93cztcbiAgICAgICAgaWYgKHRoaXMuX2N1cklkeCA8IDApIHRoaXMuX2N1cklkeCA9IDA7XG5cbiAgICAgICAgdGhpcy5zZWFyY2hBbGxMb2codGhpcy5fY3VySWR4KTtcbiAgICB9LFxuXG4gICAgb25TZWFyY2hOZXh0Q2xpY2s6IGZ1bmN0aW9uIG9uU2VhcmNoTmV4dENsaWNrKCkge1xuICAgICAgICB0aGlzLl9jdXJJZHggKz0gdGhpcy5tYXhSb3dzO1xuICAgICAgICBpZiAodGhpcy5fY3VySWR4IDwgMCkgdGhpcy5fY3VySWR4ID0gMDtcbiAgICAgICAgdGhpcy5zZWFyY2hBbGxMb2codGhpcy5fY3VySWR4KTtcbiAgICB9LFxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgc2hvd1BhZ2VCdG46IGZ1bmN0aW9uIHNob3dQYWdlQnRuKHN0YXJ0LCBjdXJSb3dzKSB7XG4gICAgICAgIHRoaXMuaGlkZVBhZ2VCdG4oKTtcbiAgICAgICAgaWYgKHN0YXJ0ID49IHRoaXMubWF4Um93cykge1xuICAgICAgICAgICAgdGhpcy5wcmVQYWdlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyUm93cyA+PSB0aGlzLm1heFJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoaWRlUGFnZUJ0bjogZnVuY3Rpb24gaGlkZVBhZ2VCdG4oKSB7XG4gICAgICAgIHRoaXMucHJlUGFnZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXh0UGFnZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xlYXJMaXN0OiBmdW5jdGlvbiBjbGVhckxpc3QoKSB7XG4gICAgICAgIHRoaXMubGlzdENvbnRlbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmFhYTFrVEZSSkpnNmpjR1dQZmJxaTQnLCAncGFnZV9zaG9wX3NjcmlwdCcpO1xuLy8gcmVzb3VyY2VzXFxwcmVmYWJlc1xccGFnZV9zaG9wXFxwYWdlX3Nob3Bfc2NyaXB0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsaXN0Q29udGVudDogY2MuTm9kZSxcbiAgICAgICAgbGlzdEl0ZW06IGNjLlByZWZhYixcbiAgICAgICAgbXNnOiBjYy5MYWJlbCxcbiAgICAgICAgX2N1ckFjY291bnQ6IG51bGwsXG4gICAgICAgIF90YXJnZXREYXRhOiBudWxsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIlwiO1xuICAgICAgICB0aGlzLmNsZWFyTGlzdCgpO1xuICAgICAgICB0aGlzLnNlYXJjaEdvb2RzKCk7XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgc2VhcmNoR29vZHM6IGZ1bmN0aW9uIHNlYXJjaEdvb2RzKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiBjYy51c2VyZGF0YS50b2tlblxuICAgICAgICB9O1xuICAgICAgICBjYy5odHRwLnNlbmRSZXF1ZXN0KFwiL2dldF9nb29kc1wiLCBkYXRhLCB0aGlzLnNlYXJjaEdvb2RzQmFjay5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgc2VhcmNoR29vZHNCYWNrOiBmdW5jdGlvbiBzZWFyY2hHb29kc0JhY2socmV0KSB7XG4gICAgICAgIGlmICghcmV0KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbGVhckxpc3QoKTtcbiAgICAgICAgdmFyIHByZTtcbiAgICAgICAgcmV0LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGlzdEl0ZW0pO1xuICAgICAgICAgICAgcHJlLmdldENvbXBvbmVudChcImdvb2RzX2l0ZW1fc2NyaXB0XCIpLnNob3dJbmZvKGVsZW1lbnQpO1xuICAgICAgICAgICAgcHJlLm9uKFwiYnV5R29vZHNcIiwgdGhpcy5vbkJ1eUdvb2RzLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgcHJlLnBhcmVudCA9IHRoaXMubGlzdENvbnRlbnQ7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkJ1eUdvb2RzOiBmdW5jdGlvbiBvbkJ1eUdvb2RzKGV2ZW50KSB7XG4gICAgICAgIHZhciBkZXQgPSBldmVudC5kZXRhaWw7XG4gICAgICAgIGlmICghZGV0KSByZXR1cm47XG4gICAgICAgIGNjLmxvZyhcImJ1eSBnb29kc1wiICsgZGV0KTtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogY2MudXNlcmRhdGEudG9rZW4sXG4gICAgICAgICAgICBpZDogZGV0LmlkXG4gICAgICAgIH07XG4gICAgICAgIGNjLmh0dHAuc2VuZFJlcXVlc3QoXCIvYnV5X2dvb2RzXCIsIGRhdGEsIHRoaXMuYnV5QmFjay5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgYnV5QmFjazogZnVuY3Rpb24gYnV5QmFjayhyZXQpIHtcbiAgICAgICAgaWYgKCFyZXQpIHJldHVybjtcbiAgICAgICAgaWYgKHJldC5lcnJjb2RlID09IDApIHtcbiAgICAgICAgICAgIGlmIChyZXQuZ29vZHNfdHlwZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLotK3kubDmiJDlip/vvIHojrflvpfvvJpcIiArIHJldC5nb29kc19udW0gKyBcIuaIv+WNoVwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXQuZ29vZHNfdHlwZSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLotK3kubDmiJDlip/vvIHojrflvpfvvJpcIiArIHJldC5nb29kc19udW0gKyBcIumHkeW4gVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJldC5lcnJjb2RlID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMubXNnLnN0cmluZyA9IFwi5pWw5o2u6ZSZ6K+v77yM6K+356iN5ZCO5YaN6K+VXCI7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gMikge1xuICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLotKfluIHkuI3otrPvvIzotK3kubDlpLHotKXvvIFcIjtcbiAgICAgICAgfSBlbHNlIGlmIChyZXQuZXJyY29kZSA9PSAzKSB7XG4gICAgICAgICAgICB0aGlzLm1zZy5zdHJpbmcgPSBcIuezu+e7n+e5geW/me+8jOivt+eojeWQjuWGjeivleOAglwiO1xuICAgICAgICB9IGVsc2UgaWYgKHJldC5lcnJjb2RlID09IDQpIHtcbiAgICAgICAgICAgIHRoaXMubXNnLnN0cmluZyA9IFwi57O757uf6ZSZ6K+v77yM6K+36IGU57O75a6i5pyN5Lq65ZGY77yBXCI7XG4gICAgICAgIH0gZWxzZSBpZiAocmV0LmVycmNvZGUgPT0gNSkge1xuICAgICAgICAgICAgdGhpcy5tc2cuc3RyaW5nID0gXCLns7vnu5/nuYHlv5nvvIzor7fnqI3lkI7lho3or5XjgIJcIjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIG9uQnV5UmVjb3JkczogZnVuY3Rpb24gb25CdXlSZWNvcmRzKCkge1xuICAgICAgICBjYy5hcHAuc2hvd1BhZ2UoXCJwcmVmYWJlcy9wYWdlX3Nob3BfbG9nL3BhZ2Vfc2hvcF9sb2dcIiwgMCwgdHJ1ZSwgXCLllYbln45cIik7XG4gICAgfSxcblxuICAgIC8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgY2xlYXJMaXN0OiBmdW5jdGlvbiBjbGVhckxpc3QoKSB7XG4gICAgICAgIHRoaXMubGlzdENvbnRlbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2U4YWE3b1NMVVpPSm9nZVdwZFByQUVTJywgJ3Nob3BfbG9nX2l0ZW1fc2NyaXB0Jyk7XG4vLyByZXNvdXJjZXNcXHByZWZhYmVzXFxwYWdlX3Nob3BfbG9nXFxzaG9wX2xvZ19pdGVtX3NjcmlwdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGltZTogY2MuTGFiZWwsXG4gICAgICAgIGdvb2RzOiBjYy5MYWJlbCxcbiAgICAgICAgcHJpY2U6IGNjLkxhYmVsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBzaG93SW5mbzogZnVuY3Rpb24gc2hvd0luZm8oaXRlbSkge1xuICAgICAgICBpZiAoIWl0ZW0pIHJldHVybjtcbiAgICAgICAgdmFyIHQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0LnNldFRpbWUoaXRlbS50aW1lKTtcbiAgICAgICAgdGhpcy50aW1lLnN0cmluZyA9IHQudG9Mb2NhbGVTdHJpbmcoKTtcblxuICAgICAgICBpZiAoaXRlbS5nb29kc190eXBlID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZ29vZHMuc3RyaW5nID0gXCIrIFwiICsgaXRlbS5nb29kc19udW0gKyBcIuaIv+WNoVwiO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uZ29vZHNfdHlwZSA9PSAyKSB7XG4gICAgICAgICAgICB0aGlzLmdvb2RzLnN0cmluZyA9IFwiKyBcIiArIGl0ZW0uZ29vZHNfbnVtICsgXCLph5HluIFcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLnByaWNlX3R5cGUgPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5wcmljZS5zdHJpbmcgPSBcIi0gXCIgKyBpdGVtLmdvb2RzX3ByaWNlICsgXCLnp6/liIZcIjtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtLmdvb2RzX3R5cGUgPT0gMikge1xuICAgICAgICAgICAgdGhpcy5wcmljZS5zdHJpbmcgPSBcIi0gXCIgKyBpdGVtLmdvb2RzX3ByaWNlICsgXCLmiL/ljaFcIjtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
