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
        _gameover:null,
        _gameresult:null,
        _seats:[],
        _isGameEnd:false,
        _pingju:null,
        _win:null,
        _lose:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.gameNetMgr.conf == null){
            return;
        }
        //TODO:可能出现不同的计分板
        this._gameover = this.node.getChildByName("game_over_"+cc.vv.gameNetMgr.conf.type);
        
        for(var n = 0; n < 4; n++){
            var hua_node = this._gameover.getChildByName("result_list").getChildByName("s"+(n+1)).getChildByName("huas");
            for(var m = 0 ; m < hua_node.childrenCount ; m++) {
                hua_node.children[m].active = false;
            }
        }
        
        this._gameover.active = false;
        
        this._pingju = this._gameover.getChildByName("pingju");
        this._win = this._gameover.getChildByName("win");
        this._lose = this._gameover.getChildByName("lose");
        
        this._gameresult = this.node.getChildByName("game_result");
        
        var wanfa = this._gameover.getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
        
        var listRoot = this._gameover.getChildByName("result_list");
        for(var i = 1; i <= 4; ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            //整理所有需要显示在计分板上的信息的节点
            var viewdata = {};
            viewdata.username = sn.getChildByName('username').getComponent(cc.Label);
            viewdata.reason = sn.getChildByName('reason').getComponent(cc.Label);
            viewdata.taisi = sn.getChildByName('taisi').getComponent(cc.Label);
            
            var f = sn.getChildByName('fan');
            if(f != null){
                viewdata.fan = f.getComponent(cc.Label);    
            }
            
            viewdata.score = sn.getChildByName('score').getComponent(cc.Label);
            viewdata.hu = sn.getChildByName('hu');
            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.zhuang = sn.getChildByName('zhuang');
            viewdata.hupai = sn.getChildByName('hupai');
            viewdata._pengandgang = [];
            
            this._seats.push(viewdata);
        }
        
        //初始化网络事件监听器
        var self = this;
        this.node.on('game_over',function(data){self.onGameOver(data.detail);});
        
        this.node.on('game_end',function(data){self._isGameEnd = true;});
    },
    
    onGameOver(data){
        //TODO:多种判定
        if(cc.vv.gameNetMgr.conf.type == "sjmmj"){
            this.onGameOver_SJMMJ(data);
        }
        else if(cc.vv.gameNetMgr.conf.type == "dhmj") {
            this.onGameOver_DHMJ(data);
        }
        else if(cc.vv.gameNetMgr.conf.type == "tdh") {
            this.onGameOver_TDH(data);
        }
    },
    
    onGameOver_SJMMJ(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
        
            
        //显示玩家信息
        for(var i = 0; i < 4; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色 根xn的字样
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var numOfGen = userData.numofgen;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
           
            for(var j = 0; j < userData.actions.length; ++j){
                var ac = userData.actions[j];
                if(ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao"){
                    if(userData.pattern == "7pairs"){
                        actionArr.push("七对");
                    }
                    else if(userData.pattern == "l7pairs"){
                        actionArr.push("龙七对");
                    }
                    else if(userData.pattern == "j7pairs"){
                        actionArr.push("将七对");
                    }
                    else if(userData.pattern == "duidui"){
                        actionArr.push("碰碰胡");
                    }
                    else if(userData.pattern == "jiangdui"){
                        actionArr.push("将对");
                    }
                    
                    if(ac.type == "zimo"){
                        actionArr.push("自摸");
                    }
                    else if(ac.type == "ganghua"){
                        actionArr.push("杠上花");
                    }
                    else if(ac.type == "dianganghua"){
                        actionArr.push("点杠花");
                    }
                    else if(ac.type == "gangpaohu"){
                        actionArr.push("杠炮胡");
                    }
                    else if(ac.type == "qiangganghu"){
                        actionArr.push("抢杠胡");
                    }
                    else if(ac.type == "chadajiao"){
                        ischadajiao = true;
                    }
                    hued = true;
                }
                else if(ac.type == "fangpao"){
                    actionArr.push("放炮");
                }
                else if(ac.type == "angang"){
                    actionArr.push("暗杠");
                }
                else if(ac.type == "diangang"){
                    actionArr.push("明杠");
                }
                else if(ac.type == "wangang"){
                    actionArr.push("弯杠");
                }
                else if(ac.type == "fanggang"){
                   actionArr.push("放杠");
                }
                else if(ac.type == "zhuanshougang"){
                    actionArr.push("转手杠");
                }
                else if(ac.type == "beiqianggang"){
                    actionArr.push("被抢杠");
                }
                else if(ac.type == "beichadajiao"){
                    actionArr.push("被查叫");
                }
            }
            
            if(hued){
                if(userData.qingyise){
                    actionArr.push("清一色");
                }
                
                if(userData.menqing){
                    actionArr.push("门清");
                }
                
                if(userData.zhongzhang){
                    actionArr.push("中张");
                }
                
                if(userData.jingouhu){
                    actionArr.push("金钩胡");
                }
                                
                if(userData.haidihu){
                    actionArr.push("海底胡");
                }
                
                if(userData.tianhu){
                    actionArr.push("天胡");
                }
                
                if(userData.dihu){
                    actionArr.push("地胡");
                }
            
                if(numOfGen > 0){
                    actionArr.push("根x" + numOfGen); 
                }                
                
                if(ischadajiao){
                    actionArr.push("查大叫");
                }
                
                if(userData.hunyise){
                    actionArr.push("混一色");
                }
                
                if(userData.duiduihu){
                    actionArr.push("对对胡");
                }
                
                if(userData.paihu){
                    actionArr.push("排胡");
                }
                
                if(userData.gangshanghua){
                    actionArr.push("杠上花");
                }
                
                if(userData.kan){
                    actionArr.push("坎档");
                }
                
                if(userData.bian){
                    actionArr.push("边档");
                }
                
                if(userData.dan){
                    actionArr.push("单吊");
                }
                
                if(userData.duidao){
                    actionArr.push("对倒");
                }
            }
            
            for(var o = 0; o < 3;++o){
                seatView.hu.children[o].active = false;    
            }
            if(userData.huorder >= 0){
                seatView.hu.children[userData.huorder].active = true;    
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("、");
            
            //显示丝数台数
            console.log("显示台和丝");
            console.log(userData.tai);
            console.log(userData.si);
            console.log( seatView.taisi.string);
            seatView.taisi.string = userData.tai + "台" + userData.si + "丝";
            
            //显示胡数
            var fan = 0;
            fan = userData.fan;
            seatView.fan.string = fan + "胡";
            
            
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            
            var hupai = -1;
            if(hued){
                hupai = userData.holds.pop();
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            //胡牌不参与排序
            if(hued){
                userData.holds.push(hupai);
            }
            
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
           
            var lackingNum = (userData.pengs.length + numOfGangs + userData.chis.length)*3; 
            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
            
            //初始化吃牌
            var chis = userData.chis 
            if(chis){
                for(var k = 0; k < chis.length; ++k){
                    var mjid = chis[k];
                    this.initPengAndGangs(seatView,index,mjid,"chi");
                    index++;    
                }    
            }
            
            //初始化花牌 TODO:和下面一样写初始化函数 并且要首先隐藏所有的花
             
            var huas = userData.huas; 
            var hua_node = this._gameover.getChildByName("result_list").getChildByName("s"+(i+1)).getChildByName("huas");
            for(var k = 0; k < hua_node.childrenCount; ++k){
                hua_node.children[k].active = false;
            }  
            if(huas){
                for(var k = 0; k < huas.length; ++k){
                    var mjid = huas[k];
                    hua_node.children[k].active = true;
                    var sp = hua_node.children[k].getComponent(cc.Sprite);
                    sp.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",mjid);
                    
                }    
            }
            
            
            //东南西北小旗子转换
            var switchFengFlag = function (direction,dir_str){
                for(var k = 0 ; k < 4 ; k ++) {
                    direction.children[k].active = false;
                }
                direction.getChildByName(dir_str).active=true;
            };
            
            //显示当前风圈和局数
            var numofgames = this._gameover.getChildByName("numofgames");
            var fengquan = "东风圈";
            switch (cc.vv.gameNetMgr.fengxiang) {
                case 0: fengquan = "东风圈";break;
                case 1: fengquan = "南风圈";break;
                case 2: fengquan = "西风圈";break;
                case 3: fengquan = "北风圈";break;
            }
            numofgames.getComponent(cc.Label).string = fengquan;
            
            //判断东南西北
            if(userData.button){
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(i%4+1)).getChildByName("direction");
                switchFengFlag(direction,"dong");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+1)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"nan");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+2)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"xi");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+3)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"bei");
            }
        }
    },
    onGameOver_DHMJ:function(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
        
            
        //显示玩家信息
        for(var i = 0; i < 4; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色 根xn的字样
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var numOfGen = userData.numofgen;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            for(var j = 0; j < userData.actions.length; ++j){
                var ac = userData.actions[j];
                if(ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao"){
                    if(userData.pattern == "7pairs"){
                        actionArr.push("七对");
                    }
                    else if(userData.pattern == "l7pairs"){
                        actionArr.push("龙七对");
                    }
                    else if(userData.pattern == "j7pairs"){
                        actionArr.push("将七对");
                    }
                    else if(userData.pattern == "duidui"){
                        actionArr.push("碰碰胡");
                    }
                    else if(userData.pattern == "jiangdui"){
                        actionArr.push("将对");
                    }
                    
                    if(ac.type == "zimo"){
                        actionArr.push("自摸");
                    }
                    else if(ac.type == "ganghua"){
                        actionArr.push("杠上花");
                    }
                    else if(ac.type == "dianganghua"){
                        actionArr.push("点杠花");
                    }
                    else if(ac.type == "gangpaohu"){
                        actionArr.push("杠炮胡");
                    }
                    else if(ac.type == "qiangganghu"){
                        actionArr.push("抢杠胡");
                    }
                    else if(ac.type == "chadajiao"){
                        ischadajiao = true;
                    }
                    hued = true;
                }
                else if(ac.type == "fangpao"){
                    actionArr.push("放炮");
                }
                else if(ac.type == "angang"){
                    actionArr.push("暗杠");
                }
                else if(ac.type == "diangang"){
                    actionArr.push("明杠");
                }
                else if(ac.type == "wangang"){
                    actionArr.push("弯杠");
                }
                else if(ac.type == "fanggang"){
                   actionArr.push("放杠");
                }
                else if(ac.type == "zhuanshougang"){
                    actionArr.push("转手杠");
                }
                else if(ac.type == "beiqianggang"){
                    actionArr.push("被抢杠");
                }
                else if(ac.type == "beichadajiao"){
                    actionArr.push("被查叫");
                }
                else if(ac.type == "sanchisanpeng0"){
                    actionArr.push("三吃三碰东");
                }
                else if(ac.type == "sanchisanpeng1"){
                    actionArr.push("三吃三碰南");
                }
                else if(ac.type == "sanchisanpeng2"){
                    actionArr.push("三吃三碰西");
                }
                else if(ac.type == "sanchisanpeng3"){
                    actionArr.push("三吃三碰北");
                }
            }
            
            if(hued){
                this._gameover.getChildByName("result_list").getChildByName("s"+(i+1)).getChildByName("hu").active = true;
                
                if(userData.qingyise){
                    actionArr.push("清一色");
                }
                
                if(userData.menqing){
                    actionArr.push("门清");
                }
                
                if(userData.zhongzhang){
                    actionArr.push("中张");
                }
                
                if(userData.jingouhu){
                    actionArr.push("金钩胡");
                }
                                
                if(userData.haidihu){
                    actionArr.push("海底胡");
                }
                
                if(userData.tianhu){
                    actionArr.push("天胡");
                }
                
                if(userData.dihu){
                    actionArr.push("地胡");
                }
            
                if(numOfGen > 0){
                    actionArr.push("根x" + numOfGen); 
                }                
                
                if(ischadajiao){
                    actionArr.push("查大叫");
                }
                
                if(userData.hunyise){
                    actionArr.push("混一色");
                }
                
                if(userData.duiduihu){
                    actionArr.push("对对胡");
                }
                
                if(userData.paihu){
                    actionArr.push("排胡");
                }
                
                if(userData.gangshanghua){
                    actionArr.push("杠上花");
                }
                
                if(userData.kan){
                    actionArr.push("坎档");
                }
                
                if(userData.bian){
                    actionArr.push("边档");
                }
                
                if(userData.dan){
                    actionArr.push("单吊");
                }
                
                if(userData.duidao){
                    actionArr.push("对倒");
                }
                
                
            }else{
                this._gameover.getChildByName("result_list").getChildByName("s"+(i+1)).getChildByName("hu").active = false;
            }
            
            // for(var o = 0; o < 3;++o){
            //     seatView.hu.children[o].active = false;    
            // }
            // if(userData.huorder >= 0){
            //     seatView.hu.children[userData.huorder].active = true;    
            // }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("、");
            
            //显示丝数台数
            if(userData.tai == -1) seatView.taisi.string = "";
            else seatView.taisi.string = userData.tai + "台";
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            
            var hupai = -1;
            if(hued){
                hupai = userData.holds.pop();
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            //胡牌不参与排序
            if(hued){
                userData.holds.push(hupai);
            }
            
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
           
            var lackingNum = (userData.pengs.length + numOfGangs + userData.chis.length)*3; 
            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
            
            //初始化吃牌
            var chis = userData.chis 
            if(chis){
                for(var k = 0; k < chis.length; ++k){
                    var mjid = chis[k];
                    this.initPengAndGangs(seatView,index,mjid,"chi");
                    index++;    
                }    
            }
            
            //初始化花牌 TODO:和下面一样写初始化函数 并且要首先隐藏所有的花
             
            var huas = userData.huas; 
            var hua_node = this._gameover.getChildByName("result_list").getChildByName("s"+(i+1)).getChildByName("huas");
            for(var k = 0; k < hua_node.childrenCount; ++k){
                hua_node.children[k].active = false;
            }  
            if(huas){
                for(var k = 0; k < huas.length; ++k){
                    var mjid = huas[k];
                    hua_node.children[k].active = true;
                    var sp = hua_node.children[k].getComponent(cc.Sprite);
                    sp.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",mjid);
                    
                }    
            }
            
            //东南西北小旗子转换
            var switchFengFlag = function (direction,dir_str){
                for(var k = 0 ; k < 4 ; k ++) {
                    direction.children[k].active = false;
                }
                direction.getChildByName(dir_str).active=true;
            };
            
            //显示当前风圈和局数
            var numofgames = this._gameover.getChildByName("numofgames");
            var fengquan = "东风圈";
            switch (cc.vv.gameNetMgr.fengxiang) {
                case 0: fengquan = "东风圈";break;
                case 1: fengquan = "南风圈";break;
                case 2: fengquan = "西风圈";break;
                case 3: fengquan = "北风圈";break;
            }
            numofgames.getComponent(cc.Label).string = fengquan;
            
            //判断东南西北
            if(userData.button){
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(i%4+1)).getChildByName("direction");
                switchFengFlag(direction,"dong");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+1)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"nan");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+2)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"xi");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+3)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"bei");
            }
        }
    },
    onGameOver_TDH:function(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
        
            
        //显示玩家信息
        for(var i = 0; i < 4; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色 根xn的字样
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var numOfGen = userData.numofgen;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            for(var j = 0; j < userData.actions.length; ++j){
                var ac = userData.actions[j];
                if(ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao"){
                    if(userData.pattern == "7pairs"){
                        actionArr.push("七对");
                    }
                    else if(userData.pattern == "l7pairs"){
                        actionArr.push("龙七对");
                    }
                    else if(userData.pattern == "j7pairs"){
                        actionArr.push("将七对");
                    }
                    else if(userData.pattern == "duidui"){
                        actionArr.push("碰碰胡");
                    }
                    else if(userData.pattern == "jiangdui"){
                        actionArr.push("将对");
                    }
                    
                    if(ac.type == "zimo"){
                        actionArr.push("自摸");
                    }
                    else if(ac.type == "ganghua"){
                        actionArr.push("杠上花");
                    }
                    else if(ac.type == "dianganghua"){
                        actionArr.push("点杠花");
                    }
                    else if(ac.type == "gangpaohu"){
                        actionArr.push("杠炮胡");
                    }
                    else if(ac.type == "qiangganghu"){
                        actionArr.push("抢杠胡");
                    }
                    else if(ac.type == "chadajiao"){
                        ischadajiao = true;
                    }
                    hued = true;
                }
                else if(ac.type == "fangpao"){
                    actionArr.push("放炮");
                }
                else if(ac.type == "angang"){
                    actionArr.push("暗杠");
                }
                else if(ac.type == "diangang"){
                    actionArr.push("明杠");
                }
                else if(ac.type == "wangang"){
                    actionArr.push("弯杠");
                }
                else if(ac.type == "fanggang"){
                   actionArr.push("放杠");
                }
                else if(ac.type == "zhuanshougang"){
                    actionArr.push("转手杠");
                }
                else if(ac.type == "beiqianggang"){
                    actionArr.push("被抢杠");
                }
                else if(ac.type == "beichadajiao"){
                    actionArr.push("被查叫");
                }
            }
            
            if(hued){
                if(userData.qingyise){
                    actionArr.push("清一色");
                }
                
                if(userData.menqing){
                    actionArr.push("门清");
                }
                
                if(userData.zhongzhang){
                    actionArr.push("中张");
                }
                
                if(userData.jingouhu){
                    actionArr.push("金钩胡");
                }
                                
                if(userData.haidihu){
                    actionArr.push("海底胡");
                }
                
                if(userData.tianhu){
                    actionArr.push("天胡");
                }
                
                if(userData.dihu){
                    actionArr.push("地胡");
                }
            
                if(numOfGen > 0){
                    actionArr.push("根x" + numOfGen); 
                }                
                
                if(ischadajiao){
                    actionArr.push("查大叫");
                }
                
                if(userData.hunyise){
                    actionArr.push("混一色");
                }
                
                if(userData.duiduihu){
                    actionArr.push("对对胡");
                }
                
                if(userData.paihu){
                    actionArr.push("排胡");
                }
                
                if(userData.gangshanghua){
                    actionArr.push("杠上花");
                }
                
                if(userData.kan){
                    actionArr.push("坎档");
                }
                
                if(userData.bian){
                    actionArr.push("边档");
                }
                
                if(userData.dan){
                    actionArr.push("单吊");
                }
                
                if(userData.duidao){
                    actionArr.push("对倒");
                }
                
                
            }
            
            for(var o = 0; o < 3;++o){
                seatView.hu.children[o].active = false;    
            }
            if(userData.huorder >= 0){
                seatView.hu.children[userData.huorder].active = true;    
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("、");
            
            
            //显示丝数台数
            seatView.taisi.string = "";
            
          
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            
            var hupai = -1;
            if(hued){
                hupai = userData.holds.pop();
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            //胡牌不参与排序
            if(hued){
                userData.holds.push(hupai);
            }
            
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
           
            var lackingNum = (userData.pengs.length + numOfGangs + userData.chis.length)*3; 
            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
            
            //初始化吃牌
            var chis = userData.chis 
            if(chis){
                for(var k = 0; k < chis.length; ++k){
                    var mjid = chis[k];
                    this.initPengAndGangs(seatView,index,mjid,"chi");
                    index++;    
                }    
            }
            
            //初始化花牌 TODO:和下面一样写初始化函数 并且要首先隐藏所有的花
             
            var huas = userData.huas; 
            var hua_node = this._gameover.getChildByName("result_list").getChildByName("s"+(i+1)).getChildByName("huas");
            for(var k = 0; k < hua_node.childrenCount; ++k){
                hua_node.children[k].active = false;
            }  
            if(huas){
                for(var k = 0; k < huas.length; ++k){
                    var mjid = huas[k];
                    hua_node.children[k].active = true;
                    var sp = hua_node.children[k].getComponent(cc.Sprite);
                    sp.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",mjid);
                    
                }    
            }
            
            //东南西北小旗子转换
            var switchFengFlag = function (direction,dir_str){
                for(var k = 0 ; k < 4 ; k ++) {
                    direction.children[k].active = false;
                }
                direction.getChildByName(dir_str).active=true;
            };
            
            //显示当前风圈和局数
            var numofgames = this._gameover.getChildByName("numofgames");
            var fengquan = "东风圈";
            switch (cc.vv.gameNetMgr.fengxiang) {
                case 0: fengquan = "东风圈";break;
                case 1: fengquan = "南风圈";break;
                case 2: fengquan = "西风圈";break;
                case 3: fengquan = "北风圈";break;
            }
            numofgames.getComponent(cc.Label).string = fengquan;
            
            //判断东南西北
            if(userData.button){
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(i%4+1)).getChildByName("direction");
                switchFengFlag(direction,"dong");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+1)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"nan");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+2)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"xi");
                
                var direction = this._gameover.getChildByName("result_list").getChildByName("s"+(((i+3)%4)+1)).getChildByName("direction");
                switchFengFlag(direction,"bei");
            }
        }
    },
    
    initPengAndGangs:function(seatView,index,mjid,flag){
        var pgroot = null;
        if(seatView._pengandgang.length <= index){
            pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot);    
        }
        else{
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
        }
      
        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        for(var s = 0; s < sprites.length; ++s){
            var sprite = sprites[s];
            if(sprite.node.name == "gang"){
                var isGang = flag != "peng";
                sprite.node.active = isGang;
                sprite.node.scaleX = 1.0;
                sprite.node.scaleY = 1.0;
                if(flag == "angang"){
                    sprite.spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame("myself");
                    sprite.node.scaleX = 1.4;
                    sprite.node.scaleY = 1.4;                        
                }   
                else{
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);    
                }
            }
            else{
                if(flag=="peng")
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);
                else if (flag=="chi"){
                     sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid[s]);
                }else{
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);
                }
            }
        }
        pgroot.x = index * 55 * 3 + index * 10;
    },

    
    onBtnReadyClicked:function(){
        console.log("onBtnReadyClicked");
        if(this._isGameEnd){
            this._gameresult.active = true;
        }
        else{
            cc.vv.net.send('ready');   
        }
        this._gameover.active = false;
    },
    
    onBtnShareClicked:function(){
        console.log("onBtnShareClicked");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
