const util = require('./util.js'), Tile = require('./tile.js'), Door = require('./door.js');

const DIRECTION = {
  EAST: 2,
  WEST: 1,
  NORTH: 3,
  SOUTH: 0
};

function getFeatureLowerBound(c, len) {
  return c - len / 2;
}

function getFeatureUpperBound(c, len) {
  return c + (len + 1) / 2;
}

function isWall(x, y, xlen, ylen, xt, yt, d) {
  let a = getFeatureLowerBound, b = getFeatureUpperBound;
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
  return false;
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
  let xlen = util.randomInt(4, mx), ylen = util.randomInt(4, my);
  let points = getRoomPoints(x, y, xlen, ylen, dir);

  if (points.some(s => s.y < 0 || s.y >= arr.length || s.x < 0 || s.x >= arr[0].length || arr[y][x] !== null)) return false;

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
        if (getCellProp(arr, 'type', xtemp, ytemp) != null) return false;
      }
      for (ytemp = y; ytemp > (y - len); ytemp--) {
        arr[ytemp][xtemp] = new Tile(0, true, true, 13);
      }
      break;
    case DIRECTION.EAST:
      if (y < 0 || y > height) return false;
      ytemp = y;
      for (xtemp = x; temp < (x + len); xtemp++) {
        if (xtemp < 0 || xtemp > width) return false;
        if (getCellProp(arr, 'type', xtemp, ytemp) != null) return false;
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
        if (getCellProp(arr, 'type', xtemp, ytemp) != null) return false;
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
        if (getCellProp(arr, 'type', xtemp, ytemp) != null) return false;
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

let _object = 0;

function createDungeon(width, height, sheet, inobj) {
  _object = inobj < 1 ? 10 : inobj;
  let doors = [];
  let arr = util.initArray(width, height, null);
  
  makeRoom((width / 2) | 0, (height / 2) | 0, 8, 6, util.randomInt(0,4), arr);

  let currentFeatures = 1;
  for (let countingTries = 0; countingTries < 1000; countingTries++) {
    if (currentFeatures === _object) break;
    let newx = 0, xmod = 0, newy = 0, ymod = 0, validTile = null;

    for (let testing = 0; testing < 1000; testing++) {
      newx = util.randomInt(1, width - 1);
      newy = util.randomInt(1, height - 1);

      if (arr[newy][newx] && (arr[newy][newx].type === 1 || arr[newy][newx].spriteNo === 13)) {
        let surroundings = getSurroundings(newx, newy, width, height, arr);
        let canReach = surroundings.find(s => (s !== null) && s.tile && (s.tile.spriteNo === 13 || s.tile.spriteNo === 14 || s.tile.type === 0));
        if (canReach == null) {
          continue;
        }
        validTile = canReach.dir;
        switch (canReach.dir) {
          case DIRECTION.NORTH:
            ymod = 0;
            xmod = -1;
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
        }

        if (doors.some(d =>
          (d.x === newx && d.y === newy + 1) ||
          (d.x === newx - 1 && d.y === newy) ||
          (d.x === newx && d.y === newy - 1) ||
          (d.x === newx + 1 && d.y === newy))) {
          validTile = null;
        }
        if (!validTile) break;

      }
    }
    if (validTile) {
      let feature = util.randomInt(0, 100);
      if (feature <= 75) {
        if (makeRoom(newx + xmod, newy + ymod, 8, 6, validTile, arr)) {
          currentFeatures++;
          arr[newy][newx] = new Tile(0, true, true, 14);
          arr[newy + ymod][newx + xmod] = new Tile(0, true, true, 14);
          doors.push(new Door(1, sheet, newx, newy, null));
        }
      } else if (feature > 75) {
        if (makeCorridor(newx + xmod, newy + ymod, 6, validTile)) {
          currentFeatures++;
          arr[newy][newx] = new Tile(0, true, true, 13);
        }
      }
    }
  }
  return {map:arr, doors:doors};
}

module.exports = createDungeon;