let $ = document.querySelector.bind(document);
let canv = document.createElement("canvas");
canv.width = 540;
canv.height = 540;
$("#container").appendChild(canv);
let ctx = canv.getContext("2d");
let state = 0;
let tileImage = new Image();
tileImage.src = "images/tileset.png";

const MIN_LEAF = 10;
const MAX_LEAF = 30;
const TILE_SIZE = 32;

let _key = null;
class Animation{
  constructor(sheet, frames, duration, loop) {
    this.sheet = sheet;
    this.frames = frames;
    this.duration = duration;
    this.durationPerFrame = this.duration / this.frames.length;
    this.loop = loop || false;
    this.elapsed = 0;
    this.cur = 0;
  }

  update(delta) {
    this.elapsed += delta;
    while (this.elapsed >= this.durationPerFrame) {
      this.elapsed -= this.durationPerFrame;
      this.cur++;
    }
    this.cur %= this.frames.length;
  }

  draw(ctx, x, y) {
    this.sheet.draw(ctx, x, y, this.frames[this.cur]);
  }
}

class Player{
  constructor() {
    this.img = new Image();
    this.img.src = "images/character.png";
    this.sheet = new SpriteSheet(this.img, 32, 48);
    this.dir = 0;
    this.tilePos = { x: 5, y: 5 };
    this.realPos = { x: 5 * 32, y: 5 * 32 };
    this.state = 'stand';
    this.animations = {
      "stand": [
        new Animation(this.sheet, [0, 1, 2, 3], 0.5, true),
        new Animation(this.sheet, [10, 11, 12, 13], 0.5, true),
        new Animation(this.sheet, [20, 21, 22, 23], 0.5, true),
        new Animation(this.sheet, [30, 31, 32, 33], 0.5, true)
      ],
      "walk": [
        new Animation(this.sheet, [0, 4, 5, 4, 0, 6, 7, 6], 0.5, true),
        new Animation(this.sheet, [10, 11, 12, 13], 0.3, true),
        new Animation(this.sheet, [20, 21, 22, 23], 0.3, true),
        new Animation(this.sheet, [30, 31, 32, 33], 0.3, true)
      ]
    }
  }

  update(delta, key) {
    if (this.state == 'stand') {
      switch (key) {
        case 37:
          if (this.dir == 2 && this.tilePos.x > 0 && map[this.tilePos.y][this.tilePos.x-1].canMove) {
            this.tilePos.x--;
            this.state = "walk";
          }
          this.dir = 2;
          break;
        case 38:
          if (this.dir == 3 && this.tilePos.y > 0 && map[this.tilePos.y - 1][this.tilePos.x].canMove) {
            this.tilePos.y--;
            this.state = "walk";
          }
          this.dir = 3;
          break;
        case 39:
        if (this.dir == 1 && map[this.tilePos.y][this.tilePos.x+1].canMove) {
            this.tilePos.x++;
            this.state = "walk";
          }  
          this.dir = 1;
          break;
        case 40:
          if (this.dir == 0 && map[this.tilePos.y + 1][this.tilePos.x].canMove) {
            this.tilePos.y++;
            this.state = "walk";
          }  
          this.dir = 0;
          break;
      }
    }
    let tarX = this.tilePos.x * 32;
    let tarY = this.tilePos.y * 32;
    if (Math.abs(tarX - this.realPos.x) > 1) {
      this.realPos.x += 128 * delta * (tarX > this.realPos.x ? 1 : -1);
    } else {
      this.realPos.x = tarX;
    }
    if (Math.abs(tarY - this.realPos.y) > 1) {
      this.realPos.y += 128 * delta * (tarY > this.realPos.y ? 1 : -1);
    } else {
      this.realPos.y = tarY;
    }
    this.realPos.x |= 0;
    this.realPos.y |= 0;
    if (this.realPos.x == tarX && this.realPos.y == tarY) {
      this.state = "stand";
    }

    this.animations[this.state][this.dir].update(delta);
  }

  render(ctx, lights) {
    this.animations[this.state][this.dir].draw(ctx, this.realPos.x, this.realPos.y - 12);
  }
}

Math.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

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

let mapTiles = new SpriteSheet(tileImage, 32, 32);

