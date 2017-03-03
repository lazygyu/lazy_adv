const SpriteSheet = require('./spritesheet.js'), Animation = require('./animation.js'), conf = require('./conf.js');

/**
 * Player class
 */
class Player {
  /**
   * create a player instance
   */
  constructor() {
    this.img = new Image();
    this.img.src = "images/character.png";
    this.lightmap = new Image();
    this.lightmap.src = "images/character_lightmap.png";
    this.sheet = new SpriteSheet(this.img, 32, 48);
    this.lighsheet = new SpriteSheet(this.lightmap, 32, 48);
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

    this.animations = {
      "stand": [
        new Animation(this.sheet, [0, 1, 2, 3], 0.5, true),
        new Animation(this.sheet, [10, 11, 12, 13], 0.5, true),
        new Animation(this.sheet, [20, 21, 22, 23], 0.5, true),
        new Animation(this.sheet, [30, 31, 32, 33], 0.5, true)
      ],
      "walk": [
        new Animation(this.sheet, [0, 4, 5, 4, 0, 6, 7, 6], 0.5, true),
        new Animation(this.sheet, [10, 11, 12, 13], 0.5, true),
        new Animation(this.sheet, [20, 21, 22, 23], 0.5, true),
        new Animation(this.sheet, [30, 31, 32, 33], 0.5, true)
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
        new Animation(this.lighsheet, [10, 11, 12, 13], 0.5, true),
        new Animation(this.lighsheet, [20, 21, 22, 23], 0.5, true),
        new Animation(this.lighsheet, [30, 31, 32, 33], 0.5, true)
      ]
    }
  }

  /**
   * Update player's state
   * @param {number} delta elapsed time after last call
   * @param {Input} key key code
   * @param {Array} map 
   */
  update(delta, key, map) {
    if (this.state == 'stand') {
      if (key.isDown(37)) {
        if (this.dir == 2 && this.tilePos.x > 0 && map[this.tilePos.y][this.tilePos.x - 1].canMove) {
          this.tilePos.x--;
          this.state = "walk";
        }
        this.dir = 2;
      } else if (key.isDown(39)) {
        if (this.dir == 1 && map[this.tilePos.y][this.tilePos.x + 1].canMove) {
          this.tilePos.x++;
          this.state = "walk";
        }
        this.dir = 1;
      } else if (key.isDown(40)) {
        if (this.dir == 0 && map[this.tilePos.y + 1][this.tilePos.x].canMove) {
          this.tilePos.y++;
          this.state = "walk";
        }
        this.dir = 0;
      }else if (key.isDown(38)) {
        if (this.dir == 3 && this.tilePos.y > 0 && map[this.tilePos.y - 1][this.tilePos.x].canMove) {
          this.tilePos.y--;
          this.state = "walk";
        }
        this.dir = 3;
      } 
    }
    let tarX = this.tilePos.x * conf.TILE_SIZE;
    let tarY = this.tilePos.y * conf.TILE_SIZE;
    let speed = 128 * delta;
    if (Math.abs(tarX - this.realPos.x) >= speed) {
      this.realPos.x += speed* (tarX > this.realPos.x ? 1 : -1);
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
    this.btx.clearRect(0, 0, 32, 64);
    this.ltx.clearRect(0,0,32,64);
    this.animations[this.state][this.dir].draw(this.btx, 0, 0);
    this.animations_light[this.state][this.dir].draw(this.ltx,0,0);
    if(lights && lights.length > 0 ){
      let origin = this.btx.getImageData(0,0,32,64);
      let light = this.ltx.getImageData(0,0,32,64);
      let dt = origin.data;
      let lt = light.data;
      let lim = dt.length;
      

      lights = lights.filter(l=>Math.sqrt(Math.pow(this.realPos.x - l.x,2) + Math.pow(this.realPos.y-l.y,2)) < l.brightness);
      lights.forEach(l=>{
        let ang = Math.round(((Math.atan2(l.y - this.realPos.y, l.x - this.realPos.x)/Math.PI*180+270)%360)/45)%8;
        let mask = 0;
        let r = l.color.r, g = l.color.g, b = l.color.b;
        switch(ang){
          case 0: mask = 4; break;
          case 1: mask = 12; break;
          case 2: mask = 8; break;
          case 3: mask = 9; break;
          case 4: mask = 1; break;
          case 5: mask = 3; break;
          case 6: mask = 2; break;
          case 7: mask = 6; break;
        }
        for(let i=0;i<lim;i+=4){
          if( !(lt[i] & mask) || (dt[i]===0&&dt[i+1]===0&&dt[i+2]===0) ) continue;
          dt[i] += 255*r;
          dt[i+1]+=255*g;
          dt[i+2]+=255*b;
        }
      });
      this.btx.putImageData(origin,0,0);
    }
    ctx.drawImage(this.buff, this.realPos.x, this.realPos.y - 32);
    
  }
}

module.exports = Player;