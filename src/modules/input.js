class Input{
    constructor(){
        this.keys = new Array(127);
        this.lastKeys = new Array(127);
        this.keydown = this.keyDownHandlerCallback.bind(this);
        this.keyup = this.keyUpHandlerCallback.bind(this);
    }

    on(){
        document.addEventListener("keydown", this.keydown, false);
        document.addEventListener("keyup", this.keyup, false);
    }

    off(){
        document.removeEventListener("keydown", this.keydown);
        document.removeEventListener("keyup", this.keyup);
    }

    keyDownHandlerCallback(e){
        this.keys[e.keyCode] = true;
    }
    keyUpHandlerCallback(e){
        this.keys[e.keyCode] = false;
    }

    update(){
        this.lastKeys = this.keys.slice();
        //this.keys = new Array(127);
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