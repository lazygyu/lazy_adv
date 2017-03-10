const util = require('./util.js');
const SpriteSheet = require('./spritesheet.js');
const conf = require('./conf.js');
const Tile = require('./tile.js');
const Leaf = require('./leaf.js');
const Shaders = require('./shaders.js');
const Door = require('./door.js');
const createDungeon = require('./createdungeon.js');
const SpriteRenderer = require('./spriterenderer.js');
const tileSets = {
  building: 'images/tileset.png'
};

class Floor {
  constructor(width, height, type, depth) {
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

    this.renderer = new SpriteRenderer(128,128, ['shader-stage-fs', 'shader-stage-vs']);
    this.mapRenderer = new SpriteRenderer(512,512, ['shader-stage-fs', 'shader-stage-vs']);
    
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
        //this.renderer.render(this.objectBuffers[0], null, this.ambient, [], this.lights);
        //ctx1.drawImage(this.renderer.canvas, x*conf.TILE_SIZE-minx, y*conf.TILE_SIZE-miny);
        ctx1.drawImage(this.objectBuffers[0], x*conf.TILE_SIZE-minx, y*conf.TILE_SIZE-miny);
        if( this.mapTop[y][x] ){
          this.sheet.draw(octx2,0,0, this.mapTop[y][x].spriteNo);
          //this.renderer.render(this.objectBuffers[1], null, this.ambient, [], this.lights);
          //ctx2.drawImage(this.renderer.canvas, x*conf.TILE_SIZE-minx, y*conf.TILE_SIZE-miny);
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