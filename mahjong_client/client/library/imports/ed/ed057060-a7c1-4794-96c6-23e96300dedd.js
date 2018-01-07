function loadImage(url, code, callback) {
    /*
    if(cc.vv.images == null){
        cc.vv.images = {};
    }
    var imageInfo = cc.vv.images[url];
    if(imageInfo == null){
        imageInfo = {
            image:null,
            queue:[],
        };
        cc.vv.images[url] = imageInfo;
    }
    
    cc.loader.load(url,function (err,tex) {
        imageInfo.image = tex;
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        for(var i = 0; i < imageInfo.queue.length; ++i){
            var itm = imageInfo.queue[i];
            itm.callback(itm.code,spriteFrame);
        }
        itm.queue = [];
    });
    if(imageInfo.image != null){
        var tex = imageInfo.image;
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback(code,spriteFrame);
    }
    else{
        imageInfo.queue.push({code:code,callback:callback});
    }*/
    // cc.loader.load(url,function (err,tex) {
    //     console.log("tex")
    //     console.log(tex)
    //     var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
    //     callback(code,spriteFrame);
    // });
    cc.loader.load(url, function (err, tex) {
        console.log("tex");
        console.log(tex);
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback(code, spriteFrame);
    });
};

function getBaseInfo(userid, callback) {
    if (cc.vv.baseInfoMap == null) {
        cc.vv.baseInfoMap = {};
    }

    if (cc.vv.baseInfoMap[userid] != null) {
        callback(userid, cc.vv.baseInfoMap[userid]);
    } else {
        cc.vv.http.sendRequest('/base_info', { userid: userid }, function (ret) {
            var url = null;
            if (ret.headimgurl) {
                url = ret.headimgurl + "?a=a.jpg";
            }
            var info = {
                name: ret.name,
                sex: ret.sex,
                url: url
            };
            cc.vv.baseInfoMap[userid] = info;
            callback(userid, info);
        }, cc.vv.http.master_url);
    }
};

cc.Class({
    "extends": cc.Component,
    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.setupSpriteFrame();
    },

    setUserID: function setUserID(userid) {
        if (cc.sys.isNative == false) {
            return;
        }
        if (!userid) {
            return;
        }
        if (cc.vv.images == null) {
            cc.vv.images = {};
        }

        var self = this;
        getBaseInfo(userid, function (code, info) {
            console.log("headimg");
            console.log(info);
            console.log(info.url);
            if (info && info.url) {

                // var info = {};
                // info.url="http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmtjiaJlQy9ExibjicIlwHOZJpibrNxaYwRjFPKD7wqe6uQeUH1Npicn0RnGfSqzIuQvHrh7DhCyJDKnQ/0?aa=aa.jpg"
                loadImage(info.url, userid, function (err, spriteFrame) {
                    self._spriteFrame = spriteFrame;
                    console.log("fuck you!");
                    console.log(spriteFrame);
                    self.setupSpriteFrame();
                });
            }
        });
    },

    setupSpriteFrame: function setupSpriteFrame() {
        if (this._spriteFrame) {
            var spr = this.getComponent(cc.Sprite);
            if (spr) {
                spr.spriteFrame = this._spriteFrame;
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});