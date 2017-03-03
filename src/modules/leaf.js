const conf = require('./conf.js');
const Util = require('./util.js');

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