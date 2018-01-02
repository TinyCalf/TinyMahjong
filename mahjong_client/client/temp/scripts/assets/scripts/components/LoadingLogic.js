"use strict";
cc._RFpush(module, '350d3Ry9aVIqJR27fP2H/z1', 'LoadingLogic');
// scripts\components\LoadingLogic.js

cc.Class({
    "extends": cc.Component,

    properties: {
        tipLabel: cc.Label,
        _stateStr: '',
        _progress: 0.0,
        _splash: null,
        _isLoading: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.initMgr();
        this.tipLabel.string = this._stateStr;

        this._splash = cc.find("Canvas/splash");
        this._splash.active = true;

        cc.vv.http.sendRequest("/mj_login", 1, function (data) {
            cc.sys.localStorage.setItem("youkeorweixin", data.data.youkeorweixin);
            if (cc.sys.localStorage.getItem("youkeorweixin") == "0" && cc.sys.os == cc.sys.OS_IOS) {
                cc.find("Canvas/New Label").active = false;
            }
        });

        var progress = this.node.getChildByName("progress");
        progress.getChildByName("progress").width = 0;
    },

    start: function start() {
        var self = this;
        var SHOW_TIME = 3000;
        var FADE_TIME = 500;
        if (cc.sys.os != cc.sys.OS_IOS || !cc.sys.isNative) {
            self._splash.active = true;
            var t = Date.now();
            var fn = function fn() {
                var dt = Date.now() - t;
                if (dt < SHOW_TIME) {
                    setTimeout(fn, 33);
                } else {
                    var op = (1 - (dt - SHOW_TIME) / FADE_TIME) * 255;
                    if (op < 0) {
                        self._splash.opacity = 0;
                        self.checkVersion();
                    } else {
                        self._splash.opacity = op;
                        setTimeout(fn, 33);
                    }
                }
            };
            setTimeout(fn, 33);
        } else {
            this._splash.active = false;
            this.checkVersion();
        }
    },

    initMgr: function initMgr() {
        cc.vv = {};
        var UserMgr = require("UserMgr");
        cc.vv.userMgr = new UserMgr();

        var ReplayMgr = require("ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();

        cc.vv.http = require("HTTP");
        cc.vv.global = require("Global");
        cc.vv.net = require("Net");

        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();

        var AnysdkMgr = require("AnysdkMgr");
        cc.vv.anysdkMgr = new AnysdkMgr();
        cc.vv.anysdkMgr.init();

        var VoiceMgr = require("VoiceMgr");
        cc.vv.voiceMgr = new VoiceMgr();
        cc.vv.voiceMgr.init();

        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();

        var Utils = require("Utils");
        cc.vv.utils = new Utils();

        cc.args = this.urlParse();
    },

    urlParse: function urlParse() {
        var params = {};
        if (window.location == null) {
            return params;
        }
        var name, value;
        var str = window.location.href; //取得整个地址栏
        var num = str.indexOf("?");
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }
        return params;
    },

    checkVersion: function checkVersion() {
        var self = this;
        var onGetVersion = function onGetVersion(ret) {
            if (ret.version == null) {
                console.log("error.");
            } else {
                cc.vv.SI = ret;
                if (ret.version != cc.VERSION) {
                    cc.find("Canvas/alert").active = true;
                } else {
                    self.startPreloading();
                }
            }
        };

        var xhr = null;
        var complete = false;
        var fnRequest = function fnRequest() {
            self._stateStr = "正在连接服务器";
            xhr = cc.vv.http.sendRequest("/get_serverinfo", null, function (ret) {
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn, 5000);
        };

        var fn = function fn() {
            if (!complete) {
                if (xhr) {
                    xhr.abort();
                    self._stateStr = "连接失败，即将重试";
                    setTimeout(function () {
                        fnRequest();
                    }, 5000);
                } else {
                    fnRequest();
                }
            }
        };
        fn();
    },

    onBtnDownloadClicked: function onBtnDownloadClicked() {
        cc.sys.openURL(cc.vv.SI.appweb);
    },

    startPreloading: function startPreloading() {
        this._stateStr = "正在加载资源，请稍候";
        this._isLoading = true;
        var self = this;

        cc.loader.onProgress = function (completedCount, totalCount, item) {
            //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if (self._isLoading) {
                self._progress = completedCount / totalCount;

                // var yx = this.node.getChildByName("yinxiao");
                var width = 790 * self._progress;
                var progress = self.node.getChildByName("progress");
                //progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.sfxVolume;
                progress.getChildByName("progress").width = width;
            }
        };

        cc.loader.loadResAll("textures", function (err, assets) {
            self.onLoadComplete();
        });
    },

    onLoadComplete: function onLoadComplete() {
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.director.loadScene("login");
        cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this._stateStr.length == 0) {
            return;
        }
        this.tipLabel.string = this._stateStr + ' ';
        if (this._isLoading) {
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";
        } else {
            var t = Math.floor(Date.now() / 1000) % 4;
            for (var i = 0; i < t; ++i) {
                this.tipLabel.string += '.';
            }
        }
    }
});

cc._RFpop();