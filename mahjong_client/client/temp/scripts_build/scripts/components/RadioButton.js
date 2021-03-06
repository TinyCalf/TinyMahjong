"use strict";
cc._RFpush(module, '8d571y2U+9AiKntO+TSf0Fb', 'RadioButton');
// scripts/components/RadioButton.js

cc.Class({
    "extends": cc.Component,

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
        target: cc.Node,
        sprite: cc.SpriteFrame,
        checkedSprite: cc.SpriteFrame,
        checked: false,
        groupId: -1
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.vv == null) {
            return;
        }
        if (cc.vv.radiogroupmgr == null) {
            var RadioGroupMgr = require("RadioGroupMgr");
            cc.vv.radiogroupmgr = new RadioGroupMgr();
            cc.vv.radiogroupmgr.init();
        }
        console.log(typeof cc.vv.radiogroupmgr.add);
        cc.vv.radiogroupmgr.add(this);

        this.refresh();
    },

    refresh: function refresh() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        if (this.checked) {
            targetSprite.spriteFrame = this.checkedSprite;
        } else {
            targetSprite.spriteFrame = this.sprite;
        }
    },

    check: function check(value) {
        this.checked = value;
        this.refresh();
    },

    onClicked: function onClicked() {
        cc.vv.radiogroupmgr.check(this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onDestroy: function onDestroy() {
        if (cc.vv && cc.vv.radiogroupmgr) {
            cc.vv.radiogroupmgr.del(this);
        }
    }
});

cc._RFpop();