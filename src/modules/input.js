const toaster = require('./toaster.js');

class Input{
    constructor(){
        this.keys = [];
        this.lastKeys = [];
        this.down = [];
        this.up = [];
        this.keydown = this.keyDownHandlerCallback.bind(this);
        this.keyup = this.keyUpHandlerCallback.bind(this);
        this.padConnect = this.gamepadConnectCallback.bind(this);
        this.padDisconnect = this.gamepadDisconnectCallback.bind(this);
        this.gamePads = [];
        this.buttons = [];
        this.lastButtons = [];
        this.axes = { x: 0, y: 0 };
    }

    on(){
        document.addEventListener("keydown", this.keydown, false);
        document.addEventListener("keyup", this.keyup, false);
        window.addEventListener("gamepadconnected", this.padConnect);
        window.addEventListener("gamepaddisconnected", this.padConnect);
    }

    off(){
        document.removeEventListener("keydown", this.keydown);
        document.removeEventListener("keyup", this.keyup);
    }

    gamepadConnectCallback(e) {
        toaster.add("Gamepad " + e.gamepad.index + " Connected!");
        this.gamePads[e.gamepad.index] = e.gamepad;
    }

    gamepadDisconnectCallback(e) {
        toaster.add("Gamepad " + e.gamepad.index + " disconnected!");
        delete this.gamePads[e.gamepad.index];
    }

    keyDownHandlerCallback(e){
        this.down.push(e.keyCode);
        
    }
    keyUpHandlerCallback(e){
        this.up.push(e.keyCode);
    }

    update() {
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        this.lastKeys = this.keys.slice();
        while(this.down.length > 0){
            this.keys[this.down.pop()] = true;
        }
        while(this.up.length > 0){
            this.keys[this.up.pop()] = false;
        }
        this.lastButtons = this.buttons.slice();
        if (gamepads[0]) {
            this.buttons = gamepads[0].buttons.map(btn => btn.pressed);
            this.axes.x = gamepads[0].axes[0];
            this.axes.y = gamepads[0].axes[1];
        }
        
    }

    btnPress(btn) {
        return this.buttons[btn] && !this.lastButtons[btn];
    }

    btnDown(btn) {
        return this.buttons[btn];
    }

    btnRelease(btn) {
        return !this.buttons[btn] && this.lastButtons[btn];
    }

    isPress(key){
        return this.keys[key] && !this.lastKeys[key];
    }

    isDown(key){
        return this.keys[key];
    }

    isUp(key){
        return !this.keys[key];
    }

    isRelease(key){
        return !this.keys[key] && this.lastKeys[key];
    }
}

module.exports = Input;