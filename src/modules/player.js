const SpriteSheet = require('./spritesheet.js'),
  Animation = require('./animation.js'),
  conf = require('./conf.js'),
  util = require('./util.js'),
  sound = require('./soundmanager.js');

/**
 * Player class
 */
class Player {
  /**
   * create a player instance
   */
  constructor() {
    this.load = 4;
    this.composite = document.createElement("canvas");
    this.composite.width = 320;
    this.composite.height = 192;

    this.composite_light = document.createElement("canvas");
    this.composite_light.width = 320;
    this.composite_light.height = 192;

    this.img = new Image();
    this.img.src = "images/character.png";
    this.cloth = new Image();
    this.cloth.src = "images/cloth1.png";

    this.lightmap = new Image();
    this.lightmap.src = "images/character_lightmap.png";

    this.clothlight = new Image();
    this.clothlight.src = "images/cloth1_light.png";

    this.inventorySize = 20;

    this.loaded = false;

    let loaded = () => {
      this.load--;
      if (this.load <= 0) {
        this.composite.getContext("2d").drawImage(this.img, 0, 0);
        this.composite.getContext("2d").drawImage(this.cloth, 0, 0);
        this.composite_light.getContext("2d").drawImage(this.lightmap, 0, 0);
        this.composite_light.getContext("2d").drawImage(this.clothlight, 0, 0);
        this.sheet = new SpriteSheet(this.composite, 32, 48);
        this.lighsheet = new SpriteSheet(this.composite_light, 32, 48);

        this.animations = {
          "stand": [
            new Animation(this.sheet, [0, 1, 2, 3], 0.5, true),
            new Animation(this.sheet, [10, 11, 12, 13], 0.5, true),
            new Animation(this.sheet, [20, 21, 22, 23], 0.5, true),
            new Animation(this.sheet, [30, 31, 32, 33], 0.5, true)
          ],
          "walk": [
            new Animation(this.sheet, [0, 4, 5, 4, 0, 6, 7, 6], 0.5, true),
            new Animation(this.sheet, [10, 14, 15, 14, 10, 16, 17, 16], 0.5, true),
            new Animation(this.sheet, [20, 25, 24, 25, 20, 27, 26, 27], 0.5, true),
            new Animation(this.sheet, [30, 34, 35, 34, 30, 36, 37, 36], 0.5, true)
          ]
        }
        this.animations_light = {
          "stand": [
            new Animation(this.lighsheet, [0, 1, 2, 3], 0.5, true),
            new Animation(this.lighsheet, [10, 11, 12, 13], 0.5, true),
            new Animation(this.lighsheet, [20, 21, 22, 23], 0.5, true),
            new Animation(this.lighsheet, [30, 31, 32, 33], 0.5, true)
          ],
          "walk": [
            new Animation(this.lighsheet, [0, 4, 5, 4, 0, 6, 7, 6], 0.5, true),
            new Animation(this.lighsheet, [10, 14, 15, 14, 10, 16, 17, 16], 0.5, true),
            new Animation(this.lighsheet, [20, 25, 24, 25, 20, 27, 26, 27], 0.5, true),
            new Animation(this.lighsheet, [30, 34, 35, 34, 30, 36, 37, 36], 0.5, true)
          ]
        }
        this.loaded = true;
      }
    }

    this.img.addEventListener("load", loaded);
    this.cloth.addEventListener("load", loaded);
    this.lightmap.addEventListener("load", loaded);
    this.clothlight.addEventListener("load", loaded);









    this.dir = 0;
    this.tilePos = { x: 5, y: 5 };
    this.realPos = { x: 5 * 32, y: 5 * 32 };
    this.state = 'stand';

    this.buff = document.createElement("canvas");
    this.buff.width = 32;
    this.buff.height = 64;
    this.btx = this.buff.getContext("2d");

    this.lightBuff = document.createElement("canvas");
    this.lightBuff.width = 32;
    this.lightBuff.height = 64;
    this.ltx = this.lightBuff.getContext("2d");

    this.tempBuff = document.createElement("canvas");
    this.tempBuff.width = 32;
    this.tempBuff.height = 64;
    this.ttx = this.tempBuff.getContext("2d");




    this.level = 1;
    this.str = 10;
    this.dex = 10;
    this.int = 10;
    this.sight = 96;

    this.fullHp = 10;
    this.hp = 10;
    this.maxHungry = 10;
    this.hungry = 0;

    this.inventory = [];
  }

  have(itemType) {
    return !!(this.inventory.findIndex(i => i.type === itemType));
  }

  gotItem(itemType) {
    if (this.inventory.length >= this.inventorySize) {
      
    }
  }

  use(itemType) {
    
  }

  get front() {
    switch (this.dir) {
      case 2:
        return { x: this.tilePos.x - 1, y: this.tilePos.y };  
      case 1:
        return { x: this.tilePos.x + 1, y: this.tilePos.y };
      case 0:
        return { x: this.tilePos.x, y: this.tilePos.y + 1 };
      case 3:
        return { x: this.tilePos.x, y: this.tilePos.y - 1 };
    }
  }

