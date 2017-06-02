var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_CHI =7;
var ACTION_BUHUA =8;


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
        _lastAction:null,
        _actionRecords:null,
        _currentIndex:0,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    clear:function(){
        this._lastAction = null;
        this._actionRecords = null;
        this._currentIndex = 0;
    },
    
    init:function(data){
        this._actionRecords = data.action_records;
        if(this._actionRecords == null){
            this._actionRecords = {};
        }
        this._currentIndex = 0;
        this._lastAction = null;
    },
    
    isReplay:function(){
        return this._actionRecords != null;    
    },
    
    getNextAction:function(){
        var actions = [].concat(this._actionRecords);
        actions.splice(0,this._currentIndex);
        console.log(actions);
        
        if(this._currentIndex >= this._actionRecords.length){
            return null;
        }

        var si = this._actionRecords[this._currentIndex++];
        var action = this._actionRecords[this._currentIndex++];
        if(action != ACTION_CHI && action != ACTION_BUHUA){
            var pai = this._actionRecords[this._currentIndex++];
            return {si:si,type:action,pai:pai};
        }else if (action==ACTION_CHI){
            var pai = this._actionRecords[this._currentIndex++];
            var chigroup = this._actionRecords[this._currentIndex++];
            return {si:si,type:action,pai:pai,chigroup:chigroup};
        }else if (action==ACTION_BUHUA){
            var buhuas = this._actionRecords[this._currentIndex++];
            var holds = this._actionRecords[this._currentIndex++];
            return {si:si,type:action,buhuas:buhuas,holds:holds};
        }
        
        
    },
    
    takeAction:function(){
        var action = this.getNextAction();
        if(this._lastAction != null && this._lastAction.type == ACTION_CHUPAI){
            if(action != null && action.type != ACTION_PENG && action.type != ACTION_GANG && action.type != ACTION_HU){
                cc.vv.gameNetMgr.doGuo(this._lastAction.si,this._lastAction.pai);
            }
        }
        this._lastAction = action;
        if(action == null){
            return -1;
        }
        var nextActionDelay = 1.0;
        if(action.type == ACTION_CHUPAI){
            console.log("chupai"+action.pai);
            cc.vv.gameNetMgr.doChupai(action.si,action.pai);
            return 1.0;
        }
        else if(action.type == ACTION_MOPAI){
            console.log("mopai"+action.pai);
            cc.vv.gameNetMgr.doMopai(action.si,action.pai);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 0.5;
        }
        else if(action.type == ACTION_PENG){
            console.log("peng"+action.pai);
            cc.vv.gameNetMgr.doPeng(action.si,action.pai);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_GANG){
            console.log("gang"+action.pai);
            cc.vv.gameNetMgr.dispatchEvent('hangang_notify',action.si);
            cc.vv.gameNetMgr.doGang(action.si,action.pai);
            cc.vv.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_HU){
            console.log("hu"+action.pai);
            cc.vv.gameNetMgr.doHu({seatindex:action.si,hupai:action.pai,iszimo:false});
            return 1.5;
        }
        else if(action.type == ACTION_CHI){
            console.log("chi"+action.pai);
            cc.vv.gameNetMgr.doChi(action.si,action.pai,action.chigroup);
            return 1.5;
        }
        else if(action.type == ACTION_BUHUA){
            console.log("chi"+action.pai);
            cc.vv.gameNetMgr.doBuhuaforme(action.si,action.holds,action.buhuas);
             cc.vv.gameNetMgr.doBuhua(action.si,action.buhuas);
            return 1.5;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
