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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const SpriteSheet = __webpack_require__(1);
	const Animation = __webpack_require__(2);
	const Player = __webpack_require__(3);
	const Util = __webpack_require__(5);
	const Shaders = __webpack_require__(9);
	const Leaf = __webpack_require__(10);
	const conf = __webpack_require__(4);
	const Input = __webpack_require__(11);
	const Floor = __webpack_require__(13);
	const SoundManager = __webpack_require__(7);
	const toaster = __webpack_require__(12);
	const SpriteRenderer = __webpack_require__(8);

	SoundManager.add("door", "./sounds/door.mp3");
	SoundManager.add("footstep1", "./sounds/footstep1.mp3");

	let $ = document.querySelector.bind(document);
	let canv = document.createElement("canvas");
	canv.width = 540;
	canv.height = 540;
	let buff = document.createElement("canvas");
	buff.width = 270;
	buff.height = 270;
	let buff2 = document.createElement("canvas");
	buff2.width = 270;
	buff2.height = 270;

	$("#container").appendChild(canv);
	let ctx = buff.getContext("2d");
	let state = 0;

	let _key = new Input();
	_key.on();

	let first = true;

	let player = new Player();
	let floor = null;
	let renderQueue = [];
	let floors = [];
	let mapRenderer = new SpriteRenderer(512, 512, ['shader-stage-fs', 'shader-stage-vs']);
	for (let i =1; i < 20; i++){
	  floors.push(new Floor(100, 100, 'building', i, {renderer:mapRenderer}));
	}
	floor = floors[0];
	let currentFloor = 0;

	let last, cur;
	cur = performance.now() / 1000;

	function init() {

	  player.tilePos = { x: floor.startPosition.x, y: floor.startPosition.y };
	  player.realPos = { x: player.tilePos.x * 32, y: player.tilePos.y * 32 };
	  render();
	  toaster.add("Game Start!");
	}



	function render() {
	  last = cur;
	  cur = performance.now() / 1000;
	  let delta = cur - last;
	  let lbuf = buff2.getContext("2d");

	  player.update(delta, _key, floor);
	  floor.update(delta, player);
	  toaster.update(delta);
	  _key.update();
	  while (floor.eventQueue.length > 0) {
	    let evt = floor.eventQueue.shift();
	    switch (evt.command) {
	      case "stair":
	        switch (evt.dir) {
	          case "up":
	            
	            if (currentFloor > 0) {
	              console.log("up!");
	              currentFloor--;
	              floor = floors[currentFloor];
	              player.setPos(floor.downPosition.x, floor.downPosition.y);
	            }
	            break;
	          case "down":
	            if (currentFloor < floors.length - 1) {
	              currentFloor++;
	              floor = floors[currentFloor];
	              player.setPos(floor.startPosition.x, floor.startPosition.y);
	            }
	            break;
	        }
	        break;
	    }
	  }

	  ctx.save();
	  ctx.fillStyle = "black";
	  ctx.fillRect(0, 0, 270, 270);
	  lbuf.clearRect(0, 0, 270, 270);

	  floor.render(ctx, player.realPos.x, player.realPos.y);
	  floor.draw(ctx, 0);
	  floor.draw(lbuf, 1);
	  ctx.drawImage(buff2, 0, 0, 270, 128, 0, 0, 270, 128);
	  ctx.translate(-player.realPos.x + conf.TILE_SIZE * 4, -player.realPos.y + conf.TILE_SIZE * 4);
	  player.render(ctx, [floor.ambient].concat(floor.lights));
	  ctx.restore();
	  ctx.save();
	  ctx.drawImage(buff2, 0, 128, 96, 32, 0, 128, 96, 32);
	  ctx.drawImage(buff2, 192, 128, 96, 32, 192, 128, 96, 32);
	  ctx.drawImage(buff2, 0, 160, 270, 110, 0, 160, 270, 110);
	  ctx.globalAlpha = 0.9;
	  ctx.drawImage(buff2, 96, 128, 32, 32, 96, 128, 32, 32);
	  ctx.drawImage(buff2, 160, 128, 32, 32, 160, 128, 32, 32);
	  ctx.globalAlpha = 0.8;
	  ctx.drawImage(buff2, 128, 128, 32, 32, 128, 128, 32, 32);
	  ctx.restore();



	  let cctx = canv.getContext("2d");
	  cctx.mozImageSmoothingEnabled = false;
	  cctx.webkitImageSmoothingEnabled = false;
	  cctx.msImageSmoothingEnabled = false;
	  cctx.imageSmoothingEnabled = false;
	  cctx.drawImage(buff, 0, 0, 540, 540);

	  floor.map.forEach((row, y) => {
	    row.forEach((t, x) => {
	      if (t.type === 1 || floor.shownmap[y][x] === 0) return true;
	      if (floor.viewmap[y][x] === 0) {
	        cctx.fillStyle = t.spriteNo === 14 ? '#633' : '#555';
	      } else {
	        cctx.fillStyle = t.spriteNo === 14 ? '#c99' : '#aaa';
	      }
	      cctx.fillRect(340 + x * 2, y * 2, 2, 2);
	    });
	  });
	  floor.mapObjects.forEach((o) => { 
	    if (!o.title || o.title !== "stair") return true;
	    cctx.fillStyle = "#9cf";
	    cctx.fillRect(340 + (o.x * 2), o.y * 2, 2, 2);
	  });

	  cctx.fillStyle = "red";
	  cctx.fillRect(340 + player.tilePos.x * 2, player.tilePos.y * 2, 2, 2);

	  cctx.fillStyle = "white";
	  cctx.fillText(Math.round(1 / delta) + "fps", 500, 20);

	  toaster.render(cctx);
	  requestAnimationFrame(render);

	}

	init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	class SpriteSheet{
	  constructor(img, w, h) {
	    this.img = img;
	    this.tileWidth = w;
	    this.tileHeight = h;
	    this.columns = this.img.width / w;
	    this.rows = this.img.height / h;
	    this.canvas = document.createElement("canvas");
	    this.ctx = null;
	    if( this.img.addEventListener )  this.img.addEventListener('load', () => { 
	      this.columns = this.img.width / w;
	      this.rows = this.img.height / h;
	      this.canvas.width = img.width;
	      this.canvas.height = img.height;
	    });

	    
	  }

	  draw(ctx, x, y, col, row) {
	    if (this.img.width == 0 && this.img.height == 0) return;
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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const SpriteSheet = __webpack_require__(1),
	  Animation = __webpack_require__(2),
	  conf = __webpack_require__(4),
	  util = __webpack_require__(5),
	  sound = __webpack_require__(7),
	  Renderer = __webpack_require__(8);

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


	    this.renderer = new Renderer(32, 64, ['shader-fs', 'shader-vs']);

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

	  setPos(x, y) {
	    this.tilePos = { x: x, y: y };
	    this.realPos = { x: x * 32, y: y * 32 };
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
	    if (this.realPos.x == tarX && this.realPos.y == tarY && this.state != "stand") {
	      map.reach(this);
	      this.state = "stand";
	    }

	    this.animations[this.state][this.dir].update(delta);
	    this.animations_light[this.state][this.dir].update(delta);
	  }

	  mult(tar, c){
	    tar[0] += c.r;
	    tar[1] += c.g;
	    tar[2] += c.b
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
	    let amb = lights && lights.find(l=>typeof l == 'function');
	    let top = [1, 1, 1], left = [1, 1, 1], right = [1, 1, 1], bottom = [1, 1, 1];
	    if (lights && lights.length > 0) {
	      
	      lights = lights.filter(l => util.distance(this.realPos.x, this.realPos.y, l.x, l.y) < l.brightness);
	      

	      
	      lights.forEach(l => {
	          let lx = l.x;
	          let ly = l.y;
	          let ang = Math.round(((Math.atan2(ly - this.realPos.y, lx - this.realPos.x) / Math.PI * 180 + 270) % 360) / 45) % 8;
	          let mask = 0;
	          let r = l.color.r, g = l.color.g, b = l.color.b, br = l.brightness;
	          let t, mx = this.realPos.x, my = this.realPos.y, px, py;
	          let bright = 1.0 - util.distance(mx, my, lx, ly)/br;
	          let cl = {r:r*bright, g:g*bright, b:b*bright};
	          switch (ang) {
	            case 0: 
	              mask = 4; 
	              this.mult(bottom, cl);
	            break;
	            case 1: 
	              mask = 12; 
	              this.mult(bottom, cl);
	              this.mult(left, cl);
	              break;
	            case 2: 
	              mask = 8; 
	              this.mult(left, cl);
	              break;
	            case 3:
	              mask = 9;
	              this.mult(top, cl);
	              this.mult(left, cl);
	              break;
	            case 4: 
	              mask = 1;
	              this.mult(top, cl);
	              break;
	            case 5:
	              mask = 3;
	              this.mult(top, cl);
	              this.mult(right, cl);
	              break;
	            case 6: 
	              mask = 2; 
	              this.mult(right, cl);
	              break;
	            case 7: 
	              mask = 6; 
	              this.mult(bottom, cl);
	              this.mult(right, cl);
	              break;
	          }
	          
	      });
	      
	    }
	    
	    this.renderer.render(this.buff, this.lightBuff, amb, [top, left, bottom, right]);
	    ctx.drawImage(this.renderer.canvas, this.realPos.x, this.realPos.y - 32);
	  }
	}

	module.exports = Player;

/***/ },
/* 4 */
/***/ function(module, exports) {

	let conf = {
	    MIN_LEAF: 10,
	    MAX_LEAF: 30,
	    TILE_SIZE: 32
	};
	module.exports = conf;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Tile = __webpack_require__(6);
	const conf = __webpack_require__(4);

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
	    getPoint: function (pt, ang, len) {
	        return { x: pt.x + (len * Math.cos(ang)), y: pt.y + (len * Math.sin(ang)) };
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
	    },
	    distance: function (x1, y1, x2, y2) {
	        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	    },
	    raycasting: function (pos, angle, limit, map) {
	        let realPos = { x: pos.x  + (conf.TILE_SIZE / 2), y: pos.y  + (conf.TILE_SIZE / 2) };
	        
	        let light = 0;
	        for (let i = 0; i < limit; i += 5) {
	            let pt = this.getPoint(realPos, angle, i);
	            let x = Math.floor(pt.x / conf.TILE_SIZE);
	            let y = Math.floor(pt.y / conf.TILE_SIZE);
	            light = 1 - i / limit;
	            if (!map.canSeeThrough(x, y)) {
	                map.view(x, y, light);
	                map.see(x, y);
	                return;
	            }
	            map.view(x, y, light);
	            map.see(x, y);
	        }
	    }
	};
	module.exports = Util;

