class Toast{
  constructor(msg, color) {
    this.msg = msg;
    this.color = color;
    if (color == null) {
      this.color = 'red';
    }
    this.done = false;
    this.elapsed = 0;
  }

  update(delta) {
    if (this.done) return;
    this.elapsed += delta;
    if (this.elapsed > 3) {
      this.done = true;
    }
  }

  render(ctx, y) {
    ctx.save();
    ctx.font = "16px verdana";
    let w = Math.max(ctx.measureText(this.msg).width, 130) + 50;
    let x = (this.elapsed < 0.5) ? (this.elapsed/0.5) * w : (1 - (this.elapsed - 2.5)/0.5) * w;
    if (this.elapsed > 0.5 && this.elapsed < 2.5) x = w;
    x = ctx.canvas.width - x;
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, w, 50);
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, 10, 50);
    ctx.fillStyle = 'white';
    ctx.fillText(this.msg, 20, 33);
    ctx.restore();
  }
}

class Toaster{
  constructor() {
    this.toasts = [];
  }

  add(msg, color) {
    
    this.toasts.push(new Toast(msg, color));
  }

  update(delta) {
    this.toasts.forEach(t => t.update(delta));
    this.toasts = this.toasts.filter(t => !t.done);
  }

  render(ctx) {
    let h = ctx.canvas.height;
    this.toasts.forEach((t, i) => { 
      t.render(ctx, h - ((i+1) * 60));
    });
  }
}

Toaster.instance = null;
Toaster.getInstance = function () {
  if (Toaster.instance === null) {
    Toaster.instance = new Toaster();
  }
  return Toaster.instance;
}

module.exports = Toaster.getInstance();