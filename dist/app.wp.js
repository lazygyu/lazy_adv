/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Animation{
    /**
     * Create an animation instance.
     * @param {SpriteSheet} sheet 
     * @param {Array} frames 
     * @param {float} duration 
     * @param {boolean} loop 
     */
  constructor(sheet, frames, duration, loop) {
    this.sheet = sheet;
    this.frames = frames;
    this.duration = duration;
    this.durationPerFrame = this.duration / this.frames.length;
    this.loop = loop || false;
    this.done = false;
    this.elapsed = 0;
    this.cur = 0;
  }

  /**
   * update this animation's state
   * @param {float} delta elapsed time after last call
   */
  update(delta) {
    if( this.done ) return;
    this.elapsed += delta;
    if( !this.loop && this.elapsed >= this.duration){
        this.cur = this.frames.length-1;
        this.done = true;
        return;
    }
    while (this.elapsed >= this.durationPerFrame) {
      this.elapsed -= this.durationPerFrame;
      this.cur++;
    }
    this.cur %= this.frames.length;
  }

/**
 * render this animation to canvas
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 */
  draw(ctx, x, y) {
    this.sheet.draw(ctx, x, y, this.frames[this.cur]);
  }
}

module.exports = Animation;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

class SpriteSheet{
  constructor(img, w, h) {
    this.img = img;
    this.tileWidth = w;
    this.tileHeight = h;
    this.columns = this.img.width / w;
    this.rows = this.img.height / h;
    this.img.addEventListener('load', () => { 
      this.columns = this.img.width / w;
    this.rows = this.img.height / h;
    });
  }

  draw(ctx, x, y, col, row) {
    if (row == null) {
      let c = col % this.columns;
      let r = Math.floor(col / this.columns);
      ctx.drawImage(this.img, c * this.tileWidth, r * this.tileHeight, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
    } else {
      ctx.drawImage(this.img, col * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
    }
  }
}

module.exports = SpriteSheet;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const SpriteSheet = __webpack_require__(1), Animation = __webpack_require__(0), conf = __webpack_require__(7);

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {
    ambientLight: function (color) {
        let cl = color;
        let r = cl.r, g = cl.g, b = cl.b;
        return function (ctx) {
            let origin = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let od = origin.data, l = origin.data.length;
            let i;

            for (i = 0; i < l; i += 4) {
                if (od[i] === 0 && od[i + 1] === 0 && od[i + 2] === 0) continue;
                od[i] = (od[i] * r) | 0;
                od[i + 1] = (od[i + 1] * g) | 0;
                od[i + 2] = (od[i + 2] * b) | 0;
            }
            ctx.putImageData(origin, 0, 0);
        }
    },
    spotLight: function (ctx, light) {
        let cl = light.color;
        let r = cl.r, g = cl.g, b = cl.b;
        let lx = light.x, ly = light.y, brightness=light.brightness;
        let dist = 0;
        
            let origin = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let od = origin.data, w = origin.width, h = origin.height;
            let x, y, cur, row,pw;
            for (y = 0; y < h; y++) {
                row = y * w * 4;
                for (x = 0; x < w; x++) {
                    dist = Math.sqrt(Math.pow(lx-x,2) + Math.pow(ly-y,2));
                    if( dist > brightness ) continue;
                    pw = 1-(dist/brightness);
                    cur = row + (x * 4);
                    if( od[cur]===0 && od[cur+1]===0 && od[cur+2]===0 ) continue;
                    od[cur] += 255*r*pw;
                    od[cur+1] += 255*g*pw;
                    od[cur+2] += 255*b*pw;
                }
            }
            ctx.putImageData(origin,0,0);
        
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

const Util = {
    randomInt: function (min, max) {
        return ((Math.random() * (max - min)) + min) | 0;
    },
    createHall: function (l, r) {
        if (l.connected.findIndex(v => v.x == r.x && v.y == r.y) >= 0) {
            console.log("already connected");
            return null;
        }
        let halls = [];
        let pt1 = { x: this.randomInt(1, l.w - 2) + l.x, y: this.randomInt(1, l.h - 2) + l.y };
        let pt2 = { x: this.randomInt(1, r.w - 2) + r.x, y: this.randomInt(1, r.h - 2) + r.y };
        let w = pt2.x - pt1.x;
        let h = pt2.y - pt1.y;

        l.connected.push(r);
        r.connected.push(l);

        if (w < 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    halls.push({ x: pt2.x, y: pt1.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt2.x, y: pt2.y, w: 1, h: Math.abs(h) + 1 });
                } else {
                    halls.push({ x: pt2.x, y: pt2.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt1.x, y: pt2.y, w: 1, h: Math.abs(h) + 1 });
                }
            } else if (h > 0) {
                if (Math.random() < 0.5) {
                    halls.push({ x: pt2.x, y: pt1.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt2.x, y: pt1.y, w: 1, h: Math.abs(h) + 1 });
                } else {
                    halls.push({ x: pt2.x, y: pt2.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt1.x, y: pt1.y, w: 1, h: Math.abs(h) + 1 });
                }
            } else {
                halls.push({ x: pt2.x, y: pt2.y, w: Math.abs(w), h: 1 });
            }
        } else if (w > 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    halls.push({ x: pt1.x, y: pt2.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt1.x, y: pt2.y, w: 1, h: Math.abs(h) });
                } else {
                    halls.push({ x: pt1.x, y: pt1.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt2.x, y: pt2.y, w: 1, h: Math.abs(h) });
                }
            } else if (h > 0) {
                if (Math.random() < 0.5) {
                    halls.push({ x: pt1.x, y: pt1.y, w: Math.abs(w), h: 2 });
                    halls.push({ x: pt2.x, y: pt1.y, w: 2, h: Math.abs(h) });
                } else {
                    halls.push({ x: pt1.x, y: pt2.y, w: Math.abs(w), h: 1 });
                    halls.push({ x: pt1.x, y: pt1.y, w: 1, h: Math.abs(h) });
                }
            } else {
                halls.push({ x: pt1.x, y: pt1.y, w: Math.abs(w), h: 1 });
            }
        } else {
            if (h < 0) {
                halls.push({ x: pt2.x, y: pt2.y, w: 1, h: Math.abs(h) });
            } else {
                halls.push({ x: pt1.x, y: pt1.y, w: 1, h: Math.abs(h) });
            }
        }
        return halls;
    },

