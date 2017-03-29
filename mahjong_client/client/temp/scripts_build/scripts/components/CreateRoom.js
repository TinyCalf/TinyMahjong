"use strict";
cc._RFpush(module, 'eec07HsL4pBn5/PiT3SYBew', 'CreateRoom');
// scripts\components\CreateRoom.js

cc.Class({
    "extends": cc.Component,

    properties: {
        _leixingxuanze: null,
        _koufei: null,
        _quanshu: null,
        _jiesuan: null,
        _wanfaxuanze: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._leixingxuanze.push(n);
            }
        }

        this._koufei = [];
        var t = this.node.getChildByName("koufei");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._koufei.push(n);
            }
        }

        this._quanshu = [];
        var t = this.node.getChildByName("quanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._quanshu.push(n);
            }
        }

        this._jiesuan = [];
        var t = this.node.getChildByName("jiesuan");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._jiesuan.push(n);
            }
        }

        this._wanfaxuanze = [];
        var t = this.node.getChildByName("wanfaxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("CheckBox");
            if (n != null) {
                this._wanfaxuanze.push(n);
            }
        }
    },

    onBtnBack: function onBtnBack() {
        this.node.active = false;
    },

    onBtnOK: function onBtnOK() {
        this.node.active = false;
        this.createRoom();
    },

    createRoom: function createRoom() {
        var self = this;
        var onCreate = function onCreate(ret) {
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("提示", "房卡不足，创建房间失败!");
                } else {
                    cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            } else {
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var hongzhongdanghua = self._wanfaxuanze[0].checked;

        var type = 0;
        for (var i = 0; i < self._leixingxuanze.length; ++i) {
            if (self._leixingxuanze[i].checked) {
                type = i;
                break;
            }
        }

        //TODO：把三种游戏的不同类型加上
        if (type == 0) {
            type = "sjmmj";
        } else if (type == 1) {
            type = "dhmj";
        } else {
            type = "tdh";
        }
        //type= "xzdd";

        var koufei = 0;
        for (var i = 0; i < self._koufei.length; ++i) {
            if (self._koufei[i].checked) {
                koufei = i;
                break;
            }
        }

        var quanshu = 0;
        for (var i = 0; i < self._quanshu.length; ++i) {
            if (self._quanshu[i].checked) {
                quanshu = i;
                break;
            }
        }

        var jiesuan = 0;
        for (var i = 0; i < self._jiesuan.length; ++i) {
            if (self._jiesuan[i].checked) {
                jiesuan = i;
                break;
            }
        }

        var conf = {
            type: type,
            hongzhongdanghua: hongzhongdanghua,
            koufei: koufei,
            quanshu: quanshu,
            jiesuan: jiesuan
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    }

});

cc._RFpop();