/***/ },
/* 6 */
/***/ function(module, exports) {

	class Tile{
	  constructor(type, canSee, canMove, spriteNo) {
	    this.type = type;
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
	module.exports = Tile;

/***/ },
/* 7 */
/***/ function(module, exports) {

	class SoundManager{
	  constructor() {
	    this.sounds = {};

	  }

	  add(name, path) {
	    if (this.sounds[name]) return;
	    let tmp = new Audio(path);
	    this.sounds[name] = tmp;
	  }

	  play(name) {
	    if (this.sounds[name]) {
	      this.sounds[name].pause();
	      this.sounds[name].currentTime = 0;
	      this.sounds[name].play();
	    }
	  }
	}

	SoundManager.instance = null;
	SoundManager.getInstance = function () {
	  if (this.instance === null) {
	    this.instance = new SoundManager();
	  }
	  return this.instance;
	}

	module.exports = SoundManager.getInstance();

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * 
	 * @param {WebGLRenderingContext} gl 
	 * @param {string} id 
	 * @return {WebGLShader}
	 */
	function getShader(gl, id){
	    let scr = document.querySelector("#" + id);
	    let source = scr.textContent;
	    let shader = null;
	    switch(scr.type){
	        case "x-shader/x-fragment":
	            shader = gl.createShader(gl.FRAGMENT_SHADER);
	        break;
	        case "x-shader/x-vertex":
	            shader = gl.createShader(gl.VERTEX_SHADER);
	        break;
	    }

	    if( !shader ) return null;
	    gl.shaderSource(shader, source);
	    gl.compileShader(shader);
	    return shader;
	}


	class SpriteRenderer{
	    constructor(width, height, shaderTypes){
	        this.canvas = document.createElement("canvas");
	        this.canvas.width = width;
	        this.canvas.height = height;
	        let gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
	        this.gl = gl;

	        // webgl init
	        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	        gl.enable(gl.DEPTH_TEST);
	        let shaders = shaderTypes.map(st=>getShader(gl, st));
	        

	        let shaderProgram = gl.createProgram();
	        this.shaderProgram = shaderProgram;
	        shaders.forEach(sd=>gl.attachShader(this.shaderProgram, sd));
	        gl.linkProgram(this.shaderProgram);
	        gl.useProgram(this.shaderProgram);

	        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	        

	        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	        if( shaderProgram.vertexNormalAttribute >= 0 ) gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	        shaderProgram.mNormalUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
	        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

	        let mvMatrix = mat4.create();
	        let pMatrix = mat4.create();
	        let vertexPositionBuffers = gl.createBuffer();
	        let ratio = width/height;
	        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffers);

	        let vertices = [
	            -1.0,-1.0, 0.0,
	             1.0,-1.0, 0.0,
	             1.0, 1.0, 0.0,
	            -1.0, 1.0, 0.0
	        ];
	        //vertices = vertices.map((v,i)=>v*(i%3==0?ratio:1));
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	        vertexPositionBuffers.itemSize = 3;
	        vertexPositionBuffers.numItems = 4;

	        
	        let vertexNormalBuffers = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffers);
	        let normals = [
	            0.0, 0.0, 1.0,
	            0.0, 0.0, 1.0,
	            0.0, 0.0, 1.0,
	            0.0, 0.0, 1.0
	        ];
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	        vertexNormalBuffers.itemSize = 3;
	        vertexNormalBuffers.numItems = 4;

	        let coordBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
	        let coordVert = [
	            0.0, 0.0,
	            1.0, 0.0,
	            1.0, 1.0,
	            0.0, 1.0
	        ];
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordVert), gl.STATIC_DRAW);
	        coordBuffer.itemSize = 2;
	        coordBuffer.numItems = 4;

	        let indexBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	        let indexes = [
	            0, 1, 2, 0, 2, 3
	        ];
	        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
	        indexBuffer.itemSize = 1;
	        indexBuffer.numItems = 6;

	        let texture = gl.createTexture();
	        let lightTexture = gl.createTexture();
	        this.o = {
	            texture:texture,
	            lightTexture:lightTexture,
	            vertexPositionBuffers: vertexPositionBuffers,
	            vertexNormalBuffers: vertexNormalBuffers,
	            mvMatrix:mvMatrix,
	            pMatrix:pMatrix,
	            coordBuffer:coordBuffer,
	            indexBuffer:indexBuffer
	        };
	    }

	    updateTexture(gl, src, texture){
	        gl.bindTexture(gl.TEXTURE_2D, texture);
	        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	        gl.bindTexture(gl.TEXTURE_2D, null);
	    }

	    render(src, lightmap, ambient, lights, lightSources){
	        let gl = this.gl;
	        
	        this.updateTexture(gl, src, this.o.texture);
	        if( lightmap ) this.updateTexture(gl, lightmap, this.o.lightTexture);
	        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	        
	        gl.bindBuffer(gl.ARRAY_BUFFER, this.o.vertexPositionBuffers);
	        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.o.vertexPositionBuffers.itemSize, gl.FLOAT, false, 0, 0);

	        gl.bindBuffer(gl.ARRAY_BUFFER, this.o.coordBuffer);
	        gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.o.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	        if (this.shaderProgram.vertexNormalAttribute >= 0) {
	            gl.bindBuffer(gl.ARRAY_BUFFER, this.o.vertexNormalBuffers);
	            gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.o.vertexNormalBuffers.itemSize, gl.FLOAT, false, 0, 0);
	        }    
	 
	        gl.activeTexture(gl.TEXTURE0);
	        gl.bindTexture(gl.TEXTURE_2D, this.o.texture);
	        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);
	        
	        gl.activeTexture(gl.TEXTURE1);
	        gl.bindTexture(gl.TEXTURE_2D, this.o.lightTexture);
	        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "normalMap"), 1);

	        //gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "aVertexNormal"), 0, 0, 1.0);

	        
	        if( lights.length > 0 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "topC"), lights[0][0], lights[0][1], lights[0][2]);
	        if( lights.length > 1 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "leftC"), lights[1][0], lights[1][1], lights[1][2]);
	        if( lights.length > 2 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "bottomC"), lights[2][0], lights[2][1], lights[2][2]);
	        if( lights.length > 3 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "rightC"), lights[3][0], lights[3][1], lights[3][2]);
	        if( ambient ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "ambientLight"), ambient.color.r, ambient.color.g, ambient.color.b);
	        
	        if(lightSources){
	            let positions = [];
	            let colors = [];
	            lightSources.forEach(l=>{ positions.push(l.x, l.y); colors.push(l.color.r, l.color.g, l.color.b, l.brightness); });
	            if(positions.length > 0 ){
	                gl.uniform2fv(gl.getUniformLocation(this.shaderProgram, "lightPositions"), positions);
	                gl.uniform4fv(gl.getUniformLocation(this.shaderProgram, "lightColors"), colors);
	            }
	        }

	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.o.indexBuffer);
	        
	        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.o.pMatrix);
	        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.o.mvMatrix);
	        let normalMatrix = mat3.create();
	        mat4.toInverseMat3(this.o.mvMatrix, normalMatrix);

	        mat4.toInverseMat3(this.o.mvMatrix, normalMatrix);
	        mat3.transpose(normalMatrix);
	        

	        gl.uniformMatrix3fv(this.shaderProgram.mNormalUniform, false, normalMatrix);
	        gl.useProgram(this.shaderProgram);
	        gl.drawElements(gl.TRIANGLES, this.o.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	        
	        gl.deleteProgram(this.shaderProgram);
	    }
	}

	module.exports = SpriteRenderer;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict"

	module.exports = {
	    ambientLight: function (color) {
	        let cl = color;
	        let r = cl.r, g = cl.g, b = cl.b;
	        let fnc =  function (ctx) {
	            let origin = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	            let od = origin.data, l = origin.data.length;
	            let i;

	            for (i = 0; i < l; i += 4) {
	                if (od[i] === 0 && od[i + 1] === 0 && od[i + 2] === 0) continue;
	                od[i] = od[i] * r;
	                od[i + 1] = od[i + 1] * g;
	                od[i + 2] = od[i + 2] * b;
	            }
	            ctx.putImageData(origin, 0, 0);
	        }
	        fnc.color = cl;
	        return fnc;
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const conf = __webpack_require__(4);
	const Util = __webpack_require__(5);

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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const toaster = __webpack_require__(12);

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

/***/ },
/* 12 */
/***/ function(module, exports) {

	class Toast{
	  constructor(msg, color) {
	    this.msg = msg;
	    this.color = color;
	    if (color == null) {
	      this.color = 'red';
	    }
	    this.done = false;
	    this.elapsed = 0;
	  }

	  update(delta) {
	    if (this.done) return;
	    this.elapsed += delta;
	    if (this.elapsed > 3) {
	      this.done = true;
	    }
	  }

	  render(ctx, y) {
	    ctx.save();
	    ctx.font = "16px verdana";
	    let w = Math.max(ctx.measureText(this.msg).width, 130) + 50;
	    let x = (this.elapsed < 0.5) ? (this.elapsed/0.5) * w : (1 - (this.elapsed - 2.5)/0.5) * w;
	    if (this.elapsed > 0.5 && this.elapsed < 2.5) x = w;
	    x = ctx.canvas.width - x;
	    ctx.translate(x, y);
	    ctx.fillStyle = 'rgba(0,0,0,0.9)';
	    ctx.fillRect(0, 0, w, 50);
	    ctx.fillStyle = this.color;
	    ctx.fillRect(0, 0, 10, 50);
	    ctx.fillStyle = 'white';
	    ctx.fillText(this.msg, 20, 33);
	    ctx.restore();
	  }
	}

	class Toaster{
	  constructor() {
	    this.toasts = [];
	  }

	  add(msg, color) {
	    
	    this.toasts.push(new Toast(msg, color));
	  }

	  update(delta) {
	    this.toasts.forEach(t => t.update(delta));
	    this.toasts = this.toasts.filter(t => !t.done);
	  }

	  render(ctx) {
	    let h = ctx.canvas.height;
	    this.toasts.forEach((t, i) => { 
	      t.render(ctx, h - ((i+1) * 60));
	    });
	  }
	}

	Toaster.instance = null;
	Toaster.getInstance = function () {
	  if (Toaster.instance === null) {
	    Toaster.instance = new Toaster();
	  }
	  return Toaster.instance;
	}

	module.exports = Toaster.getInstance();

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	const util = __webpack_require__(5);
	const SpriteSheet = __webpack_require__(1);
	const conf = __webpack_require__(4);
	const Tile = __webpack_require__(6);
	const Leaf = __webpack_require__(10);
	const Shaders = __webpack_require__(9);
	const Door = __webpack_require__(14);
	const createDungeon = __webpack_require__(15);
	const SpriteRenderer = __webpack_require__(8);
	const tileSets = {
	  building: 'images/tileset.png'
	};

	class Floor {
	  constructor(width, height, type, depth, opt) {
	    this.depth = depth || 1;
	    this.width = width;
	    this.height = height;


	    this.lights = [];
	    this.monsters = [];
	    this.mapObjects = [];
	    this.items = [];
	    this.ambient = Shaders.ambientLight({ r: Math.min(0.3+Math.random(), 0.8), g: Math.min(0.3+Math.random(),0.8), b: Math.min(Math.random()+0.3, 1), a: 1 });
	    
	    this.tileset = new Image();
	    this.tileset.src = tileSets[type];
	    this.layers = [];
	    
	    this.buffers = [document.createElement("canvas"), document.createElement("canvas")];
	    this.buffers.forEach(cv=>{
	      cv.width = 512;
	      cv.height = 512;
	    });
	    this.objectBuffers = [document.createElement("canvas"), document.createElement("canvas")];
	    this.objectBuffers.forEach(cv=>{
	      cv.width = 128;
	      cv.height = 128;
	    });

	    this.mapRenderer = opt.renderer || new SpriteRenderer(512,512, ['shader-stage-fs', 'shader-stage-vs']);
	    
	    this.sheet = new SpriteSheet(this.tileset, 32, 32);
	    this.map = util.initArray(width, height, null);
	    this.mapTop = util.initArray(width, height, null);
	    //this.createMap(width, height, this.lights);
	    let res = createDungeon(width, height, this.sheet, 50, depth);
	    this.map = res.map;
	    this.startPosition = res.startPosition;
	    this.downPosition = res.downPosition;
	    this.lights.push.apply(this.lights, res.lights);
	    this.mapObjects.push.apply(this.mapObjects, res.doors);
	    for (let _x = 0; _x < this.width; _x++){
	      for (let _y = 0; _y < this.height; _y++){
	        if (this.map[_y][_x] == null) {
	          if (_y < height - 1 && this.map[_y + 1][_x] !== null && this.map[_y + 1][_x].type === 0) {
	            this.map[_y][_x] = new Tile(1, false, false, 4);
	          } else {
	            this.map[_y][_x] = new Tile(1, false, false, 17);
	          }
	        }else if(_y < this.height-1 && this.map[_y][_x].type == 1 && this.map[_y+1][_x] && this.map[_y+1][_x].type == 0){
	          this.map[_y][_x].spriteNo = 4;
	        }
	      }
	    }
	    for (let _x = 0; _x < this.width; _x++){
	      for (let _y = 0; _y < this.height; _y++){
	        if (_x > 0 && _x < this.width - 1 && this.map[_y][_x].type == 1 && this.map[_y][_x - 1].type == 0 && this.map[_y][_x + 1].type == 0) {
	          if (_y > 0 && this.map[_y - 1][_x].type == 0) {
	            this.mapTop[_y - 1][_x] = new Tile(1, false, false, 9);
	          } else {
	            this.mapTop[_y - 1][_x] = new Tile(1, false, false, 19);
	          }
	        } else if (_x > 0 && this.map[_y][_x].type == 1 && this.map[_y][_x - 1].type == 0) {
	          if (_y > 0 && this.map[_y - 1][_x].type == 0) {
	            this.mapTop[_y - 1][_x] = new Tile(1, false, false, 6);
	            //this.map[_y][_x].spriteNo = 16;
	          } else {
	            this.mapTop[_y - 1][_x] = new Tile(1, false, false, 16);
	          }
	         } else if (_x < this.width - 1 && this.map[_y][_x].type == 1 && this.map[_y][_x + 1].type == 0) {
	           if (_y > 0 && this.map[_y - 1][_x].type == 0) {
	             this.mapTop[_y - 1][_x] = new Tile(1, false, false, 8);
	           } else {
	             this.mapTop[_y - 1][_x] = new Tile(1, false, false, 18);
	          }
	         } else if (_y > 0 && this.map[_y][_x].type == 1 && this.map[_y - 1][_x].type == 0) {
	           this.mapTop[_y - 1][_x] = new Tile(1, false, false, 7); 
	        }
	      }
	    }
	    this.layers.push(this.map);
	    this.viewmap = util.initArray(width, height, 0);
	    this.shownmap = util.initArray(width, height, 0);
	    this.tileset.addEventListener("load", () => { this.makeBuffer(); });
	    this.eventQueue = [];
	  }

	  canMove(x, y) {
	    let res = x >= 0 && y >= 0 && x < this.width && y < this.height && this.map[y][x].canMove;
	    this.monsters.forEach(m => {
	      res = res && (m.x != x && m.y != y);
	    });
	    this.mapObjects.forEach(o => { 
	      if (o.x === x && o.y === y) res = res && o.canMove;
	    });
	    return res;
	  }

	  canSeeThrough(x, y) {
	    let res = x >= 0 && y >= 0 && x < this.width && y < this.height && this.map[y][x].canSeeThrough;
	    this.mapObjects.forEach(o => { 
	      if (o.x == x && o.y == y) res = res && o.canSeeThrough;
	    });
	    return res;
	  }

	  see(x, y) {
	    if (x >= 0 && y >= 0 && x < this.width && y < this.height) this.shownmap[y][x] = 1;
	  }

	  view(x, y, close) {
	    if (x >= 0 && y >= 0 && x < this.width && y < this.height) this.viewmap[y][x] = Math.max(close, this.viewmap[y][x]);
	  }

	  update(delta, player) {
	    this.monsters.forEach(m => m.update(delta, this.map, player));
	    this.mapObjects.forEach(o => { 
	      if (o.update) o.update(delta, player);
	    });
	    this.viewmap = util.initArray(this.width, this.height, 0);
	    for (let i = 0; i < 360; i += 5) {
	      util.raycasting(player.realPos, i, player.sight, this);
	    }
	  }

	  getObject(x, y) {
	    let objs = [];
	    Array.prototype.push.call(objs, this.monsters.filter(m => m.x == x && m.y == y));
	    Array.prototype.push.call(objs, this.items.filter(i => i.x == x && i.y == y));
	    Array.prototype.push.call(objs, this.mapObjects.filter(i => i.x == x && i.y == y));
	    return objs;
	  }

	  draw(ctx, layer) {
	    ctx.drawImage(this.buffers[layer], 0, 0);
	  }

	  reach(player) {
	    this.mapObjects.forEach(i => { 
	      if (i.x == player.tilePos.x && i.y == player.tilePos.y && i.reach) {
	        this.eventQueue.push(i.reach(player));
	      }
	    });
	  }

	  do(player, x, y) {
	    this.items.forEach(i => { 
	      if (i.x == x && i.y == y) i.do(player);
	    });
	    this.monsters.forEach(i => { 
	      if (i.x == x && i.y == y) i.do(player);
	    });
	    this.mapObjects.forEach(i => { 
	      if (i.x == x && i.y == y) i.do(player);
	    });
	  }

	  makeBuffer(){
	    
	  }

	  render(ctx, sx, sy) {
	    let x, y;
	    let ix = Math.floor(sx / conf.TILE_SIZE) - 4, iy = Math.floor(sy / conf.TILE_SIZE) - 4;
	    let x_pad = sx % conf.TILE_SIZE, y_pad = sy % conf.TILE_SIZE;
	    let minx = sx - 4 * conf.TILE_SIZE, maxx = sx + 5 * conf.TILE_SIZE;
	    let miny = sy - 4 * conf.TILE_SIZE, maxy = sy + 5 * conf.TILE_SIZE;
	    let ctx1 = this.buffers[0].getContext("2d");
	    let ctx2 = this.buffers[1].getContext("2d");
	    ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
	    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
	    let octx1 = this.objectBuffers[0].getContext("2d");
	    let octx2 = this.objectBuffers[1].getContext("2d");

	    for(x=ix;x<ix+10;x++){
	      if( x < 0 || x > this.width ) continue;
	      for(y=iy;y<iy+10;y++){
	        if( y < 0 || y > this.width ) continue;
	        octx1.clearRect(0,0,octx1.canvas.width,octx1.canvas.height);
	        octx2.clearRect(0,0,octx2.canvas.width,octx2.canvas.height);
	        this.sheet.draw(octx1,0, 0, this.map[y][x].spriteNo);
	        
	        ctx1.drawImage(this.objectBuffers[0], x*conf.TILE_SIZE-minx, y*conf.TILE_SIZE-miny);
	        if( this.mapTop[y][x] ){
	          this.sheet.draw(octx2,0,0, this.mapTop[y][x].spriteNo);
	          
	          ctx2.drawImage(this.objectBuffers[1], x*conf.TILE_SIZE-minx, y*conf.TILE_SIZE-miny);
	        }
	      }
	    }

	    let fh = this.height * conf.TILE_SIZE;
	    
	    let lights = this.lights
	      //.filter(l => l.x > minx && l.x < maxx && l.y > miny)
	      .map(l => {
	        return {
	          x: (l.x - minx) / 512,
	          y: 1.0 - (l.y - miny) / 512,
	          color: l.color,
	          brightness: l.brightness / conf.TILE_SIZE
	        };
	      });
	      //.filter(l => l.x <= 1.0 && l.y <= 1.0);
	    
	    

	    
	    
	    this.mapObjects.forEach((o) => { 
	      if (this.shownmap[o.y][o.x] === 0) return true;
	      o.render(ctx1, ctx2, minx, miny);
	    });
	    this.mapRenderer.render(this.buffers[0], null, this.ambient, [], lights);
	    ctx1.drawImage(this.mapRenderer.canvas, 0, 0);
	    this.mapRenderer.render(this.buffers[1], null, this.ambient, [], []);
	    ctx2.drawImage(this.mapRenderer.canvas, 0, 0);

	    ctx1.fillStyle = "black";
	    ctx2.fillStyle = "black";
	    for(y=0;y<11;y++){
	      for(x=0;x<11;x++){
	        if (y + iy < 0 || x + ix < 0 || x + ix >= this.width || y + iy >= this.height ) continue;
	        if( !this.shownmap[y+iy][x+ix]) {
	            ctx1.fillRect(x*conf.TILE_SIZE-x_pad, y*conf.TILE_SIZE-y_pad, conf.TILE_SIZE, conf.TILE_SIZE);
	            ctx2.fillRect(x*conf.TILE_SIZE-x_pad, (y-1)*conf.TILE_SIZE-y_pad, conf.TILE_SIZE, conf.TILE_SIZE);
	        }
	        //if( this.shownmap[y+iy][x+ix] ) this.sheet.draw(ctx1, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, Math.round(this.viewmap[y + iy][x + ix] * 8 + 3) * 10);
	        this.sheet.draw(ctx2, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, Math.round(this.viewmap[y + iy][x + ix] * 8 + 3) * 10);
	      }
	    }
	    
	  }
	  

	}

	module.exports = Floor;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	const conf = __webpack_require__(4);
	const sound = __webpack_require__(7);
	const toaster = __webpack_require__(12);
	class Door{
	  constructor(dir, sheet, x, y, key) {
	    this.dir = dir;
	    this.x = x;
	    this.y = y;
	    this.sheet = sheet;
	    this.opened = false;
	    this.canSeeThrough = false;
	    this.canMove = false;
	    this.type = "mapobject";
	    this.openTimer = 0;
	    this.locked = key || null;
	    this.openSound = 'door';
	    this.title = "door";
	  }

	  update(delta) {
	    if (this.openTimer > 0) {
	      this.openTimer -= delta;
	      if (this.openTimer < 0) this.openTimer = 0;
	    }
	  }

	  render(ctx1, ctx2, sx, sy) {
	    let rx = (this.x * conf.TILE_SIZE) - sx;
	    let ry = (this.y * conf.TILE_SIZE) - sy;
	    let tile = this.opened ? ((this.openTimer > 0) ? 70 : 50) : 30;
	    if (this.dir === 0) {
	      this.sheet.draw(ctx2, rx, ry - conf.TILE_SIZE, tile+1);
	      this.sheet.draw(ctx1, rx, ry, tile + 11);
	    } else {
	      this.sheet.draw(ctx2, rx, ry - conf.TILE_SIZE, tile + 3);
	      this.sheet.draw(ctx1, rx, ry, tile + 13);
	      this.sheet.draw(ctx2, rx + conf.TILE_SIZE, ry - conf.TILE_SIZE, tile + 4);
	      this.sheet.draw(ctx1, rx + conf.TILE_SIZE, ry, tile + 14);
	    }
	  }

	  do(player) {
	    if (this.locked) {
	      if (player.have(this.locked)) {
	        player.use(this.locked);
	        this.locked = null;
	      } else {
	        toaster.add("Door is locked");
	        return;
	      }
	    }
	    this.opened = true;
	    this.canSeeThrough = true;
	    this.canMove = true;
	    this.openTimer = 0.2;
	    sound.play(this.openSound);
	    
	  }
	}

	module.exports = Door;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	const util = __webpack_require__(5), Tile = __webpack_require__(6), Door = __webpack_require__(14), Stair = __webpack_require__(16);

	const DIRECTION = {
	  EAST: 2,
	  WEST: 1,
	  NORTH: 3,
	  SOUTH: 0
	};

	const arrDirection = ['SOUTH', 'WEST', 'EAST', 'NORTH'];

	function getFeatureLowerBound(c, len) {
	  return Math.floor(c - len / 2);
	}

	function getFeatureUpperBound(c, len) {
	  return Math.floor(c + (len + 1) / 2);
	}

	function isFeatureWallBound(c, len){
	  return Math.floor(c + (len-1)/2);
	}

	function isWall(x, y, xlen, ylen, xt, yt, d) {
	  let a = getFeatureLowerBound, b = isFeatureWallBound;
	  switch (d) {
	    case DIRECTION.NORTH:
	      return xt === a(x, xlen) || xt === b(x, xlen) || yt === y || yt === y - ylen + 1;
	      break;
	    case DIRECTION.EAST:
	      return xt === x || xt === x + xlen - 1 || yt === a(y, ylen) || yt === b(y, ylen);
	      break;
	    case DIRECTION.SOUTH:
	      return xt === a(x, xlen) || xt === b(x, xlen) || yt === y || yt === y + ylen - 1;
	      break;
	    case DIRECTION.WEST:
	      return xt === x || xt === x - xlen + 1 || yt === a(y, ylen) || yt === b(y, ylen);
	      break;
	  }
	  throw new Error("Invalid operation");
	}

	function getRoomPoints(x, y, xlen, ylen, dir) {
	  let a = getFeatureLowerBound, b = getFeatureUpperBound;
	  let res = [];
	  switch (dir) {
	    case DIRECTION.NORTH:
	      for (let xt = a(x, xlen)|0; xt < b(x, xlen); xt++){
	        for (let yt = y; yt > y - ylen; yt--){
	          res.push({ x: xt, y: yt });
	        }
	      }
	      break;
	    case DIRECTION.EAST:
	      for (let xt = x; xt < x + xlen; xt++){
	        for (let yt = a(y,ylen)|0; yt < b(y, ylen); yt++){
	          res.push({ x: xt, y: yt });
	        }
	      }
	      break;
	    case DIRECTION.SOUTH:
	      for (let xt = a(x, xlen)|0; xt < b(x, xlen); xt++){
	        for (let yt = y; yt < y + ylen; yt++){
	          res.push({ x: xt, y: yt });
	        }
	      }  
	      break;
	    case DIRECTION.WEST:
	      for (let xt = x; xt > x - xlen; xt--){
	        for (let yt = a(y,ylen)|0; yt < b(y, ylen); yt++){
	          res.push({ x: xt, y: yt });
	        }
	      }  
	      break;
	  }
	  return res;
	}

	function makeRoom(x, y, mx, my, dir, arr) {
	  let xlen = util.randomInt(5, mx), ylen = util.randomInt(5, my);
	  let points = getRoomPoints(x, y, xlen, ylen, dir);

	  if (points.some(s => s.y < 0 || s.y >= arr.length || s.x < 0 || s.x >= arr[0].length || !isUnused(arr, s.x, s.y))) return false;
	  
	  points.forEach(p => {
	    let tmp = null;
	    if (isWall(x, y, xlen, ylen, p.x, p.y, dir)) {
	      tmp = new Tile(1, false, false, 17);
	    } else {
	      tmp = new Tile(0, true, true, 14);
	    }
	    arr[p.y][p.x] = tmp;
	  });

	  return true;
	}

	function makeCorridor(x, y, width, height, length, dir, arr) {
	  let len = util.randomInt(2, length);
	  let xtemp, ytemp = 0;

	  switch (dir) {
	    case DIRECTION.NORTH:
	      if (x < 0 || x > width) return false;
	      xtemp = x;
	      for (ytemp = y; ytemp > (y - len); ytemp--) {
	        if (ytemp < 0 || ytemp > height) return false;
	        if (!isUnused(arr, xtemp, ytemp)) return false;
	      }
	      for (ytemp = y; ytemp > (y - len); ytemp--) {
	        arr[ytemp][xtemp] = new Tile(0, true, true, 13);
	        
	      }
	      break;
	    case DIRECTION.EAST:
	      if (y < 0 || y > height) return false;
	      ytemp = y;
	      for (xtemp = x; xtemp < (x + len); xtemp++) {
	        if (xtemp < 0 || xtemp > width) return false;
	        if (!isUnused(arr, xtemp, ytemp)) return false;
	      }
	      for (xtemp = x; xtemp < (x + len); xtemp++) {
	        arr[ytemp][xtemp] = new Tile(0, true, true, 13);
	      }
	      break;
	    case DIRECTION.SOUTH:
	      if (x < 0 || x > width) return false;
	      xtemp = x;
	      for (ytemp = y; ytemp < (y + len); ytemp++) {
	        if (ytemp < 0 || ytemp > height) return false;
	        if (!isUnused(arr, xtemp, ytemp)) return false;
	      }
	      for (ytemp = y; ytemp < (y + len); ytemp++) {
	        arr[ytemp][xtemp] = new Tile(0, true, true, 13);
	      }
	      break;
	    case DIRECTION.WEST:
	      if (ytemp < 0 || ytemp > height) return false;
	      ytemp = y;
	      for (xtemp = x; xtemp > (x - len); xtemp--) {
	        if (xtemp < 0 || xtemp > width) return false;
	        if (!isUnused(arr, xtemp, ytemp)) return false;
	      }
	      for (xtemp = x; xtemp > (x - len); xtemp--) {
	        arr[ytemp][xtemp]= new Tile(0,true, true, 13);
	      }
	      break;
	  }
	  
	  
	  return true;
	}

	function rendomDirection() {
	  return (Math.random() * 4) | 0;
	}

	function inBounds(x, y, maxx, maxy) {
	  return x > 0 && x < maxx && y > 0 && y < maxy;
	}

	function getSurroundings(x, y, maxx, maxy, arr) {
	  let spt = getSurroundingPoints(x, y, maxx, maxy);
	  return spt.map(pt => {
	    return { x: pt.x, y: pt.y, dir: pt.dir, tile: arr[pt.y][pt.x] };
	  });
	}

	function getSurroundingPoints(x, y, maxx, maxy) {
	  let points = [
	    { x: x, y: y + 1, dir: DIRECTION.NORTH },
	    { x: x - 1, y: y, dir: DIRECTION.EAST },
	    { x: x, y: y - 1, dir: DIRECTION.SOUTH },
	    { x: x + 1, y: y, dir: DIRECTION.WEST }
	  ];
	  return points.filter(p => inBounds(p.x, p.y, maxx, maxy));
	}

	function getCellProp(arr, prop, x, y) {
	  if (y < 0 || y >= arr.length) return null;
	  if (x < 0 || x >= arr[0].length) return null;
	  if (!arr[y][x]) return null;
	  return arr[y][x][prop];
	}
	function isUnused(arr, x, y){
	  if( y < 0 || y >= arr.length ) return false;
	  if( x < 0 || x >= arr.length ) return false;
	  if( arr[y][x] !== null ) return false;
	  return true;
	}

	let _object = 0;

	function createDungeon(width, height, sheet, inobj, depth) {
	  _object = inobj < 1 ? 10 : inobj;
	  let doors = [], lights = [];
	  let arr = util.initArray(width, height, null);
	  let startDir = util.randomInt(0, 4);
	  
	  makeRoom((width / 2) | 0, (height / 2) | 0, 8, 6, startDir, arr);

	  let startPosition = { x: (width / 2) | 0, y: (height / 2) | 0 };
	  let downPosition = { x: (width / 2) | 0, y: (height / 2) | 0 };
	  switch (startDir) {
	    case DIRECTION.NORTH:
	      startPosition.y--;  
	      break;  
	    case DIRECTION.EAST:
	      startPosition.x++;  
	      break;
	    case DIRECTION.SOUTH:
	      startPosition.y++;
	      break;
	    case DIRECTION.WEST:
	      startPosition.x--;  
	      break;
	  }

	  let currentFeatures = 1;
	  for (let countingTries = 0; countingTries < 1000; countingTries++) {
	    if (currentFeatures === _object) break;
	    let newx = 0, xmod = 0, newy = 0, ymod = 0, validTile = null, canReach;

	    for (let testing = 0; testing < 1000; testing++) {
	      newx = util.randomInt(1, width - 1);
	      newy = util.randomInt(1, height - 1);
	      canReach = null;
	      if (arr[newy][newx] && (arr[newy][newx].spriteNo == 13 || arr[newy][newx].spriteNo == 17) ) {
	        
	        let surroundings = getSurroundings(newx, newy, width, height, arr);
	        canReach = surroundings.find(s => (s !== null) && s.tile && (s.tile.canMove));
	        if (canReach == null) {
	          continue;
	        }
	        
	        validTile = canReach.dir;
	        switch (validTile) {
	          case DIRECTION.NORTH:
	            ymod = -1;
	            xmod = 0;
	            break;
	          case DIRECTION.EAST:
	            xmod = 1;
	            ymod = 0;
	            break;
	          case DIRECTION.SOUTH:
	            xmod = 0;
	            ymod = 1;
	            break;
	          case DIRECTION.WEST:
	            xmod = -1;
	            ymod = 0;
	            break;
	          default :
	            throw new Error("Invalid operation");
	        }

	        if (doors.some(d =>
	          (d.x === newx && d.y === newy + 1) ||
	          (d.x === newx - 1 && d.y === newy) ||
	          (d.x === newx && d.y === newy - 1) ||
	          (d.x === newx + 1 && d.y === newy))) {
	          validTile = null;
	        }
	        if (validTile != null) break;
	      }
	    }
	    if (validTile) {
	      
	      
	      let feature = util.randomInt(0, 100);
	      if (feature <= 75) {
	        
	        if (makeRoom(newx + xmod, newy + ymod, 8, 6, validTile, arr)) {
	          
	          currentFeatures++;
	          arr[newy][newx] = new Tile(0, true, true, 13);
	          arr[newy + ymod][newx + xmod] = new Tile(0, true, true, 14);

	          let tDoor = null;
	          switch(validTile){
	            case DIRECTION.EAST:
	            case DIRECTION.WEST:
	              tDoor = new Door(1, sheet, newx, newy, null);
	              break;
	            default:
	              tDoor = new Door(0, sheet, newx, newy, null);
	          } 
	          doors.push(tDoor);
	          lights.push({ x: (newx + xmod) * 32 + 16, y: (newy + ymod) * 32 + 16, color: {r:Math.random(), g:Math.random(), b:Math.random()}, brightness: util.randomInt(3, 6) * 32 });
	        }
	      } else if (feature > 75) {
	        
	        if (makeCorridor(newx + xmod, newy + ymod, width, height, 6, validTile, arr)) {
	        
	          currentFeatures++;
	          arr[newy][newx] = new Tile(0, true, true, 13);
	          
	        }
	      }
	    }
	  }
	   while (true) {
	      newx = util.randomInt(1, width - 1);
	      newy = util.randomInt(1, height - 1);
	      if (getCellProp(arr, 'spriteNo', newx, newy) === 14 && getCellProp(arr, 'type', newx, newy+1) !== 1 && !doors.some(d=>d.x === newx && d.y === newy) ) {
	        doors.push(new Stair('down', sheet, newx, newy, 50, 50));
	        downPosition = { x: newx, y: newy };
	        break;
	      }
	   }
	   if (depth > 1) {
	     while (true) {
	       newx = util.randomInt(1, width - 1);
	       newy = util.randomInt(1, height - 1);
	       if (getCellProp(arr, 'spriteNo', newx, newy) === 14 && getCellProp(arr, 'type', newx, newy+1) !== 1 && !doors.some(d=>d.x === newx && d.y === newy)) {
	         doors.push(new Stair('up', sheet, newx, newy, 50, 50));
	         startPosition = { x: newx, y: newy };
	         break;
	       }
	     } 
	   }
	  
	  return {map:arr, doors:doors, lights:lights, downPosition:downPosition, startPosition:startPosition};
	}

	module.exports = createDungeon;

/***/ },
/* 16 */
/***/ function(module, exports) {

	class Stair{
	  constructor(type, sheet, x, y, tarx, tary) {
	    this.sheet = sheet;
	    this.type = type;
	    this.x = x;
	    this.y = y;
	    this.tarx = tarx;
	    this.tary = tary;
	    this.canSeeThrough = true;
	    this.canMove = true;
	    this.title = "stair";
	  }

	  reach(player) {
	    return {command:'stair', dir:this.type}
	  }

	  do(player) {
	    return null;
	  }

	  render(ctx, ctx2, sx, sy) {
	    switch (this.type) {
	      case 'up':
	        this.sheet.draw(ctx, (this.x * 32) - sx, (this.y * 32) - sy, 24);
	        break;
	      case 'down':
	        this.sheet.draw(ctx, (this.x * 32) - sx, (this.y * 32) - sy, 23);
	        break;  
	    }
	  }
	}

	module.exports = Stair;

/***/ }
/******/ ]);