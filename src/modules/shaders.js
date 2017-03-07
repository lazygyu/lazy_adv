"use strict"
const gpu = new GPU();
module.exports = {
    ambientLight: function (color) {
        let cl = color;
        let r = cl.r, g = cl.g, b = cl.b;
        let fnc = gpu.createKernel(function (d, arr) {
            var t = (this.dimensions.y - this.thread.y) * this.dimensions.x * 4 + (this.thread.x * 4);
            this.color(
                d[t] / 255  * arr[0],
                d[t + 1] / 255 * arr[1],
                d[t + 2] / 255 * arr[2],
                1-d[t + 3] / 255);
            }, { mode:'gpu',graphical:true });
        
        return function (ctx) {
            let origin = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let od = origin.data, l = origin.data.length;
            let i;

            fnc.dimensions([ctx.canvas.width, ctx.canvas.height])(od, [r, g, b]);
            let cv = fnc.getCanvas('gpu');
            ctx.drawImage(cv, 0, 0);
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