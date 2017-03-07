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
      cv.width = 270;
      cv.height = 270;
    });

    this.sheet = new SpriteSheet(this.tileset, 32, 32);
    this.map = util.initArray(width, height, null);
    this.mapTop = util.initArray(width, height, null);
    //this.createMap(width, height, this.lights);
    let res = createDungeon(width, height, this.sheet, 20);
    this.map = res.map;
    this.mapObjects.push.apply(this.mapObjects, res.doors);
    for (let _x = 0; _x < this.width; _x++){
      for (let _y = 0; _y < this.height; _y++){
        if (this.map[_y][_x] == null){
          if( _y < height-1 && this.map[_y+1][_x] !== null && this.map[_y+1][_x].type === 0){
            this.map[_y][_x] = new Tile(1, false, false, 4);
          }else{
            this.map[_y][_x] = new Tile(1, false, false, 17);
          }
        }else if(_y < this.height-1 && this.map[_y][_x].type == 1 && this.map[_y+1][_x] && this.map[_y+1][_x].type == 0){
          this.map[_y][_x].spriteNo = 4;
        }
      }
    }
    this.layers.push(this.map);
    this.viewmap = util.initArray(width, height, 0);
    this.shownmap = util.initArray(width, height, 0);
  }

  /**
   * @param {number} width
   * @param {number} height
   * @return Tile[][]
   */
  createMap(width, height) {
    let arr = [];
    let second = util.initArray(width, height, null);
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
            for (let i = 0; i < h.h; i++) {
              for (let j = 0; j < h.w; j++) {
                arr[i + h.y][j + h.x].set(0, true, true, 14);
              }
            }
          });
        });
      }
    });

    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width; x++) {
        if (arr[y][x].type == 1) {
          if (arr[y + 1][x].type == 0) {
            
              if (y > 0) {
                if (arr[y - 1][x].type === 0) {
                  if (x > 0 && arr[y][x - 1].type === 0) {
                    second[y - 1][x] = new Tile(1, false, false, 6);
                  } else if (x < width-1 && arr[y][x + 1].type === 0) {
                    second[y - 1][x] = new Tile(1, false, false, 8);
                  } else {
                    second[y - 1][x] = new Tile(1, false, false, 7);
                  }
                
                } else if (arr[y][x + 1].type === 0 && x > 0 && arr[y][x - 1].type === 0) {
                  second[y - 1][x] = new Tile(1, false, false, 19);
                } else if (arr[y][x + 1].type === 0) {
                  second[y - 1][x] = new Tile(1, false, false, 18);
                } else if (x > 0 && arr[y][x - 1].type === 0) {
                  second[y - 1][x] = new Tile(1, false, false, 16);
                } else {
                  second[y - 1][x] = new Tile(1, false, false, 17);
                }
              }
              arr[y][x].set(1, false, false, 4);
            
          } else if (y > 0 && arr[y - 1][x].type == 0) {
            if (x > 0 && arr[y][x - 1].type == 0) {
              if (x < width && arr[y][x + 1].type == 0) {
                if (y > 0) second[y - 1][x] = new Tile(1, false, false, 9);
                //arr[y][x].set(1, false, false, 9)
              } else {
                if (y > 0) second[y - 1][x] = new Tile(1, false, false, 6);
                //arr[y][x].set(1, false, false, 6);
              }
            } else if (x < width - 1 && arr[y][x + 1].type == 0) {
              if (y > 0) second[y - 1][x] = new Tile(1, false, false, 8);
              //arr[y][x].set(1, false, false, 8);
            } else {
              if (y > 0) second[y - 1][x] = new Tile(1, false, false, 7);
              //arr[y][x].set(1, false, false, 7);
            }
          } else if (x < width - 1 && (arr[y][x + 1].type == 0 || arr[y + 1][x + 1].type == 0)) {
            if (x > 0 && arr[y][x - 1].type === 0) {
              if (y > 0) second[y - 1][x] = new Tile(1, false, false, 19);
              //arr[y][x].set(1, false, false, 19);
            } else {
              if (y > 0 && arr[y][x+1].type !== 1 ) second[y - 1][x] = new Tile(1, false, false, 18);
              //arr[y][x].set(1, false, false, 18);
            }
          } else if (x > 0 && (arr[y][x - 1].type == 0)) {
            if (y > 0) second[y - 1][x] = new Tile(1, false, false, 16);
            //arr[y][x].set(1, false, false, 16);
          }
        }
      }
    }

    arr.forEach((row, y) => {
      row.forEach((t, x) => {
        if ((t.spriteNo === 4 || t.spriteNo === 6 || t.spriteNo === 7 || t.spriteNo === 18) && Math.random() < 0.01) {
          if (t.spriteNo === 4) t.spriteNo = 15;
          this.lights.push({ x: x * conf.TILE_SIZE, y: y * conf.TILE_SIZE, color: { r: 1, g: 1, b: 0 }, brightness: 128 });
        } else if (t.type === 0 && ((y > 0 && arr[y - 1][x].type === 1) || y === 0) && ((y < this.height - 1 && arr[y + 1][x].type == 1) || y === this.height - 1)) {
          if (x > 2 && arr[y][x - 1].type === 0 && arr[y][x - 2].type === 0 && y > 0 && arr[y - 1][x - 1].type === 0 && arr[y - 1][x - 1].type === 0) {
            this.mapObjects.push(new Door(1, this.sheet, x, y));
          }
          
        } else if (t.type === 0 && ((x > 0 && arr[y][x - 1].type === 1) || x === 0) && ((x < this.width - 1 && arr[y][x + 1].type === 1) || x === this.width - 1)) {
          if (Math.random() < 0.2) {
            this.mapObjects.push(new Door(0, this.sheet, x, y));
          }
        }
      });
    });
    this.map = arr;
    this.mapTop = second;
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
    Array.prototype.push.call(objs, this.monsters.map(m => m.x == x && m.y == y));
    Array.prototype.push.call(objs, this.items.map(i => i.x == x && i.y == y));
    Array.prototype.push.call(objs, this.mapObjects.map(i => i.x == x && i.y == y));
    return objs;
  }

  draw(ctx, layer) {
    ctx.drawImage(this.rendered[layer], 0, 0);
  }

  do(player, x, y) {
    console.log("player do to " + x + "," + y);
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

  render(ctx, sx, sy) {
    let x, y;
    let ix = Math.floor(sx / conf.TILE_SIZE) - 4, iy = Math.floor(sy / conf.TILE_SIZE) - 4;
    let x_pad = sx % conf.TILE_SIZE, y_pad = sy % conf.TILE_SIZE;
    let minx = sx - 4 * conf.TILE_SIZE, maxx = sx + 5 * conf.TILE_SIZE;
    let miny = sy - 4 * conf.TILE_SIZE, maxy = sy + 5 * conf.TILE_SIZE;
    let ctx1 = this.rendered[0].getContext("2d");
    let ctx2 = this.rendered[1].getContext("2d");
    ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);

    for (y = 0; y < 11; y++) {
      for (x = 0; x < 11; x++) {
        if (y + iy < 0 || x + ix < 0 || x + ix >= this.width || y + iy >= this.height || !this.shownmap[y + iy][x + ix]) continue;
        this.sheet.draw(ctx1, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, this.map[y + iy][x + ix].spriteNo);
        if (this.mapTop[y + iy][x + ix]) {
          this.sheet.draw(ctx2, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, this.mapTop[y + iy][x + ix].spriteNo);
        }
      }
    }

    this.mapObjects.forEach((o) => { 
      if (this.shownmap[o.y][o.x] === 0) return true;
      o.render(ctx1, ctx2, minx, miny);
    });

    let lights = this.lights.filter(l => { return (l.x + l.brightness) > minx && (l.x - l.brightness) < maxx && (l.y + l.brightness) > miny && (l.y - l.brightness) < maxy; });
    if (this.ambient) {
      this.ambient(ctx1);
      this.ambient(ctx2);
    }
    for(y=0;y<11;y++){
      for(x=0;x<11;x++){
        if (y + iy < 0 || x + ix < 0 || x + ix >= this.width || y + iy >= this.height ) continue;
        this.sheet.draw(ctx1, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, Math.round(this.viewmap[y + iy][x + ix] * 8 + 3) * 10);
        if (this.mapTop[y + iy][x + ix]) { this.sheet.draw(ctx2, x * conf.TILE_SIZE - x_pad, y * conf.TILE_SIZE - y_pad, Math.round(this.viewmap[y + iy + 1][x + ix] * 8 + 3) * 10); }
      }
    }
    let imgData = ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height);
    let dt = imgData.data;
    lights.forEach(l => {
      let lx = l.x - minx, ly = l.y - miny;
      let _minx = lx - l.brightness, _maxx = lx + l.brightness;
      let _miny = ly - l.brightness, _maxy = ly + l.brightness;
      let r = l.color.r, b = l.color.b, g = l.color.g;
      let x, y, cur, dist;
      for (y = _miny; y < _maxy; y++) {
        if (y < 0 || y >= imgData.height) continue;
        for (x = _minx; x < _maxx; x++) {
          if (x < 0 || x >= imgData.width) continue;
          cur = (y * imgData.width * 4) + x * 4;
          if (dt[cur] === 0 && dt[cur + 1] === 0 && dt[cur + 2] === 0) continue;
          dist = 1 - util.distance(lx, ly, x, y) / l.brightness;
          dt[cur] += Math.max(0, dt[cur] * r * dist);
          dt[cur + 1] += Math.max(0, dt[cur + 1] * g * dist);
          dt[cur + 2] += Math.max(0, dt[cur + 2] * b * dist);
        }
      }
    });
    ctx1.putImageData(imgData, 0, 0);
  }


}

module.exports = Floor;