    initArray: function (width, height, value) {
        let arr = [];
        for (let i = 0; i < height; i++) {
            arr.push([]);
            for (let j = 0; j < width; j++) {
                arr[i].push(value);
            }
        }
        return arr;
    }
};
module.exports = Util;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const SpriteSheet = __webpack_require__(1);
const Animation = __webpack_require__(0);
const Player = __webpack_require__(2);
const Util = __webpack_require__(4);
const Shaders = __webpack_require__(3);
const Leaf = __webpack_require__(6);
const ambient = Shaders.ambientLight({r:0.8, g:0.8, b:1.4, a:1});
const light1 = {color:{r:1, g:0.2, b:0.2}, brightness:100, x:300, y:300};
const conf = __webpack_require__(7);
const Input = __webpack_require__(8);

let $ = document.querySelector.bind(document);
let canv = document.createElement("canvas");
canv.width = 540;
canv.height = 540;
let buff = document.createElement("canvas");
buff.width = 270;
buff.height = 270;
let playerBuff = document.createElement("canvas");
playerBuff.width = 32;
playerBuff.height = 64;

$("#container").appendChild(canv);
let ctx = buff.getContext("2d");
let state = 0;
let tileImage = new Image();
tileImage.src = "images/tileset.png";



let _key = new Input();
_key.on();




let mapTiles = new SpriteSheet(tileImage, 32, 32);



class Tile{
  constructor(type, canSee, canMove, spriteNo) {
    this.type = type || 1;
    this.canSeeThrough = canSee || false;
    this.canMove = canMove || false;
    this.spriteNo = spriteNo;
  }

  set(type, canSee, canMove, spriteNo) {
    this.type = type;
    this.canSeeThrough = canSee || false;
    this.canMove = canMove || false;
    this.spriteNo = spriteNo || this.spriteNo;
  }
}



