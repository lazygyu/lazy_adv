const conf = require('./conf.js');
const sound = require('./soundmanager.js');
const toaster = require('./toaster.js');
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