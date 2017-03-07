const SpriteSheet = require('./modules/spritesheet.js');
const Animation = require('./modules/animation.js');
const Player = require('./modules/player.js');
const Util = require('./modules/util.js');
const Shaders = require('./modules/shaders.js');
const Leaf = require('./modules/leaf.js');
const conf = require('./modules/conf.js');
const Input = require('./modules/input.js');
const Floor = require('./modules/floor.js');
const SoundManager = require('./modules/soundmanager.js');

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
let floor = new Floor(100,100, 'building', 20);
let renderQueue = [];

let last, cur;
cur = performance.now()/1000;

function init() {
  let w = 50, h = 50;
  

  player.tilePos = {x:50, y:50};
  while(!floor.map[player.tilePos.y][player.tilePos.x].canMove){
    player.tilePos.y--;
    player.tilePos.x--;
  }
  player.realPos = {x:player.tilePos.x*conf.TILE_SIZE, y:player.tilePos.y*conf.TILE_SIZE};
  if (first) render();
  first = false;
}



function render() {
  last = cur;
  cur = performance.now() / 1000;
  let delta = cur - last;
  let lbuf = buff2.getContext("2d");
  
  player.update(delta, _key, floor);
  floor.update(delta, player);
  _key.update();
  if( _key.isPress(38)) console.log("press");
  
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
  ctx.globalAlpha = 0.8;
  ctx.drawImage(buff2, 96, 128, 32, 32, 96, 128, 32, 32);
  ctx.drawImage(buff2, 160, 128, 32, 32, 160, 128, 32, 32);
  ctx.globalAlpha = 0.5;
  ctx.drawImage(buff2, 128, 128, 32, 32, 128, 128, 32, 32);
  ctx.restore();
  
  
  
  let cctx = canv.getContext("2d");
  cctx.mozImageSmoothingEnabled = false;
  cctx.webkitImageSmoothingEnabled = false;
  cctx.msImageSmoothingEnabled = false;
  cctx.imageSmoothingEnabled = false;
  cctx.drawImage(buff,0,0,540, 540);
  
  floor.map.forEach((row, y) => {
    row.forEach((t, x) => {
      if (t.type === 1 || floor.shownmap[y][x] === 0 ) return true;
      if (floor.viewmap[y][x] === 0) {
        cctx.fillStyle = t.spriteNo===14?'#633':'#555';
      } else {
        cctx.fillStyle = t.spriteNo===14?'#c99':'#aaa';
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