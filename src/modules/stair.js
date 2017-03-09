class Stair{
  constructor(type, sheet, x, y, tarx, tary) {
    this.sheet = sheet;
    this.type = type;
    this.x = x;
    this.y = y;
    this.tarx = tarx;
    this.tary = tary;
    this.canSeeThrough = true;
    this.canMove = true;
    this.title = "stair";
  }

  reach(player) {
    return {command:'stair', dir:this.type}
  }

  do(player) {
    return null;
  }

  render(ctx, ctx2, sx, sy) {
    switch (this.type) {
      case 'up':
        this.sheet.draw(ctx, (this.x * 32) - sx, (this.y * 32) - sy, 24);
        break;
      case 'down':
        this.sheet.draw(ctx, (this.x * 32) - sx, (this.y * 32) - sy, 23);
        break;  
    }
  }
}

module.exports = Stair;