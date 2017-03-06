class Tile{
  constructor(type, canSee, canMove, spriteNo) {
    this.type = type;
    this.canSeeThrough = canSee || false;
    this.canMove = canMove || false;
    this.spriteNo = spriteNo;
  }

  set(type, canSee, canMove, spriteNo) {
    this.type = type;
    this.canSeeThrough = canSee || false;
    this.canMove = canMove || false;
    this.spriteNo = spriteNo || this.spriteNo;
  }
}
module.exports = Tile;