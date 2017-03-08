const util = require('./util.js');
const SpriteSheet = require('./spritesheet.js');
const conf = require('./conf.js');
const Tile = require('./tile.js');
const Leaf = require('./leaf.js');
const Shaders = require('./shaders.js');
const Door = require('./door.js');
const createDungeon = require('./createdungeon.js');

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
    this.ambient = Shaders.ambientLight({ r: Math.min(0.3+Math.random(), 1), g: Math.min(0.3+Math.random(),1), b: Math.min(Math.random()+0.3, 1), a: 1 });
    this.tileset = new Image();
    this.tileset.src = tileSets[type];
    this.layers = [];
    this.rendered = [document.createElement("canvas"), document.createElement("canvas")];
    this.rendered.forEach(cv => {
      cv.width = width*32;
      cv.height = height*32;
    });
    this.buffers = [document.createElement("canvas"), document.createElement("canvas")];
    this.buffers.forEach(cv=>{
      cv.width = 270;
      cv.height = 270;
    });

    this.sheet = new SpriteSheet(this.tileset, 32, 32);
    this.map = util.initArray(width, height, null);
    this.mapTop = util.initArray(width, height, null);
    //this.createMap(width, height, this.lights);
    let res = createDungeon(width, height, this.sheet, 50);
    this.map = res.map;
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
    this.tileset.addEventListener("load", ()=>{ this.makeBuffer(); });
    
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
    let ctx1 = this.rendered[0].getContext("2d");
    let ctx2 = this.rendered[1].getContext("2d");
    
    for(let x=0;x<this.width;x++){
      for(let y=0;y<this.height;y++){
        if( this.map[y][x] ){
          this.sheet.draw(ctx1, x*conf.TILE_SIZE, y*conf.TILE_SIZE, this.map[y][x].spriteNo);
        }
        if( this.mapTop[y][x]){
          this.sheet.draw(ctx2, x*conf.TILE_SIZE, y*conf.TILE_SIZE, this.mapTop[y][x].spriteNo);
        }
      }
    }
    if(this.ambient){
      this.ambient(ctx1);
      this.ambient(ctx2);
    }
    
    let imgData1 = ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height);
    let imgData2 = ctx2.getImageData(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    let dt = imgData1.data;
    let dt2 = imgData2.data;
    this.lights.forEach(l => {
      let lx = l.x, ly = l.y;
      let _minx = lx - l.brightness, _maxx = lx + l.brightness;
      let _miny = ly - l.brightness, _maxy = ly + l.brightness;
      let r = l.color.r, b = l.color.b, g = l.color.g;
      let x, y, cur, dist;
      for (y = _miny; y < _maxy; y++) {
        if (y < 0 || y >= imgData1.height) continue;
        for (x = _minx; x < _maxx; x++) {
          if (x < 0 || x >= imgData1.width) continue;
          cur = (y * imgData1.width * 4) + x * 4;
          
          dist = 1 - util.distance(lx, ly, x, y) / l.brightness;
          dt[cur] += Math.max(0, dt[cur] * r * dist);
          dt[cur + 1] += Math.max(0, dt[cur + 1] * g * dist);
          dt[cur + 2] += Math.max(0, dt[cur + 2] * b * dist);
          dt2[cur] += Math.max(0, dt2[cur] * r * dist);
          dt2[cur + 1] += Math.max(0, dt2[cur + 1] * g * dist);
          dt2[cur + 2] += Math.max(0, dt2[cur + 2] * b * dist);
        }
      }
    });
    ctx1.putImageData(imgData1, 0, 0);
    ctx2.putImageData(imgData2, 0, 0);

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
    ctx1.drawImage(this.rendered[0], minx, miny, ctx1.canvas.width, ctx1.canvas.height, 0, 0,ctx1.canvas.width, ctx1.canvas.height);
    ctx2.drawImage(this.rendered[1], minx, miny, ctx2.canvas.width, ctx2.canvas.height, 0, 0,ctx1.canvas.width, ctx1.canvas.height);
    

    this.mapObjects.forEach((o) => { 
      if (this.shownmap[o.y][o.x] === 0) return true;
      o.render(ctx1, ctx2, minx, miny);
    });

    ctx1.fillStyle = "black";
    ctx2.fillStyle = "black";
    for(y=0;y<11;y++){
      for(x=0;x<11;x++){
        if (y + iy < 0 || x + ix < 0 || x + ix >= this.width || y + iy >= this.height ) continue;
        if( !this.shownmap[y+iy][x+ix]) {
            ctx1.fillRect(x*conf.TILE_SIZE-x_pad, y*conf.TILE_SIZE-y_pad, conf.TILE_SIZE, conf.TILE_SIZE);
            ctx2.fillRect(x*conf.TILE_SIZE-x_pad, (y-1)*conf.TILE_SIZE-y_pad, conf.TILE_SIZE, conf.TILE_SIZE);
        }
        if( this.shownmap[y+iy][x+ix] ) this.sheet.draw(ctx1, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, Math.round(this.viewmap[y + iy][x + ix] * 8 + 3) * 10);
        this.sheet.draw(ctx2, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, Math.round(this.viewmap[y + iy][x + ix] * 8 + 3) * 10);
      }
    }
    
  }


}

module.exports = Floor;