function createMap(width, height) {
  let arr = [];
  for (let i = 0; i < height; i++) {
    arr.push([]);
    for (let j = 0; j < width; j++) {
      arr[i].push(new Tile(1, false, false, 17));
    }
  }

  let root = new Leaf(0, 0, width, height);
  let leafs = [root];
  let did = true;
  // devide
  while (did) {
    did = false;
    leafs.forEach((l) => {
      if (!l.left && !l.right) {
        if (l.w > conf.MAX_LEAF || l.h > conf.MAX_LEAF || Math.random() > .75) {
          if (l.split()) {
            leafs.push(l.left);
            leafs.push(l.right);
            did = true;
          }
        }
      }
    });
  }
  root.createRooms();

  leafs.forEach(l => {
    if (l.room) {
      for (let i = 0; i < l.room.h; i++) {
        for (let j = 0; j < l.room.w; j++) {
          arr[i + l.room.y][j + l.room.x].set(0, true, true, 14);
        }
      }
    }
    if (l.halls.length > 0) {
      l.halls.forEach(hs => { 
        hs.forEach(h => { 
          for (let i = 0; i < h.h; i++){
            for (let j = 0; j < h.w; j++){
              arr[i + h.y][j + h.x].set(0, true, true, 14);
            }
          }
        });
      });
    }
  });

  for (let y = 0; y < height-1; y++){
    for (let x = 0; x < width; x++){
      if (arr[y][x].type == 1) {
        if (arr[y + 1][x].type == 0) {
          if (y > 0 && arr[y - 1][x].type == 0) {
            
              arr[y][x].set(1, true, false, 5);
              
          } else {
            arr[y][x].set(1, true, false, 4);
          }
        } else if (y > 0 && arr[y - 1][x].type == 0) {
          if (x > 0 && arr[y][x - 1].type == 0) {
            if (x < width && arr[y][x + 1].type == 0) {
              arr[y][x].set(1, false, false, 9)
            } else {
              arr[y][x].set(1, false, false, 6);
            }
          } else if (x < width - 1 && arr[y][x + 1].type == 0) {
            arr[y][x].set(1, false, false, 8);
          } else {
            arr[y][x].set(1, false, false, 7);
          }
        } else if (x < width - 1 && (arr[y][x + 1].type == 0 || arr[y+1][x+1].type == 0)) {
          arr[y][x].set(1, false, false, 18);
        } else if (x > 0 && (arr[y][x - 1].type == 0 || arr[y][x-1].spriteNo==4)) {
          arr[y][x].set(1, false, false, 16);
        }
      }
    }
  }

  
  return arr;
}

let map, viewmap, shownmap;
let first = true;

let player = new Player();
let last, cur;
cur = performance.now()/1000;

function init() {
  let w = 100, h = 100;
  map = createMap(w, h);
  viewmap = Util.initArray(w, h, 0);
  shownmap = Util.initArray(w, h, 0);

  loop1:
  for (let i = 0; i < w; i++) {
    loop2:
    for (let j = 0; j < h; j++) {
      if (map[i][j].type == 0) {
        player.tilePos.x = j;
        player.tilePos.y = i;
        player.realPos.x = j*32;
        player.realPos.y = i*32;
        light1.x = (j+3)*32;
        light1.y = (i+2)*32;
        break loop1;
      }
    }
  }

  if (first) render();
  first = false;
}

Math.getPoint = function (pt, ang, len) {
  return { x: pt.x + (len * Math.cos(ang)), y: pt.y + (len * Math.sin(ang)) };
}

function raycasting(pos, angle) {
  let limit = 200;
  let realPos = { x: pos.x * conf.TILE_SIZE + (conf.TILE_SIZE/2), y: pos.y * conf.TILE_SIZE + (conf.TILE_SIZE/2) };
  let light = 0;
  for (let i = 0; i < limit; i += 5) {
    let pt = Math.getPoint(realPos, angle, i);
    let x = (pt.x / conf.TILE_SIZE) | 0;
    let y = (pt.y / conf.TILE_SIZE) | 0;
    if (x < 0 || y < 0 || x > 99 || y > 99) return;
    light = 1 - i / limit;
    if (!map[y][x].canSeeThrough ) {
      viewmap[y][x] = light;
      shownmap[y][x] = 1;
      return;
    }

    if (viewmap[y][x] < light) viewmap[y][x] = light;
    shownmap[y][x] = 1;
  }
}