  /**
   * Update player's state
   * @param {number} delta elapsed time after last call
   * @param {Input} key key code
   * @param {Floor} map 
   */
  update(delta, key, map) {
    if (!this.loaded) return;
    if (this.state == 'stand') {
      if (key.isDown(37) || key.btnDown(14) || key.axes.x < -0.5) {
        if (this.dir == 2 && this.tilePos.x > 0 && map.canMove(this.tilePos.x - 1, this.tilePos.y)) {
          this.tilePos.x--;
          this.state = "walk";
          sound.play('footstep1');
        }
        this.dir = 2;
      } else if (key.isDown(39) || key.btnDown(15) || key.axes.x > 0.5) {
        if (this.dir == 1 && map.canMove(this.tilePos.x + 1, this.tilePos.y)) {
          this.tilePos.x++;
          this.state = "walk";
          sound.play('footstep1');
        }
        this.dir = 1;
      } else if (key.isDown(40) || key.btnDown(13) || key.axes.y > 0.5) {
        if (this.dir == 0 && map.canMove(this.tilePos.x, this.tilePos.y+1)) {
          this.tilePos.y++;
          this.state = "walk";
          sound.play('footstep1');
        }
        this.dir = 0;
      } else if (key.isDown(38) || key.btnDown(12) || key.axes.y < -0.5) {
        if (this.dir == 3 && this.tilePos.y > 0 && map.canMove(this.tilePos.x, this.tilePos.y-1)) {
          this.tilePos.y--;
          this.state = "walk";
          sound.play('footstep1');
        }
        this.dir = 3;
      } else if (key.isPress(13) || key.btnPress(0)) {
        console.log("do");
        let tPos = this.front;
        map.do(this, tPos.x, tPos.y);
      }

    }
    let tarX = this.tilePos.x * conf.TILE_SIZE;
    let tarY = this.tilePos.y * conf.TILE_SIZE;
    let speed = 128 * delta;
    if (Math.abs(tarX - this.realPos.x) >= speed) {
      this.realPos.x += speed * (tarX > this.realPos.x ? 1 : -1);
    } else {
      this.realPos.x = tarX;
    }
    if (Math.abs(tarY - this.realPos.y) >= speed) {
      this.realPos.y += speed * (tarY > this.realPos.y ? 1 : -1);
    } else {
      this.realPos.y = tarY;
    }
    this.realPos.x = Math.round(this.realPos.x);
    this.realPos.y = Math.round(this.realPos.y);
    if (this.realPos.x == tarX && this.realPos.y == tarY) {
      this.state = "stand";
    }

    this.animations[this.state][this.dir].update(delta);
    this.animations_light[this.state][this.dir].update(delta);
  }
  /**
   * draw the player into a canvas
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Array} lights lights array
   */
  render(ctx, lights) {
    if (!this.loaded) return;
    this.btx.clearRect(0, 0, 32, 64);
    this.ltx.clearRect(0, 0, 32, 64);
    this.ttx.clearRect(0, 0, 32, 64);
    this.animations[this.state][this.dir].draw(this.btx, 0, 16);
    this.animations[this.state][this.dir].draw(this.ttx, 0, 16);
    this.animations_light[this.state][this.dir].draw(this.ltx, 0, 16);

    if (lights && lights.length > 0) {
      let origin = this.btx.getImageData(0, 0, 32, 64);
      let light = this.ltx.getImageData(0, 0, 32, 64);
      let tempBuff = this.ttx.getImageData(0, 0, 32, 64);
      let dt = origin.data;
      let lt = light.data;
      let tt = tempBuff.data;
      let lim = dt.length;


      lights = lights.filter(l => typeof l == 'function' || util.distance(this.realPos.x, this.realPos.y, l.x, l.y) < l.brightness);
      lights.forEach(l => {

        if (typeof l == 'function') {
          
          l(this.ttx);
          tempBuff = this.ttx.getImageData(0, 0, 32, 64);
          tt = tempBuff.data;
          
        } else {

          let lx = l.x;
          let ly = l.y;
          let ang = Math.round(((Math.atan2(ly - this.realPos.y, lx - this.realPos.x) / Math.PI * 180 + 270) % 360) / 45) % 8;
          let mask = 0;
          let r = l.color.r, g = l.color.g, b = l.color.b, br = l.brightness;
          let t, mx = this.realPos.x, my = this.realPos.y, px, py;
          switch (ang) {
            case 0: mask = 4; break;
            case 1: mask = 12; break;
            case 2: mask = 8; break;
            case 3: mask = 9; break;
            case 4: mask = 1; break;
            case 5: mask = 3; break;
            case 6: mask = 2; break;
            case 7: mask = 6; break;
          }
          for (let i = 0; i < lim; i += 4) {
            if (!(lt[i] & mask) || (dt[i] === 0 && dt[i + 1] === 0 && dt[i + 2] === 0)) continue;
            px = (i / 4) % 32;
            py = (i / 4 / 32) | 0;
            px += mx; py += my;
            t = 1 - Math.sqrt(Math.pow(lx - px, 2) + Math.pow(ly - py, 2)) / br;
            tt[i] = Math.max(tt[i] + dt[i] * r * t, tt[i]);
            tt[i + 1] = Math.max(tt[i + 1] + dt[i] * g * t, tt[i + 1]);
            tt[i + 2] = Math.max(tt[i + 2] + dt[i] * b * t, tt[i + 2]);
          }
        }
      });
      this.btx.putImageData(tempBuff, 0, 0);
    }
    ctx.drawImage(this.buff, this.realPos.x, this.realPos.y - 32);
  }
}

module.exports = Player;