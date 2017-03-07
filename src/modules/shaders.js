"use strict"
const gpu = new GPU();
module.exports = {
    ambientLight: function (color) {
        let cl = color;
        let r = cl.r, g = cl.g, b = cl.b;
        return function (ctx) {
            let origin = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let od = origin.data, l = origin.data.length;
            let i;

            for (i = 0; i < l; i += 4) {
                if (od[i] === 0 && od[i + 1] === 0 && od[i + 2] === 0) continue;
                od[i] = od[i] * r;
                od[i + 1] = od[i + 1] * g;
                od[i + 2] = od[i + 2] * b;
            }
            ctx.putImageData(origin, 0, 0);
        }
    },
    spotLight: function (ctx, light) {
        let cl = light.color;
        let r = cl.r, g = cl.g, b = cl.b;
        let lx = light.x, ly = light.y, brightness=light.brightness;
        let dist = 0;
        
            let origin = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let od = origin.data, w = origin.width, h = origin.height;
            let x, y, cur, row,pw;
            for (y = 0; y < h; y++) {
                row = y * w * 4;
                for (x = 0; x < w; x++) {
                    dist = Math.sqrt(Math.pow(lx-x,2) + Math.pow(ly-y,2));
                    if( dist > brightness ) continue;
                    pw = 1-(dist/brightness);
                    cur = row + (x * 4);
                    if( od[cur]===0 && od[cur+1]===0 && od[cur+2]===0 ) continue;
                    od[cur] += 255*r*pw;
                    od[cur+1] += 255*g*pw;
                    od[cur+2] += 255*b*pw;
                }
            }
            ctx.putImageData(origin,0,0);
        
    }
}