function createHall(l, r) {
  if (l.connected.findIndex(v=>v.x==r.x&&v.y==r.y) >= 0) {
    console.log("already connected");
    return null;
  }
  let halls = [];
  let pt1 = { x: Math.randomInt(1, l.w-2)+l.x, y: Math.randomInt(1, l.h-2)+l.y };
  let pt2 = { x: Math.randomInt(1, r.w-2)+r.x, y: Math.randomInt(1, r.h-2)+r.y };
  let w = pt2.x - pt1.x;
  let h = pt2.y - pt1.y;
  
  l.connected.push(r);
  r.connected.push(l);
  
  if (w < 0) {
    if (h < 0) {
      if (Math.random() < 0.5) {
        halls.push({ x: pt2.x, y: pt1.y, w: Math.abs(w), h: 1 });
        halls.push({ x: pt2.x, y: pt2.y, w: 1, h: Math.abs(h)+1 });
      } else {
        halls.push({ x: pt2.x, y: pt2.y, w: Math.abs(w), h: 1 });
        halls.push({ x: pt1.x, y: pt2.y, w: 1, h: Math.abs(h)+1 });
      }
    } else if (h > 0) {
      if (Math.random() < 0.5) {
        halls.push({ x: pt2.x, y: pt1.y, w: Math.abs(w), h: 1 });
        halls.push({ x: pt2.x, y: pt1.y, w: 1, h: Math.abs(h)+1 });
      } else {
        halls.push({ x: pt2.x, y: pt2.y, w: Math.abs(w), h: 1 });
        halls.push({ x: pt1.x, y: pt1.y, w: 1, h: Math.abs(h)+1 });
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
}

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
    max = (dir ? this.h : this.w) - MIN_LEAF;
    if (max < MIN_LEAF) {
      return false;
    }
    sz = Math.floor(Math.random() * (max - MIN_LEAF) + MIN_LEAF);
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
        let hall = createHall(this.left.getRoom(), this.right.getRoom());
        if (hall) this.halls.push(hall);
      }
    } else {
      let rw = Math.randomInt(3, this.w - 2);
      let rh = Math.randomInt(3, this.h - 2);
      let rx = Math.randomInt(1, this.w - rw - 2) + this.x;
      let ry = Math.randomInt(1, this.h - rh - 2) + this.y;
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


function initArray(width, height, value) {
  let arr = [];
  for (let i = 0; i < height; i++) {
    arr.push([]);
    for (let j = 0; j < width; j++) {
      arr[i].push(value);
    }
  }
  return arr;
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
        if (l.w > MAX_LEAF || l.h > MAX_LEAF || Math.random() > .75) {
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
  viewmap = initArray(w, h, 0);
  shownmap = initArray(w, h, 0);

  loop1:
  for (let i = 0; i < w; i++) {
    loop2:
    for (let j = 0; j < h; j++) {
      if (map[i][j].type == 0) {
        player.tilePos.x = j;
        player.tilePos.y = i;
        player.realPos.x = j*32;
        player.realPos.y = i*32;
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
  let realPos = { x: pos.x * TILE_SIZE + (TILE_SIZE/2), y: pos.y * TILE_SIZE + (TILE_SIZE/2) };
  let light = 0;
  for (let i = 0; i < limit; i += 5) {
    let pt = Math.getPoint(realPos, angle, i);
    let x = (pt.x / TILE_SIZE) | 0;
    let y = (pt.y / TILE_SIZE) | 0;
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
  player.update(delta, _key);
  _key = null;
  
  
  ctx.save();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 640, 640);
  ctx.translate(-player.realPos.x+ 270, -player.realPos.y + 270);
  
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
      let t_x = (x * TILE_SIZE) | 0;
      let t_y = (y * TILE_SIZE) | 0;
      
      
      mapTiles.draw(ctx, t_x, t_y, t.spriteNo);
      mapTiles.draw(ctx, t_x, t_y, (((viewmap[y][x] * 7) | 0) + 3) * 10);
      
    });
  });

  
  player.render(ctx, []);
  ctx.restore();
  map.forEach((row, y) => {
    row.forEach((t, x) => {
      if (t.type === 1 || shownmap[y][x] == 0) return true;
      if (viewmap[y][x] === 0) {
        ctx.fillStyle = t.type===2?'#633':'#555';
      } else {
        ctx.fillStyle = t.type===2?'#c99':'#aaa';
      }
      ctx.fillRect(340 + x*2, y*2, 2, 2);
    });
  });
  ctx.fillStyle = "red";
  ctx.fillRect(340 + player.tilePos.x*2, player.tilePos.y*2, 2, 2);
  
  ctx.fillStyle = "black";

  requestAnimationFrame(render);

}

init();
document.addEventListener('keydown', function (e) {
  if (state !== 0) return;
  _key = e.keyCode;

});