function render() {
  last = cur;
  cur = performance.now() / 1000;
  let delta = cur - last;
  player.update(delta, _key, map);
  
  
  
  ctx.save();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 640, 640);
  ctx.translate(-player.realPos.x+ 135, -player.realPos.y + 135);
  
  for (let i = 0; i < viewmap.length; i++) {
    for (let j = 0; j < viewmap[i].length; j++) {
      viewmap[i][j] = 0;
    }
  }
  for (let i = 0; i < 360; i+=3) {
    raycasting(player.tilePos, i);
  }
  map.forEach((row, y) => {
    row.forEach((t, x) => {

      if (shownmap[y][x] === 0) return true;
      if (Math.abs(player.tilePos.x - x) > 10 || Math.abs(player.tilePos.y - y) > 10) return true;
      let t_x = (x * conf.TILE_SIZE) | 0;
      let t_y = (y * conf.TILE_SIZE) | 0;
      
      
      mapTiles.draw(ctx, t_x, t_y, t.spriteNo);
      mapTiles.draw(ctx, t_x, t_y, (((viewmap[y][x] * 7) | 0) + 3) * 10);
      
    });
  });

  
  player.render(ctx, [light1]);
  ctx.drawImage(playerBuff, player.realPos.x, player.realPos.y-32);
  ctx.beginPath();
  ctx.arc(light1.x, light1.y, 10, 0, Math.PI*2,false);
  ctx.fill();
  ctx.restore();
  
  ambient(ctx);
  
  let cctx = canv.getContext("2d");
  cctx.mozImageSmoothingEnabled = false;
  cctx.webkitImageSmoothingEnabled = false;
  cctx.msImageSmoothingEnabled = false;
  cctx.imageSmoothingEnabled = false;
  cctx.drawImage(buff,0,0,540, 540);
  
  map.forEach((row, y) => {
    row.forEach((t, x) => {
      if (t.type === 1 || shownmap[y][x] == 0) return true;
      if (viewmap[y][x] === 0) {
        cctx.fillStyle = t.type===2?'#633':'#555';
      } else {
        cctx.fillStyle = t.type===2?'#c99':'#aaa';
      }
      cctx.fillRect(340 + x*2, y*2, 2, 2);
    });
  });
  cctx.fillStyle = "red";
  cctx.fillRect(340 + player.tilePos.x*2, player.tilePos.y*2, 2, 2);
  
  cctx.fillStyle = "white";
  cctx.fillText( (1/delta)|0 + "fps", 500, 20 );
  requestAnimationFrame(render);

}

init();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const conf = __webpack_require__(7);
const Util = __webpack_require__(4);

class Leaf {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.left = null;
    this.right = null;
    this.room = null;
    this.halls = [];
  }

  split() {
    let dir = false, max, sz;
    if (this.left || this.right) {
      return false;
    }
    dir = Math.random() > 0.5;
    if (this.w > this.h && this.w / this.h >= 1.25) {
      dir = 0;
    } else if (this.h > this.w && this.h / this.w >= 1.25) {
      dir = 1;
    }
    max = (dir ? this.h : this.w) - conf.MIN_LEAF;
    if (max < conf.MIN_LEAF) {
      return false;
    }
    sz = Math.floor(Math.random() * (max - conf.MIN_LEAF) + conf.MIN_LEAF);
    if (dir) {
      this.left = new Leaf(this.x, this.y, this.w, sz);
      this.right = new Leaf(this.x, this.y + sz, this.w, this.h - sz);
    } else {
      this.left = new Leaf(this.x, this.y, sz, this.h);
      this.right = new Leaf(this.x + sz, this.y, this.w - sz, this.h);
    }
    return true;
  }

  createRooms() {
    if (this.left || this.right) {
      if (this.left) this.left.createRooms();
      if (this.right) this.right.createRooms();
      if (this.left && this.right) {
        let hall = Util.createHall(this.left.getRoom(), this.right.getRoom());
        if (hall) this.halls.push(hall);
      }
    } else {
      let rw = Util.randomInt(3, this.w - 2);
      let rh = Util.randomInt(3, this.h - 2);
      let rx = Util.randomInt(1, this.w - rw - 2) + this.x;
      let ry = Util.randomInt(1, this.h - rh - 2) + this.y;
      this.room = { x: rx, y: ry, w: rw, h: rh, connected:[] };
      
    }
  }

  getRoom() {
    if (this.room) return this.room;

    if (!this.left && !this.right) {
      return null;
    }
    if (!this.right) return this.left.getRoom();
    if (!this.left) return this.right.getRoom();
    if (Math.random() > .5) return this.left.getRoom();
    return this.right.getRoom();
  }
}

module.exports = Leaf;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

let conf = {
    MIN_LEAF: 10,
    MAX_LEAF: 30,
    TILE_SIZE: 32
};
module.exports = conf;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

class Input{
    constructor(){
        this.keys = [];
        this.lastKeys = [];
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
        this.keys = [];
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

/***/ })
/******/ ]);