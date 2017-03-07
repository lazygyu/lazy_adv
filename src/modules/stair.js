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
  }

  reach(player) {
    return {command:'stair', dir:'up'}
  }

  do(player) {
    
  }
}