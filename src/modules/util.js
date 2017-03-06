const Tile = require('./tile.js');
const conf = require('./conf.js');

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