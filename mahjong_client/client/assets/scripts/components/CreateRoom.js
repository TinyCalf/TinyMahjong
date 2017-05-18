cc.Class({
    extends: cc.Component,

    properties: {
        _leixingxuanze:null,
        _koufei:null,
        _quanshu:null,
        _jiesuan:null,
        _wanfaxuanze:null,
        _types:[],//定义多种游戏类型 
        _sjmmj_jifei:0,//房主出资 or 玩家平分
        _sjmmj_jushu:0,//8盘 or 1圈
        _dhmj_jifei:0,
        _dhmj_jushu:0,
        _tdh_jifei:0,
        _tdh_jushu:0,
    },

    // use this for initialization
    onLoad: function () {
        //有多种玩法，沈家门麻将 定海麻将 推到胡麻将
        this._types = ["sjmmj","dhmj","tdh"];
        
        //隐藏除第一种外的其他玩法 界面
        for(var i = 1 ; i < this._types.length ; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
        
        //房主开8局 3砖  平摊每个人1砖
        //房主开一圈 6砖   平摊每个人 2砖
        //初始化计费
        
    },
    
    onBtnBack:function(){
        this.node.active = false;
    },
    
    onBtnOK:function(event){
        this.node.active = false;
        //确定游戏类型
        var type = event.target.parent.name;
        //分别进入不同的创建逻辑
        //TODO：让添加一个游戏和规则更加方便
        if(type=="sjmmj"){
            this.createRoomSJMMJ();
        }else if(type=="dhmj"){
            this.createRoomDHMJ();
        }else if(type=="tdh"){
            this.createRoomTDH();
        }
    },
    
    onTypeClicked:function(event){
        this.switchType(event.target.parent.children[1].name);
    },
    
    onSJMMJfangzhuClicked:function (event) {
        this._sjmmj_jifei = 0;
        var cost = 1;
        if(this._sjmmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._sjmmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/sjmmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onSJMMJwanjiaClicked:function (event) {
        this._sjmmj_jifei = 1;
        var cost = 1;
        if(this._sjmmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._sjmmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/sjmmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onSJMMJ8panClicked:function (event) {
        this._sjmmj_jushu = 0;
        var cost = 1;
        if(this._sjmmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._sjmmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/sjmmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onSJMMJ1quanClicked:function (event) {
        this._sjmmj_jushu = 1;
        var cost = 1;
        if(this._sjmmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._sjmmj_jushu == 0) cost = cost;
        else cost = 2 * cost;
        cc.find("Canvas/CreateRoom/sjmmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    
    onDHMJfangzhuClicked:function (event) {
        this._dhmj_jifei = 0;
        var cost = 1;
        if(this._dhmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._dhmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/dhmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onDHMJwanjiaClicked:function (event) {
        this._dhmj_jifei = 1;
        var cost = 1;
        if(this._dhmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._dhmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/dhmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onDHMJ8panClicked:function (event) {
        this._dhmj_jushu = 0;
        var cost = 1;
        if(this._dhmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._dhmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/dhmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onDHMJ1quanClicked:function (event) {
        this._dhmj_jushu = 1;
        var cost = 1;
        if(this._dhmj_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._dhmj_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/dhmj/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    
    onTDHfangzhuClicked:function (event) {
        this._tdh_jifei = 0;
        var cost = 1;
        if(this._tdh_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._tdh_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/tdh/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onTDHwanjiaClicked:function (event) {
        this._tdh_jifei = 1;
        var cost = 1;
        if(this._tdh_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._tdh_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/tdh/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onTDH8panClicked:function (event) {
        this._tdh_jushu = 0;
        var cost = 1;
        if(this._tdh_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._tdh_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/tdh/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    onTDH1quanClicked:function (event) {
        this._tdh_jushu = 1;
        var cost = 1;
        if(this._tdh_jifei == 0 ) cost = 3;
        else cost = 1;
        if(this._tdh_jushu == 0) cost = cost;
        else cost *= 2;
        cc.find("Canvas/CreateRoom/tdh/cost/number").getComponent(cc.Label).string = "×" + cost;
    },
    
    //tab界面切换
    switchType:function(type) {
        for(var i = 0 ; i < this._types.length ; i++) {
            this.node.getChildByName(this._types[i]).active = false;
        }
        this.node.getChildByName(type).active = true;
    },

    createRoomSJMMJ:function(){
        
        //获取需要的所有选项
        
        //这里一定要小写，后端会直接拼接这个字符串
        var type = "sjmmj";
        
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
        
        this._jiesuan = [];
        var t = this.node.getChildByName(type).getChildByName("jiesuan");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jiesuan.push(n);
            }
        }
        
        this._wanfaxuanze = [];
        var t = this.node.getChildByName(type).getChildByName("wanfaxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("CheckBox");
            if(n != null){
                this._wanfaxuanze.push(n);
            }
        }
        

        var self = this;
        var onCreate = function(ret){
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

        var hongzhongdanghua = self._wanfaxuanze[0].checked;     
        
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
        
        var jiesuan = 0;
        for(var i = 0; i < self._jiesuan.length; ++i){
            if(self._jiesuan[i].checked){
                jiesuan = i;
                break;
            }     
        }
        
        var conf = {
            type:type,
            hongzhongdanghua: hongzhongdanghua,
            koufei:koufei,
            quanshu:quanshu,
            jiesuan:jiesuan
        }; 
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room",data,onCreate);   
    },
    
    createRoomDHMJ:function(){
        
        //获取需要的所有选项
        //这里一定要小写，后端会直接拼接这个字符串
        var type = "dhmj";
        
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
        
        this._jiesuan = [];
        var t = this.node.getChildByName(type).getChildByName("jiesuan");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jiesuan.push(n);
            }
        }
        
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
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
        
        //判断用户做了哪些选择
        //扣费 0 房主出资 1 玩家平分
        //圈数 0 8盘 1 一圈
        //结算 0 50  1 120

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
        
        var jiesuan = 0;
        for(var i = 0; i < self._jiesuan.length; ++i){
            if(self._jiesuan[i].checked){
                jiesuan = i;
                break;
            }     
        }
        
        var conf = {
            type:type,
            koufei:koufei,
            quanshu:quanshu,
            jiesuan:jiesuan
        }; 
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room",data,onCreate);   
    },
    
    createRoomTDH:function(){
        
        //获取需要的所有选项
        //这里一定要小写，后端会直接拼接这个字符串
        var type = "tdh";
        
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
        
        this._jiesuan = [];
        var t = this.node.getChildByName(type).getChildByName("jiesuan");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jiesuan.push(n);
            }
        }
        
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
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
        
        //判断用户做了哪些选择
        //扣费 0 房主出资 1 玩家平分
        //圈数 0 8盘 1 一圈
        //结算 0 50  1 120

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
        
        var jiesuan = 0;
        for(var i = 0; i < self._jiesuan.length; ++i){
            if(self._jiesuan[i].checked){
                jiesuan = i;
                break;
            }     
        }
        
        var conf = {
            type:type,
            koufei:koufei,
            quanshu:quanshu,
            jiesuan:jiesuan
        }; 
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room",data,onCreate);   
    },
    
});
