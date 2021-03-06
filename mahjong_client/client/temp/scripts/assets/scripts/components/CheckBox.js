"use strict";
cc._RFpush(module, 'dc9e5hcegFBFpbh0CwUFw8V', 'CheckBox');
// scripts/components/CheckBox.js

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
        checked: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refresh();
    },

    onClicked: function onClicked() {
        this.checked = !this.checked;
        this.refresh();
    },

    switchToUnchecked: function switchToUnchecked() {
        this.checked = false;
        this.refresh();
    },

    refresh: function refresh() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        if (this.checked) {
            targetSprite.spriteFrame = this.checkedSprite;
        } else {
            targetSprite.spriteFrame = this.sprite;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();