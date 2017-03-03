const SpriteSheet = require('./modules/spritesheet.js');
const Animation = require('./modules/animation.js');
const Player = require('./modules/player.js');
const Util = require('./modules/util.js');
const Shaders = require('./modules/shaders.js');
const Leaf = require('./modules/leaf.js');
const ambient = Shaders.ambientLight({r:0.8, g:0.8, b:1.4, a:1});
const light1 = {color:{r:1, g:0.2, b:0.2}, brightness:100, x:300, y:300};
const conf = require('./modules/conf.js');
const Input = require('./modules/input.js');

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