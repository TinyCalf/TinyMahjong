cc.Class({
    extends: cc.Component,

    properties: {
        _mahjongtype:null,
        _koufei:null,
        _quanshu:null,
        _peizi:false,
        _qidui:false,
        _fengqing:false,
        _yitiaolong:false,
        _difen:null,
        _types:[],
    },

    // use this for initialization
    onLoad: function () {
        //有多种玩法，跌倒胡 扬州麻将
        this._types = ["ddh","yzmj"];

        //隐藏除第一种外的其他玩法 界面
        for(var i = 1 ; i < this._types.length ; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
    },

    onBtnBack:function () {
        this.node.active = false;
    },

    onBtnOK:function(event){
        this.node.active = false;
        //确定游戏类型
        var type = event.target.parent.name;
        //分别进入不同的创建逻辑
        if(type=="ddh"){
            this.createRoomDDH();
        }else if(type=="yzmj"){
            this.createRoomYZMJ();
        }
    },

    onTypeClicked:function(event){
      console.log(event.target.parent.name);
      this.switchType(event.target.parent.name);
    },

    //tab界面切换
    switchType:function(type) {
        for(var i = 0 ; i < this._types.length ; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
        this.node.getChildByName(type).active = true;
    },

    createRoomDDH:function(){

        //获取需要的所有选项

        //这里一定要小写，后端会直接拼接这个字符串
        var type = "ddh";

        this._koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._koufei.push(n);
            }
        }

        this._quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._quanshu.push(n);
            }
        }

        var self = this;
        var onCreate = function(ret){
          console.log("房间创建完成")
          console.log(ret)
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if(ret.errcode == 2222){
                    cc.vv.alert.show("提示","房卡不足，创建房间失败!");
                }
                else{
                    cc.vv.alert.show("提示","创建房间失败,错误码:" + ret.errcode);
                }
            }
            else{
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var koufei = 0;
        for(var i = 0; i < self._koufei.length; ++i){
            if(self._koufei[i].checked){
                koufei = i;
                break;
            }
        }

        var quanshu = 0;
        for(var i = 0; i < self._quanshu.length; ++i){
            if(self._quanshu[i].checked){
                quanshu = i;
                break;
            }
        }
        

        var conf = {
            type:type,
            koufei:koufei,
            quanshu:quanshu,
            peizi:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("peizi").getComponent("CheckBox").checked,
            qidui:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("qidui").getComponent("CheckBox").checked,
            fengqing:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("fengqing").getComponent("CheckBox").checked,
            yitiaolong:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("yitiaolong").getComponent("CheckBox").checked,
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
        console.log(conf)
        cc.vv.http.sendRequest("/create_private_room",data,onCreate);
    },

    createRoomYZMJ:function(){

        //获取需要的所有选项

        //这里一定要小写，后端会直接拼接这个字符串
        var type = "yzmj";

        this._koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._koufei.push(n);
            }
        }

        this._quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._quanshu.push(n);
            }
        }
        
        this._difen = [];
        var t = this.node.getChildByName(type).getChildByName("difen");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._difen.push(n);
            }
        }

        var self = this;
        var onCreate = function(ret){
          console.log("房间创建完成")
          console.log(ret)
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if(ret.errcode == 2222){
                    cc.vv.alert.show("提示","房卡不足，创建房间失败!");
                }
                else{
                    cc.vv.alert.show("提示","创建房间失败,错误码:" + ret.errcode);
                }
            }
            else{
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var koufei = 0;
        for(var i = 0; i < self._koufei.length; ++i){
            if(self._koufei[i].checked){
                koufei = i;
                break;
            }
        }

        var quanshu = 0;
        for(var i = 0; i < self._quanshu.length; ++i){
            if(self._quanshu[i].checked){
                quanshu = i;
                break;
            }
        }
        
        var difen = 0;
        for(var i = 0; i < self._difen.length; ++i){
            if(self._difen[i].checked){
                difen = i;
                break;
            }
        }
        

        var conf = {
            type:type,
            koufei:koufei,
            quanshu:quanshu,
            difen:difen,
            peizi:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("peizi").getComponent("CheckBox").checked,
            qidui:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("qidui").getComponent("CheckBox").checked,
            fengqing:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("fengqing").getComponent("CheckBox").checked,
            yitiaolong:this.node.getChildByName(type).getChildByName("wanfa").getChildByName("yitiaolong").getComponent("CheckBox").checked,
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
        console.log(conf)
        cc.vv.http.sendRequest("/create_private_room",data,onCreate);
    },

     update: function (dt) {
        var type = "ddh";
        var fangka = 1;

        var __koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                __koufei.push(n);
            }
        }
        var __quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                __quanshu.push(n);
            }
        }
        
        var quanshu = 0;
        for(var i = 0; i < __quanshu.length; ++i){
            if(__quanshu[i].checked){
                quanshu = i;
                break;
            }
        }
        
       var koufei = 0;
        for(var i = 0; i < __koufei.length; ++i){
            if(__koufei[i].checked){
                koufei = i;
                break;
            }
        }
        
        if(quanshu==0 && koufei==0) fangka = 3
        if(quanshu==1 && koufei==0) fangka = 7
        if(quanshu==2 && koufei==0) fangka = 15
        
        if(quanshu==0 && koufei==1) fangka = 1
        if(quanshu==1 && koufei==1) fangka = 2
        if(quanshu==2 && koufei==1) fangka = 4
        
        this.node.getChildByName(type).getChildByName("btn_ok").getChildByName("num").getComponent(cc.Label).string = "× " + fangka
        
        
        
        
        var type = "yzmj";
        var fangka = 1;

        var __koufei = [];
        var t = this.node.getChildByName(type).getChildByName("koufei");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                __koufei.push(n);
            }
        }
        var __quanshu = [];
        var t = this.node.getChildByName(type).getChildByName("quanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                __quanshu.push(n);
            }
        }
        
        var quanshu = 0;
        for(var i = 0; i < __quanshu.length; ++i){
            if(__quanshu[i].checked){
                quanshu = i;
                break;
            }
        }
        
       var koufei = 0;
        for(var i = 0; i < __koufei.length; ++i){
            if(__koufei[i].checked){
                koufei = i;
                break;
            }
        }
        
        if(quanshu==0 && koufei==0) fangka = 3
        if(quanshu==1 && koufei==0) fangka = 7
        if(quanshu==2 && koufei==0) fangka = 15
        
        if(quanshu==0 && koufei==1) fangka = 1
        if(quanshu==1 && koufei==1) fangka = 2
        if(quanshu==2 && koufei==1) fangka = 4
        
        this.node.getChildByName(type).getChildByName("btn_ok").getChildByName("num").getComponent(cc.Label).string = "× " + fangka
        
        
     }
});
