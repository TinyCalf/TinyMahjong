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
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.vv){
            return;
        }
        
        
        this.hidehuas();
        
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName("myself");
        var pengangroot = myself.getChildByName("penggangs");
        var realwidth = cc.director.getVisibleSize().width;
        var scale = realwidth / 1280;
        pengangroot.scaleX *= scale;
        pengangroot.scaleY *= scale;
        
        var self = this;
        this.node.on('peng_notify',function(data){
            //刷新所有的牌
            console.log("penggang plat");
            console.log(data.detail);
            var data = data.detail;
            self.onPengGangChanged(data);
        });
        
        this.node.on('gang_notify',function(data){
            //刷新所有的牌
            //console.log(data.detail);
            var data = data.detail;
            self.onPengGangChanged(data.seatData);
        });
        
        this.node.on('chi_notify',function(data){
            //刷新所有的牌
            console.log("penggang plat");
            console.log(data.detail);
            var data = data.detail;
            self.onPengGangChanged(data);
        });
        
        this.node.on('gethua_notify',function(data){
            console.log("gethua_notify accept");
            //刷新所有的牌
            var data = data.detail;
            self.onHuaChanged(data);
            
        });
        
        this.node.on('game_begin',function(data){
            self.onGameBein();
        });
        
        var seats = cc.vv.gameNetMgr.seats;
        for(var i in seats){
            this.onPengGangChanged(seats[i]);
        }
    },
    
    //隐藏所有花牌
    hidehuas:function(){
        //隐藏所有花牌
        var gameChild = this.node.getChildByName("game");
        var sides = new Array(
            "right",
            "left",
            "up",
            "myself");
        for(var j= 0; j < 4 ; j++){
            var side = gameChild.getChildByName(sides[j]);
            var huasroot = side.getChildByName("huas");
            for(var i = 0 ; i < huasroot.childrenCount ; i++){
                huasroot.children[i].active = false;
            }
        }
        
    },
    
    onGameBein:function(){
        this.hideSide("myself");
        this.hideSide("right");
        this.hideSide("up");
        this.hideSide("left");
        this.hidehuas();
    },
    
    hideSide:function(side){
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if(pengangroot){
            for(var i = 0; i < pengangroot.childrenCount; ++i){
                pengangroot.children[i].active = false;
            }            
        }
    },
    
    onPengGangChanged:function(seatData){
        
        if(seatData.angangs == null && seatData.diangangs == null && seatData.wangangs == null && seatData.pengs == null && seatData.chis == null){
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        console.log("localIndex = " + localIndex);
        console.log("side = " + side);
        console.log("pre = " + pre);
        console.log("onPengGangChanged" + localIndex);
            
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        
        for(var i = 0; i < pengangroot.childrenCount; ++i){
            pengangroot.children[i].active = false;
        }
        //初始化杠牌
        var index = 0;
        
        var gangs = seatData.angangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"angang");
            index++;    
        } 
        var gangs = seatData.diangangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"diangang");
            index++;    
        }
        
        var gangs = seatData.wangangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"wangang");
            index++;    
        }
        
        //初始化碰牌
        var pengs = seatData.pengs
        if(pengs){
            for(var i = 0; i < pengs.length; ++i){
                var mjid = pengs[i];
                this.initPengAndGangs(pengangroot,side,pre,index,mjid,"peng");
                index++;    
            }    
        }  
        
        //初始化吃牌
        console.log("初始化吃牌");
        console.log(seatData);
        var chis = seatData.chis;
        if(chis){
            for(var i = 0; i < chis.length; ++i){
                var mjid = chis[i];
                this.initPengAndGangs(pengangroot,side,pre,index,mjid,"chi");
                index++;    
            }    
        }  
        
        //初始化花牌
        console.log("初始化花牌");
        console.log(seatData);
        var huas = seatData.huas;
        if(huas){
            for(var i = 0; i < huas.length; ++i){
                var mjid = huas[i];
                this.onHuaChanged(seatData);                                     
                index++;    
            }    
        }  
    },
    
    
    
    initPengAndGangs:function(pengangroot,side,pre,index,mjid,flag){
        var pgroot = null;
        if(pengangroot.childrenCount <= index){
            if(side == "left" || side == "right"){
                pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabLeft);
            }
            else{
                pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
            }
            
            pengangroot.addChild(pgroot);    
        }
        else{
            pgroot = pengangroot.children[index];
            pgroot.active = true;
        }
        
        if(side == "left"){
            pgroot.y = -(index * 25 * 3);                    
        }
        else if(side == "right"){
            pgroot.y = (index * 25 * 3);
            pgroot.setLocalZOrder(-index);
        }
        else if(side == "myself"){
            pgroot.x = index * 55 * 3 + index * 10;                    
        }
        else{
            pgroot.x = -(index * 55*3);
        }

        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        // if(flag == "chi"){
        //     console.log("排列吃！");
        //     console.log(mjid);
        //     for(var s = 0; s < 3; s++){
        //         var sprite = sprites[s];
        //         sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid[s]);
        //     }
        //     return;
        // }
        if(flag == "chi"){
            var mjid1 = [].concat(mjid);
            var pai = mjid1.pop();
            mjid1.sort(function(a,b){
            return parseInt(a)- parseInt(b)});
            
            mjid1[2] = mjid1[1];
            mjid1[1] = mjid1[0];
            mjid1[0] = pai;
        }
        for(var s = 0; s < sprites.length; ++s){
            console.log("in xunhuan");
            var sprite = sprites[s];
            if(sprite.node.name == "gang"){
                var isGang = flag != "peng";
                sprite.node.active = isGang;
                sprite.node.scaleX = 1.0;
                sprite.node.scaleY = 1.0;
                if(flag == "angang"){
                    sprite.spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
                    if(side == "myself" || side == "up"){
                        sprite.node.scaleX = 1.4;
                        sprite.node.scaleY = 1.4;                        
                    }
                }   
                else{
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid);    
                }
            }
            else { 
                if ( flag == "peng" ) {
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid);
                }else if (flag == "chi") {
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid1[s]);
                }else{
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid);
                }
            }
        }
        
    },
    
    onHuaChanged:function(seatData){
        console.log("onHuaChanged!!!");
        console.log(seatData);
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var side = gameChild.getChildByName(side);
        var huas = side.getChildByName("huas");
        
        console.log(side);
        console.log(huas);
        
        for(var i = 0; i < seatData.huas.length; i++){
            console.log("show hua!"+seatData.huas[i]);
            var nowchild = huas.children[i];
            nowchild.active = true;
            console.log(nowchild.active);
            var sprite = nowchild.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,seatData.huas[i]);
        }
    },
    
    initHuas:function(){
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
