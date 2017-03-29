cc.Class({
    "extends": cc.Component,

    properties: {
        _leixingxuanze: null,
        _koufei: null,
        _quanshu: null,
        _jiesuan: null,
        _wanfaxuanze: null,
        _types: [] },

    //定义多种游戏类型
    // use this for initialization
    onLoad: function onLoad() {
        //有多种玩法，沈家门麻将 定海麻将 推到胡麻将
        this._types = ["SJMMJ", "DHMJ", "TDH"];

        //隐藏除第一种外的其他玩法 界面
        for (var i = 1; i < this._types.length; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
    },

    onBtnBack: function onBtnBack() {
        this.node.active = false;
    },

    onBtnOK: function onBtnOK(event) {
        this.node.active = false;
        //确定游戏类型
        var type = event.target.parent.name;
        //分别进入不同的创建逻辑
        //TODO：让添加一个游戏和规则更加方便
        if (type == "SJMMJ") {
            this.createRoomSJMMJ();
        } else if (type == "DHMJ") {
            //this.createRoomDHMJ();
        } else if (type == "TDH") {
                //this.createRoomTDH();
            }
    },

    onTypeClicked: function onTypeClicked(event) {
        this.switchType(event.target.parent.children[1].name);
    },

    //tab界面切换
    switchType: function switchType(type) {
        for (var i = 0; i < this._types.length; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
        this.node.getChildByName(type).active = true;
    },

    createRoomSJMMJ: function createRoomSJMMJ() {

        //获取需要的所有选项

        var type = "SJMMJ";

        this._koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._koufei.push(n);
            }
        }

        this._quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._quanshu.push(n);
            }
        }

        this._jiesuan = [];
        var t = this.node.getChildByName(type).getChildByName("jiesuan");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._jiesuan.push(n);
            }
        }

        this._wanfaxuanze = [];
        var t = this.node.getChildByName(type).getChildByName("wanfaxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("CheckBox");
            if (n != null) {
                this._wanfaxuanze.push(n);
            }
        }

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