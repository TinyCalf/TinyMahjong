"use strict";
cc._RF.push(module, '572a7Qfh69N9ZLXkNthANfi', 'Login');
// scripts/components/Login.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && (typeof args === "undefined" ? "undefined" : _typeof(args)) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                } else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    } else {
        return this;
    }
};

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _mima: null,
        _mimaIndex: 0,
        mjdl: 1 },

    // use this for initialization
    onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        if (!cc.vv) {
            cc.director.loadScene("loading");
            return;
        }
        cc.vv.http.url = cc.vv.http.master_url;
        cc.vv.net.addHandler('push_need_create_role', function () {
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");
        });

        cc.vv.audioMgr.playBGM("bgMain.mp3");

        this._mima = ["A", "A", "B", "B", "A", "B", "A", "B", "A", "A", "A", "B", "B", "B"];

        if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) {
            cc.find("Canvas/btn_yk").active = true;
        }

        var youkeorweixin = cc.sys.localStorage.getItem("youkeorweixin");
        //安卓只显示微信登陆
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("platform:" + cc.sys.OS_ANDROID + " OS_ANDROID.");
            cc.find("Canvas/btn_yk").active = false;
            cc.find("Canvas/z_weixindenglu").active = true;
        }
        //IOS审核版本 只显示游客登录 过审版本 只显示微信登陆
        else if (cc.sys.os == cc.sys.OS_IOS) {
                console.log("platform:" + cc.sys.OS_IOS + " OS_IOS.");
                if (youkeorweixin == "0") {
                    cc.find("Canvas/btn_yk").active = true;
                    cc.find("Canvas/z_weixindenglu").active = false;
                    cc.find("Canvas/yhxy").active = true;
                }
                if (youkeorweixin == "1" || youkeorweixin == "null") {
                    cc.find("Canvas/z_weixindenglu").active = true;
                    cc.find("Canvas/btn_yk").active = false;
                }
            } else {
                cc.find("Canvas/btn_yk").active = true;
                cc.find("Canvas/z_weixindenglu").active = false;
                console.log("platform:" + cc.sys.os + " dosn't implement share.");
            }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            cc.game.end();
        }, cc.Game);
    },

    start: function start() {
        var account = cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");
        if (account != null && sign != null) {
            var ret = {
                errcode: 0,
                account: account,
                sign: sign
            };
            cc.vv.userMgr.onAuth(ret);
        }
    },

    onBtnReturn: function onBtnReturn() {
        var yhxy = this.node.getChildByName("yhxy");
        yhxy.active = false;
    },
    check_mark: function check_mark() {
        var tyyhxy = this.node.getChildByName("tyyhxy");
        var btn_checkbox = tyyhxy.getChildByName("btn_checkbox");
        var check_mark = btn_checkbox.getChildByName("check_mark");
        if (this.mjdl == 1) {
            check_mark.active = false;
            this.mjdl = 0;
        } else {
            check_mark.active = true;
            this.mjdl = 1;
        }
        console.log("this.mjdl:" + this.mjdl);
    },
    yonghuxieyi: function yonghuxieyi() {

        var yhxy = this.node.getChildByName("yhxy");
        yhxy.active = true;
    },
    prompt: function prompt() {
        var prompt = this.node.getChildByName("prompt");
        prompt.active = false;
    },
    onBtnQuickStartClicked: function onBtnQuickStartClicked() {
        if (this.mjdl == 0) {
            var prompt = this.node.getChildByName("prompt");
            prompt.active = true;
            return;
        }
        console.log("ssy");

        cc.vv.userMgr.guestAuth();
    },

    onBtnDownloadClicked: function onBtnDownloadClicked() {
        cc.sys.openURL(cc.vv.SI.appweb);
    },

    onBtnWeichatClicked: function onBtnWeichatClicked() {

        var self = this;
        if (self.mjdl == 0) {
            var prompt = this.node.getChildByName("prompt");
            prompt.active = true;
            return;
        }
        console.log("ss");
        cc.vv.anysdkMgr.login();
    },

    onBtnMIMAClicked: function onBtnMIMAClicked(event) {
        if (this._mima[this._mimaIndex] == event.target.name) {
            this._mimaIndex++;
            if (this._mimaIndex == this._mima.length) {
                cc.find("Canvas/btn_yk").active = true;
            }
        } else {
            console.log("oh ho~~~");
            this._mimaIndex = 0;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();