"use strict";
cc._RF.push(module, 'c12553sxCxG/on0Bz7rkX0f', 'Alert');
// scripts/components/Alert.js

"use strict";

cc.Class({
    extends: cc.Component,

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
        _alert: null,
        _btnOK: null,
        _btnCancel: null,
        _title: null,
        _content: null,
        _onok: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.vv == null) {
            return;
        }
        this._alert = cc.find("Canvas/alert");
        this._title = cc.find("Canvas/alert/title").getComponent(cc.Label);
        this._content = cc.find("Canvas/alert/content").getComponent(cc.Label);

        this._btnOK = cc.find("Canvas/alert/btn_ok");
        this._btnCancel = cc.find("Canvas/alert/btn_cancel");

        cc.vv.utils.addClickEvent(this._btnOK, this.node, "Alert", "onBtnClicked");
        cc.vv.utils.addClickEvent(this._btnCancel, this.node, "Alert", "onBtnClicked");

        this._alert.active = false;
        cc.vv.alert = this;
    },

    onBtnClicked: function onBtnClicked(event) {
        if (event.target.name == "btn_ok") {
            if (this._onok) {
                this._onok();
            }
        }
        this._alert.active = false;
        this._onok = null;
    },

    show: function show(title, content, onok, needcancel, okstr, cancelstr) {
        this._alert.active = true;
        this._onok = onok;
        this._title.string = title;
        this._content.string = content;
        if (needcancel) {
            this._btnCancel.active = true;
            this._btnOK.x = -150;
            this._btnCancel.x = 150;
        } else {
            this._btnCancel.active = false;
            this._btnOK.x = 0;
        }
        if (okstr) {
            this._btnOK.getChildByName("New Label").getComponent(cc.Label).string = okstr;
        }
        if (cancelstr) {
            this._btnCancel.getChildByName("New Label").getComponent(cc.Label).string = cancelstr;
        }
    },

    onDestory: function onDestory() {
        if (cc.vv) {
            cc.vv.alert = null;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();