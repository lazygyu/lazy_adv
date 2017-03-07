class Input{
    constructor(){
        this.keys = [];
        this.lastKeys = [];
        this.down = [];
        this.up = [];
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
        this.down.push(e.keyCode);
        
    }
    keyUpHandlerCallback(e){
        this.up.push(e.keyCode);
    }

    update(){
        this.lastKeys = this.keys.slice();
        while(this.down.length > 0){
            this.keys[this.down.pop()] = true;
        }
        while(this.up.length > 0){
            this.keys[this.up.pop()] = false;
        }
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