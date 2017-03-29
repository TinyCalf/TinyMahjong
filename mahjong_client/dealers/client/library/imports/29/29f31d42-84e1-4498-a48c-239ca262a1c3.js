cc.Class({
    "extends": cc.Component,

    properties: {
        on: cc.Node,
        off: cc.Node,
        label: cc.Label,
        onColor: cc.Color,
        offColor: cc.Color,
        _isOn: false,
        isOn: {
            set: function set(value) {
                if (this._isOn != value) {
                    this._isOn = value;
                    this.updateState();
                }
            },
            get: function get() {
                return this._isOn;
            }
        }
    },

    onLoad: function onLoad() {
        this.updateState();
    },

    updateState: function updateState() {
        this.on.active = false;
        this.off.active = false;
        if (this.isOn) {
            this.on.active = true;
            this.label.node.color = this.onColor;
        } else {
            this.off.active = true;
            this.label.node.color = this.offColor;
        }
    },

    onClick: function onClick() {
        if (!this.isOn) {
            this.isOn = !this.isOn;
            this.node.emit("change", this.isOn);
        }
    }

});